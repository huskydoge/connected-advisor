import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Autocomplete,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const ConnectionInfo = () => {
  const [connections, setConnections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [startYearValidation, setStartYearValidation] = useState({});
  const [endYearValidation, setEndYearValidation] = useState({});

  const [tempConnection, setTempConnection] = useState({
    name: "",
    papers: [],
    relation: {
      type: "",
      role: "",
      duration: { start: "", end: "" },
    },
  });

  const handleOpenDialog = () => {
    setTempConnection({
      name: "",
      papers: [],
      relations: [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const relationTypes = [
    "phD",
    "Undergrad",
    "Master",
    "PostDoc",
    "Collaborator",
  ];

  const handleAddConnection = () => {
    if (!tempConnection.name || !tempConnection.relations.length) {
      // warning! Add validation here

      return;
    }
    setConnections([...connections, tempConnection]);
    handleCloseDialog();
    setTempConnection({
      name: "",
      papers: [],
      relation: {
        type: "",
        role: "",
        duration: { start: "", end: "" },
      },
    });
  };

  const validateYear = (index, startYear, endYear) => {
    let isValidStart = true,
      isValidEnd = true,
      startMessage = "",
      endMessage = "";
    const currentYear = new Date().getFullYear();

    // Validate start year range
    if (startYear) {
      if (
        parseInt(startYear, 10) < 1900 ||
        parseInt(startYear, 10) > currentYear
      ) {
        isValidStart = false;
        startMessage = "Start year must be between 1900 and " + currentYear;
      }
    }

    // Validate end year range
    if (endYear) {
      if (parseInt(endYear, 10) < 1900 || parseInt(endYear, 10) > currentYear) {
        isValidEnd = false;
        endMessage = "End year must be between 1900 and " + currentYear;
      }
    }

    // Validate start is less than or equal to end
    if (startYear && endYear && isValidStart && isValidEnd) {
      isValidStart = parseInt(startYear, 10) <= parseInt(endYear, 10);
      isValidEnd = parseInt(endYear, 10) >= parseInt(startYear, 10);
      if (!isValidStart) {
        startMessage = "Start year must be less than or equal to end year";
      }
      if (!isValidEnd) {
        endMessage = "End year must be greater than or equal to start year";
      }
    }

    setStartYearValidation((prev) => ({
      ...prev,
      [index]: { valid: isValidStart, message: startMessage },
    }));
    setEndYearValidation((prev) => ({
      ...prev,
      [index]: { valid: isValidEnd, message: endMessage },
    }));
  };

  const handleChange = (e, index = 0, field = "") => {
    if (field.startsWith("relations.")) {
      const updatedRelations = [...tempConnection?.relations];
      const [_, subfield] = field.split(".");
      updatedRelations[index][subfield] = e.target.value;
      setTempConnection({
        ...tempConnection,
        relations: updatedRelations,
      });
    } else {
      setTempConnection({
        ...tempConnection,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleBlur = (index, fieldName) => {
    const relation = tempConnection.relations[index];
    validateYear(index, relation.start, relation.end);
  };

  useEffect(() => {
    if (tempConnection.relations?.length > 0) {
      tempConnection.relations.forEach((relation, index) => {
        validateYear(index, relation.start, relation.end);
      });
    }
  }, [tempConnection.relations]);

  const handleAddRelation = () => {
    setTempConnection((prev) => ({
      ...prev,
      relations: [...(prev.relations || []), { type: "", start: "", end: "" }],
    }));
  };

  const handleRelationChange = (index, field, value) => {
    let newRelations = [...tempConnection.relations];
    newRelations[index][field] = value;
    setTempConnection({ ...tempConnection, relations: newRelations });
  };

  // Placeholder for paper search functionality
  const handlePaperSearch = (event, value) => {
    setTempConnection({ ...tempConnection, papers: value });
  };

  // Placeholder for API call
  const fetchConnectionDetails = async (name) => {
    // Simulate API call
    console.log("Fetching details for", name);
  };

  const handleAddPaper = () => {
    setTempConnection((prev) => ({
      ...prev,
      papers: [...prev.papers, { title: "" }],
    }));
  };

  const handlePaperChange = (index, value) => {
    let newPapers = [...tempConnection.papers];
    newPapers[index].title = value;
    setTempConnection({ ...tempConnection, papers: newPapers });
  };

  const paperOptions = []; // Populate this array based on the API search results

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Connection Information
        </Typography>
        {connections.map((connection, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                <b>{connection.name}</b> -{" "}
                <i>{connection.relations.map((r) => r.type).join(", ")}</i>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="primary" gutterBottom>
                    <strong>Name:</strong> {connection.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="secondary">
                    <strong>Relations:</strong>{" "}
                    {connection.relations
                      .map((r) => `${r.type} from ${r.start} to ${r.end}`)
                      .join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    <strong>Papers ({connection.papers.length}):</strong>{" "}
                    {connection.papers.map((p) => p.title).join(", ")}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          variant="outlined"
          onClick={handleOpenDialog}
          sx={{ mt: 2, width: "100%" }}
        >
          Add Connection
        </Button>
      </CardContent>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Connection Details</Typography>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={tempConnection.name}
                onChange={handleChange}
                onBlur={() => fetchConnectionDetails(tempConnection.name)}
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Papers</Typography>
              {tempConnection.papers?.map((paper, index) => (
                <Autocomplete
                  key={index}
                  freeSolo
                  options={paperOptions}
                  getOptionLabel={(option) => option.title}
                  value={paper.title}
                  onChange={(event, newValue) =>
                    handlePaperChange(index, newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Paper"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  )}
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddPaper}
                sx={{ mt: 1 }}
              >
                Add Paper
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Relation</Typography>
              {tempConnection.relations?.map((relation, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={4}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Type</InputLabel>
                      <Select
                        name={`relations.type`}
                        value={relation.type}
                        onChange={(e) =>
                          handleRelationChange(index, "type", e.target.value)
                        }
                        label="Type"
                      >
                        {relationTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Start Year"
                      name={`relations.start`}
                      type="number"
                      value={relation.start}
                      onChange={(e) =>
                        handleChange(e, index, "relations.start")
                      }
                      onBlur={() => handleBlur(index, "start")}
                      error={startYearValidation[index]?.valid === false}
                      helperText={startYearValidation[index]?.message}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="End Year"
                      name={`relations.end`}
                      type="number"
                      value={relation.end}
                      onChange={(e) => handleChange(e, index, "relations.end")}
                      onBlur={() => handleBlur(index, "end")}
                      error={endYearValidation[index]?.valid === false}
                      helperText={endYearValidation[index]?.message}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddRelation}
                sx={{ mt: 1 }}
              >
                Add Relation
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddConnection}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectionInfo;
