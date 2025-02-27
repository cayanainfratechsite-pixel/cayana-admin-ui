"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "@/components/Button";
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchBlogById, updateBlog } from "@/api/Blogs/page";

interface Blog {
  cardImage: string;
  coverImage: string;
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        try {
          const response = await fetchBlogById(id);
          if (response.success === 0 && response.result) {
            const { images, publisherName, title, content, approxReadTime } = response.result;
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
    setBlog((prevBlog) => (prevBlog ? { ...prevBlog, [field]: value } : prevBlog));
  };

  const handleSave = async () => {
    if (blog && id) {
      const updatedBlog = {
        cardImage: blog.cardImage,
        coverImage: blog.coverImage,
        publisherName: blog.publisherName,
        title: blog.title,
        content: blog.content,
        approxReadTime: blog.approxReadTime,
      };

      try {
        const response = await updateBlog(id, updatedBlog);
        if (response.success === 0) {
          setSnackbarMessage("Blog updated successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);


          setTimeout(() => {
            router.push("/blogs");
          },2000);
        } else {
          setSnackbarMessage(response.message || "Failed to update the blog. Please try again.");
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
          <Typography variant="h5" className="text-xl font-semibold text-gray-800">
            Edit Blog Page
          </Typography>
        </div>

        <div className="bg-white p-4 rounded-md flex-1">
          <Typography variant="subtitle1" className="text-gray-600" sx={{ mb: 1 }}>
            Blog ID: {id}
          </Typography>

          <Typography variant="h6" className="font-bold text-gray-800" sx={{ mb: 4, fontWeight: 600 }}>
            Blog Title: <span className="text-zinc-500">{blog.title}</span>
          </Typography>

          <Box sx={{ mb: 4 }}>
            <TextField
              label="Card Image URL"
              variant="outlined"
              fullWidth
              value={blog.cardImage}
              onChange={(e) => handleChange("cardImage", e.target.value)}
              sx={{
                mb: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            />
            <TextField
              label="Cover Image URL"
              variant="outlined"
              fullWidth
              value={blog.coverImage}
              onChange={(e) => handleChange("coverImage", e.target.value)}
              sx={{
                mb: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            />
            <TextField
              label="Publisher Name"
              variant="outlined"
              fullWidth
              value={blog.publisherName}
              onChange={(e) => handleChange("publisherName", e.target.value)}
              sx={{
                mb: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            />
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={blog.title}
              onChange={(e) => handleChange("title", e.target.value)}
              sx={{
                mb: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextEditor
              onChange={(content) => handleChange("content", content)}
              initialContent={blog.content}
            />
          </Box>

          <TextField
            label="Approximate Read Time (in minutes)"
            variant="outlined"
            fullWidth
            type="number"
            value={blog.approxReadTime}
            onChange={(e) => handleChange("approxReadTime", Number(e.target.value))}
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
        </div>
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
