/*
 * @Author: huskydoge hbh001098hbh@sjtu.edu.cn
 * @Date: 2024-02-21 15:59:56
 * @LastEditors: huskydoge hbh001098hbh@sjtu.edu.cn
 * @LastEditTime: 2024-04-24 20:28:39
 * @FilePath: /connected-advisor/src/components/mainPage/statisticCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// StatisticCard.jsx
import React from "react";
import { Box, CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchStatistics } from "../wrapped_api/fetchStatistics";

//@ts-ignore
const StatisticCard = ({ onClose }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography variant="h6">Statistics</Typography>
      </CardContent>
    </Box>
  );
};

export default StatisticCard;
