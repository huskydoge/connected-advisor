import React, { useEffect, useState } from "react";
import RelationComponent from "./relation";
import { Advisor, Connection } from "@/components/interface";
import { fetchAdvisorByIdLst } from "@/components/fetches/fetchAdvisor";
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

// Finds the connected advisors based on main advisor id
const findConnectedAdvisors = async (mainAdvisor: Advisor) => {
  if (mainAdvisor) {
    const connectedIds = mainAdvisor.connections?.map(
      (conn: Connection) => conn.advisor_id
    );
    const res = await fetchAdvisorByIdLst(connectedIds);
    return res;
  } else {
    return [];
  }
};

const ListView = ({ onClose, mainAdvisor }) => {
  const [advisors, setAdvisors] = useState([]);
  const [showTableView, setShowTableView] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  useEffect(() => {
    const loadAdvisors = async () => {
      const advisors = await findConnectedAdvisors(mainAdvisor);
      setAdvisors(advisors);
    };
    loadAdvisors();
  }, [mainAdvisor]);

  const handleClickConnection = (advisorId: string) => {
    const advisor = advisors.find(
      (advisor: Advisor) => advisor?.advisor_id === advisorId
    );
    console.log(advisor);
    setSelectedAdvisor(advisor || null);
    setShowTableView(false);
  };

  const returnToListView = () => {
    setShowTableView(true);
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
