import { limit } from "@/lib/data";
import axios from "axios";

const API_BASE_URL = "https://cayana.co.in/api/v1";

export const fetchJobPosts = async (page: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job`, {
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
          "An error occurred while fetching job posts"
      );
    } else {
      throw new Error("An unknown error occurred while fetching job posts");
    }
  }
};

export const deleteJobPost = async (jobPostsId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/job/delete/${jobPostsId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to delete the blog");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error deleting blog:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while deleting the blog");
  }
};

export interface JobPostPayload {
  title: string;
  description: string;
}

export const createJobPost = async (payload: JobPostPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/job/post`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error creating job post:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while creating the job post");
  }
};
