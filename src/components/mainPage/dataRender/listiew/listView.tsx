import React, { useEffect, useState } from "react";
import RelationComponent from "./relation";
import { Advisor, Connection, AdvisorDetails } from "@/components/interface";
import {
  fetchAdvisorByIdLst,
  fetchAdvisorDetails,
} from "@/components/wrapped_api/fetchAdvisor";

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

const calculate_relation_factor = (
  advisor1: AdvisorDetails,
  advisor2: AdvisorDetails,
  conn: Connection
) => {
  const tag_weight = 2;
  const relation_weight = 10;
  const paper_weight = 5;

  let tags1 = advisor1.tags;
  let tags2 = advisor2.tags;
  let tag_score = 0;
  tags1.forEach((tag1) => {
    tags2.forEach((tag2) => {
      if (tag1 === tag2) {
        tag_score += 1;
      }
    });
  });
  let paper_score = conn.collaborations.length;
  const relation_type_score_map = {
    PhD: 5,
    Master: 3,
    Undergrad: 1,
    Postdoc: 4,
    Working: 2,
    Collaboration: 1,
  };
  let relations = conn.relations;
  let relation_score = 0;
  for (let i = 0; i < relations.length; i++) {
    let relation = relations[i];

    let type = relation.type;
    // console.log("type", type);
    let start = relation.duration.start;
    let end = relation.duration.end;
    // console.log("start", start);
    // console.log("end", end);
    relation_score +=
      relation_type_score_map[type as keyof typeof relation_type_score_map] *
      (end - start);
  }

  // console.log("tag_score", tag_score);
  // console.log("relation_score", relation_score);
  // console.log("paper_score", paper_score);

  let relationFactor =
    tag_score * tag_weight +
    relation_score * relation_weight +
    paper_score * paper_weight;

  return relationFactor;
};

const calculate_influence_factor = (advisor: AdvisorDetails, degree = 1) => {
  // TODO, should take the influence of its connected advisors into account, rather than merely count the number of connections
  let influenceFactor = 0;
  console.log(advisor);
  for (let i = 0; i < advisor.connections.length; i++) {
    let conn = advisor.connections[i];
    let paper_score = conn.collaborations?.length;
    influenceFactor += 1 + paper_score;
  }
  return influenceFactor;
};

const get_advisors_with_factors = (
  mainAdvisor: AdvisorDetails,
  advisors: Array<AdvisorDetails>
) => {
  let finalAdvisors = [];
  for (let i = 0; i < advisors.length; i++) {
    let advisor = advisors[i];
    let connections = advisor.connections;
    let relationFactor = 0;
    for (let j = 0; j < connections.length; j++) {
      let conn = connections[j];
      let relationFactor_ = calculate_relation_factor(
        mainAdvisor,
        advisor,
        conn
      );
      relationFactor += relationFactor_;
    }
    const advisor_ = {
      ...advisor,
      relationFactor: relationFactor,
      influenceFactor: calculate_influence_factor(advisor),
    };
    finalAdvisors.push(advisor_);
  }
  return finalAdvisors;
};

const fetchConnectedAdvisorDetailsBatch = async (connectionIds) => {
  const fetchPromises = connectionIds?.map((id) => fetchAdvisorDetails(id));
  return Promise.all(fetchPromises);
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

  const processAdvisors = () => {
    let filteredAdvisors = advisors?.filter((advisor) => {
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
    const withRelationFactorAdvisor = get_advisors_with_factors(
      mainAdvisor,
      filteredAdvisors
    );
    return withRelationFactorAdvisor;
  };

  useEffect(() => {
    const loadAdvisors = async () => {
      console.log(mainAdvisor);
      const connected_ids = mainAdvisor.connections?.map(
        (conn: Connection) => conn._id
      );
      if (!connected_ids) {
        return;
      }
      console.log("coon_ids", connected_ids);
      const advisors_ = await fetchConnectedAdvisorDetailsBatch(connected_ids);
      console.log("fetched", advisors_);
      setAdvisors(advisors_);
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
        {showTableView ? (
          processAdvisors()?.length > 0 ? (
            <TableView
              advisors={processAdvisors()}
              onClickConnection={(advisorId) => {
                const advisor = advisors.find(
                  (advisor) => advisor._id === advisorId
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
          )
        ) : (
          <RelationComponent
            main={mainAdvisor}
            second={selectedAdvisor}
            onBack={returnToListView}
          />
        )}
      </div>
    </Paper>
  );
};

export default ListView;
