"use client";

import React, { useState } from "react";
import { TextField, Button as MUIButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import SnackbarComponent from "@/components/SnackbarComponent";
import { publishBlog } from "@/api/Blogs/page"; 

const NewBlogPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cardImage: "",
    coverImage: "",
    publisherName: "",
    title: "",
    content: "",
    approxReadTime: 0,
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  
  const router = useRouter();

  // Handle change in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle updating content from the TextEditor
  const handleEditorChange = (content: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content,
    }));
    console.log("Updated content:", content);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await publishBlog(formData);
      console.log("Blog published successfully:", data);
      setSnackbarMessage("Blog published successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);


      setTimeout(() => {
        router.push("/blogs");
      }, 2000);

    } catch (error) {
      console.error("Error publishing blog:", error);
      setSnackbarMessage("Error publishing blog");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Blog
            </h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 items-center justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Image URL */}
            <div>
              <TextField
                label="Card Image URL"
                variant="outlined"
                fullWidth
                name="cardImage"
                value={formData.cardImage}
                onChange={handleChange}
                className="mb-4"
              />
              {formData.cardImage && (
                <div className="mt-2">
                  <img
                    src={formData.cardImage}
                    alt="Card Image Preview"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <TextField
                label="Cover Image URL"
                variant="outlined"
                fullWidth
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="mb-4"
              />
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover Image Preview"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Publisher Name */}
            <div>
              <TextField
                label="Publisher Name"
                variant="outlined"
                fullWidth
                name="publisherName"
                value={formData.publisherName}
                onChange={handleChange}
              />
            </div>

            {/* Title */}
            <div>
              <TextField
                label="Blog Title"
                variant="outlined"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Content */}
            <div>
              <Typography
                variant="body1"
                className="mb-2"
                sx={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
              >
                Content
              </Typography>
              <TextEditor onChange={handleEditorChange} />
            </div>

            {/* Approximate Read Time */}
            <div>
              <TextField
                label="Approximate Read Time (in minutes)"
                variant="outlined"
                fullWidth
                type="number"
                name="approxReadTime"
                value={formData.approxReadTime}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div>
              <MUIButton
                type="submit"
                color="primary"
                variant="contained"
                className="w-full sm:w-auto"
              >
                Submit Blog
              </MUIButton>
            </div>
          </form>
        </div>
        <SnackbarComponent
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
        />
      </div>
    </div>
  );
};

export default NewBlogPage;
