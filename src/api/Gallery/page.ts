import { limit } from "@/lib/data";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

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
      `http://localhost:4000/api/v1/gallery/delete/${id}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
