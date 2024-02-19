import React from "react";
import { Typography, Avatar, Link, Grid, Stack } from "@mui/material";
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
      </Grid>
    </Grid>
  );
};

export default AdvisorCard;
