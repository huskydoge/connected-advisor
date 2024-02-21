import React, { useEffect, useRef, useState } from "react";
import RelationComponent from "./relation";
interface Advisor {
  advisor_id: number;
  name: string;
  affiliation: string;
  homepage: string;
  twitter: string;
  github: string;
  email: string;
  position: string;
  connections: {
    advisor_id: number;

    relation: Array<{
      class: string;
      role: string;
      duration: {
        start: { year: number; month: number };
        end: { year: number; month: number };
      };
    }>;
    collaborations: Array<{
      papername: string;
      year: number;
      url: string;
    }>;
    latestCollaboration: number;
    relationFactor: number;
  }[];
}
const advisors: Advisor[] = require("../../../../data/advisors.json");

import {
  Tooltip,
  Paper,
  IconButton,
  Typography,
  Toolbar,
  Box,
} from "@mui/material";

import TableView from "./table";
import CloseIcon from "@mui/icons-material/Close";

// find the connected advisors based on main advisor id
const findConnectedAdvisors = (mainAdvisorId: number) => {
  // find in main advisor's connections list
  const mainAdvisor = advisors.find(
    (advisor) => advisor?.advisor_id === mainAdvisorId
  );
  const connectedAdvisors = mainAdvisor?.connections.map((connection) => {
    return advisors.find(
      (advisor) => advisor?.advisor_id === connection.advisor_id
    );
  });
  return connectedAdvisors;
};

// @ts-ignore
const ListView = ({ onClose, mainAdvisor }) => {
  const advisors = findConnectedAdvisors(mainAdvisor.advisor_id);
  const [showTableView, setShowTableView] = useState(true); // 控制显示哪个视图
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null); // 存储选中的advisor id

  const handleClickConnection = (advisor_id: number) => {
    // @ts-ignore
    const advisor = advisors.find(
      (advisor) => advisor?.advisor_id === advisor_id
    );
    setSelectedAdvisor(advisor || null); // 设置选中的advisor id
    setShowTableView(false); // 切换到RelationComponent视图
  };

  const returnToListView = () => {
    setShowTableView(true); // 切换到TableView视图
  };

  return (
    <Paper
      sx={{ width: "100%", paddingLeft: 2, paddingRight: 2, paddingTop: 2 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Typography variant="h6">Connected to {mainAdvisor.name}</Typography>
        {/* 使用Box组件作为flex占位符 */}
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Close List View">
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      {showTableView ? (
        <TableView
          advisors={advisors}
          onClickConnection={handleClickConnection}
        />
      ) : (
        <RelationComponent
          main={mainAdvisor}
          second={selectedAdvisor}
          onBack={returnToListView}
        />
      )}
    </Paper>
  );
};

export default ListView;
