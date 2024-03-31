import React, { useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Relation from "./relation";

const Papers = ({ papers, setPapers, newPaper, setNewPaper, errors }) => {
  const [paperSearchResult, setPaperSearchResult] = useState([]);
  const [submitPaperOpen, setSubmitPaperOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);
  const [authorSearchResult, setAuthorSearchResult] = useState([]);
  const fetchPaperDetails = async (searchText) => {
    if (!searchText.trim()) return;
    const response = await fetch("/api/searchPaper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: searchText }),
    });
    const data = await response.json();
    setPaperSearchResult(Array.isArray(data) ? data : []);
  };
  const handlePaperDialogOpen = () => {
    setPaperDialogOpen(true);
  };

  const handleRemovePaper = (index) => {
    setPapers((prevPapers) => prevPapers.filter((_, i) => i !== index));
  };

  const handleOpenSubmitPaper = () => {
    setSubmitPaperOpen(true);
  };

  const handlePaperDialogClose = () => {
    if (submitPaperOpen) {
      // clear new paper data
      setNewPaper({ name: "", year: "" });
      setSubmitPaperOpen(false); // Return to search paper view
    } else {
      setPaperDialogOpen(false); // Close dialog
    }
  };

  const fetchAuthors = async (searchText) => {
    if (!searchText.trim()) return;
    const response = await fetch("/api/searchAdvisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: searchText }),
    });
    const data = await response.json();
    setAuthorSearchResult(data);
  };

  const handleAuthorChange = (event, newValue) => {
    setNewPaper({ ...newPaper, authors: newValue });
  };

  const handleAuthorSearch = (event, newInputValue) => {
    fetchAuthors(newInputValue);
  };

  const handleAuthorSelect = (event, newValue) => {
    setNewPaper({ ...newPaper, authors: newValue });
  };

  const renderAuthorChip = (author, index) => (
    <Chip key={index} label={author.name} />
  );

  const renderPaperDialog = () => (
    <Dialog
      open={paperDialogOpen}
      onClose={handlePaperDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {submitPaperOpen ? "Submit New Paper" : "Add Paper"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Paper Name"
              fullWidth
              variant="outlined"
              margin="dense"
              value={newPaper.name}
              onChange={(e) =>
                setNewPaper({ ...newPaper, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Year"
              fullWidth
              variant="outlined"
              margin="dense"
              value={newPaper.year}
              onChange={(e) =>
                setNewPaper({ ...newPaper, year: e.target.value })
              }
            />
          </Grid>
          {submitPaperOpen && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="URL"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  value={newPaper.url}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, url: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Abstract"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={4}
                  value={newPaper.abstract}
                  onChange={(e) =>
                    setNewPaper({ ...newPaper, abstract: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={authorSearchResult}
                  value={newPaper.authors}
                  onChange={handleAuthorChange}
                  onInputChange={handleAuthorSearch}
                  getOptionLabel={(option) =>
                    `${option.name} - ${option.position} - ${option.affiliation}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Authors"
                      variant="outlined"
                      onClick={() => fetchAuthors("")}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((author, index) =>
                      renderAuthorChip(author, index)
                    )
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePaperDialogClose}>Cancel</Button>
        {submitPaperOpen && <Button onClick={addPaper}>Confirm Submit</Button>}
        {!submitPaperOpen && (
          <Button onClick={handleOpenSubmitPaper}>Submit New Paper</Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const addPaper = () => {
    // check whether a paper is selected
    console.log(selectedPaper);
    if (!selectedPaper) {
      errors.paper = "Please select a paper";
      return;
    }
    // check whether the paper is already added
    if (papers.find((paper) => paper._id === selectedPaper._id)) {
      errors.paper = "This paper is already added";
      return;
    }
    setPapers([...papers, selectedPaper]);
    console.log(papers);
    setPaperDialogOpen(false);
    setSubmitPaperOpen(false);
    setSelectedPaper(null);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        Collaborated Papers
      </Typography>
      <Button startIcon={<AddIcon />} onClick={handlePaperDialogOpen}>
        Add Paper
      </Button>
      <List>
        {papers.map((paper, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemovePaper(index)}>
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemText primary={paper?.name} secondary={paper?.year} />
          </ListItem>
        ))}
      </List>

      {renderPaperDialog()}
    </Box>
  );
};

export default Papers;
