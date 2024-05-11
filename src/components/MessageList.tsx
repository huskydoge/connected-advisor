import React from "react";
import { useMessages } from "./utils/useMessages";
import { Avatar, TextField, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages();

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
        if (message.role === "system") return null;
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
                padding: "1rem",
                borderRadius: ".5rem",
                backgroundColor: isUser ? "#1976d2" : "#f0f0f0",
                color: isUser ? "white" : "black",
              }}
            >
              {message.content.trim()}
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
