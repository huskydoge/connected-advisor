import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Snackbar,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { Relation } from "@/components/interface";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a1b9a",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: ['"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

const RelationProcesser = ({ relations, setRelations, existingRelations }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRelation, setNewRelation] = useState({
    type: "",
    "role-1": "",
    "role-2": "",
    duration: {
      start: "",
      end: "",
    },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  console.log("existingRelations", existingRelations);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const validateRelation = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!newRelation.type) errors.type = "Type is required";
    if (!newRelation["role-1"]) errors.role1 = "Person 1's role is required";
    if (
      Number(newRelation.duration.start) < 1900 ||
      Number(newRelation.duration.start) > currentYear
    )
      errors.start = "Start year is out of range";
    if (
      Number(newRelation.duration.end) < 1900 ||
      Number(newRelation.duration.end) > currentYear
    )
      errors.end = "End year is out of range";
    if (newRelation.duration.start > newRelation.duration.end)
      errors.yearRange = "End year must be greater or equal to start year";

    const isDuplicate = relations.some(
      (r) =>
        r.type === newRelation.type &&
        r["role-1"] === newRelation["role-1"] &&
        r.duration.start === newRelation.duration.start &&
        r.duration.end === newRelation.duration.end
    );

    if (isDuplicate) errors.duplicate = "Duplicate relation";

    return errors;
  };

  const addRelation = () => {
    const errors = validateRelation();

    if (Object.keys(errors).length > 0) {
      setSnackbarMessage(Object.values(errors).join(", "));
      setSnackbarOpen(true);
      return;
    }

    setRelations([...relations, newRelation]);
    setNewRelation({
      type: "",
      "role-1": "",
      "role-2": "",
      duration: {
        start: "",
        end: "",
      },
    });
    handleDialogClose();
  };

  const deleteRelation = (index) => {
    setRelations(relations.filter((_, i) => i !== index));
  };

  const roleMapping = {
    Supervisor: "Supervisee",
    Supervisee: "Supervisor",
    Collaborater: "Collaborater",
    Superior: "Subordinate",
    Subordinate: "Superior",
  };

  const handleRole1Change = (event) => {
    const role1 = event.target.value;
    setNewRelation({
      ...newRelation,
      "role-1": role1,
      "role-2": roleMapping[role1] || "",
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        New Relations
      </Typography>
      <Button sx={{ mb: 2 }} variant="outlined" onClick={handleDialogOpen}>
        Add Relation
      </Button>
      {relations.map((relation: Relation, index) => (
        <Card
          key={index}
          sx={{
            my: 1,
            boxShadow: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <CardHeader
            title={`Relation ${index + 1}`}
            sx={{
              backgroundColor: "#1a1b9e",
              color: "#fff",
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          />
          <CardContent>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ color: "#333", fontWeight: "medium" }}
              >{`Type: ${relation?.type}`}</Typography>
              <IconButton onClick={() => deleteRelation(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <GroupIcon
                    sx={{ verticalAlign: "middle", color: "primary.main" }}
                  />{" "}
                  {`Person 1's Role: ${relation["role-1"]}`}
                </Typography>
                <Typography>
                  <GroupIcon
                    sx={{ verticalAlign: "middle", color: "secondary.main" }}
                  />{" "}
                  {`Person 2's Role: ${roleMapping[relation["role-1"]]}`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <AccessTimeIcon sx={{ verticalAlign: "middle" }} />{" "}
                  {`Years: ${relation?.duration?.start} - ${relation?.duration?.end}`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        Existing Relations
      </Typography>
      {existingRelations.map((relation: Relation, index) => (
        <Card
          key={index}
          sx={{
            my: 1,
            boxShadow: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <CardHeader
            title={`Relation ${index + 1}`}
            sx={{
              backgroundColor: "#6a1b9a",
              color: "#fff",
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          />
          <CardContent>
            <Typography
              sx={{ color: "#333", fontWeight: "medium" }}
            >{`Type: ${relation?.type}`}</Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <GroupIcon
                    sx={{ verticalAlign: "middle", color: "primary.main" }}
                  />{" "}
                  {`Person 1's Role: ${relation["role-1"]}`}
                </Typography>
                <Typography>
                  <GroupIcon
                    sx={{ verticalAlign: "middle", color: "secondary.main" }}
                  />{" "}
                  {`Person 2's Role: ${roleMapping[relation["role-1"]]}`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <AccessTimeIcon sx={{ verticalAlign: "middle" }} />{" "}
                  {`Years: ${relation?.duration?.start} - ${relation?.duration?.end}`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={newRelation.type}
                onChange={(e) =>
                  setNewRelation({ ...newRelation, type: e.target.value })
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Type
                </MenuItem>
                <MenuItem value="Postdoc">PostDoc</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
                <MenuItem value="MS">Master</MenuItem>
                <MenuItem value="Undergrad">Undergrad</MenuItem>
                <MenuItem value="Working">Working</MenuItem>
                <MenuItem value="Collaboration">Collaboration</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={newRelation["role-1"]}
                onChange={handleRole1Change}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Person 1's Role
                </MenuItem>
                <MenuItem value="Supervisor">Supervisor</MenuItem>
                <MenuItem value="Supervisee">Supervisee</MenuItem>
                <MenuItem value="Collaborater">Collaborater</MenuItem>
                <MenuItem value="Superior">Superior</MenuItem>
                <MenuItem value="Subordinate">Subordinate</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                value={newRelation["role-2"]}
                label="Person 2's Role"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Start Year"
                value={newRelation.duration.start}
                onChange={(e) =>
                  setNewRelation({
                    ...newRelation,
                    duration: {
                      ...newRelation.duration,
                      start: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="End Year"
                value={newRelation.duration.end}
                onChange={(e) =>
                  setNewRelation({
                    ...newRelation,
                    duration: { ...newRelation.duration, end: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={addRelation}>Add Relation</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="warning"
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default RelationProcesser;
