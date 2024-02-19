import React from "react";
import {
  Typography,
  Avatar,
  Link,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { GitHub, Twitter, Email, Language } from "@mui/icons-material";

const AdvisorCard = ({ advisor }) => {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{ p: 2 }}
      direction="column"
    >
      {/* 将头像放置于顶部 */}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          alt={advisor.name}
          src={advisor.avatar}
          sx={{
            width: { xs: 80, sm: 100, md: 120 },
            height: { xs: 80, sm: 100, md: 120 },
            mb: 2,
          }}
        />
      </Grid>
      {/* 文本内容 */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            fontWeight: "bold",
            textAlign: "center", // 使文本在较小屏幕上居中对齐
          }}
        >
          {advisor.name}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            textAlign: "center",
          }}
        >
          {advisor.position} @ {advisor.affliation}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center" // 居中对齐图标
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href={advisor.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <GitHub sx={{ mr: 0.5 }} /> GitHub
          </Link>
          <Link
            href={advisor.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Twitter sx={{ mr: 0.5 }} /> Twitter
          </Link>
          <Link
            href={`mailto:${advisor.email}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Email sx={{ mr: 0.5 }} /> Email
          </Link>
          <Link
            href={advisor.website}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Language sx={{ mr: 0.5 }} /> Website
          </Link>
        </Stack>
        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            textAlign: "justify", // 对齐段落文本
          }}
          variant="body1"
          paragraph
        >
          {advisor.description}
        </Typography>
        {/* TODO1 A Section of Connections, render as lists */}
        {/*         
        TODO2 A Comments
        Section, 评论系统 Connections, render as lists */}
      </Grid>

      {/* Connections Section */}
      {/* <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Connections
        </Typography>
        <List>
          {advisor.connections &&
            advisor.connections.map((connection, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={connection.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Class: {connection.relation.class}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Role: {connection.relation.role}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Duration: {connection.relation.duration.start.year}-
                          {connection.relation.duration.start.month} to
                          {connection.relation.duration.end.year}-
                          {connection.relation.duration.end.month}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                {index < advisor.connections.length - 1 && <Divider />}
              </React.Fragment>
            ))}
        </List>
      </Grid> */}

      {/* Comments Section */}
      <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Comments
        </Typography>
        <List>
          {advisor.comments &&
            advisor.comments.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.author}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.date}
                        </Typography>
                        {` — ${comment.content}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < advisor.comments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default AdvisorCard;
