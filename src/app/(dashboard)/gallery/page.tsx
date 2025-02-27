"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import Image from "next/image";
import Button from "@/components/Button";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SnackbarComponent from "@/components/SnackbarComponent";
import { fetchGallery, deleteImage } from "@/api/Gallery/page";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGallery();
        setGallery(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
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
      setGallery((prevGallery) =>
        prevGallery.filter((item) => item._id !== selectedId)
      );
      console.log("Successfully deleted image with ID:");
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

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-full flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Blog Page</h2>
          </div>
          <div className="ml-4">
            <Button
              text="Upload Images"
              // onClick={handleNewBlog}
              color="primary"
              variant="outlined"
              icon={<BackupOutlinedIcon />}
            />
          </div>
        </div>

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
                  <div className=" border border-zinc-600 p-2 rounded-sm overflow-hidden transition-transform ">
                    <Image
                      src={image}
                      alt="Cayana Gallery"
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
