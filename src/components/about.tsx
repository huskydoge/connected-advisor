import React from "react";
import { Box, Grid, Typography, Avatar, Button, Stack } from "@mui/material";

const AboutPage = () => {
  const profiles = [
    {
      name: "Benhao Huang",
      avatar:
        "https://media.licdn.com/dms/image/D5603AQGfjU-JQgGc2Q/profile-displayphoto-shrink_200_200/0/1706193347767?e=1720656000&v=beta&t=tUgl1yKE0Dbqqz6HVZ1L3TGHLGdbOI87DLSjD-fhEmE",
      github: "https://huskydoge.github.io/",
      email: "hbh001098hbh@sjtu.edu.cn",
      bio: "Hello! Husky Here! I’m a junior student at Shanghai Jiao Tong University(SJTU), majored in Computer Science.",
    },
    {
      name: "Pengxiang Zhu",
      avatar: "https://jubsteven.github.io/images/intro_img.jpg",
      github: "https://jubsteven.github.io/",
      email: "zhu_peng_xiang@sjtu.edu.cn",
      bio: "I’m currently an undergraduate student at Shanghai Jiao Tong University, majoring in Computer Science and Technology (IEEE Pilot Class). I’m now a research intern in Machine Vision and Intelligence Group (MVIG), under the supervision of Prof. Cewu Lu and Prof. Lixin Yang.",
    },
    {
      name: "YiZhou Liu",
      avatar: "/zhouzhoucat.jpeg",
      github: "https://github.com/carol",
      email: "carol@example.com",
      bio: "Currently an undergraduate student at Shanghai Jiao Tong University, majoring in Computer Science and Mathematics, striving to be a human, a bridge player, a thinker and a feeler, a dreamer, and a world healer.",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Grid container direction="column" spacing={2} justifyContent="center">
        {profiles.map((profile) => (
          <Grid
            item
            xs={12}
            key={profile.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: 2,
            }}
          >
            <Avatar
              alt={profile.name}
              src={profile.avatar}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                href={profile.github}
                target="_blank"
                sx={{ textTransform: "none", color: "grey.600" }}
              >
                GitHub
              </Button>
              <Button
                variant="outlined"
                href={`mailto:${profile.email}`}
                sx={{ textTransform: "none", color: "grey.600" }}
              >
                Email
              </Button>
            </Stack>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: "1rem",
                lineHeight: 2,
                wordBreak: "break-word",
                textAlign: "justify",
              }}
            >
              {profile.bio}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutPage;
