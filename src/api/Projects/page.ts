import { limit } from "@/lib/data";
import axios from "axios";

const API_BASE_URL = "https://backend.cayana.co.in/api/v1";

export const fetchProjects = async (page: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/getAll`, {
      params: {
        page,
        limit: limit,
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
    const response = await axios.delete(
      `${API_BASE_URL}/project/delete/${projectId}`
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
