import { limit } from "@/lib/data";
import axios, { AxiosProgressEvent } from "axios";

const API_BASE_URL = "https://backend.cayana.co.in/api/v1";

export const fetchGallery = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/gallery`);
    if (data.success === 0) {
      return data.result;
    } else {
      throw new Error(data.message || "Failed to fetch gallery");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteImage = async (id: string) => {
  try {
    const response = await axios.delete(
      `https://api.cayana.co.in/api/v1/gallery/delete/${id}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};


export const uploadImages = async (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await axios.post(
      "https://api.cayana.co.in/api/v1/gallery/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};