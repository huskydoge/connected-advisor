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

// @ts-ignore
const TableView = ({ onClickConnection, advisors }) => {
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
          {advisors?.map((advisor: any) => (
            <TableRow sx={{ border: "none" }} key={advisor?.advisor_id} hover>
              <TableCell align="center">{advisor?.name}</TableCell>
              <TableCell align="center">{advisor?.position}</TableCell>
              <TableCell align="center">{advisor?.affiliation}</TableCell>
              <TableCell align="center">
                <Link
                  href={advisor?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {advisor?.website}
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link href={`mailto:${advisor?.email}`}>{advisor?.email}</Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  href={advisor?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {advisor?.twitter}
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  href={advisor?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {advisor?.github}
                </Link>
              </TableCell>
              <TableCell align="center">
                {/* Implementation for collaborations and connection cell */}
                <Tooltip title="show details">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onClickConnection(advisor.advisor_id)}
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
