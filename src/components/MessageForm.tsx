import React, { useState } from "react";
import { useMessages } from "./utils/useMessages";
import { IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const { addMessage } = useMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMessage(content);
    setContent("");
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
        position: "relative", // For absolute positioning of the button
      }}
    >
      <TextField
        id="message-input"
        label="Type your message"
        variant="outlined"
        multiline
        maxRows={4} // Adjust maxRows as needed for better control over scrolling
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        fullWidth
        style={{ marginRight: "48px" }} // Make space for the button
      />
      <IconButton
        type="submit"
        color="primary"
        aria-label="send"
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
