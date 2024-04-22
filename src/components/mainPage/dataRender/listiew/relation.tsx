import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  Link,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// @ts-ignore
const RelationComponent = ({ main, second, onBack }) => {
  console.log("main", main);
  console.log("second", second);
  const connection = main.connections.find(
    (conn: any) => conn._id === second._id || conn._id === second._id
  );

  if (!connection) {
    return (
      <Paper sx={{ p: 2, position: "relative" }}>
        <Typography variant="body1">No connection found.</Typography>
        <Box sx={{ position: "absolute", right: 8, bottom: 8 }}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 2, position: "relative" }}>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ textAlign: "center" }}
      >
        Relations
      </Typography>
      <List>
        {connection.relation.map((rel: any, index: number) => (
          <ListItem
            key={index}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="body1">
                {main.name} is {rel.role} of {second.name} during/in {rel.class}
                ,
              </Typography>
            </Box>
            <Typography variant="h6">
              {rel.duration.start} to {rel.duration.end}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ textAlign: "center" }}
      >
        Collaborations
      </Typography>
      <List>
        {connection.collaborations.map((collab: any, index: number) => (
          <ListItem key={index}>
            <Link
              href={collab.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              <Typography variant="body1">
                {collab.papername}, published in {collab.year}.
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", right: 8, bottom: 8 }}>
        <Tooltip title="return to list view">
          <IconButton onClick={onBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default RelationComponent;
