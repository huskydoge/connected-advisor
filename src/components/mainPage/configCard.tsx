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
import { integer } from "@elastic/elasticsearch/lib/api/types";

const ConfigCard = ({
  onClose,
  onGraphDegreeChange,
  onGraphTypeChange,
  onGraphAvatarDisplayChange,
  onGraphPatternChange,
  config,
}: {
  onClose: () => void;
  onGraphDegreeChange: (degree: number) => void;
  onGraphTypeChange: (type: string) => void;
  onGraphAvatarDisplayChange: (show: boolean) => void;
  onGraphPatternChange: (id: integer) => void;
  config: Config;
}) => {
  const [patternId, setPatternId] = React.useState(config.pattern_id);
  const [graphType, setGraphType] = React.useState(config.graphType);
  const [graphDegree, setGraphDegree] = React.useState(config.graphDegree);
  const [showAvatars, setShowAvatars] = React.useState(config.showAvatars);

  const handleDegreeChange = (event: any) => {
    onGraphDegreeChange(event.target.value);
    setGraphDegree(event.target.value);
  };
  // @ts-ignore
  const handlePatternChange = (event, newColor) => {
    if (newColor !== null) {
      onGraphPatternChange(event.target.value);
      setPatternId(event.target.value);
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
        <Box sx={{ width: "100%" }}>
          <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Graph Degree
            </FormLabel>

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

          <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Graph Color
            </FormLabel>
            <ToggleButtonGroup
              color="primary"
              value={patternId}
              exclusive
              onChange={handlePatternChange}
              fullWidth
            >
              <ToggleButton value="0">Pattern 1</ToggleButton>
              <ToggleButton value="1">Pattern 2</ToggleButton>
              <ToggleButton value="2">Pattern 3</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Graph Type
            </FormLabel>
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
          <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Show Avatar
            </FormLabel>
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
      </CardContent>
    </Box>
  );
};
export default ConfigCard;
