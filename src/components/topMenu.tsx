import React, { useState, useEffect } from "react";

import IconButton from "@mui/material/IconButton";
import { useLocation } from "react-router-dom"; // Make sure to install react-router-dom if not already installed
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { lightBlue } from "@mui/material/colors";
import { Chip, Stack } from "@mui/material";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkIcon from "@mui/icons-material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import {
  searchAdvisorDetailsByName,
  fuzzySearchAdvisor,
} from "./wrapped_api/fetchAdvisor";
import { useRouter } from "next/router";
import { AdvisorDetails } from "./interface";
import Iframe from "react-iframe";
import AboutPage from "./about";
import SearchTableView from "./searchTable";

function WeChatIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M17,14H15V9H17V14M11,14H9V9H11V14Z" />
    </SvgIcon>
  );
}

function QQIcon(props) {
  return (
    <SvgIcon {...props}>
      {/* SVG path for QQ icon */}
      <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2ZM12,4C15.31,4 18,6.69 18,10C18,13.31 15.31,16 12,16C8.69,16 6,13.31 6,10C6,6.69 8.69,4 12,4ZM16.5,18.25C16.5,18.25 14.5,20 12,20C9.5,20 7.5,18.25 7.5,18.25C5.91,17.53 5,15.85 5,14C5,12.21 6.07,10.67 7.64,10.16C8.18,10 8.59,10.33 8.76,10.87C8.93,11.4 8.73,11.99 8.25,12.25C7.95,12.41 7.91,12.85 8.18,13.06C8.64,13.42 9.3,13.58 10,13.58C10.7,13.58 11.36,13.42 11.82,13.06C12.09,12.85 12.05,12.41 11.75,12.25C11.27,11.99 11.07,11.4 11.24,10.87C11.41,10.33 11.82,10 12.36,10.16C13.93,10.67 15,12.21 15,14C15,15.85 14.09,17.53 12.5,18.25H16.5Z" />
    </SvgIcon>
  );
}

// 假设这是你的搜索结果类型
interface SearchResult {
  id: string;
  title: string;
}

function TopMenu() {
  const omit_thres = 10;
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdvisorDetails[]>([]);
  const [searchResultsShow, setSearchResultsShow] = useState<AdvisorDetails[]>(
    []
  );
  const theme = useTheme();
  const [openShare, setOpenShare] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [chatBtnText, setChatBtnText] = useState("Chat");

  const location = useRouter();
  const [previouseRoute, setPreviouseRoute] = useState("");

  useEffect(() => {
    const path = location.pathname; // This gives you the current path in the URL
    if (path.endsWith("chat")) {
      setShowChat(true);
      setChatBtnText("Back");
    } else {
      setShowChat(false);
      setChatBtnText("Chat");
    }
  }, [location]); // Dependency array includes location to rerun effect when location changes

  // 即时搜索逻辑
  const updateSearchQuery = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    // 假设这是调用搜索 API 的函数，返回搜索结果
    if (query.length > 1) {
      // 可以设置触发搜索的最小字符数限制
      const results = await searchAPI(query);
      setSearchResults(results);
      setSearchResultsShow(results.slice(0, omit_thres));
    } else {
      setSearchResults([]); // 清空结果
      setSearchResultsShow([]);
    }
  };

  // 假设的搜索 API 函数
  const searchAPI = async (query: string): Promise<AdvisorDetails[]> => {
    // 这里应该是调用实际的搜索 API
    // 返回模拟的搜索结果
    const results = await fuzzySearchAdvisor(query);
    console.log("from API", results);
    return results;
  };

  const handleClick = (id: string) => {
    router.push(`/main/${id}?view=graph`, undefined, {
      shallow: true,
    });
    // clear query and results
    setSearchQuery("");
    setSearchResults([]);
  };

  const showMoreResults = () => {
    setShowMore(true);
  };

  const handleChatClick = () => {
    if (!showChat) {
      router.push(`/chat`, undefined, {
        shallow: false,
      });
    } else {
      router.back();
    }
  };

  const handleShareClick = () => {
    setOpenShare(true);
  };
  const handleFollowClick = () => {
    setOpenFollow(true);
  };
  const handleAboutClick = () => {
    setOpenAbout(true);
  };
  const handleClose = () => {
    setOpenShare(false);
    setOpenFollow(false);
    setOpenAbout(false);
    setShowMore(false);
  };

  const handleClickOnAdvisor = (id: string) => {
    setShowMore(false);
    setSearchResults([]);
    setSearchQuery("");
    setSearchResultsShow([]);
    router.push(`/main/${id}?view=graph`, undefined, {
      shallow: false,
    });
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
                {searchResultsShow.map((result) => (
                  <ListItem
                    key={result._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: lightBlue[200],
                        color: "white",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(result._id)}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1" component="div">
                        {result.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                      >
                        | {result.affiliation} | {result.position}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {result.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
                {searchResults.length > omit_thres && (
                  <ListItem
                    sx={{
                      "&:hover": {
                        backgroundColor: lightBlue[300], // Using a darker shade of blue for hover
                        color: "white",
                      },
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={showMoreResults}
                  >
                    <ListItemText primary="Show more results" />
                  </ListItem>
                )}
              </List>
            </Paper>
          )}
        </Paper>
        {/* 导航按钮 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{
              color: "blue",
              textTransform: "none",
              marginRight: 2,
              fontSize: theme.typography.h6.fontSize,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.fontWeightRegular,
            }}
            onClick={handleChatClick}
          >
            {chatBtnText}
          </Button>

          <Button
            sx={{
              color: "blue",
              textTransform: "none",
              marginRight: 2,
              fontSize: theme.typography.h6.fontSize,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.fontWeightRegular,
            }}
            onClick={handleShareClick}
          >
            Share
          </Button>

          <Button
            sx={{
              color: "blue",
              textTransform: "none",
              marginRight: 2,
              fontSize: theme.typography.h6.fontSize,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.fontWeightRegular,
            }}
            onClick={handleFollowClick}
          >
            Follow
          </Button>

          <Button
            sx={{
              color: "blue",
              textTransform: "none",
              marginRight: 2,
              fontSize: theme.typography.h6.fontSize,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.fontWeightRegular,
            }}
            onClick={handleAboutClick}
          >
            About
          </Button>
        </Box>

        {/* 用户图标 */}
        {/* <IconButton
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          sx={{ color: "blue" }}
        >
          <AccountCircle />
        </IconButton> */}
      </Toolbar>
      {/* 弹窗组件 */}
      <Dialog
        fullWidth
        maxWidth="xl"
        open={showMore}
        onClose={handleClose}
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title" sx={{ fontSize: "1.5rem" }}>
          Search Results
        </DialogTitle>
        <DialogContent>
          <SearchTableView
            advisors={searchResults}
            handleClickOnAdvisor={handleClickOnAdvisor}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openShare}
        onClose={handleClose}
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title" sx={{ fontSize: "1.5rem" }}>
          Share Connected Advisors to your friends!
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ mx: "auto", width: "100%" }} // 确保Grid填满Dialog
          >
            <Grid item>
              <Button
                startIcon={<WeChatIcon style={{ fontSize: 40 }} />}
                size="large"
              >
                WeChat
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<QQIcon style={{ fontSize: 40 }} />}
                size="large"
              >
                QQ
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<TwitterIcon style={{ fontSize: 40 }} />}
                size="large"
              >
                Twitter
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<LinkIcon style={{ fontSize: 40 }} />}
                size="large"
              >
                Copy Link
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFollow} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle id="follow-dialog-title">Follow Us!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please follow us at our GitHub to stay updated with the latest news
            and updates:
          </DialogContentText>
          <DialogContentText sx={{ display: "flex", justifyContent: "center" }}>
            <a
              href="https://github.com/huskydoge/connected-advisor"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "blue",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              https://github.com/huskydoge/connected-advisor
            </a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            href="https://github.com/huskydoge/connected-advisor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GitHub
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={openAbout}
        onClose={handleClose}
        aria-labelledby="share-dialog-title"
      >
        <AboutPage />
      </Dialog>
    </AppBar>
  );
}

export default TopMenu;
