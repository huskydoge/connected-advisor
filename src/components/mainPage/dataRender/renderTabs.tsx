/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-02-21 15:05:00
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 19:43:42
 * @FilePath: /connected-advisor/src/components/mainPage/dataRender/renderTabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { Toolbar, Button, Typography, Box } from "@mui/material";
import { Advisor } from "@/components/interface";

//@ts-ignore
const RenderTabs = ({
  onStatistics,
  onUpload,
  onListView,
  onGraphMode,
  selected,
  mainAdvisor,
}: {
  onStatistics: () => void;
  onUpload: () => void;
  onListView: () => void;
  onGraphMode: () => void;
  selected: string;
  mainAdvisor: Advisor;
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
        {mainAdvisor.name}
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
          onClick={onStatistics}
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: selected === "Statistics" ? "#e0e0e0" : "inherit",
            fontSize: "1rem",
          }}
        >
          Statistics
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
