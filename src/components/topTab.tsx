import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Link from "next/link";

import { Box, useTheme } from "@mui/material";

function TopMenu() {
  const [searchFocused, setSearchFocused] = useState(false);
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ bgcolor: "white", color: "blue" }}>
      <Toolbar>
        <Typography
          variant="h5"
          noWrap
          sx={{ color: "blue", textTransform: "none", marginRight: 2 }} // 将 marginRight 添加到这里，使 logo 和搜索框之间有一点空间
        >
          <Link href="/"> Connected Advisor </Link>
        </Typography>

        {/* 搜索栏 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            marginRight: 5,
            marginLeft: 5,
            paddingLeft: 2,
            border: searchFocused ? "1px solid blue" : "1px solid transparent", // 边框亮起效果
            borderRadius: theme.shape.borderRadius, // 使用主题提供的边框圆角
            "&:hover": {
              borderColor: "blue", // 鼠标悬停时边框亮起
            },
            "& .MuiSvgIcon-root": {
              color: searchFocused ? "blue" : "inherit", // 搜索图标的颜色也可以随着聚焦状态变化
            },
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            sx={{ color: "blue", marginLeft: 1, width: "100%" }}
            onFocus={() => setSearchFocused(true)} // 当输入框聚焦时，设置状态为true
            onBlur={() => setSearchFocused(false)} // 当输入框失去焦点时，设置状态为false
          />
        </Box>

        {/* 导航按钮 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {["Share", "Follow", "About", "Pricing", "Sponsors"].map((text) => (
            <Button
              key={text}
              sx={{
                color: "blue",
                textTransform: "none",
                marginRight: 2,
                fontSize: theme.typography.h6.fontSize,
                fontFamily: theme.typography.fontFamily,
                fontWeight: theme.typography.fontWeightRegular,
              }}
            >
              {text}
            </Button>
          ))}
        </Box>

        {/* 用户图标 */}
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          sx={{ color: "blue" }}
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopMenu;
