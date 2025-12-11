import { limit } from "@/lib/data"; 
import axios from "axios";

const API_BASE_URL = "https://backend.cayana.co.in/api/v1";

export const fetchApplications = async (page: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job/applied-jobs`, {
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
}


export const deleteApplication = async (applicationsId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/job/delete-applied-job/${applicationsId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to delete the application");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error deleting application:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while deleting the application");
  }
}


export const downloadAppliedJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job/excel-download-applied-jobs`);
    return response.data;
  } catch (error) {
    console.error("Error in downloadAppliedJobs API call: ", error);
    throw error;
  }
};