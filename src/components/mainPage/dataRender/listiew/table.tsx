import * as React from "react";
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
  IconButton,
  TableSortLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import SortIcon from "@mui/icons-material/Sort";

import { useRouter } from "next/router";
import {
  AdvisorDetails,
  AdvisorDetailsWithFactors,
} from "@/components/interface";

function stableSort<T>(array: any, comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// @ts-ignore
const TableView = ({ onClickConnection, advisors }) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [advisorsList, setAdvisorsList] = React.useState<
    AdvisorDetailsWithFactors[]
  >([]);
  React.useEffect(() => {
    setAdvisorsList(advisors);
  }, [advisors]);
  const [orderBy, setOrderBy] = React.useState("IF");
  const router = useRouter();
  const handleClickOnAdvisor = (id: string) => {
    router.push(`${id}?view=graph`, undefined, {
      shallow: true,
    });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AdvisorDetailsWithFactors
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    sort_advisors(advisorsList);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function sort_advisors(advisors: AdvisorDetailsWithFactors[]) {
    let tmp = stableSort(advisors, getComparator(order, orderBy));
    setAdvisorsList(tmp);
  }

  console.log("table", advisors);

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Advisor Name</TableCell>
            <TableCell
              id="influenceFactor"
              align="center"
              sortDirection={orderBy === "influenceFactor" ? order : false}
            >
              <TableSortLabel
                active={orderBy === "influenceFactor"}
                direction={orderBy === "influenceFactor" ? order : "asc"}
                onClick={createSortHandler("influenceFactor")}
              >
                IF
                {orderBy === "influenceFactor" ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
            <TableCell
              id="relationFactor"
              align="center"
              sortDirection={orderBy === "relationFactor" ? order : false}
            >
              <TableSortLabel
                active={orderBy === "relationFactor"}
                direction={orderBy === "relationFactor" ? order : "asc"}
                onClick={createSortHandler("relationFactor")}
              >
                RF
                {orderBy === "relationFactor" ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Affliation</TableCell>
            <TableCell align="center">HomePage</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Twitter</TableCell>
            <TableCell align="center">GitHub</TableCell>
            <TableCell align="center">Connections</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisorsList?.map((advisor: AdvisorDetailsWithFactors) => (
            <TableRow sx={{ border: "none" }} key={advisor?._id} hover>
              <TableCell align="center">
                <Button onClick={() => handleClickOnAdvisor(advisor._id)}>
                  {advisor?.name}
                </Button>
              </TableCell>
              <TableCell align="center">{advisor.influenceFactor}</TableCell>
              <TableCell align="center">{advisor.relationFactor}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
