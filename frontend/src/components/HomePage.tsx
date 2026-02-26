import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Container,
  Paper,
  InputAdornment,
  Box,
  Grid,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Search,
  Calendar,
  Hash,
  Clipboard,
  User,
  ChevronRight,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Static Patient Data
const initialPatients = [
  {
    id: 1,
    name: "John Doe",
    dob: "12-05-1985",
    regno: "MRN001",
    complaint: "Knee Pain",
    doctor: "Dr. Smith",
    status: "In-Progress",
  },
  {
    id: 2,
    name: "Sarah Connor",
    dob: "25-08-1990",
    regno: "MRN002",
    complaint: "Shoulder Injury",
    doctor: "Dr. Williams",
    status: "Scheduled",
  },
  {
    id: 3,
    name: "Michael Vance",
    dob: "10-01-1975",
    regno: "MRN003",
    complaint: "Back Ache",
    doctor: "Dr. Smith",
    status: "Follow-up",
  },
  {
    id: 4,
    name: "Elena Gilbert",
    dob: "05-11-1995",
    regno: "MRN004",
    complaint: "Ankle Sprain",
    doctor: "Dr. Brown",
    status: "New",
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredPatients = initialPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.regno.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f8f8f8", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1A2027",
              mb: 1,
              fontFamily: "Comfortaa",
            }}
          >
            Patient Directory
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: "Philosopher" }}
          >
            Manage and search for patient records across the facility.
          </Typography>
        </Box>

        {/* Search Bar - Enhanced with Shadow */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Name or MRN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: "12px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              "& fieldset": { border: "1px solid #E0E4E8" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#007FFF" />
              </InputAdornment>
            ),
          }}
        />

        {/* Patient Cards */}
        <Grid container spacing={2}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Grid size={{ xs: 12, md: 12 }} key={patient.id}>
                <Paper
                  elevation={0}
                  onClick={() =>
                    navigate(`/patient/${patient.regno}`, {
                      state: {
                        name: patient.name,
                        dob: patient.dob,
                        regno: patient.regno,
                        complaint: patient.complaint,
                        doctor: patient.doctor,
                        status: patient.status,
                      },
                    })
                  }
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #E0E4E8",
                    transition: "all 0.2s",

                    "&:hover": {
                      borderColor: "#007FFF",
                      boxShadow: "0px 4px 20px rgba(0,127,255,0.08)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#EDF5FF",
                          color: "#007FFF",
                          borderRadius: "10px",
                        }}
                      >
                        <User size={20} />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            fontFamily: "Comfortaa",
                          }}
                        >
                          {patient.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                            fontFamily: "Philosopher",
                          }}
                        >
                          {patient.regno}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <ChevronRight size={20} />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontFamily: "Comfortaa" }}
                      >
                        DATE OF BIRTH
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Calendar size={14} color="#64748B" />
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontFamily: "Philosopher" }}
                        >
                          {patient.dob}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontFamily: "Comfortaa" }}
                      >
                        CHIEF COMPLAINT
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Clipboard size={14} color="#64748B" />
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontFamily: "Philosopher" }}
                        >
                          {patient.complaint}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontFamily: "Comfortaa" }}
                      >
                        ATTENDING DOCTOR
                      </Typography>
                      <Chip
                        label={patient.doctor}
                        size="small"
                        sx={{
                          bgcolor: "#ecf4fd",
                          fontWeight: 600,
                          color: "#475569",
                          fontFamily: "Philosopher",
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: "center", width: "100%", py: 8 }}>
              <Typography color="text.secondary">
                No patient records match your search.
              </Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
