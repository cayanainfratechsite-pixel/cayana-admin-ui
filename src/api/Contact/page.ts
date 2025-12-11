import { limit } from "@/lib/data"; 
import axios from "axios";

const API_BASE_URL = "https://backend.cayana.co.in/api/v1";

export const fetchContactEnquiry = async (page: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enquiry`, {
      params: {
        page,
        limit: limit,
        category:'general',
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


export const deleteContactEnquiry = async (projectEnquiryId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/enquiry/delete/${projectEnquiryId}`
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


export const downloadContactEnquiry = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enquiry/excel-download-enquiries?category=general`);
    return response.data;
  } catch (error) {
    console.error("Error in downloadAppliedJobs API call: ", error);
    throw error;
  }
};