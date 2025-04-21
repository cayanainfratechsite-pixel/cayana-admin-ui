import { limit } from "@/lib/data";
import axios from "axios";

const API_BASE_URL = "https://cayana.co.in/api/v1";

export const fetchBlogs = async (page:number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog`, {
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
          "An error occurred while fetching blogs"
      );
    } else {
      throw new Error("An unknown error occurred while fetching blogs");
    }
  }
};



// Generic API response interface
export interface ApiResponse<T> {
  success: number;
  message: string;
  result: T;
}

// Updated Blog interface to match the API response
export interface Blog {
  _id: string;
  images: {
    cardImage: string;
    coverImage: string;
  };
  publisherName: string;
  title: string;
  content: string;
  approxReadTime: number;
  createdAt: string;
  updatedAt: string;
  publishedDate: string;
  modifiedDate: string;
}

// Fetch blog by ID
export const fetchBlogById = async (id: string): Promise<ApiResponse<Blog>> => {
  try {
    const response = await axios.get<ApiResponse<Blog>>(`${API_BASE_URL}/blog/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching blog:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while fetching the blog");
  }
};

// Update blog by ID
export const updateBlog = async (
  id: string,
  updatedBlog: FormData
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await axios.put<ApiResponse<Blog>>(
      `${API_BASE_URL}/blog/edit/${id}`,
      updatedBlog
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error updating blog:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while updating the blog");
  }
};



export const deleteBlog = async (blogId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/blog/delete/${blogId}`
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

export const publishBlog = async (formData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/blog/publish`,
      formData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error publishing blog:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while publishing the blog");
  }
}