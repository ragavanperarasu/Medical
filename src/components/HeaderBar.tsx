import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stack
} from "@mui/material";
import {
  User,
  Heart,
  Activity,
  Mic,
  Thermometer,
  Square,
  Radio,
  Circle
} from "react-feather";

import axios from "axios";

const HeaderBar = ({ setHeaderData, setHeaderData2 }) => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // 🎤 START RECORDING
  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    streamRef.current = stream; // ✅ store stream

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm"
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      try {
        const response = await axios.post(
          "http://localhost:5000/transcribe",
          formData
        );

       // setTranscription(response.data.text);
        setHeaderData(response.data.text); // ✅ send transcription to App

        const response1 = await axios.post(
          "http://localhost:5000/api/triage",
          { message: response.data.text }
        );
        setHeaderData2(response1.data.data.output_parsed); // ✅ send triage result to App

      } catch (err) {
        console.error("Transcription failed:", err);
      }
    };

    mediaRecorder.start();
    setRecording(true);

    console.log("Recording started 🎙");
  } catch (err) {
    console.error("Microphone access denied:", err);
    alert("Please allow microphone access");
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
  }

  // ✅ STOP microphone completely
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }

  setRecording(false);
  console.log("Recording stopped ❌");
};

  const toggleRecording = () => {
    recording ? stopRecording() : startRecording();
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #C0C0C0",
        
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">

        {/* LEFT SECTION */}
        <Stack direction="row" spacing={3} alignItems="center">

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ bgcolor: "#f0f6ff", px: 2, py: 1, borderRadius: 3, }}
          >
            <User size={24} color="#3b82f6" />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Philosopher", fontWeight: 500, fontSize: 14}}>
                Current Patient
              </Typography>
              <Typography fontWeight="bold" sx={{ fontFamily: "Comfortaa", fontSize: 16}}>
                Sarah Mitchell
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{
              bgcolor: "#ffffff",
              px: 3,
              py: 1,
              borderRadius: 3,
              border: "1px solid #e5e7eb"
            }}
          >
            <VitalItem
              icon={<Heart size={20} color="#ef4444" />}
              label="Heart Rate"
              value="72 bpm"
            />
            <VitalItem
              icon={<Activity size={20} color="#2563eb" />}
              label="BP"
              value="120/80"
            />
            <VitalItem
              icon={<Thermometer size={20} color="#f97316" />}
              label="Temp"
              value="98.6°F"
            />
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <Stack direction="row" spacing={2} alignItems="center">

          {recording && (
            <Stack direction="row" spacing={3} alignItems="center">

              {/* Recording Indicator */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ bgcolor: "#fff0f0", px: 2, py: 1, borderRadius: 3 }}
              >
                <Circle
                  size={12}
                  fill="#ef4444"
                  color="#ef4444"
                  style={{ animation: "pulse 1.2s infinite" }}
                />
                <Typography color="error" fontWeight={600} fontFamily={"Comfortaa"}>
                  Recording in Progress
                </Typography>
              </Stack>

              {/* Sending Indicator */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ bgcolor: "#f0f6ff", px: 2, py: 1, borderRadius: 3 }}
              >
                <Radio
                  size={18}
                  color="#0070BB"
                  style={{ animation: "spin 1.2s linear infinite" }}
                />
                <Typography color="#0070BB" sx={{fontFamily:"Comfortaa", fontWeight: 500}}>
                  Listening...
                </Typography>
              </Stack>
            </Stack>
          )}

          <Button
            onClick={toggleRecording}
            variant="contained"
            startIcon={recording ? <Square size={18} /> : <Mic size={18} />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              bgcolor: recording ? "#ef4444" : "#0070FF",
              boxShadow: recording
                ? "0 0 0 4px rgba(239,68,68,0.2)"
                : "0 0 0 0 rgba(0,0,0,0)",
              fontSize: 16,
              fontFamily: "Comfortaa",
              transition: "all 0.3s ease",
              transform: recording ? "scale(1.05)" : "scale(1)",

              "&:hover": {
                bgcolor: recording ? "#dc2626" : "#005bd1",
                transform: "scale(1.05)"
              },

              "&:active": {
                transform: "scale(0.9)"
              }
            }}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </Stack>
      </Stack>

      {/* Transcription Output */}
      {transcription && (
        <Box mt={3}>
          <Typography variant="subtitle2" color="text.secondary" sx={{fontFamily:'Comfortaa'}}>
            Transcription:
          </Typography>
          <Typography fontWeight={500} sx={{ whiteSpace: "pre-line", fontFamily: "Comfortaa" }}>
            {transcription}
          </Typography>
        </Box>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Card>
  );
};

const VitalItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon}
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 500, fontSize: 14, fontFamily: "Philosopher" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, fontSize: 16, fontFamily: "Comfortaa" }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default HeaderBar;