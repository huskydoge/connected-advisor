import React from "react";
import { Container, Typography, Button } from "@mui/material";
import ImageGallery from "@/components/ImageGallery";
import Testimonials from "@/components/testimony"; // 确保组件名称正确
import router from "next/router";
import styles from "../styles/home.module.css";

export default function Home() {
  const handleEnter = () => {
    router.push("/main/6607bc09eb00fa31e8d30829?graph");
  };

  return (
    <Container
      sx={{
        overflowY: "scroll",
        height: "100vh",
        padding: 12,
        backgroundColor: "#f5f5f5",
        width: "100%",
        margin: 0,
        minWidth: "100%",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: "light", color: "#3f51b5" }}
      >
        Welcome to Connected Advisors!
      </Typography>
      <Typography
        variant="h6"
        component="p"
        align="center"
        sx={{ color: "#757575" }}
      >
        Hope you can find your advisor to help your brilliant future!
      </Typography>
      {/* Testimonials Component */}
      <Testimonials />
      {/* ImageGallery Component */}
      <div className={styles.galleryWrapper}>
        <ImageGallery />
      </div>
      {/* Navigation Entry */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px" }}
      >
        <Button variant="contained" color="primary" onClick={handleEnter}>
          Enter Main Page
        </Button>
      </div>
    </Container>
  );
}
