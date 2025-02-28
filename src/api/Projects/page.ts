import { limit } from "@/lib/data";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const getAccessToken = () => {
  const match = document.cookie.match(/(^| )access-token=([^;]+)/);
  return match ? match[2] : null;
};

export const fetchProjects = async (page: number) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Access token not found in cookies");
    }

    const response = await axios.get(`${API_BASE_URL}/project`, {
      params: {
        page,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching applications"
      );
    } else {
      throw new Error("An unknown error occurred while fetching applications");
    }
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Access token not found in cookies");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/project/delete/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to delete the project");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error deleting project:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while deleting the project");
  }
};

