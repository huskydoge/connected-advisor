import React, { useRef, useState, useLayoutEffect } from "react";
import MessageForm from "@/components/MessageForm";
import Layout from "@/components/Layout";
import MessagesList from "@/components/MessageList";
import { NextPage } from "next";
import { MessagesProvider } from "@/components/utils/useMessages";
import TopMenu from "@/components/topMenu";
import { Typography, Box, Avatar, Container } from "@mui/material";

const IndexPage: NextPage = () => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [availableHeight, setAvailableHeight] = useState(100); // 初始化为100%

  useLayoutEffect(() => {
    const headerHeight = headerRef.current ? headerRef.current.clientHeight : 0;
    const footerHeight = footerRef.current ? footerRef.current.clientHeight : 0;
    const totalHeight =
      ((window.innerHeight - headerHeight - footerHeight) * 9.5) / 10;
    const newAvailableHeight = (totalHeight / window.innerHeight) * 100;
    setAvailableHeight(newAvailableHeight);
  }, [headerRef, footerRef]);

  return (
    <Box sx={{ height: "100%" }}>
      <div ref={headerRef}>
        <TopMenu />
      </div>
      <Container maxWidth="md" sx={{ height: `${availableHeight}vh` }}>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{ width: 56, height: 56, marginRight: 2 }}
            src="path_to_your_logo.png"
            alt="Logo"
          />
          <Typography variant="h4" align="center" sx={{ flexGrow: 1 }}>
            Chat with the bot
          </Typography>
        </Box>
        <MessagesProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              <MessagesList />
            </Box>
            <Box
              ref={footerRef}
              sx={{
                flexShrink: 0,
              }}
            >
              <MessageForm />
            </Box>
          </Box>
        </MessagesProvider>
      </Container>
    </Box>
  );
};

export default IndexPage;
