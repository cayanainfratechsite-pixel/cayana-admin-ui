"use client";

import React, { useState } from "react";
import {
  TextField,
  Button as MUIButton,
  Typography,
  Grid,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import SnackbarComponent from "@/components/SnackbarComponent";
import { publishBlog } from "@/api/blogs/page";

const NewBlogPage: React.FC = () => {
  // Store file objects for images
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Use separate state for image previews (for UI only)
  const [cardImagePreview, setCardImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  // Other text fields (do not include image URLs)
  const [formData, setFormData] = useState({
    publisherName: "",
    title: "",
    content: "",
    approxReadTime: 0,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const router = useRouter();

  // Optionally track overall upload progress
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Handlers for file selection that update preview and store the file object
  const handleCardImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCardImageFile(file);
      // Only for preview purposes; this URL will not be sent to the backend
      setCardImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove handlers for images
  const removeCardImage = () => {
    setCardImageFile(null);
    setCardImagePreview("");
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
  };

  // Handle changes for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update content from the TextEditor
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  // On form submission, build a FormData payload containing both text fields and binary files
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    // Append text fields
    data.append("publisherName", formData.publisherName);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("approxReadTime", formData.approxReadTime.toString());

    // Append files if they exist
    if (cardImageFile) {
      data.append("cardImage", cardImageFile);
    }
    if (coverImageFile) {
      data.append("coverImage", coverImageFile);
    }

    try {
      // publishBlog should now send the FormData to your API (which is running on port 4000)
      // Optionally pass a progress callback if using axios.
      await publishBlog(data);
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
            <h2 className="text-xl font-semibold text-gray-800">Create New Blog</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 items-center justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Image File Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Card Image <span className="text-xs text-zinc-600">
                (Image dimensions: 708 × 531 px)
              </span>
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageSelect}
                  style={{ display: "none" }}
                  id="card-image-upload"
                />
                <label htmlFor="card-image-upload" style={{ cursor: "pointer" }}>
                  <Typography variant="body2" color="textSecondary">
                    Click to select card image
                  </Typography>
                </label>
              </Box>
              {cardImagePreview && (
                <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
                  <img
                    src={cardImagePreview}
                    alt="Card Image Preview"
                    style={{ width: "100%", maxWidth: 150, borderRadius: 8 }}
                  />
                  <IconButton
                    onClick={removeCardImage}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>

            {/* Cover Image File Upload */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Cover Image <span className="text-xs text-zinc-600">
                (Image dimensions: 3840 × 2160 px)
              </span>
              </Typography>

              

              
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  style={{ display: "none" }}
                  id="cover-image-upload"
                />
                <label htmlFor="cover-image-upload" style={{ cursor: "pointer" }}>
                  <Typography variant="body2" color="textSecondary">
                    Click to select cover image
                  </Typography>
                </label>
              </Box>
              {coverImagePreview && (
                <Box sx={{ mt: 2, position: "relative", display: "inline-block" }}>
                  <img
                    src={coverImagePreview}
                    alt="Cover Image Preview"
                    style={{ width: "100%", maxWidth: 150, borderRadius: 8 }}
                  />
                  <IconButton
                    onClick={removeCoverImage}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>

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

            {/* Blog Title */}
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
              <Typography variant="body1" className="mb-2" sx={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
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

            {/* Upload Progress (optional) */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption">{uploadProgress}%</Typography>
              </Box>
            )}

            {/* Submit Button */}
            <div>
              <MUIButton type="submit" color="primary" variant="contained" className="w-full sm:w-auto">
                Submit Blog
              </MUIButton>
            </div>
          </form>
        </div>
        <SnackbarComponent open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
      </div>
    </div>
  );
};

export default NewBlogPage;
