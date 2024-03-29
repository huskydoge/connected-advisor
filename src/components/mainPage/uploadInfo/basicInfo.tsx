import React, { useState, useRef } from "react";
import {
  Box,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

// @ts-ignore
const BasicInfo = ({ formData, setFormData }) => {
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef(""); // 用于跟踪最新的输入值
  const availableTags = ["CV", "NLP", "Robotics", "ML", "Theory", "LLM"];

  const handleAddTag = () => {
    const newTag = inputValueRef.current;
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      inputValueRef.current = "";
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle select field change
  const handleSelectChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof formData;
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof FormData,
    field?: string
  ) => {
    const { name, value } = e.target;

    if (section && field) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <CardContent>
      <Divider sx={{ mb: 3 }} />
      {/* Basic Information */}
      <Typography variant="subtitle1" gutterBottom>
        Basic Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              name="position"
              value={formData.position}
              label="Position"
              onChange={handleSelectChange}
            >
              <MenuItem value="Professor">Professor</MenuItem>
              <MenuItem value="Assistant Professor">
                Assistant Professor
              </MenuItem>
              <MenuItem value="Associate Professor">
                Associate Professor
              </MenuItem>
              <MenuItem value="Tenure Track Assistant Professor">
                Tenure Track Assistant Professor
              </MenuItem>
              <MenuItem value="Adjunct Professor">Adjunct Professor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Affiliation"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Homepage"
            name="homepage"
            value={formData.homepage}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="GitHub"
            name="github"
            value={formData.github}
            onChange={handleChange}
          />
        </Grid>
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
      <Divider sx={{ mb: 3 }} />

      {/* Tags Section */}
      <Typography variant="subtitle1" gutterBottom>
        Tags
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {formData.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            color="primary"
            size="small"
          />
        ))}
        {formData.tags.length < availableTags.length && (
          <Autocomplete
            freeSolo
            options={availableTags.filter(
              (option) => !formData.tags.includes(option)
            )}
            inputValue={inputValueRef.current}
            onInputChange={(event, newValue) => {
              inputValueRef.current = newValue;
              setInputValue(newValue);
            }}
            onChange={handleAddTag}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                label="Add Tag"
              />
            )}
            sx={{ width: 250 }}
          />
        )}
      </Stack>

      <Divider sx={{ mb: 3, mt: 1 }} />

      {/* Publications */}
      <Typography variant="subtitle1" gutterBottom>
        Publications
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Google Scholar"
            value={formData.publication?.googleScholar}
            onChange={(e) => handleChange(e, "publication", "googleScholar")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="DBLP"
            value={formData.publication?.dblp}
            onChange={(e) => handleChange(e, "publication", "dblp")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ResearchGate"
            value={formData.publication?.researchGate}
            onChange={(e) => handleChange(e, "publication", "researchGate")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Semantic Scholar"
            value={formData.publication?.semanticScholar}
            onChange={(e) => handleChange(e, "publication", "semanticScholar")}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 3 }} />

      {/* Contacts */}
      <Typography variant="subtitle1" gutterBottom>
        Contacts
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Email"
            value={formData.contacts?.email}
            onChange={(e) => handleChange(e, "contacts", "email")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Twitter"
            value={formData.contacts?.twitter}
            onChange={(e) => handleChange(e, "contacts", "twitter")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={formData.contacts?.linkedIn}
            onChange={(e) => handleChange(e, "contacts", "linkedIn")}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default BasicInfo;
