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
  Divider,
  Typography,
  // Autocomplete,
  // Chip,
  // Avatar,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarComponent from "@/components/SnackbarComponent";
import { useParams, useRouter } from "next/navigation";

const EditProjectForm: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  // Form fields; image fields are stored as URLs initially.
  const [formData, setFormData] = useState({
    status: "completed",
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

  // Amenities & snackbar state.
  // const [amenitiesOptions, setAmenitiesOptions] = useState<any[]>([]);
  // const [selectedAmenities, setSelectedAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // File objects and preview states for image fields.
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  // const [overviewImageFile, setOverviewImageFile] = useState<File[]>([]);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  // const [overviewImagePreview, setOverviewImagePreview] = useState<string[]>(
  //   []
  // );

  // New state declarations for brochure file
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochureFileName, setBrochureFileName] = useState<string>("");

  // New ref for brochure file input
  const brochureInputRef = useRef<HTMLInputElement>(null);

  // Gallery images: we'll store files and their preview URLs.
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryImageurl, setExistingGalleryImageurl] = useState([]);

  // Refs for file inputs.
  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  // const overviewImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Fetch amenities options.
  // useEffect(() => {
  //   const fetchAmenities = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://backend.cayana.co.in/api/v1amenity"
  //       );
  //       setAmenitiesOptions(response.data.result);
  //     } catch (error) {
  //       console.error("Error fetching amenities:", error);
  //     }
  //   };
  //   fetchAmenities();
  // }, []);

  // Fetch project data by id and prepopulate form fields and image previews.
  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://backend.cayana.co.in/api/v1project/${id}`
        );
        const project = response.data.result;
        setFormData({
          status: project.status || "completed",
          name: project.name || "",
          cardImage: project.cardImage || "",
          basePrice: project.basePrice?.toString() || "",
          type: project.type || "",
          bedRooms: project.bedRooms?.toString() || "",
          size: project.size?.toString() || "",
          units: project.units?.toString() || "",
          locationName: project.locationName || "",
          coverImage: project.coverImage || "",
          overview: project.overview || "",
          overViewImage: project.overViewImage || "",
          details: project.details || "",
          locationEmbedURL: project.locationEmbedURL || "",
          gallery: project.gallery || [],
          brochureURL: project.brochureURL || "",
        });
        // setSelectedAmenities(project.amenities || []);
        setCardImagePreview(project.cardImage || "");
        setCoverImagePreview(project.coverImage || "");
        // setOverviewImagePreview(project.overViewImage || "");
        // setGalleryPreviews(project.gallery || []);
        setExistingGalleryImageurl(project.gallery || []);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- File input handlers for Card Image ---
  const handleCardImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCardImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCardImagePreview(previewUrl);
    }
  };
  const removeCardImage = () => {
    setCardImageFile(null);
    setCardImagePreview("");
  };

  // --- File input handlers for Cover Image ---
  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };
  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
  };

  // --- File input handlers for Overview Image ---
  // const handleOverviewImageSelect = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const newFiles = Array.from(files);
  //     const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
  //     setOverviewImageFile(newFiles); // Replace existing files
  //     setOverviewImagePreview(newPreviews); // Replace existing previews
  //   }
  // };

  // const removeOverviewImage = (index: number) => {
  //   setOverviewImageFile((prev) => prev.filter((_, i) => i !== index));
  //   setOverviewImagePreview((prev) => prev.filter((_, i) => i !== index));
  // };


  const handleGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setGalleryFiles((prev) => [...prev, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImageurl((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeNewGalleryImage = (index: number) => {
    setGalleryFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    setGalleryPreviews((prev) => {
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };


  const handleBrochureFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBrochureFile(file);
      setBrochureFileName(file.name);
    }
  };

  const removeBrochureFile = () => {
    setBrochureFile(null);
    setBrochureFileName("");
  };

  // --- Handle form submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create a FormData object for multipart/form-data submission.
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

    // Add existing gallery URLs as a JSON string
    formDataPayload.append(
      "existingGallery",
      JSON.stringify(existingGalleryImageurl)
    );

    // Append amenities as double-stringified JSON.
    // formDataPayload.append(
    //   "amenities",
    //   JSON.stringify(
    //     selectedAmenities.map((amenity: any) => ({
    //       name: amenity.name,
    //       icon: amenity.icon,
    //     }))
    //   )
    // );

    if (brochureFile) {
      formDataPayload.append("brochureURL", brochureFile);
    }

    // Append file fields if a new file was selected.
    if (cardImageFile) {
      formDataPayload.append("cardImage", cardImageFile);
    }
    if (coverImageFile) {
      formDataPayload.append("coverImage", coverImageFile);
    }
    // if (overviewImageFile) {
    //   overviewImageFile.forEach((file) => {
    //     formDataPayload.append("overViewImage", file);
    //   });
    // }

    // Append each gallery file if any.
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formDataPayload.append("gallery", file);
      });
    }

    try {
      const response = await fetch(
        `https://backend.cayana.co.in/api/v1project/edit/${id}`,
        {
          method: "PUT",
          body: formDataPayload,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error editing project.");
      }
      const result = await response.json();
      console.log("Response:", result);
      setSnackbarMessage("Project edited successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push("/projects");
      }, 2000);
    } catch (error) {
      console.error("Error editing project:", error);
      if (error instanceof Error) {
        setSnackbarMessage(error.message || "Error editing project.");
      } else {
        setSnackbarMessage("Error editing project.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div className="p-4">Loading project data...</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Project{" "}
            <span className="text-xs text-zinc-600">
              (Maximum size limit 50MB)
            </span>
          </h2>
        </div>
      </div>
      <Card className="shadow-lg">
        <Divider />
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
                    <MenuItem value="upcoming">Upcoming</MenuItem>
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

              {/* Card Image Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Card Image{" "}
                  <span className="text-xs text-zinc-600">
                    (Image dimensions: 1200x650)
                  </span>{" "}
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
                  type="text"
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
                  label="Price"
                  name="bedRooms"
                  type="number"
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
                  type="text"
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

              {/* Cover Image Upload */}
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

              {/* Overview Text */}
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

              {/* Overview Image Upload */}

              {/* Floor Image File Upload */}
              {/* <Grid item xs={12}>
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
              </Grid> */}

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
              {/* <Grid item xs={12}>
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
                        alt={option.name}
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
                      key={index}
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
              </Grid> */}

              {/* Gallery Images Upload */}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Gallery Images
                </Typography>

                {/* Upload button */}
                <Button
                  variant="outlined"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  Upload New Gallery Images
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={galleryInputRef}
                  style={{ display: "none" }}
                  onChange={handleGalleryFilesSelect}
                />

                {/* Existing Gallery Images */}
                {existingGalleryImageurl.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Existing Images
                    </Typography>
                    <Box
                      sx={{ mt: 1, display: "flex", gap: 2, flexWrap: "wrap" }}
                    >
                      {existingGalleryImageurl.map((image, index) => (
                        <Box
                          key={`existing-${index}`}
                          sx={{ position: "relative", display: "inline-block" }}
                        >
                          <img
                            src={image}
                            alt={`Existing Gallery Image ${index + 1}`}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            onClick={() => removeExistingGalleryImage(index)}
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
                  </>
                )}

                {/* New Gallery Images */}
                {galleryPreviews.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      New Images
                    </Typography>
                    <Box
                      sx={{ mt: 1, display: "flex", gap: 2, flexWrap: "wrap" }}
                    >
                      {galleryPreviews.map((preview, index) => (
                        <Box
                          key={`new-${index}`}
                          sx={{ position: "relative", display: "inline-block" }}
                        >
                          <img
                            src={preview}
                            alt={`New Gallery Image ${index + 1}`}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            onClick={() => removeNewGalleryImage(index)}
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
                  </>
                )}
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
                    <Typography variant="body2">{brochureFileName}</Typography>
                    <IconButton
                      onClick={removeBrochureFile}
                      sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.7)" }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                {(formData.brochureURL || brochureFile) && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (brochureFile) {
                        const pdfUrl = URL.createObjectURL(brochureFile);
                        window.open(pdfUrl, "_blank");
                      } else if (formData.brochureURL) {
                        window.open(formData.brochureURL, "_blank");
                      }
                    }}
                    sx={{ mt: 2 }}
                  >
                    View Brochure PDF
                  </Button>
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
                Update Project
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
  );
};

export default EditProjectForm;
