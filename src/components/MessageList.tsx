import React from "react";
import { useMessages } from "./utils/useMessages";
import { Avatar, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages();

  // 自定义链接行为，使链接在新标签页中打开
  const markdownComponents = {
    a: ({ node, ...props }) => (
      <a target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul
        style={{ paddingTop: "1rem", paddingLeft: "2rem", margin: "0" }}
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <li style={{ marginBottom: "0.5rem" }} {...props} />
    ),
  };

  return (
    <Box
      sx={{
        maxWidth: "2000vw",
        margin: "auto",
        padding: "1rem",
        paddingTop: "3rem",
        overflow: "auto",
      }}
    >
      {messages?.map((message, i) => {
        const isUser = message.role === "user";
        if (
          message.role === "system" ||
          message.role === "tool" ||
          message?.content == null
        )
          return null;
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: "16px",
            }}
          >
            {!isUser && (
              <Avatar
                src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
                alt="Bot"
                sx={{ marginRight: "8px" }}
              />
            )}
            <Box
              sx={{
                maxWidth: "calc(100% - .2rem)",
                padding: "1.2rem",
                borderRadius: ".4rem",
                backgroundColor: isUser ? "#1976d2" : "#f0f0f0",
                color: isUser ? "white" : "black",
                // fontFamily: "monospace",
                fontSize: "1.1rem",
                wordBreak: "break-word", // Ensures text wraps to avoid horizontal overflow
                boxSizing: "border-box", // Makes sure padding does not add to width
              }}
            >
              <ReactMarkdown components={markdownComponents}>
                {message?.content?.trim()}
              </ReactMarkdown>
            </Box>
            {isUser && (
              <Avatar
                src="https://www.teamsmart.ai/next-assets/profile-image.png"
                alt="User"
                sx={{ marginLeft: "8px" }}
              />
            )}
          </Box>
        );
      })}
      {isLoadingAnswer && (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
          <Avatar
            src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
            alt="Bot"
          />
          <Box sx={{ marginLeft: "8px", display: "flex", gap: "4px" }}>
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MessagesList;
