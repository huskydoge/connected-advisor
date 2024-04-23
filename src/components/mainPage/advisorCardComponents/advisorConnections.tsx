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
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import AvatarLoader from "@/components/AvatarLoader";
import { fetchAdvisorDetails } from "@/components/wrapped_api/fetchAdvisor";
import { Connection, AdvisorDetails, Relation } from "@/components/interface";
import { useRouter } from "next/router";
import { scholarImg } from "@/components/const";

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
const Experience = memo(
  ({ relation, advisorName }: { relation: Relation; advisorName: string }) => (
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
  )
);

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

const AdvisorConnection = ({ connection }: { connection: Connection }) => {
  const [expanded, setExpanded] = useState(false);
  const [advisor, setAdvisor] = useState(null);
  const router = useRouter();
  const handleClickOnAdvisor = (id: string) => {
    router.push(`${id}?view=graph`, undefined, {
      shallow: true,
    });
  };

  // set the type of advisor to AdvisorDetails

  useEffect(() => {
    const fetchAdvisor = async () => {
      const advisorData = await fetchAdvisorDetails(connection._id);
      setAdvisor(advisorData);
    };
    fetchAdvisor();
  }, [connection._id]);

  return (
    <Card sx={{ marginBottom: 2, width: "100%" }}>
      {advisor && (
        <>
          <CardHeader
            avatar={
              <AvatarLoader
                src={advisor["avatar"] ? advisor["avatar"] : scholarImg}
                alt={advisor["name"]}
              />
            }
            action={
              <Box
                display="flex"
                alignItems="center" // 确保内容在垂直方向上居中对齐
                justifyContent="space-between" // 元素之间均匀分布空间
                sx={{
                  width: "100%", // 宽度设置为100%以填满可用空间
                  paddingX: 2, // 在左右两侧添加一些内边距
                }}
              >
                <Typography
                  variant="body1" // 使用更大的字体变种
                  color="purple" // 使用主题的主色调
                  sx={{ marginRight: 10 }} // 增加与右侧元素的间隙
                >
                  {advisor["position"]}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginRight: 2 }} // 调整内部元素间隙
                  >
                    {`Relations: ${connection.relations.length} `}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginRight: 2 }}
                  >
                    |
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginRight: 2 }} // 调整内部元素间隙
                  >
                    {`Collaborated Papers: ${connection.collaborations.length}`}
                  </Typography>
                </Box>
                {/* @ts-ignore */}
                <ExpandMore
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
            }
            title={
              <Button
                sx={{ color: "black", textTransform: "none", paddingLeft: 1 }}
                variant="text"
                onClick={() => handleClickOnAdvisor(advisor["_id"])}
              >
                {advisor["name"]}
              </Button>
            }
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
                  relation={connection.relations}
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
        </>
      )}
    </Card>
  );
};

export default AdvisorConnection;
