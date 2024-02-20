import React, { useState, useEffect } from "react";
import { CircularProgress, Box, Avatar, AvatarProps } from "@mui/material";

interface AvatarLoaderProps extends AvatarProps {
  src: string;
  alt: string;
}

const AvatarLoader = ({ src, alt, ...props }: AvatarLoaderProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      setLoaded(true); // 当图像加载完成时更新状态
    };
  }, [src]); // 依赖项为src，这意味着当src变化时，重新运行effect

  return (
    <Box
      sx={{
        display: "inline-flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!loaded && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            zIndex: 1,
          }}
        />
      )}
      <Avatar
        src={loaded ? src : undefined} // 图像加载完成后设置src属性
        alt={alt}
        {...props}
        sx={{
          ...props.sx,
          opacity: loaded ? 1 : 0, // 在加载过程中隐藏Avatar，直到图像加载完成
          transition: "opacity 0.3s ease-in-out", // 平滑过渡效果
        }}
      />
    </Box>
  );
};

export default AvatarLoader;
