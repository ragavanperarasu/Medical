import { useState, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import {
  User,
  Heart,
  Activity,
  Mic,
  Thermometer,
  Square,
  Radio,
  Circle,
  Edit2,
  Users
} from "react-feather";

import axios from "axios";

const HeaderBar = ({ setHeaderData, setHeaderData2, patientData }) => {
  const [recording, setRecording] = useState(false);
  
  // --- Vital Editing State ---
  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState({
    hr: "72",
    bp: "120/80",
    temp: "98.6",
    gender: "Male"
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Dialog Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleSave = () => {
    // Here you would typically send an API update
    handleClose();
  };

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  // 🎤 RECORDING LOGIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");

        try {
          const response = await axios.post("http://72.60.103.126/medical/transcribe", formData);
          setHeaderData(response.data.text);
          const response1 = await axios.post("http://72.60.103.126/medical/api/triage", { message: response.data.text });
          setHeaderData2(response1.data.data.output_parsed);
        } catch (err) {
          console.error("Transcription failed:", err);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setRecording(false);
  };

  const toggleRecording = () => (recording ? stopRecording() : startRecording());

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none", border: "1px solid #C0C0C0" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        
        {/* LEFT SECTION: Patient Info & Vitals */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "#f0f6ff", px: 2, py: 1, borderRadius: 3 }}>
            <User size={24} color="#3b82f6" />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Philosopher", fontSize: 14 }}>
                Current Patient
              </Typography>
              <Typography fontWeight="bold" sx={{ fontFamily: "Comfortaa", fontSize: 16 }}>
                {patientData.name}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{ bgcolor: "#ffffff", px: 3, py: 1, borderRadius: 3, border: "1px solid #e5e7eb" }}
          >
            <VitalItem icon={<Users size={18} color="#8b5cf6" />} label="Gender" value={vitals.gender} />
            <VitalItem icon={<Heart size={18} color="#ef4444" />} label="HR" value={vitals.hr+" bpm"} />
            <VitalItem icon={<Activity size={18} color="#2563eb" />} label="BP" value={vitals.bp} />
            <VitalItem icon={<Thermometer size={18} color="#f97316" />} label="Temp" value={vitals.temp+"°F"} />
            
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 1, bgcolor: "#f3f4f6" }}>
              <Edit2 size={14} />
            </IconButton>
          </Stack>
        </Stack>

        {/* RIGHT SECTION: Indicators & Mic */}
        <Stack direction="row" spacing={2} alignItems="center">
          {recording && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "#fff0f0", px: 2, py: 1, borderRadius: 3 }}>
                <Circle size={10} fill="#ef4444" color="#ef4444" style={{ animation: "pulse 1.2s infinite" }} />
                <Typography color="error" variant="caption" fontWeight={600} fontFamily="Comfortaa">REC</Typography>
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
              fontFamily: "Comfortaa",
              px: 3
            }}
          >
            {recording ? "Stop" : "Start Recording"}
          </Button>
        </Stack>
      </Stack>

      {/* EDIT VITALS DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "Comfortaa", fontWeight: "bold" }}>Update Vitals</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              select
              label="Gender"
              name="gender"
              fullWidth
              value={vitals.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField label="Heart Rate" name="hr" fullWidth value={vitals.hr} onChange={handleChange} />
            <TextField label="Blood Pressure" name="bp" fullWidth value={vitals.bp} onChange={handleChange} />
            <TextField label="Temperature" name="temp" fullWidth value={vitals.temp} onChange={handleChange} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontFamily: "Comfortaa" }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ fontFamily: "Comfortaa", borderRadius: 2 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <style>
        {`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}
      </style>
    </Card>
  );
};

const VitalItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon}
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontFamily: "Philosopher" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14, fontFamily: "Comfortaa" }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default HeaderBar;