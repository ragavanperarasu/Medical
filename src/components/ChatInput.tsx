import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import VoiceButton from "./VoiceButton";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <VoiceButton />

      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}