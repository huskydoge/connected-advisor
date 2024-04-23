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
  FormGroup,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Config } from "../interface";

const ConfigCard = ({
  onClose,
  onGraphDegreeChange,
  onGraphTypeChange,
  onGraphAvatarDisplayChange,
  config,
}: {
  onClose: () => void;
  onGraphDegreeChange: (degree: number) => void;
  onGraphTypeChange: (type: string) => void;
  onGraphAvatarDisplayChange: (show: boolean) => void;
  config: Config;
}) => {
  const [colorPattern, setColorPattern] = React.useState(config.colorPattern);
  const [graphType, setGraphType] = React.useState(config.graphType);
  const [graphDegree, setGraphDegree] = React.useState(config.graphDegree);
  const [showAvatars, setShowAvatars] = React.useState(config.showAvatars);

  const handleDegreeChange = (event: any) => {
    onGraphDegreeChange(event.target.value);
    setGraphDegree(event.target.value);
  };
  // @ts-ignore
  const handleColorChange = (event, newColor) => {
    if (newColor !== null) {
      setColorPattern(newColor);
    }
  };
  // @ts-ignore
  const handleGraphTypeChange = (event) => {
    onGraphTypeChange(event.target.value);
    setGraphType(event.target.value);
  };

  const handleAvatarDisplayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onGraphAvatarDisplayChange(event.target.checked);
    setShowAvatars(event.target.checked);
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
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Graph Configuration
        </Typography>
        <Box
          sx={{
            display: "flex",
            direction: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Graph Degree</FormLabel>
              <RadioGroup
                value={graphDegree}
                row
                name="graph-degree"
                onChange={handleDegreeChange}
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
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
          </Box>
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
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
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAvatars}
                      onChange={handleAvatarDisplayChange}
                    />
                  }
                  label="Display Avatars on Nodes"
                />
              </FormGroup>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
    </Box>
  );
};
export default ConfigCard;
