import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { useState } from "react";

export default function VoiceButton() {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    setRecording(!recording);
  };

  return (
    <IconButton
      onClick={toggleRecording}
      sx={{
        backgroundColor: recording ? "#ff4d4f" : "#e0e0e0",
        color: recording ? "white" : "black",
        "&:hover": {
          backgroundColor: recording ? "#ff4d4f" : "#d5d5d5",
        },
      }}
    >
      <MicIcon />
    </IconButton>
  );
}