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
  Card,
  Alert,
  Snackbar,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { FormHelperText } from "@mui/material";
import { error } from "console";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { availableTags } from "@/components/const";

// @ts-ignore
const BasicInfo = ({ formData, setFormData }) => {
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef(""); // 用于跟踪最新的输入值
  const [errors, setErrors] = useState({});

  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const checkRequiredFields = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "position",
      "affiliation",
      "descriptions",
      // "email",
    ];
    requiredFields.forEach((field) => {
      if (field == "email") {
        if (!formData.contacts.email) {
          newErrors["email"] = "This field is required";
        }
      } else if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    if (checkRequiredFields()) {
      // 确保在提交前进行必要字段检查
      console.log("Submit data:", formData);
      const formattedData = {
        ...formData,
        publications: {
          "google-scholar": formData.publications.googleScholar,
          dblp: formData.publications.dblp,
          "research-gate": formData.publications.researchGate,
          "semantic-scholar": formData.publications.semanticScholar,
        },
      };

      try {
        const response = await fetch("/api/addAdvisor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const result = await response.json();
        setOpenSnackbar(true);
        console.log("Submit result:", result);
        // clear form data
        setFormData({
          name: "",
          tags: [],
          picture: "",
          github: "",
          homepage: "",
          position: "",
          affiliation: "",
          department: "",
          descriptions: "",
          publications: {
            googleScholar: "",
            dblp: "",
            researchGate: "",
            semanticScholar: "",
          },
          contacts: {
            email: "",
            linkedin: "",
            twitter: "",
          },
          connections: [],
        });

        // 根据需要处理结果
      } catch (error) {
        console.error("Submit error:", error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof FormData,
    field?: string
  ) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value, section, field);
    if (name) {
      errors[name] && delete errors[name]; // clear error message when user starts typing
    } else {
      errors[field] && delete errors[field];
    }
    if (field === "email" && !validateEmail(value)) {
      console.log("email", value);
      errors.email = "Invalid email address";
    } else if (name === "homepage" && value && !validateURL(value)) {
      errors.homepage = "Invalid URL";
    } else if (name === "github" && value && !validateURL(value)) {
      errors.github = "Invalid URL";
    }
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
    <Box>
      {/* Adjust height as needed */}
      <CardContent>
        <Divider sx={{ mb: 3 }} />
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Button
            onClick={handleSubmit}
            sx={{
              mx: 1,
              fontSize: "0.8 rem",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            Submit Advisor
          </Button>
        </Grid>
        {/* Basic Information */}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              error={errors.name && !formData.name}
              helperText={errors.name && !formData.name ? errors.name : ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              error={errors.position && !formData.position}
            >
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
                <MenuItem value="Postdoc">Postdoc</MenuItem>
                <MenuItem value="PhD Student">PhD Student</MenuItem>
                <MenuItem value="Master Student">Master Student</MenuItem>
                <MenuItem value="Research Scientist">
                  Research Scientist
                </MenuItem>
                <MenuItem value="Research Assistant">
                  Research Assistant
                </MenuItem>
                <MenuItem value="Undergrad">Undergraduate Student</MenuItem>
              </Select>
              {errors.position && !formData.position && (
                <FormHelperText>{errors.position}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              error={errors.affiliation && !formData.affiliation}
              helperText={
                errors.affiliation && !formData.affiliation
                  ? errors.affiliation
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department && !formData.department}
              helperText={
                errors.department && !formData.affiliation
                  ? errors.department
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Homepage"
              name="homepage"
              value={formData.homepage}
              onChange={handleChange}
              error={errors.homepage}
              helperText={errors.homepage ? errors.homepage : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              error={errors.github}
              helperText={errors.github ? errors.github : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Picture"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              error={errors.picture}
              helperText={errors.picture ? errors.picture : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="descriptions"
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
              error={errors.descriptions && !formData.descriptions}
              helperText={
                errors.descriptions && !formData.descriptions
                  ? errors.descriptions
                  : ""
              }
              multiline
              rows={15}
            />
          </Grid>
          <Grid item xs={12} className="markdown-preview">
            Preview in Markdown:
            <ReactMarkdown
              children={formData.descriptions}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mb: 3 }} />

        {/* Tags Section */}
        <Typography variant="h6" gutterBottom>
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
        <Typography variant="h6" gutterBottom>
          Publications
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Google Scholar"
              value={formData.publications?.googleScholar}
              onChange={(e) => handleChange(e, "publications", "googleScholar")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="DBLP"
              value={formData.publications?.dblp}
              onChange={(e) => handleChange(e, "publications", "dblp")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ResearchGate"
              value={formData.publications?.researchGate}
              onChange={(e) => handleChange(e, "publications", "researchGate")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Semantic Scholar"
              value={formData.publications?.semanticScholar}
              onChange={(e) =>
                handleChange(e, "publications", "semanticScholar")
              }
            />
          </Grid>
        </Grid>
        <Divider sx={{ mb: 3 }} />

        {/* Contacts */}
        <Typography variant="h6" gutterBottom>
          Contacts
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Email"
              value={formData.contacts?.email}
              onChange={(e) => handleChange(e, "contacts", "email")}
              error={errors.email}
              helperText={errors.email ? errors.email : ""}
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
        <Grid
          item
          xs={12}
          sx={{
            mt: 3,
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
        ></Grid>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ size: "large" }}
      >
        <Alert onClose={handleClose} severity="success">
          Successfully Submitted {formData.name} to the database!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BasicInfo;
