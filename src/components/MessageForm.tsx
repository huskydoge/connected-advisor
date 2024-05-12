import React, { useEffect, useState } from "react";
import { useMessages } from "./utils/useMessages";
import { IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const { addMessage, isLoadingAnswer } = useMessages();
  const [activate, setActivate] = useState(true);

  useEffect(() => {
    if (isLoadingAnswer) {
      setActivate(false);
    } else {
      setActivate(true);
    }
  }, [isLoadingAnswer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activate) {
      addMessage(content);
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        padding: "10px",
        maxWidth: "768px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      <TextField
        id="message-input"
        label="Type your message"
        variant="outlined"
        multiline
        maxRows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey && activate) {
            e.preventDefault();
            if (content.trim()) {
              handleSubmit(e);
            }
          }
        }}
        autoFocus
        fullWidth
        disabled={!activate} // Disable input when activate is false
        style={{ marginRight: "48px" }}
      />
      <IconButton
        type="submit"
        color={activate ? "primary" : "default"} // Change color based on activate
        aria-label="send"
        disabled={!activate} // Disable button when activate is false
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <SendIcon />
      </IconButton>
    </form>
  );
};

export default MessageForm;
