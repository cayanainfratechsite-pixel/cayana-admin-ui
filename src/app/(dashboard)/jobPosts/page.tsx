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
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Divider,
  Typography,
  InputAdornment,
} from "@mui/material";
import SnackbarComponent from "@/components/SnackbarComponent";
import { createJobPost, JobPostPayload } from "@/api/JobPosts/page";
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StarsIcon from '@mui/icons-material/Stars';
import InfoIcon from '@mui/icons-material/Info';

// Standalone component for dynamic list items to prevent re-rendering focus loss
const DynamicListItem = ({ 
  label, 
  items, 
  placeholder, 
  onAdd, 
  onRemove, 
  onChange 
}: { 
  label: string, 
  items: string[], 
  placeholder: string,
  onAdd: () => void,
  onRemove: (index: number) => void,
  onChange: (index: number, value: string) => void
}) => (
  <div className="mt-2 mb-4">
    <div className="flex justify-between items-center mb-2">
      <Typography variant="body2" fontWeight="600" color="text.secondary">{label}</Typography>
      <MuiButton size="small" onClick={onAdd} startIcon={<AddIcon />}>Add Point</MuiButton>
    </div>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <TextField
            size="small"
            fullWidth
            placeholder={placeholder}
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
            autoFocus={index === items.length - 1 && item === ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </InputAdornment>
              ),
            }}
          />
          <MuiButton 
            size="small" 
            color="error" 
            onClick={() => onRemove(index)}
            sx={{ minWidth: '40px' }}
          >
            ✕
          </MuiButton>
        </div>
      ))}
      {items.length === 0 && (
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
          No points added yet. Click "Add Point" to begin.
        </Typography>
      )}
    </div>
  </div>
);

const JobPostPage: React.FC = () => {
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [formData, setFormData] = useState<JobPostPayload>({
    title: "",
    description: "",
    company: "Cayana Infratech Pvt Ltd",
    location: {
      city: "Bhubaneswar",
      headquarters: "Bhubaneswar",
      type: "On-site",
    },
    jobType: "Full-time",
    salary: {
      min: 0,
      max: 0,
      currency: "INR",
      period: "LPA",
    },
    benefits: [""],
    responsibilities: [""],
    requirements: {
      experience: { min: 0, max: 0 },
      education: "",
      preferredEducation: "",
      skills: [""],
      materialKnowledge: [""],
    },
    traits: [""],
    industry: "IT / Software",
    whyJoinUs: "",
    isActive: true,
  });
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
    setFormData({
      title: "",
      description: "",
      company: "Cayana Infratech Pvt Ltd",
      location: {
        city: "Bhubaneswar",
        headquarters: "Bhubaneswar",
        type: "On-site",
      },
      jobType: "Full-time",
      salary: {
        min: 0,
        max: 0,
        currency: "INR",
        period: "LPA",
      },
      benefits: [""],
      responsibilities: [""],
      requirements: {
        experience: { min: 0, max: 0 },
        education: "",
        preferredEducation: "",
        skills: [""],
        materialKnowledge: [""],
      },
      traits: [""],
      industry: "IT / Software",
      whyJoinUs: "",
      isActive: true,
    });
  };

  const handleCreateJobPost = async () => {
    try {
      // Filter out empty entries from arrays before sending for a cleaner payload
      const cleanedData: JobPostPayload = {
        ...formData,
        benefits: formData.benefits.filter(item => item.trim() !== ""),
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ""),
        traits: formData.traits.filter(item => item.trim() !== ""),
        requirements: {
          ...formData.requirements,
          skills: formData.requirements.skills.filter(item => item.trim() !== ""),
          materialKnowledge: formData.requirements.materialKnowledge.filter(item => item.trim() !== ""),
        }
      };
      
      await createJobPost(cleanedData);
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

  const updateArrayField = (field: string, index: number, value: string) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      const fieldKey = field as keyof JobPostPayload;
      const newArray = [...(formData[fieldKey] as string[])];
      newArray[index] = value;
      setFormData({ ...formData, [fieldKey]: newArray });
    } else {
      const parentKey = keys[0] as keyof JobPostPayload;
      const parent = formData[parentKey] as any;
      const newArray = [...parent[keys[1]]];
      newArray[index] = value;
      setFormData({ 
        ...formData, 
        [parentKey]: { ...parent, [keys[1]]: newArray } 
      });
    }
  };

  const addArrayItem = (field: string) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      const fieldKey = field as keyof JobPostPayload;
      const newArray = [...(formData[fieldKey] as string[]), ""];
      setFormData({ ...formData, [fieldKey]: newArray });
    } else {
      const parentKey = keys[0] as keyof JobPostPayload;
      const parent = formData[parentKey] as any;
      const newArray = [...parent[keys[1]], ""];
      setFormData({ 
        ...formData, 
        [parentKey]: { ...parent, [keys[1]]: newArray } 
      });
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      const fieldKey = field as keyof JobPostPayload;
      const newArray = [...(formData[fieldKey] as string[])];
      newArray.splice(index, 1);
      setFormData({ ...formData, [fieldKey]: newArray });
    } else {
      const parentKey = keys[0] as keyof JobPostPayload;
      const parent = formData[parentKey] as any;
      const newArray = [...parent[keys[1]]];
      newArray.splice(index, 1);
      setFormData({ 
        ...formData, 
        [parentKey]: { ...parent, [keys[1]]: newArray } 
      });
    }
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
      <Dialog open={newPostModalOpen} onClose={handleCloseNewPostModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ position: "relative", display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 8 }}>
          <span>New Job Post</span>
          <span
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              fontSize: "0.875rem",
              color: "gray",
            }}
          >
            {getCurrentTime()}
          </span>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 3 }}>
            Review and organize the job details. Enter lists as separate points.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Job Title"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Company"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" fontSize="small" /> LOCATION DETAILS
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.location.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                label="Headquarters"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.location.headquarters}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: { ...formData.location, headquarters: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Location Type</InputLabel>
                <Select
                  value={formData.location.type}
                  label="Location Type"
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, type: e.target.value as string } })}
                >
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" fontSize="small" /> JOB & INDUSTRY
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={formData.jobType}
                  label="Job Type"
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as string })}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Industry"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, industry: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentsIcon color="primary" fontSize="small" /> SALARY DETAILS
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Min Salary"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.salary.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary: { ...formData.salary, min: Number(e.target.value) } })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Max Salary"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.salary.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary: { ...formData.salary, max: Number(e.target.value) } })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Currency"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.salary.currency}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary: { ...formData.salary, currency: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Period"
                type="text"
                placeholder="e.g. LPA, Monthly"
                fullWidth
                variant="outlined"
                value={formData.salary.period}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary: { ...formData.salary, period: e.target.value } })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Requirements & Experience</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Min Experience"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.requirements.experience.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ 
                  ...formData, 
                  requirements: { 
                    ...formData.requirements, 
                    experience: { ...formData.requirements.experience, min: Number(e.target.value) } 
                  } 
                })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Max Experience"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.requirements.experience.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ 
                  ...formData, 
                  requirements: { 
                    ...formData.requirements, 
                    experience: { ...formData.requirements.experience, max: Number(e.target.value) } 
                  } 
                })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Education"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.requirements.education}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, requirements: { ...formData.requirements, education: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                margin="dense"
                label="Pref. Education"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.requirements.preferredEducation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, requirements: { ...formData.requirements, preferredEducation: e.target.value } })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChecklistIcon color="primary" fontSize="small" /> WHAT WE EXPECT
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <DynamicListItem 
                label="Required Skills" 
                items={formData.requirements.skills} 
                placeholder="e.g. Node.js" 
                onAdd={() => addArrayItem('requirements.skills')}
                onRemove={(index) => removeArrayItem('requirements.skills', index)}
                onChange={(index, value) => updateArrayField('requirements.skills', index, value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DynamicListItem 
                label="Material Knowledge" 
                items={formData.requirements.materialKnowledge} 
                placeholder="e.g. Cement" 
                onAdd={() => addArrayItem('requirements.materialKnowledge')}
                onRemove={(index) => removeArrayItem('requirements.materialKnowledge', index)}
                onChange={(index, value) => updateArrayField('requirements.materialKnowledge', index, value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ListAltIcon color="primary" fontSize="small" /> KEY RESPONSIBILITIES
              </Typography>
              <Divider />
              <DynamicListItem 
                label="Responsibilities" 
                items={formData.responsibilities} 
                placeholder="e.g. Manage stock inventory" 
                onAdd={() => addArrayItem('responsibilities')}
                onRemove={(index) => removeArrayItem('responsibilities', index)}
                onChange={(index, value) => updateArrayField('responsibilities', index, value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarsIcon color="primary" fontSize="small" /> PERKS & BENEFITS
              </Typography>
              <Divider />
              <DynamicListItem 
                label="Benefits" 
                items={formData.benefits} 
                placeholder="e.g. Health Insurance" 
                onAdd={() => addArrayItem('benefits')}
                onRemove={(index) => removeArrayItem('benefits', index)}
                onChange={(index, value) => updateArrayField('benefits', index, value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PsychologyIcon color="primary" fontSize="small" /> KEY TRAITS
              </Typography>
              <Divider />
              <DynamicListItem 
                label="Key Traits" 
                items={formData.traits} 
                placeholder="e.g. Logical thinker" 
                onAdd={() => addArrayItem('traits')}
                onRemove={(index) => removeArrayItem('traits', index)}
                onChange={(index, value) => updateArrayField('traits', index, value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" fontSize="small" /> ADDITIONAL CONTENT
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Why Join Us?"
                type="text"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={formData.whyJoinUs}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFormData({ ...formData, whyJoinUs: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active Job Post"
              />
            </Grid>
          </Grid>
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
