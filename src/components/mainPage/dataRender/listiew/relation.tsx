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
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group"; // 角色图标
import BookIcon from "@mui/icons-material/Book"; // 合作图标

// @ts-ignore
const RelationComponent = ({ main, second, onBack }) => {
  console.log("main", main);
  console.log("second", second);
  const connection = main.connections.find(
    (conn: any) => conn._id === second._id
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
    <Paper
      elevation={3}
      sx={{ p: 2, position: "relative", margin: "auto", width: "100%" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Relationship Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {connection.relations.map((rel: any, index: number) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>{main.name}</strong> is the{" "}
                    <strong style={{ color: "#3f51b5" }}>{rel.role}</strong> of{" "}
                    <strong>{second.name}</strong> in his/her/its/{" "}
                    <strong style={{ fontWeight: "bold", color: "#ff5722" }}>
                      {rel.type}
                    </strong>
                    ,
                  </Typography>
                </Box>

                <Typography variant="h6">
                  {rel.duration.start} to {rel.duration.end}
                </Typography>
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Collaborative Works
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {connection.collaborations.map((collab: any, index: number) => (
          <Card key={index} variant="outlined" sx={{ mb: 2, boxShadow: 1 }}>
            <CardContent>
              <ListItem>
                <Link
                  href={collab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BookIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {collab.papername}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    published in {collab.year}
                  </Typography>
                </Link>
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>

      <Box sx={{ position: "absolute", right: 8, bottom: 8 }}>
        <Tooltip title="Return to previous view" arrow>
          <IconButton onClick={onBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default RelationComponent;
