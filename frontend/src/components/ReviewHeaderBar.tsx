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


const ReviewHeaderBar = ({
  patientData
}) => {

  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState({
    heartrate: "72",
    bp: "120/80",
    tempinfahrenheit: "98.6",
    gender: "Male",
    age: "28",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    handleClose();
  };

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
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
      </Stack>


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

export default ReviewHeaderBar;
