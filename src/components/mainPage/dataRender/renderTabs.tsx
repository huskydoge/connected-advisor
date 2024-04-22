import React from "react";
import { Toolbar, Button, Typography, Box } from "@mui/material";

//@ts-ignore
const RenderTabs = ({
  onFilter,
  onUpload,
  onListView,
  onGraphMode,
  selected,
}: {
  onFilter: () => void;
  onUpload: () => void;
  onListView: () => void;
  onGraphMode: () => void;
  selected: string;
}) => {
  return (
    <Toolbar
      sx={{
        justifyContent: "space-between",
        width: "99.95%",
        backgroundColor: "white", // 设置背景颜色为白色
        boxShadow:
          "0px 2px 3px -2px rgba(0,0,0,0.12), 0px -2px 6px -2px rgba(0,0,0,0.11)", // 上下阴影
      }}
    >
      <Typography variant="h6" component="div">
        Render Tab
      </Typography>
      <Box sx={{ display: "flex", gap: 5 }}>
        <Button
          onClick={onUpload}
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: selected === "upload" ? "#e0e0e0" : "inherit",
            fontSize: "1rem",
          }}
        >
          Upload
        </Button>
        <Button
          onClick={onFilter}
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: selected === "filter" ? "#e0e0e0" : "inherit",
            fontSize: "1rem",
          }}
        >
          Filter
        </Button>
        <Button
          onClick={onListView}
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: selected === "listview" ? "#e0e0e0" : "inherit",
            fontSize: "1rem",
          }}
        >
          List View
        </Button>
        <Button
          onClick={onGraphMode}
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: selected === "graphmode" ? "#e0e0e0" : "inherit",
            fontSize: "1rem",
          }}
        >
          Configuration
        </Button>
      </Box>
    </Toolbar>
  );
};

export default RenderTabs;
