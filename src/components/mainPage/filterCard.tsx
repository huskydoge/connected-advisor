// FilterCard.jsx
import React from "react";
import { Box, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

//@ts-ignore
const FilterCard = ({ onClose }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography variant="h6">Filter Configuration</Typography>
        fafaasfa
      </CardContent>
    </Box>
  );
};

export default FilterCard;
