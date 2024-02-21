import React, { useEffect, useRef, useState } from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableHeadRow: {
      // 移除表格表头底部的边框线
      borderBottom: "none",
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

//@ts-ignore
const ListView = ({ onClose }) => {
  const classes = useStyles();
  const toolClasses = useToolbarStyles();
  return (
    <div className={classes.paper}>
      <Paper
        className={classes.paper}
        sx={{ width: "100%", paddingLeft: 2, paddingRight: 2, paddingTop: 2 }}
      >
        {" "}
        {/* 确保这一层也是充满父元素的 */}
        <Toolbar
          className={toolClasses.root}
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
          <Table stickyHeader className={classes.table}>
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
                <TableRow
                  sx={{ border: "none" }}
                  key={advisor.advisor_id}
                  hover
                >
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
                    <Link href={`mailto:${advisor.email}`}>
                      {advisor.email}
                    </Link>
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
    </div>
  );
};

export default ListView;
