import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";

import { useRouter } from "next/router";
import { AdvisorDetails } from "@/components/interface";

// @ts-ignore
const SearchTableView = ({ advisors, handleClickOnAdvisor }) => {
  const router = useRouter();

  console.log("table", advisors);
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Advisor Name</TableCell>
            <TableCell align="center">Affliation</TableCell>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Tags</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisors?.map((advisor: AdvisorDetails) => (
            <TableRow sx={{ border: "none" }} key={advisor?._id} hover>
              <TableCell align="center">
                <Button onClick={() => handleClickOnAdvisor(advisor._id)}>
                  {advisor?.name}
                </Button>
              </TableCell>
              <TableCell align="center">{advisor?.affiliation}</TableCell>
              <TableCell align="center">{advisor?.position}</TableCell>
              <TableCell align="center">{advisor?.tags}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchTableView;
