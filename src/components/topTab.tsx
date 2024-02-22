import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";

import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// 假设这是你的搜索结果类型
interface SearchResult {
  id: string;
  title: string;
}

function TopMenu() {
  const [searchFocused, setSearchFocused] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const theme = useTheme();

  // 即时搜索逻辑
  const updateSearchQuery = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    // 假设这是调用搜索 API 的函数，返回搜索结果
    if (query.length > 2) {
      // 可以设置触发搜索的最小字符数限制
      const results = await searchAPI(query);
      setSearchResults(results);
    } else {
      setSearchResults([]); // 清空结果
    }
  };

  // 假设的搜索 API 函数
  const searchAPI = async (query: string): Promise<SearchResult[]> => {
    // 这里应该是调用实际的搜索 API
    // 返回模拟的搜索结果
    return [
      { id: "1", title: "Result 1" },
      { id: "2", title: "Result 2" },
      // 根据实际查询动态生成
    ];
  };

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
        <Paper
          sx={{
            position: "relative", // 设置为相对定位，为绝对定位的 Paper 创建上下文
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            marginRight: theme.spacing(5),
            marginLeft: theme.spacing(5),
            paddingLeft: theme.spacing(2),
            borderTopRightRadius: theme.shape.borderRadius * 3,
            borderTopLeftRadius: theme.shape.borderRadius * 3,
            borderBottomRightRadius:
              searchResults.length > 0 ? 0 : theme.shape.borderRadius * 3,
            borderBottomLeftRadius:
              searchResults.length > 0 ? 0 : theme.shape.borderRadius * 3,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={updateSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{ color: "blue", marginLeft: 1, width: "100%" }}
          />
          {searchResults.length > 0 && (
            <Paper
              sx={{
                position: "absolute", // 绝对定位，基于上面的 Box 组件
                width: "100%", // 宽度与搜索框相同
                top: "80%", // 紧贴搜索框下方
                left: 0,
                borderTop: "none", // 移除上边框以融合搜索框
                right: 0,
                elevation: 0, // 提高海拔以显示在顶部
                zIndex: theme.zIndex.modal, // 确保显示在最上层
                borderBottomLeftRadius: theme.shape.borderRadius * 3, // 应用底部边框半径以融合搜索框
                borderBottomRightRadius: theme.shape.borderRadius * 3, // 应用底部边框半径以融合搜索框
              }}
            >
              <List>
                {searchResults.map((result) => (
                  <ListItem button key={result.id}>
                    <ListItemText primary={result.title} />
                  </ListItem>
                ))}
                <ListItem button>
                  <ListItemText primary="Show more results" />
                </ListItem>
              </List>
            </Paper>
          )}
        </Paper>
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
