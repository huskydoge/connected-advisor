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
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      {tags.map((tag) => {
        // 移除了index参数，改用tag作为key
        const borderColor = getRandomColor();
        return (
          <Chip
            key={tag} // 使用tag作为key，假设所有tag都是唯一的
            label={tag}
            onClick={() => onClickTag(tag)}
            variant="outlined"
            sx={{
              border: `2px solid ${borderColor}`,
              color: borderColor,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: borderColor,
                color: "#000",
              },
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
