import React from "react";
import { Chip, Stack } from "@mui/material";

interface TagsProps {
  tags: string[];
  onClickTag: (tag: string) => void;
}

const getRandomColor = (): string => {
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

const Tags: React.FC<TagsProps> = ({ tags, onClickTag }) => {
  return (
    <Stack
      direction="row"
      spacing={1} // 控制水平间距
      sx={{
        flexWrap: "wrap",
        gap: "0.5rem", // 控制垂直间距，当元素换行时
        justifyContent: "center", // 使元素整体居中
        width: "100%", // 确保Stack占满其容器的宽度
      }}
    >
      {tags.map((tag) => {
        const borderColor = getRandomColor();
        return (
          <Chip
            key={tag}
            label={tag}
            onClick={() => onClickTag(tag)}
            variant="outlined"
            sx={{
              border: `0.1rem solid ${borderColor}`,
              color: borderColor,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "0.4rem",
              "&:hover": {
                backgroundColor: borderColor,
                color: "#000",
              },
              padding: "0 0.1rem",
              height: "2rem",
              fontSize: "0.6rem", // 调整字体大小
            }}
          />
        );
      })}
    </Stack>
  );
};

export default Tags;
