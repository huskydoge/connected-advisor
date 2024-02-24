// 这个文件是上传新的顾问的表单，包括顾问的基本信息，社交链接，标签，描述，以及顾问的关系
// 需要好好修改，现在只是一个框架，没有实际的上传功能

import React, { useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const handleAddConnection = () => {
    // @ts-ignore
    setFormData((prev) => ({
      ...prev,
      connections: [
        ...prev.connections,
        {
          advisor_id: "",
          relation: [],
          collaborations: [],
          latestCollaboration: "",
          relationFactor: "",
        },
      ],
    }));
  };

  // @ts-ignore
  const handleConnectionChange = (index, field, value) => {
    const updatedConnections = formData.connections.map((connection, idx) => {
      if (idx === index) {
        // @ts-ignore
        return { ...connection, [field]: value };
      }
      return connection;
    });
    // @ts-ignore
    setFormData((prev) => ({ ...prev, connections: updatedConnections }));
  };

  const handleAddRelation = (connectionIndex: number) => {
    const updatedConnections = formData.connections.map((connection, idx) => {
      if (idx === connectionIndex) {
        return {
          // @ts-ignore
          ...connection,
          relation: [
            // @ts-ignore
            ...connection.relation,
            {
              class: "",
              role: "",
              duration: {
                start: { year: "", month: "" },
                end: { year: "", month: "" },
              },
            },
          ],
        };
      }
      return connection;
    });

    // @ts-ignore
    setFormData((prev) => ({ ...prev, connections: updatedConnections }));
  };

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add tag
  const handleAddTag = () => {
    // @ts-ignore
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  // Remove tag
  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  // Update tag
  const handleTagChange = (value: any, index: number) => {
    const newTags = formData.tags.map((tag, idx) =>
      idx === index ? value : tag
    );
    // @ts-ignore
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
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

        <Typography variant="h6" sx={{ mt: 2, mb: 5 }}>
          Connections
        </Typography>
        {formData.connections.map((connection, index) => (
          <Accordion key={index} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Connection {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Inputs for connection fields */}
                <TextField
                  label="Advisor ID"
                  // @ts-ignore
                  value={connection.advisor_id}
                  onChange={(e) =>
                    handleConnectionChange(index, "advisor_id", e.target.value)
                  }
                  fullWidth
                />
                {/* Relation and Collaboration details */}
                <Button
                  onClick={() => handleAddRelation(index)}
                  startIcon={<AddIcon />}
                >
                  Add Relation
                </Button>
                {/* Display Relations and Collaborations */}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          onClick={handleAddConnection}
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
        >
          Add Connection
        </Button>
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
