import React from "react";
import {
  Box,
  CardContent,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// @ts-ignore
const GraphCard = ({ onClose }) => {
  const [degree, setDegree] = React.useState("1");
  const [colorPattern, setColorPattern] = React.useState("pattern1");
  const [graphType, setGraphType] = React.useState("undirected");
  // @ts-ignore
  const handleDegreeChange = (event) => {
    setDegree(event.target.value);
  };
  // @ts-ignore
  const handleColorChange = (event, newColor) => {
    if (newColor !== null) {
      setColorPattern(newColor);
    }
  };
  // @ts-ignore
  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
  };

  return (
    <Box sx={{ position: "relative", p: 2 }}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        {/* Add marginTop to the first Typography for spacing */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 4 }}>
          Graph Configuration
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Graph Degree</FormLabel>
          <RadioGroup
            row
            name="graph-degree"
            value={degree}
            onChange={handleDegreeChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Graph Color</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={colorPattern}
            exclusive
            onChange={handleColorChange}
            aria-label="Graph color pattern"
          >
            <ToggleButton value="pattern1">Pattern 1</ToggleButton>
            <ToggleButton value="pattern2">Pattern 2</ToggleButton>
            <ToggleButton value="pattern3">Pattern 3</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        {/* Add Graph Type Selection */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Graph Type</FormLabel>
          <RadioGroup
            row
            name="graph-type"
            value={graphType}
            onChange={handleGraphTypeChange}
          >
            <FormControlLabel
              value="undirected"
              control={<Radio />}
              label="Undirected"
            />
            <FormControlLabel
              value="directed"
              control={<Radio />}
              label="Directed"
            />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Box>
  );
};

export default GraphCard;
