import React from "react";
import { Chip, Stack } from "@mui/material";

// 随机颜色生成器
const getRandomColor = () => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#cc65fe",
    "#ff7043",
    "#4caf50",
    "#2196f3",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Tags = ({ tags, onClickTag }) => {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      {tags.map((tag, index) => {
        const borderColor = getRandomColor();
        return (
          <Chip
            key={index}
            label={tag}
            onClick={() => onClickTag(tag)}
            variant="outlined"
            sx={{
              border: `2px solid ${borderColor}`,
              color: borderColor,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "4px", // 调整圆角大小
              "&:hover": {
                backgroundColor: borderColor, // 鼠标悬浮时背景色变为边框颜色
                color: "#000", // 鼠标悬浮时文本颜色变为白色
              },
              // 长方形形状，可通过调整padding和fontSize来进一步定制
              padding: "0 2px",
              paddingTop: 0.2,
              height: "32px",
            }}
          />
        );
      })}
    </Stack>
  );
};

export default Tags;
