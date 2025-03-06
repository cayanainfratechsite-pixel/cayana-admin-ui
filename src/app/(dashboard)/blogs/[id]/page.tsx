"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextEditor from "@/components/TextEditor";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "@/components/Button";
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchBlogById, updateBlog } from "@/api/blogs/page";

interface Blog {
  cardImage: string; // existing URL from server
  coverImage: string; // existing URL from server
  publisherName: string;
  title: string;
  content: string;
  approxReadTime: number;
}

const BlogPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // States to store new file objects and their preview URLs
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        try {
          const response = await fetchBlogById(id);
          if (response.success === 0 && response.result) {
            const { images, publisherName, title, content, approxReadTime } =
              response.result;
            setBlog({
              cardImage: images?.cardImage || "",
              coverImage: images?.coverImage || "",
              publisherName,
              title,
              content,
              approxReadTime,
            });
          } else {
            setBlog(null);
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getBlog();
  }, [id]);

  const handleChange = (field: keyof Blog, value: string | number) => {
    setBlog((prevBlog) =>
      prevBlog ? { ...prevBlog, [field]: value } : prevBlog
    );
  };

  // When selecting a new card image file, store the file and create a preview URL.
  const handleCardImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCardImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCardImagePreview(previewUrl);
    }
  };

  // When selecting a new cover image file, store the file and create a preview URL.
  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };

  // Remove the new card image selection.
  const removeCardImage = () => {
    setCardImageFile(null);
    setCardImagePreview("");
  };

  // Remove the new cover image selection.
  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
  };

  // When saving, build a FormData payload that includes text fields and, if available, file objects.
  const handleSave = async () => {
    if (blog && id) {
      const formData = new FormData();
      formData.append("publisherName", blog.publisherName);
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      formData.append("approxReadTime", blog.approxReadTime.toString());
      // If a new file was selected, send the file object (binary data) instead of a URL.
      if (cardImageFile) {
        formData.append("cardImage", cardImageFile);
      }
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }
      // Otherwise, do not include the image field—this way, the backend can preserve the original image.

      try {
        const response = await updateBlog(id, formData);
        if (response.success === 0) {
          setSnackbarMessage("Blog updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          setTimeout(() => {
            router.push("/blogs");
          }, 2000);
        } else {
          setSnackbarMessage(
            response.message || "Failed to update the blog. Please try again."
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        console.error("Error saving blog:", error);
        setSnackbarMessage("Failed to update the blog. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress className="m-auto" />;
  if (!blog) return <Typography variant="h6">Blog not found</Typography>;

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Blog Page
            </h2>
          </div>
        </div>

        <Box className="bg-white p-4 rounded-md flex-1">
          <Typography
            variant="subtitle1"
            className="text-gray-600"
            sx={{ mb: 1 }}
          >
            Blog ID: {id}
          </Typography>


          {/* Card Image Upload & Display */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Card Image
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
            {(cardImagePreview || blog.cardImage) && (
              <Box
                sx={{ mt: 2, position: "relative", display: "inline-block" }}
              >
                <Image
                  src={cardImagePreview || blog.cardImage}
                  alt="Card Image"
                  width={150}
                  height={150}
                  style={{ borderRadius: 8, objectFit: "cover" }}
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

          {/* Cover Image Upload & Display */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Cover Image
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
            {(coverImagePreview || blog.coverImage) && (
              <Box
                sx={{ mt: 2, position: "relative", display: "inline-block" }}
              >
                <Image
                  src={coverImagePreview || blog.coverImage}
                  alt="Cover Image"
                  width={150}
                  height={150}
                  style={{ borderRadius: 8, objectFit: "cover" }}
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


          {/* New Input Field for Publisher Name */}
          <TextField
            label="Publisher Name"
            variant="outlined"
            fullWidth
            value={blog.publisherName}
            onChange={(e) => handleChange("publisherName", e.target.value)}
            sx={{
              mb: 4,
              mt: 4,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
            }}
          />

          {/* New Input Field for Blog Title */}
          <TextField
            label="Blog Title"
            variant="outlined"
            fullWidth
            value={blog.title}
            onChange={(e) => handleChange("title", e.target.value)}
            sx={{
              mb: 4,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
            }}
          />
          <div>
            <Typography
              variant="body1"
              sx={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}
            >
              Content
            </Typography>
          </div>

          {/* Text Editor for Blog Content */}
          <Box sx={{ mb: 4 }}>
            <TextEditor
              onChange={(content) => handleChange("content", content)}
              initialContent={blog.content}
            />
          </Box>

          {/* Approximate Read Time */}
          <TextField
            label="Approximate Read Time (in minutes)"
            variant="outlined"
            fullWidth
            type="number"
            value={blog.approxReadTime}
            onChange={(e) =>
              handleChange("approxReadTime", Number(e.target.value))
            }
            sx={{
              mb: 4,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
            }}
          />

          <div className="flex justify-center">
            <Button
              text="Edit Blog"
              onClick={handleSave}
              color="primary"
              variant="contained"
              icon={<BorderColorOutlinedIcon />}
            />
          </div>
        </Box>
      </div>
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default BlogPage;
