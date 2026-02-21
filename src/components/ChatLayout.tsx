import { Box } from "@mui/material";
import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatLayout() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello Ragavan 👋 How can I help you?" },
  ]);

  const sendMessage = (text) => {
    setMessages([
      ...messages,
      { role: "user", text },
      { role: "assistant", text: "This is AI response..." },
    ]);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </Box>

      {/* Input */}
      <ChatInput onSend={sendMessage} />
    </Box>
  );
}