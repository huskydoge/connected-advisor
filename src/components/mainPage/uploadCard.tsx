/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-02-24 00:24:48
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-03-29 19:32:58
 * @FilePath: /connected-advisor/src/components/mainPage/uploadCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Slide, Grid } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import BasicInfo from "./uploadInfo/basicInfo";
import ConnectionInfo from "./uploadInfo/connectionInfo";
//@ts-ignore
const UploadCard = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 2; // 假设总共有两步
  const progress = (step / totalSteps) * 100;

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
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(step + 1);
      setLoading(false);
    }, 300); // Simulate loading
  };

  const handlePreviousStep = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(step - 1);
      setLoading(false);
    }, 300);
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ width: "100%", height: "90vh", display: "flex" }}
    >
      <Grid item>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{ mb: 2, mt: 2 }}
          gutterBottom
        >
          Upload New Advisor
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs sx={{ flexGrow: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {step === 1 && (
              <BasicInfo formData={formData} setFormData={setFormData} />
            )}
            {step === 2 && (
              <ConnectionInfo formData={formData} setFormData={setFormData} />
            )}
          </>
        )}
      </Grid>

      {!loading && (
        <Grid
          item
          sx={{ display: "flex", justifyContent: "center", mt: 2, pb: 2 }}
        >
          {step > 1 && (
            <Button
              onClick={handlePreviousStep}
              variant="contained"
              sx={{ mx: 1, fontSize: "1.5rem" }}
            >
              Back
            </Button>
          )}
          {step < totalSteps && (
            <Button
              onClick={handleNextStep}
              variant="contained"
              sx={{ mx: 1, fontSize: "1.5rem" }}
            >
              Next
            </Button>
          )}
          {step === totalSteps && (
            <Button
              onClick={() => {
                /* handle submission */
              }}
              variant="contained"
              sx={{ mx: 1, fontSize: "1.5rem" }}
            >
              Submit
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default UploadCard;
