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
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  User,
  Heart,
  Activity,
  Mic,
  Thermometer,
  Square,
  Circle,
  Edit2,
  Users,
  Calendar,
  Shield,
  Info,
} from "react-feather";
import Loading from "./Loading";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animation/loading.json";
import { ToastContainer, toast } from 'react-toastify';


const HeaderBar = ({
  setNurseAndPatientTranscript,
  setHeaderData2,
  patientData,
  patientHelthData,
}) => {
  const [recording, setRecording] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sendHealthData, setSendHealthData] = useState(true);
  const [load, setLoad] = useState(false);
  const [history, setHistory] = useState("");

  const audioContextRef = useRef(null);
const analyserRef = useRef(null);
const silenceTimerRef = useRef(null);
  

  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState({
    heartrate: "72",
    bp: "120/80",
    tempinfahrenheit: "98.6",
    gender: "Male",
    age: "28",
  });
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    handleClose();
  };

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  // 🎤 RECORDING LOGIC
  const startRecording = async () => {
  setConfirmOpen(false);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    // 🎧 Audio context for silence detection
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);
    analyserRef.current = analyser;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      if (sendHealthData) {
        formData.append("vitals", JSON.stringify(vitals));
      }

      try {
        setLoad(true);

        const response = await axios.post(
          "http://127.0.0.1:5000/transcribe",
          formData
        );

        setNurseAndPatientTranscript((prev) => [...prev, response.data]);
        console.log("Transcription and Analysis Result:", response.data);

        // if(history !== ""){
        //   const senddata = `
        //   OLD CONVERSATION:
        //   ${history}

        //   NEXT CONVERSATION:
        //   ${response.data.translation}
        //   `;
        //   const response1 = await axios.post(
        //     "http://127.0.0.1:5000/api/ortho",
        //     { message: senddata }
        //   );
        //   setHeaderData2(response1.data.llm);
        //   setHistory(response.data.summary);
        // }
        // else if (sendHealthData) {
        //   const pd = JSON.stringify(patientHelthData);
        //   const pd2 = JSON.stringify(vitals);
        //   const fpd = `
        //   PATIENT PROFILE:
        //   ${pd2} 
        //   ${pd} 
          
        //   CONVERSATION:
        //   ${response.data.text}`;

        //   const response1 = await axios.post(
        //     "http://127.0.0.1:5000/api/ortho",
        //     { message: fpd }
        //   );

        //   setHeaderData2(response1.data.llm);
        //   setHistory(response.data.summary);
        // }
        // else {
        //  // console.log("else block")
        //   const response1 = await axios.post(
        //     "http://127.0.0.1:5000/api/ortho",
        //     { message: response.data.text }
        //   );

        //   setHeaderData2(response1.data.llm);
        //   setHistory(response.data.summary);
       // }
      } catch (err) {
        toast.error("Something Network Issue")
        //console.error("Transcription failed:", err);
      } finally {
        setLoad(false);
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
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  if (silenceTimerRef.current) {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }

  setRecording(false);
};

  const handleMicClick = () => {
    if (recording) {
      stopRecording();
    } else {
      setConfirmOpen(true);
    }
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
      <ToastContainer position="bottom-right"/>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* LEFT SECTION */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ bgcolor: "#f0f6ff", px: 2, py: 1, borderRadius: 3 }}
          >
            <User size={24} color="#3b82f6" />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "Philosopher", fontSize: 14 }}
              >
                Current Patient
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{ fontFamily: "Comfortaa", fontSize: 16 }}
              >
                {patientData.name}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            sx={{
              bgcolor: "#ffffff",
              px: 3,
              py: 1,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <VitalItem
              icon={<Calendar size={18} color="#06b6d4" />}
              label="Age"
              value={vitals.age}
            />
            <VitalItem
              icon={<Users size={18} color="#8b5cf6" />}
              label="Gender"
              value={vitals.gender}
            />
            <VitalItem
              icon={<Heart size={18} color="#ef4444" />}
              label="Heart Rate"
              value={vitals.heartrate + " bpm"}
            />
            <VitalItem
              icon={<Activity size={18} color="#2563eb" />}
              label="BP"
              value={vitals.bp}
            />
            <VitalItem
              icon={<Thermometer size={18} color="#f97316" />}
              label="Temp"
              value={vitals.tempinfahrenheit + "°F"}
            />

            <IconButton
              onClick={handleOpen}
              size="small"
              sx={{
                ml: 1,
                bgcolor: "#f3f4f6",
                "&:hover": { bgcolor: "#e5e7eb" },
              }}
            >
              <Edit2 size={14} />
            </IconButton>
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <Stack direction="row" spacing={2} alignItems="center">
          {recording && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ bgcolor: "#fff0f0", px: 2, py: 1, borderRadius: 3 }}
            >
              <Circle
                size={10}
                fill="#ef4444"
                color="#ef4444"
                style={{ animation: "pulse 1.2s infinite" }}
              />
              <Typography
                color="error"
                variant="caption"
                fontWeight={600}
                fontFamily="Comfortaa"
              >
                REC
              </Typography>
            </Stack>
          )}

          <Button
            onClick={handleMicClick}
            variant="contained"
            startIcon={recording ? <Square size={18} /> : <Mic size={18} />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              bgcolor: recording ? "#ef4444" : "#0070FF",
              fontFamily: "Comfortaa",
              px: 3,
              py: 1,
              boxShadow: "0 4px 12px rgba(0, 112, 255, 0.2)",
              "&:hover": { bgcolor: recording ? "#d32f2f" : "#0056b3" },
            }}
          >
            {recording ? "Stop" : "Start Recording"}
          </Button>
        </Stack>
      </Stack>

      {/* --- CONFIRMATION DIALOG --- */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontFamily: "Comfortaa",
          }}
        >
          <Shield size={24} color="#0070FF" />
          Recording Session
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You are about to start an AI-assisted transcription for{" "}
            <strong>{patientData.name}</strong>.
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={sendHealthData}
                  onChange={(e) => setSendHealthData(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: "Comfortaa" }}
                  >
                    Include Health Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Send current vitals and patient metrics to the Ortho Agent
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, color: "text.secondary" }}
            alignItems="center"
          >
            <Info size={14} />
            <Typography variant="caption">
              Audio data is processed securely via HIPAA-compliant protocols.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="inherit"
            sx={{ textTransform: "none", fontFamily: "Comfortaa" }}
          >
            Cancel
          </Button>
          <Button
            onClick={startRecording}
            variant="contained"
            startIcon={<Mic size={16} />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              bgcolor: "#0070FF",
              fontFamily: "Comfortaa",
            }}
          >
            Begin Recording
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT VITALS DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "Comfortaa", fontWeight: "bold" }}>
          Edit Patient Details
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Age"
                name="age"
                type="number"
                fullWidth
                value={vitals.age}
                onChange={handleChange}
              />
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
            </Stack>
            <TextField
              label="Heart Rate (bpm)"
              name="heartrate"
              fullWidth
              value={vitals.heartrate}
              onChange={handleChange}
            />
            <TextField
              label="Blood Pressure"
              name="bp"
              fullWidth
              value={vitals.bp}
              onChange={handleChange}
            />
            <TextField
              label="Temperature (°F)"
              name="temp"
              fullWidth
              value={vitals.tempinfahrenheit}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={load}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4, // 👈 border radius applied here
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", p: 4, borderRadius: 10 }}>
          <Box sx={{ width: 200, margin: "auto" }}>
            <Lottie animationData={loadingAnimation} loop={true} />
          </Box>

          <Typography mt={2} sx={{ fontFamily: "Comfortaa", fontSize: 20 }}>
            Analyzing Patient Symptoms
          </Typography>
        </DialogContent>
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
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: 11,
          fontFamily: "Philosopher",
          display: "block",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, fontSize: 14, fontFamily: "Comfortaa" }}
      >
        {value}
      </Typography>
    </Box>
    
  </Stack>
  
);

export default HeaderBar;
