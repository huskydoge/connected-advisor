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

import { useRouter } from "next/router";
import {
  AdvisorDetails,
  AdvisorDetailsWithRelationFactor,
} from "@/components/interface";

// @ts-ignore
const TableView = ({ onClickConnection, advisors }) => {
  const router = useRouter();
  const handleClickOnAdvisor = (id: string) => {
    router.push(`${id}?view=graph`, undefined, {
      shallow: true,
    });
  };

  const calculate_influence_factor = (
    advisor: AdvisorDetailsWithRelationFactor,
    degree = 1
  ) => {
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

  console.log("table", advisors);
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Advisor Name</TableCell>
            <TableCell align="center">Influence Factor</TableCell>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Affliation</TableCell>
            <TableCell align="center">HomePage</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Twitter</TableCell>
            <TableCell align="center">GitHub</TableCell>
            <TableCell align="center">Connections</TableCell>
            <TableCell align="center">Relation Factor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisors?.map((advisor: AdvisorDetailsWithRelationFactor) => (
            <TableRow sx={{ border: "none" }} key={advisor?._id} hover>
              <TableCell align="center">
                <Button onClick={() => handleClickOnAdvisor(advisor._id)}>
                  {advisor?.name}
                </Button>
              </TableCell>
              <TableCell align="center">
                {calculate_influence_factor(advisor)}
              </TableCell>
              <TableCell align="center">{advisor?.position}</TableCell>
              <TableCell align="center">{advisor?.affiliation}</TableCell>
              <TableCell align="center">
                {advisor["homepage"] ? (
                  <Link
                    href={advisor?.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor["homepage"]}
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell align="center">
                <Link href={`mailto:${advisor.email}`}>
                  {advisor.email ? advisor.email : "N/A"}
                </Link>
              </TableCell>
              <TableCell align="center">
                {advisor.twitter ? (
                  <Link
                    href={advisor?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {advisor.twitter}
                  </Link>
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
              <TableCell align="center">{advisor.relationFactor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
