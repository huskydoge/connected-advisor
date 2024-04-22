import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Link,
  Button,
  Tooltip,
} from "@mui/material";

import { AdvisorDetails } from "@/components/interface";

// @ts-ignore
const TableView = ({ onClickConnection, advisors }) => {
  console.log("table", advisors);
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Advisor Name</TableCell>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Affliation</TableCell>
            <TableCell align="center">Website</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Twitter</TableCell>
            <TableCell align="center">GitHub</TableCell>
            <TableCell align="center">Connections</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisors?.map((advisor: AdvisorDetails) => (
            <TableRow sx={{ border: "none" }} key={advisor?._id} hover>
              <TableCell align="center">{advisor?.name}</TableCell>
              <TableCell align="center">{advisor?.position}</TableCell>
              <TableCell align="center">{advisor?.affiliation}</TableCell>
              <TableCell align="center">
                {advisor.homepage ? (
                  <Link
                    href={advisor?.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  ></Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell align="center">
                <Link href={`mailto:${advisor.contacts.email}`}>
                  {advisor.contacts.email ? advisor.contacts.email : "N/A"}
                </Link>
              </TableCell>
              <TableCell align="center">
                {advisor.contacts.twitter ? (
                  <Link
                    href={advisor?.contacts.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  ></Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell align="center">
                {advisor.github ? (
                  <Link
                    href={advisor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor.github}
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell align="center">
                {/* Implementation for collaborations and connection cell */}
                <Tooltip title="show details">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onClickConnection(advisor._id)}
                  >
                    Show Relation
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
