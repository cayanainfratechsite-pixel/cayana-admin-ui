"use client";

import { useEffect, useState, useRef } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  LinearProgress,
  Box,
} from "@mui/material";
import Image from "next/image";
import Button from "@/components/Button";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchGallery, deleteImage, uploadImages } from "@/api/gallery/page";

interface GalleryItem {
  _id: string;
  image: string;
}

const GalleryPage = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // State for multiple image upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGallery();
        setGallery(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      await deleteImage(selectedId);
      setGallery(prev => prev.filter(item => item._id !== selectedId));
      setSnackbarMessage("Image deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Trigger file selection for multiple images
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle multiple file selection and upload
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      try {
        setIsUploading(true);
        const uploaded = await uploadImages(
          formData,
          (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        );
        // Ensure uploaded is iterable
        const uploadedImages = Array.isArray(uploaded) ? uploaded : [uploaded];
        setGallery(prev => [...prev, ...uploadedImages]);
        setSnackbarMessage("Images uploaded successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // refresh the page
        window.location.reload();
      } catch (err) {
        console.error(err);
        setSnackbarMessage("Failed to upload images.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Hidden file input for multiple image upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUploadImages}
      />

      <div className="w-full lg:w-full flex flex-col gap-8">
        <Box className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <Typography variant="h5" className="text-xl font-semibold text-gray-800">
            Gallery Page
          </Typography>
          <div className="ml-4">
            <Button
              text="Upload Images"
              onClick={handleUploadButtonClick}
              color="primary"
              variant="outlined"
              icon={<BackupOutlinedIcon />}
            />
          </div>
        </Box>

        {isUploading && (
          <div className="mb-4">
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{uploadProgress}%</Typography>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        ) : (
          <div className="bg-white p-4 rounded-md flex-1">
            <Grid container spacing={4} justifyContent="start">
              {gallery.map(({ _id, image }) => (
                <Grid item key={_id} xs={12} sm={6} md={4} lg={3}>
                  <div className="border border-zinc-600 p-2 rounded-sm overflow-hidden transition-transform">
                    <Image
                      src={image}
                      alt="Gallery Image"
                      width={900}
                      height={600}
                      style={{ objectFit: "contain" }}
                    />
                    <div className="p-2 flex justify-end">
                      <Button
                        text="Delete"
                        color="error"
                        variant="outlined"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(_id)}
                      />
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDeleteCancel} color="primary">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleDeleteConfirm} color="secondary">
            Delete
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

export default GalleryPage;
