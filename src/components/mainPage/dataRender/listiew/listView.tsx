import React, { useEffect, useState } from "react";
import RelationComponent from "./relation";
import { Advisor, Connection, AdvisorDetails } from "@/components/interface";
import { fetchAdvisorByIdLst } from "@/components/wrapped_api/fetchAdvisor";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  AppBar,
  Box,
  IconButton,
  Typography,
  Toolbar,
  TextField,
  Autocomplete,
  Tooltip,
  Drawer,
  Card,
  CardContent,
  Chip,
  Paper,
} from "@mui/material";
import TableView from "./table";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import FilterListIcon from "@mui/icons-material/FilterList"; // 过滤图标

import {
  availablePositions,
  availableTags,
  affiliationList,
} from "@/components/const";

// Finds the connected advisors based on main advisor id
const findConnectedAdvisors = async (mainAdvisor: Advisor) => {
  console.log(mainAdvisor);
  if (mainAdvisor) {
    const connectedIds = mainAdvisor.connections?.map(
      (conn: Connection) => conn._id
    );
    const res = await fetchAdvisorByIdLst(connectedIds);
    return res;
  } else {
    return [];
  }
};

const ListView = ({
  onClose,
  mainAdvisor,
}: {
  mainAdvisor: AdvisorDetails;
}) => {
  const [advisors, setAdvisors] = useState([]);
  const [showTableView, setShowTableView] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [affiliations, setAffiliations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [tags, setTags] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filterAdvisors = () => {
    return advisors?.filter((advisor) => {
      const hasAffiliation =
        affiliations.length === 0 ||
        affiliations.some((aff) => advisor.affiliation?.includes(aff));
      const hasPosition =
        positions.length === 0 ||
        positions.some((pos) => advisor.position?.includes(pos));
      const hasTag =
        tags.length === 0 || tags.some((tag) => advisor.tags?.includes(tag));
      return hasAffiliation && hasPosition && hasTag;
    });
  };

  useEffect(() => {
    const loadAdvisors = async () => {
      const advisors = await findConnectedAdvisors(mainAdvisor);
      setAdvisors(advisors);
    };
    loadAdvisors();
  }, [mainAdvisor]);

  const handleClickConnection = (advisorId: string) => {
    const advisor = advisors.find(
      (advisor: Advisor) => advisor?._id === advisorId
    );
    setSelectedAdvisor(advisor || null);
    setShowTableView(false);
  };

  const returnToListView = () => {
    setShowTableView(true);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleReset = () => {
    setAffiliations([]);
    setPositions([]);
    setTags([]);
  };

  return (
    <Paper sx={{ width: "100%", padding: 2 }}>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
          BackdropProps: {
            invisible: true, // Makes backdrop invisible.
          },
        }}
        sx={{
          "& .MuiDrawer-paper": { width: "50vw", boxSizing: "border-box" }, // 增加 Drawer 的宽度
        }}
      >
        <Box
          sx={{ width: "100%" }}
          role="presentation"
          onKeyDown={handleDrawerClose}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerClose}
              sx={{ marginRight: 1 }} // 增加间距，使标题和按钮不太挤
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Filter Options
            </Typography>
          </Toolbar>
          <Box sx={{ p: 2 }}>
            {" "}
            {/* 增加内部间距使内容不太拥挤 */}
            <Typography variant="subtitle1" gutterBottom>
              Customize your search by selecting from the following options:
            </Typography>
            <Autocomplete
              multiple
              options={affiliationList}
              value={affiliations}
              onChange={(event, newValue) => setAffiliations(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Affiliation"
                  variant="outlined"
                  size="small"
                  margin="dense"
                />
              )}
              sx={{ mb: 2 }} // 增加间距
            />
            <Autocomplete
              multiple
              options={availablePositions}
              value={positions}
              onChange={(event, newValue) => setPositions(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Position"
                  variant="outlined"
                  size="small"
                  margin="dense"
                />
              )}
              sx={{ mb: 2 }} // 增加间距
            />
            <Autocomplete
              multiple
              options={availableTags}
              value={tags}
              onChange={(event, newValue) => setTags(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  variant="outlined"
                  size="small"
                  margin="dense"
                />
              )}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              {" "}
              {/* 重置按钮移到顶部并对齐到右边 */}
              <Tooltip title="Reset Filters">
                <IconButton onClick={handleReset}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} /> {/* 这里使用了 Box 来推动图标到右侧 */}
          <Tooltip title="Open Filter">
            <IconButton
              onClick={handleDrawerOpen}
              color="inherit"
              sx={{ mr: 2 }}
            >
              {" "}
              {/* 设置右边距为 2 个 theme 间距单位 */}
              <FilterListIcon /> {/* 更换为过滤图标 */}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={onClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 20 }}>
        {filterAdvisors()?.length > 0 ? (
          <TableView
            advisors={filterAdvisors()}
            onClickConnection={(advisorId) => {
              const advisor = advisors.find(
                (advisor) => advisor?._id === advisorId
              );
              setSelectedAdvisor(advisor || null);
              setShowTableView(false);
            }}
          />
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                No results
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </Paper>
  );
};

export default ListView;
