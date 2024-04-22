import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
} from "@mui/material";

import BasicInfo from "./uploadInfo/basicInfo";
import ConnectionInfo from "./uploadInfo/connectionInfo";

const UploadCard = ({ onClose }) => {
  const [step, setStep] = useState(0); // Step changed to 0-indexed
  const totalSteps = 2; // Total steps
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setStep(newValue);
  };

  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    picture: "",
    github: "",
    homepage: "",
    position: "",
    affiliation: "",
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

  return (
    <Grid container direction="column" sx={{ width: "100%", height: "95vh" }}>
      <Grid item>
        <Tabs value={step} onChange={handleChange} centered>
          <Tab label="Add Advisor" />
          <Tab label="Add Connection" />
        </Tabs>
      </Grid>

      <Grid item xs sx={{ flexGrow: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : step === 0 ? (
          <BasicInfo formData={formData} setFormData={setFormData} />
        ) : (
          <ConnectionInfo />
        )}
      </Grid>
    </Grid>
  );
};

export default UploadCard;
