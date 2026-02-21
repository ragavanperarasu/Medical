import { Box, Paper, Typography } from "@mui/material";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: "60%",
          backgroundColor: isUser ? "#10a37f" : "#f1f1f1",
          color: isUser ? "white" : "black",
          borderRadius: 3,
        }}
      >
        <Typography>{message.text}</Typography>
      </Paper>
    </Box>
  );
}