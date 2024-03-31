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

const ConnectionInfo = () => {
  const [relations, setRelations] = useState([]);
  const [searchResult_1, setsearchResult_1] = useState([]);
  const [searchResult_2, setsearchResult_2] = useState([]);
  const [selectedNameOne, setSelectedNameOne] = useState(null);
  const [selectedNameTwo, setSelectedNameTwo] = useState(null);
  const [papers, setPapers] = useState([]);
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);
  const [paperSearchResult, setPaperSearchResult] = useState([]);
  const [submitPaperOpen, setSubmitPaperOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [errors, setErrors] = useState({});
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogMessage, setInfoDialogMessage] = useState("");

  // submitted by user
  const [newPaper, setNewPaper] = useState({ name: "", year: "" });

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

  const fetchSearchDetailsByName = async (searchText, ord) => {
    if (!searchText.trim()) return [];

    const response = await fetch("/api/searchAdvisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: searchText }),
    });
    const data = await response.json();

    const res = Array.isArray(data) ? data : [];

    if (ord === 1) {
      setsearchResult_1(res);
    } else if (ord === 2) {
      setsearchResult_2(res);
    } else {
      alert("Invalid ord");
    }
  };

  const fetchSearchDetailsById = async (id) => {
    const response = await fetch("/api/searchAdvisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oid: id }),
    });
    const data = await response.json();
    console.log("Search details by id:", data);
    return data;
  };
  const updateAdvisor = async (formattedData) => {
    try {
      const response = await fetch("/api/updateAdvisor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        // Throw an error with the response status to handle it in the catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submit result:", result);

      // Optionally, return the result to the caller for further processing
      return result;
    } catch (error) {
      console.error("Submit error:", error);
      // Optionally, throw the error again to let the caller handle it
      throw error;
    }
  };

  const handlePaperDialogOpen = () => {
    setPaperDialogOpen(true);
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

  const addPaper = () => {
    // check whether a paper is selected
    console.log(selectedPaper);
    if (!selectedPaper) {
      setErrors({ paper: "Please select a paper" });
      return;
    }
    // check whether the paper is already added
    if (papers.find((paper) => paper._id === selectedPaper._id)) {
      setErrors({ paper: "This paper is already added" });
      return;
    }
    setPapers([...papers, selectedPaper]);
    console.log(papers);
    setPaperDialogOpen(false);
    setSubmitPaperOpen(false);
    setSelectedPaper(null);
  };

  const renderDetail = (selectedName) => (
    <Box sx={{ p: 2, border: "1px solid grey", borderRadius: "5px", mt: 1 }}>
      <Typography variant="h5" gutterBottom>
        {selectedName.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Position: {selectedName.position}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Affiliation: {selectedName.affiliation}
      </Typography>
      <Button
        startIcon={<CloseIcon />}
        onClick={() => {
          if (selectedName === selectedNameOne) {
            setSelectedNameOne(null);
          } else if (selectedName === selectedNameTwo) {
            setSelectedNameTwo(null);
          }
        }}
        size="small"
      >
        Remove
      </Button>
    </Box>
  );

  const handleRemovePaper = (index) => {
    setPapers((prevPapers) => prevPapers.filter((_, i) => i !== index));
  };

  const handleOpenSubmitPaper = () => {
    setSubmitPaperOpen(true);
  };

  const renderPaperDialog = () => (
    <Dialog
      open={paperDialogOpen}
      onClose={handlePaperDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        {submitPaperOpen ? (
          <>
            <TextField
              label="Paper Name"
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              value={newPaper.name}
              onChange={(e) =>
                setNewPaper({ ...newPaper, name: e.target.value })
              }
            />
            <TextField
              label="Year"
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              value={newPaper.year}
              onChange={(e) =>
                setNewPaper({ ...newPaper, year: e.target.value })
              }
            />
          </>
        ) : (
          <Autocomplete
            freeSolo
            options={paperSearchResult}
            getOptionLabel={(option) => `${option.name} - ${option.year}`}
            onInputChange={(event, newValue) => {
              console.log("fetching paper details", newValue);
              fetchPaperDetails(newValue);
            }}
            onChange={(event, newValue) => {
              setSelectedPaper(newValue);
              // clear errors
              if (newValue) {
                setErrors({ ...errors, paper: "" });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Paper"
                variant="outlined"
                fullWidth
                error={errors.paper}
                helperText={errors.paper}
              />
            )}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button onClick={handlePaperDialogClose}>Cancel</Button>
          </Grid>
          {!submitPaperOpen && (
            <Grid item>
              <Button onClick={() => addPaper(selectedPaper)}>Add Paper</Button>
            </Grid>
          )}
          {submitPaperOpen ? (
            <Grid item>
              <Button onClick={addPaper}>Confirm Submit</Button>
            </Grid>
          ) : (
            <Grid item>
              <Button onClick={handleOpenSubmitPaper}>Submit New Paper</Button>
            </Grid>
          )}
        </Grid>
      </DialogActions>
    </Dialog>
  );

  const fetchRelations = async () => {
    if (!selectedNameOne || !selectedNameTwo) {
      alert("Both persons must be selected to form a connection.");
      return;
    }
    const response = await fetch("/api/searchRelation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "id-1": selectedNameOne?._id,
        "id-2": selectedNameTwo?._id,
      }),
    });
    const existingRelations = await response.json();
    if (!response.ok) {
      return [];
    } else {
      return existingRelations;
    }
  };

  const fetchConnection = async () => {
    console.log(selectedNameOne?._id, selectedNameTwo?._id);
    const response = await fetch("/api/searchConnection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "id-1": selectedNameOne?._id,
        "id-2": selectedNameTwo?._id,
      }),
    });
    const existingConnection = await response.json();
    if (!response.ok) {
      console.error("Failed to fetch connection");
      return null;
    } else {
      return existingConnection;
    }
  };

  const addOrUpdateConnection = async (connectionData) => {
    // TODO make sure it return correct id. If existing, then return existing id
    const response = await fetch("/api/addConnection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connectionData),
    });
    if (!response.ok) {
      console.error("Failed to add/update connection");
      return null;
    } else {
      console.log("Connection added/updated successfully");
      const connection_id = (await response.json())._id;
      return connection_id;
    }
  };

  const addRelations = async () => {
    const relation_list = relations.map((relation) => {
      console.log(relation, selectedNameOne._id, selectedNameTwo._id);
      return {
        type: relation.type,
        "id-1": selectedNameOne._id,
        "id-2": selectedNameTwo._id,
        "role-1": relation.role1,
        "role-2": relation.role2,
        duration: {
          start: relation.start,
          end: relation.end,
        },
      };
    });

    let relation_ids = [];
    for (let relation of relation_list) {
      const response = await fetch("/api/addRelation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relation),
      });
      if (!response.ok) {
        console.error("Failed to add relation", relation);
        return false;
      } else {
        relation_ids.push((await response.json())._id);
      }
    }
    console.log("Relation IDs:", relation_ids);
    return relation_ids;
  };

  const handleSubmitConnection = async () => {
    console.log("submit connection");
    // submit relation first
    // we should check whether this relation has been added
    // since we have the relation table, we just need to check whether there exists a relation, whose {id_1, id_2} = {searchResult_1._id, searchResult2._id}, and has same type with the relation we are going to add
    // the relation search api is /api/searchRelation
    // relations are stored in a list, make it a loop

    // Assuming the API endpoint '/api/searchRelation' accepts POST requests
    // and returns relations in the form [{ type, personOneId, personTwoId }]

    const existingRelations = await fetchRelations();
    const existingConnection = await fetchConnection();

    console.log("Existing relations:", existingRelations);
    console.log("new relations:", relations);

    // Check if any of the new relations already exist
    const duplicateRelations = relations.filter((newRelation) =>
      existingRelations.some(
        (existingRelation) =>
          existingRelation.type === newRelation.type &&
          ((existingRelation["id-1"] === selectedNameOne._id &&
            existingRelation["id-2"] === selectedNameTwo._id) ||
            (existingRelation["id-1"] === selectedNameTwo._id &&
              existingRelation["id-2"] === selectedNameOne._id))
      )
    );

    if (duplicateRelations.length > 0) {
      const duplicateMessage = duplicateRelations
        .map(
          (relation) =>
            `Duplicate relation found: ${relation.type} between ${selectedNameOne.name} and ${selectedNameTwo.name}`
        )
        .join(", ");

      setInfoDialogMessage(duplicateMessage);
      setInfoDialogOpen(true);
      return;
    }

    // if no duplicate, then we can add all the relation in relation list to relation table first, and get the relation id

    const relation_ids = await addRelations();

    console.log(relation_ids);

    let connectionData = {
      "id-1": selectedNameOne._id,
      "id-2": selectedNameTwo._id,
      relations: relation_ids,
      "collaborate-papers": papers.map((paper) => paper._id),
      "last-connected": Math.max(...papers.map((paper) => paper.year)),
      "connection-strength": 1, // This could be calculated based on some logic
    };

    console.log("Existing connection:", existingConnection);

    if (existingConnection) {
      // Update the existing connection
      existingConnection["relations"] = [
        ...existingConnection["relations"],
        ...connectionData["relations"],
      ];
      existingConnection["collaborate-papers"] = [
        ...new Set([...existingConnection.papers, ...connectionData.papers]),
      ];
      existingConnection["last-connected"] = Math.max(
        existingConnection.lastConnected,
        connectionData.lastConnected
      );
      let connectionData = existingConnection;
    }
    console.log("Connection data:", connectionData);
    const connection_id = await addOrUpdateConnection(connectionData);

    // after get the id of the connection, we can add it to corresponding advisor's connection list

    const advisor_1 = await fetchSearchDetailsById(selectedNameOne._id);
    const advisor_2 = await fetchSearchDetailsById(selectedNameTwo._id);

    advisor_1.connections.push(connection_id);
    advisor_2.connections.push(connection_id);

    await updateAdvisor(advisor_1);

    await updateAdvisor(advisor_2);

    setInfoDialogMessage("Connection submitted successfully");
    setInfoDialogOpen(true);
  };

  return (
    <Box>
      <CardContent>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Connection Information
          </Typography>
          <Button onClick={handleSubmitConnection}>Submit Connection</Button>
        </Grid>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Person One
            </Typography>
            {selectedNameOne ? (
              renderDetail(selectedNameOne)
            ) : (
              <Autocomplete
                freeSolo
                options={searchResult_1}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.position} - ${option.affiliation}`
                }
                onInputChange={(event, newValue) => {
                  fetchSearchDetailsByName(newValue, 1);
                }}
                onChange={(event, newValue) => {
                  if (selectedNameTwo?._id === newValue?._id) {
                    setsearchResult_1([]);
                    setSelectedNameOne(null);
                    setInfoDialogMessage(
                      "Person One and Person Two cannot be the same person."
                    );
                    setInfoDialogOpen(true);

                    return;
                  }
                  setSelectedNameOne(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Person One"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Grid>
          <Grid item>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Person Two
            </Typography>
            {selectedNameTwo ? (
              renderDetail(selectedNameTwo)
            ) : (
              <Autocomplete
                freeSolo
                options={searchResult_2}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.position} - ${option.affiliation}`
                }
                onInputChange={(event, newValue) => {
                  fetchSearchDetailsByName(newValue, 2);
                }}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  console.log(selectedNameOne);
                  if (newValue?._id === selectedNameOne?._id) {
                    setsearchResult_2([]);
                    setSelectedNameTwo(null);
                    setInfoDialogMessage(
                      "Person One and Person Two cannot be the same person."
                    );
                    setInfoDialogOpen(true);

                    return;
                  }
                  setSelectedNameTwo(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Person Two"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
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
        <Relation relations={relations} setRelations={setRelations} />
      </CardContent>
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">{"Information: "}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="error-dialog-description"
            style={{ fontSize: "1.2rem" }}
          >
            {infoDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectionInfo;
