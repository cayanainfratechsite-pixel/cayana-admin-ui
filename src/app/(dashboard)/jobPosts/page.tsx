"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import AddIcon from "@mui/icons-material/Add";
import JobPostsTable from "@/components/JobPostsTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button as MuiButton,
} from "@mui/material";
import SnackbarComponent from "@/components/SnackbarComponent";
import { createJobPost } from "@/api/jobPosts/page";

const JobPostPage: React.FC = () => {
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Get current time in 12-hr format
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const handleOpenNewPostModal = () => {
    setNewPostModalOpen(true);
  };

  const handleCloseNewPostModal = () => {
    setNewPostModalOpen(false);
    setNewPostTitle("");
    setNewPostDescription("");
  };

  const handleCreateJobPost = async () => {
    try {
      const payload = {
        title: newPostTitle,
        description: newPostDescription,
      };
      await createJobPost(payload);
      console.log("Job post created successfully");
      setSnackbarMessage("Job post Created Successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      handleCloseNewPostModal();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error creating job post", error);
      setSnackbarMessage("Error creating job post");
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
              Job Post List
            </h2>
          </div>
          <div className="ml-4">
            <Button
              text="New Job post"
              onClick={handleOpenNewPostModal}
              color="primary"
              variant="outlined"
              icon={<AddIcon />}
            />
          </div>
        </div>

        <JobPostsTable />
      </div>

      {/* New Job Post Modal using MUI Button for actions */}
      <Dialog open={newPostModalOpen} onClose={handleCloseNewPostModal}>
        <DialogTitle sx={{ position: "relative" }}>
          New Job Post
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 16,
              fontSize: "0.875rem",
              color: "gray",
            }}
          >
            {getCurrentTime()}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details to create a new job post.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newPostDescription}
            onChange={(e) => setNewPostDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseNewPostModal} color="primary">
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleCreateJobPost}
            variant="contained"
            color="primary"
          >
            Create
          </MuiButton>
        </DialogActions>
      </Dialog>

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default JobPostPage;
