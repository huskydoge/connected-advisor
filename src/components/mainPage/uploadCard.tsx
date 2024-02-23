import React, { useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadCard = ({ onClose }: { onClose: any }) => {
  // Initial state setup for the form
  const [formData, setFormData] = useState({
    advisor_id: "",
    name: "",
    tags: [],
    avatar: "",
    github: "",
    twitter: "",
    email: "",
    website: "",
    position: "",
    affiliation: "",
    description: "",
    connections: [],
  });

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add tag
  const handleAddTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  // Remove tag
  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  // Update tag
  const handleTagChange = (value, index) => {
    const newTags = formData.tags.map((tag, idx) =>
      idx === index ? value : tag
    );
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ position: "relative", width: "100%", mt: 2 }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload New Advisor
        </Typography>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Advisor Basic Information */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
            />
          </Grid>
          {/* Social Links */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </Grid>
          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Stack direction="column" spacing={1}>
              {formData.tags.map((tag, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={tag}
                    onChange={(e) => handleTagChange(e.target.value, index)}
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    onClick={() => handleRemoveTag(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <Button
              onClick={handleAddTag}
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Add Tag
            </Button>
          </Grid>
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
};

export default UploadCard;
