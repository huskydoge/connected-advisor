import React, { useEffect, useRef, useState } from "react";

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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Toolbar,
  Link,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

//@ts-ignore
const ListView = ({ onClose }) => {
  return (
    <Paper
      sx={{ width: "100%", paddingLeft: 2, paddingRight: 2, paddingTop: 2 }}
    >
      {" "}
      {/* 确保这一层也是充满父元素的 */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          width: "100%",
        }}
      >
        <Typography variant="h6">Main Advisor</Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Advisor Name</TableCell>
              <TableCell align="center">Position</TableCell>
              <TableCell align="center">Affliation</TableCell>
              <TableCell align="center">HomePage</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Twitter</TableCell>
              <TableCell align="center">GitHub</TableCell>
              <TableCell align="center">Collaborations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advisors.map((advisor) => (
              <TableRow sx={{ border: "none" }} key={advisor.advisor_id} hover>
                <TableCell align="center">{advisor.name}</TableCell>
                <TableCell align="center">{advisor.position}</TableCell>
                <TableCell align="center">{advisor.affiliation}</TableCell>
                <TableCell align="center">
                  <Link
                    href={advisor.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor.homepage}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Link href={`mailto:${advisor.email}`}>{advisor.email}</Link>
                </TableCell>
                <TableCell align="center">
                  <Link
                    href={advisor.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor.twitter}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Link
                    href={advisor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor.github}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {/* Implementation for collaborations and connection cell */}
                  {/* You can add a button or link here to navigate to the connection table */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ListView;
