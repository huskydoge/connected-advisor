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
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";

const Relation = ({ relations, setRelations }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRelation, setNewRelation] = useState({
    type: "",
    role1: "",
    role2: "",
    start: "",
    end: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    if (!newRelation.role1) errors.role1 = "Person 1's role is required";
    if (newRelation.start < 1900 || newRelation.start > currentYear)
      errors.start = "Start year is out of range";
    if (newRelation.end < 1900 || newRelation.end > currentYear)
      errors.end = "End year is out of range";
    if (newRelation.start >= newRelation.end)
      errors.yearRange = "End year must be greater than start year";

    const isDuplicate = relations.some(
      (r) =>
        r.type === newRelation.type &&
        r.role1 === newRelation.role1 &&
        r.start === newRelation.start &&
        r.end === newRelation.end
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
      role1: "",
      role2: "",
      start: "",
      end: "",
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
      role1: role1,
      role2: roleMapping[role1] || "",
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        Relations
      </Typography>
      <Button variant="outlined" onClick={handleDialogOpen}>
        Add Relation
      </Button>

      {relations.map((relation, index) => (
        <Card key={index} sx={{ my: 1 }}>
          <CardHeader
            title={`Relation ${index + 1}`}
            sx={{ backgroundColor: "#f0f0f0" }}
          />
          <CardContent>
            <Typography>{`Type: ${relation.type}`}</Typography>
            <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography>{`Person 1's Role: ${relation.role1}`}</Typography>
                <Typography>{`Person 2's Role: ${
                  roleMapping[relation.role1]
                }`}</Typography>
                <Typography>{`Years: ${relation.start} - ${relation.end}`}</Typography>
              </Box>
              <IconButton onClick={() => deleteRelation(index)}>
                <DeleteIcon />
              </IconButton>
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
                value={newRelation.role1}
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
                value={newRelation.role2}
                label="Person 2's Role"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Start Year"
                value={newRelation.start}
                onChange={(e) =>
                  setNewRelation({ ...newRelation, start: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="End Year"
                value={newRelation.end}
                onChange={(e) =>
                  setNewRelation({ ...newRelation, end: e.target.value })
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

export default Relation;
