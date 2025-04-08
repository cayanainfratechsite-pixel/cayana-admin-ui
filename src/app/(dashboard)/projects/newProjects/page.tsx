"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  Chip,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarComponent from "@/components/SnackbarComponent";
import { useRouter } from "next/navigation";

const AddProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    status: "",
    name: "",
    cardImage: "",
    basePrice: "",
    type: "",
    bedRooms: "",
    size: "",
    units: "",
    locationName: "",
    coverImage: "",
    overview: "",
    overViewImage: "",
    details: "",
    locationEmbedURL: "",
    gallery: [] as string[],
    brochureURL: "",
  });
  const router = useRouter();
  const [amenitiesOptions, setAmenitiesOptions] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // States for file objects and previews for Card, Cover, and Overview images
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [overviewImageFile, setOverviewImageFile] = useState<File[]>([]);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [overviewImagePreview, setOverviewImagePreview] = useState<string[]>(
    []
  );

  // New state declarations for brochure file
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochureFileName, setBrochureFileName] = useState<string>("");

  // New ref for brochure file input
  const brochureInputRef = useRef<HTMLInputElement>(null);

  // States for multiple Gallery Images file upload
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Optionally track overall upload progress (if needed)
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Refs for file inputs
  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const overviewImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get(
          "https://api.cayana.co.in/api/v1/amenity"
        );
        setAmenitiesOptions(response.data.result);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
    fetchAmenities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for selecting a brochure PDF
  const handleBrochureFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBrochureFile(file);
      setBrochureFileName(file.name);
    }
  };

  // Handler to remove the selected brochure file
  const removeBrochureFile = () => {
    setBrochureFile(null);
    setBrochureFileName("");
  };

  // File input handlers for Card Image
  const handleCardImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCardImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCardImagePreview(previewUrl);
      setFormData({ ...formData, cardImage: previewUrl });
    }
  };
  const removeCardImage = () => {
    setCardImageFile(null);
    setCardImagePreview("");
    setFormData({ ...formData, cardImage: "" });
  };

  // File input handlers for Cover Image
  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
      setFormData({ ...formData, coverImage: previewUrl });
    }
  };
  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
    setFormData({ ...formData, coverImage: "" });
  };

  // File input handlers for Overview Image
  const handleOverviewImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setOverviewImageFile(newFiles); // Replace existing files
      setOverviewImagePreview(newPreviews); // Replace existing previews
    }
  };
  const removeOverviewImage = (index: number) => {
    setOverviewImageFile((prev) => prev.filter((_, i) => i !== index));
    setOverviewImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // File input handlers for multiple Gallery Images
  const handleGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newFiles.push(files[i]);
        newPreviews.push(URL.createObjectURL(files[i]));
      }
      const updatedFiles = [...galleryFiles, ...newFiles];
      const updatedPreviews = [...galleryPreviews, ...newPreviews];
      setGalleryFiles(updatedFiles);
      setGalleryPreviews(updatedPreviews);
      setFormData({ ...formData, gallery: updatedPreviews });
    }
  };
  const removeGalleryImage = (index: number) => {
    const updatedFiles = [...galleryFiles];
    const updatedPreviews = [...galleryPreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setGalleryFiles(updatedFiles);
    setGalleryPreviews(updatedPreviews);
    setFormData({ ...formData, gallery: updatedPreviews });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create a FormData object for multipart/form-data submission
    const formDataPayload = new FormData();
    formDataPayload.append("status", formData.status);
    formDataPayload.append("name", formData.name);
    formDataPayload.append("basePrice", formData.basePrice);
    formDataPayload.append("type", formData.type);
    formDataPayload.append("bedRooms", formData.bedRooms);
    formDataPayload.append("size", formData.size);
    formDataPayload.append("units", formData.units);
    formDataPayload.append("locationName", formData.locationName);
    formDataPayload.append("overview", formData.overview);
    formDataPayload.append("details", formData.details);
    formDataPayload.append("locationEmbedURL", formData.locationEmbedURL);
    // formDataPayload.append("brochureURL", formData.brochureURL);
    // Append amenities as a JSON string
    formDataPayload.append("amenities", JSON.stringify(selectedAmenities));

    if (brochureFile) {
      formDataPayload.append("brochureURL", brochureFile);
    }

    // Append file fields if a new file was selected
    if (cardImageFile) {
      formDataPayload.append("cardImage", cardImageFile);
    }
    if (coverImageFile) {
      formDataPayload.append("coverImage", coverImageFile);
    }
    if (overviewImageFile) {
      overviewImageFile.forEach((file, index) => {
        formDataPayload.append("overViewImage", file);
      });
    }
    // Append each gallery image file (if any)
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formDataPayload.append("gallery", file);
      });
    }

    try {
      const response = await fetch(
        "https://api.cayana.co.in/api/v1/project/add",
        {
          method: "POST",
          body: formDataPayload,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding project.");
      }
      const result = await response.json();
      console.log("Response:", result);
      setSnackbarMessage("Project added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push("/projects");
      }, 2000);
    } catch (error) {
      console.error("Error adding project:", error);
      if (error instanceof Error) {
        setSnackbarMessage(error.message || "Error adding project.");
      } else {
        setSnackbarMessage("Error adding project.");
      }
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
              Add New Projects {" "} <span className="text-xs text-zinc-600">
                (Maximum size limit 50MB)
              </span>
            </h2>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent sx={{ pt: 5 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Grid container spacing={3}>
                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="ongoing">Ongoing</MenuItem>
                      <MenuItem value="upcoming">upcoming</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Project Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Project Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Card Image File Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Card Image <span className="text-xs text-zinc-600">
                      (Image dimensions: 1200x650)
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
                      ref={cardImageInputRef}
                    />
                    <label
                      htmlFor="card-image-upload"
                      style={{ cursor: "pointer" }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Click to select card image
                      </Typography>
                    </label>
                  </Box>
                  {cardImagePreview && (
                    <Box
                      sx={{
                        mt: 2,
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={cardImagePreview}
                        alt="Card Image Preview"
                        style={{
                          width: "100%",
                          maxWidth: 150,
                          borderRadius: 8,
                        }}
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

                {/* Base Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Rera Number"
                    name="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Type */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Bedrooms, Size and Units */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Size"
                    name="bedRooms"
                    type="text"
                    value={formData.bedRooms}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Category"
                    name="size"
                    type="string"
                    value={formData.size}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Units"
                    name="units"
                    type="number"
                    value={formData.units}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Location Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Location Name"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Cover Image File Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Cover Image{" "}
                    <span className="text-xs text-zinc-600">
                      (Image dimensions: 1920 x 1080)
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
                      ref={coverImageInputRef}
                    />
                    <label
                      htmlFor="cover-image-upload"
                      style={{ cursor: "pointer" }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Click to select cover image
                      </Typography>
                    </label>
                  </Box>
                  {coverImagePreview && (
                    <Box
                      sx={{
                        mt: 2,
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={coverImagePreview}
                        alt="Cover Image Preview"
                        style={{
                          width: "100%",
                          maxWidth: 150,
                          borderRadius: 8,
                        }}
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

                {/* Floor Text */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Floor Details"
                    name="overview"
                    multiline
                    rows={3}
                    value={formData.overview}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Floor Image File Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Floor Structure Images{" "}
                    <span className="text-xs text-zinc-600">
                      (Image dimensions: 1080x700)
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
                      multiple
                      onChange={handleOverviewImageSelect}
                      style={{ display: "none" }}
                      id="overview-image-upload"
                      ref={overviewImageInputRef}
                    />
                    <label
                      htmlFor="overview-image-upload"
                      style={{ cursor: "pointer" }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Click to select Floor Structure images
                      </Typography>
                    </label>
                  </Box>
                  {overviewImagePreview.length > 0 && (
                    <Box
                      sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                    >
                      {overviewImagePreview.map((preview, index) => (
                        <Box
                          key={index}
                          sx={{ position: "relative", display: "inline-block" }}
                        >
                          <img
                            src={preview}
                            alt={`Overview Image Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              maxWidth: 150,
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            onClick={() => removeOverviewImage(index)}
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
                      ))}
                    </Box>
                  )}
                </Grid>

                {/* Details */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Details"
                    name="details"
                    multiline
                    rows={4}
                    value={formData.details}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Location Embed URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Location Embed URL"
                    name="locationEmbedURL"
                    value={formData.locationEmbedURL}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Amenities Autocomplete */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Amenities
                  </Typography>
                  <Autocomplete
                    multiple
                    options={amenitiesOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedAmenities}
                    onChange={(event, newValue) => {
                      setSelectedAmenities(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Amenities"
                        placeholder="Choose amenities"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Avatar
                          src={option.icon}
                          sx={{
                            width: 24,
                            height: 24,
                            marginRight: 1,
                          }}
                        />
                        {option.name}
                      </li>
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          avatar={<Avatar src={option.icon} />}
                          label={option.name}
                          {...getTagProps({ index })}
                          sx={{
                            backgroundColor: "#e0f7fa",
                            color: "#00695c",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            margin: "4px",
                          }}
                        />
                      ))
                    }
                  />
                </Grid>

                {/* Gallery Images Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-2">
                    Gallery Images <span className="text-xs text-zinc-600">
                      (Image dimensions: 1080x700)
                    </span>
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    Upload Gallery Images
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryInputRef}
                    style={{ display: "none" }}
                    onChange={handleGalleryFilesSelect}
                  />
                  <Box
                    sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    {galleryPreviews.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <img
                          src={preview}
                          alt={`Gallery Preview ${index + 1}`}
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: 8,
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          onClick={() => removeGalleryImage(index)}
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
                    ))}
                  </Box>
                </Grid>

                {/* Brochure URL */}

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Brochure PDF
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
                      accept="application/pdf"
                      onChange={handleBrochureFileSelect}
                      style={{ display: "none" }}
                      id="brochure-file-upload"
                      ref={brochureInputRef}
                    />
                    <label
                      htmlFor="brochure-file-upload"
                      style={{ cursor: "pointer" }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Click to select Brochure PDF
                      </Typography>
                    </label>
                  </Box>
                  {brochureFile && (
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <Typography variant="body2">
                        {brochureFileName}
                      </Typography>
                      <IconButton
                        onClick={removeBrochureFile}
                        sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.7)" }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Add Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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

export default AddProjectForm;
