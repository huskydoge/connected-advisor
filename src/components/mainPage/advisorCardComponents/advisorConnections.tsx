import React from "react";
import {
  Link,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { GitHub, Twitter, Email, Language } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CardHeader,
  IconButtonProps,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import AvatarLoader from "@/components/AvatarLoader";

import advisors from "../../../data/advisors.json";

// Mock function to get advisor info by ID
const getAdvisorById = (id: number) => {
  // 查找与给定id匹配的advisor
  const advisor = advisors.find((advisor) => advisor.advisor_id === id);
  if (advisor) {
    return {
      id: advisor.advisor_id,
      name: advisor.name,
      position: advisor.position,
      avatar: advisor.avatar || "https://via.placeholder.com/40", // 如果advisor对象中没有avatar属性，则使用占位图
    };
  }
  // 如果没有找到匹配的advisor，返回一个默认对象或null
  return null;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean; // 明确指出expand属性是一个布尔值
}

interface Duration {
  start: {
    year: number;
    month: number;
  };
  end: {
    year: number;
    month: number;
  };
}

interface Collaboration {
  papername: string;
  url: string;
  year: number;
}

interface Relation {
  duration: Duration;
  class: string;
  role: string;
}

interface Connection {
  advisor_id: number;
  relation: Relation[];
  collaborations: Collaboration[];
}

const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => (
  <IconButton {...other} />
))(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AdvisorConnection = ({ connection }: { connection: Connection }) => {
  const [expanded, setExpanded] = React.useState(false);
  const advisor = getAdvisorById(connection.advisor_id);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ marginBottom: 2, width: "100%" }}>
      <CardHeader
        avatar={
          advisor && <AvatarLoader src={advisor.avatar} alt={advisor.name} />
        }
        action={
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
        title={advisor?.name}
        subheader={advisor?.position}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* 经历部分 - 标题 */}
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Experience:
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {connection.relation.map((rel, index) => (
              <ListItem
                key={index}
                sx={{
                  pl: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {advisor && (rel as Relation).class}, the{" "}
                    {(rel as Relation).role} of {advisor?.name},
                  </span>
                  <span>
                    {(rel as Relation).duration.start.year}.
                    {(rel as Relation).duration.start.month
                      .toString()
                      .padStart(2, "0")}{" "}
                    -{(rel as Relation).duration.end.year}.
                    {(rel as Relation).duration.end.month
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </Typography>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mb: 2 }} /> {/* 分割线 - 分隔经历和合作部分 */}
          {/* 合作部分 - 标题 */}
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Collaborations:
          </Typography>
          {connection.collaborations.map((collab, index) => (
            <React.Fragment key={index}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Grid item xs={8}>
                  <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                    {" "}
                    {/* 字号增大 */}
                    {collab.papername}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    href={collab.url}
                    target="_blank"
                    size="small"
                    variant="outlined"
                  >
                    Link
                  </Button>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="body1"
                    textAlign="right"
                    sx={{ fontSize: "1rem" }}
                  >
                    {" "}
                    {/* 字号增大 */}
                    {collab.year}
                  </Typography>
                </Grid>
              </Grid>
              {index < connection.collaborations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AdvisorConnection;
