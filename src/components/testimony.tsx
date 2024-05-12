import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "huskydoge",
      feedback:
        "Discovering connectedAdvisors has changed how I find research mentors. The visualizations clearly show advisor connections, making it easier to find the right mentor for my academic journey.",
      avatarUrl: "/husky.png",
      likedCount: 5,
    },
    {
      id: 2,
      name: "JubSteven",
      feedback:
        "connectedAdvisors is a fantastic resource for sorting potential advisors by research area and other criteria. Its visual tools help clarify the academic environment, aiding in my decision-making.",
      avatarUrl: "https://jubsteven.github.io/images/intro_img.jpg",
      likedCount: 2,
    },
    {
      id: 3,
      name: "ZhouzhouCat",
      feedback:
        "The ChatGPT integration in connectedAdvisors makes querying advisor information effortless. The platform's continuous updates ensure it stays relevant and helpful.",
      avatarUrl: "/zhouzhoucat.jpeg",
      likedCount: 1,
    },
  ];

  const emo_dict = {
    1: "🦴",
    2: "❤️",
    3: "🐟",
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "60%", mx: "auto", p: 4 }}>
      <Grid container spacing={4}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <Avatar
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" component="div">
                      {testimonial.name}
                    </Typography>
                    {testimonial.likedCount && (
                      <Typography variant="body2" color="textSecondary">
                        {emo_dict[testimonial.id]} {testimonial.likedCount}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {testimonial.feedback}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
