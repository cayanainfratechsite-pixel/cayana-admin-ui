"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SnackbarComponent from "@/components/SnackbarComponent";
import { useRouter } from "next/navigation";

const AddProjectForm = () => {
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
    gallery: [""],
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


  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/amenity");
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

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const addGalleryImage = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ""] });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice),
      bedRooms: Number(formData.bedRooms),
      size: Number(formData.size),
      units: Number(formData.units),
      amenities: selectedAmenities.map((amenity: any) => ({
        name: amenity.name,
        icon: amenity.icon,
      })),
    };
  
    try {
      const response = await fetch("http://localhost:4000/api/v1/project/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      // Check if response is OK
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
              Add New Projects
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
                      <MenuItem value="pending">Pending</MenuItem>
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

                {/* Card Image URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Card Image URL"
                    name="cardImage"
                    value={formData.cardImage}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Base Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Base Price"
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
                    label="Bedrooms"
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
                    label="Size (sq ft)"
                    name="size"
                    type="number"
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

                {/* Cover Image URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Cover Image URL"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Overview */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Overview"
                    name="overview"
                    multiline
                    rows={3}
                    value={formData.overview}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Overview Image URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Overview Image URL"
                    name="overViewImage"
                    value={formData.overViewImage}
                    onChange={handleChange}
                  />
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

                {/* Professional Amenities Autocomplete */}
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
                          // alt={option.name}
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

                {/* Gallery Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-2">
                    Gallery Images
                  </Typography>
                </Grid>
                {formData.gallery.map((img, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Gallery Image URL ${index + 1}`}
                      value={img}
                      onChange={(e) =>
                        handleGalleryChange(index, e.target.value)
                      }
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button variant="outlined" onClick={addGalleryImage}>
                    Add Gallery Image
                  </Button>
                </Grid>

                {/* Brochure URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Brochure URL"
                    name="brochureURL"
                    value={formData.brochureURL}
                    onChange={handleChange}
                  />
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
