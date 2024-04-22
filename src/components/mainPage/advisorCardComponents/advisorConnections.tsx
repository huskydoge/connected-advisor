import React, { useState, useEffect, memo } from "react";
import {
  Link,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Typography,
  Avatar,
  CardHeader,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import AvatarLoader from "@/components/AvatarLoader";
import { fetchAdvisorDetails } from "@/components/fetches/fetchAdvisor";

const ExpandMore = styled(({ expand, ...other }) => <IconButton {...other} />)(
  ({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  })
);

// 分离 Experience 和 Collaboration 组件
const Experience = memo(({ relation, advisorName }) => (
  <List dense sx={{ mb: 2 }}>
    {relation.map((rel, index) => (
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
            {rel.class}, the {rel.role} of {advisorName},
          </span>
          <span>
            {rel.duration.start} - {rel.duration.end}
          </span>
        </Typography>
      </ListItem>
    ))}
  </List>
));

const Collaborations = memo(({ collaborations }) => (
  <>
    {collaborations.map((collab, index) => (
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
              {collab.year}
            </Typography>
          </Grid>
        </Grid>
        {index < collaborations.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </>
));

const AdvisorConnection = ({ connection }) => {
  const [expanded, setExpanded] = useState(false);
  const [advisor, setAdvisor] = useState(null);

  useEffect(() => {
    const fetchAdvisor = async () => {
      const advisorData = await fetchAdvisorDetails(connection._id);
      setAdvisor(advisorData);
    };
    fetchAdvisor();
  }, [connection._id]);

  return (
    <Card sx={{ marginBottom: 2, width: "100%" }}>
      <CardHeader
        avatar={
          advisor && <AvatarLoader src={advisor.avatar} alt={advisor.name} />
        }
        action={
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
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
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Experience:
          </Typography>
          {advisor && (
            <Experience
              relation={connection.relation}
              advisorName={advisor.name}
            />
          )}
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Collaborations:
          </Typography>
          <Collaborations collaborations={connection.collaborations} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AdvisorConnection;
