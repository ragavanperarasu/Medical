import React, { useState } from "react";
import {
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search,
  Calendar,
  Clipboard,
  User,
  ChevronRight,
  Plus,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Initial Static Data
const initialData = [
  { id: 1, name: "John Doe", dob: "12-05-1985", regno: "MRN001", complaint: "Knee Pain", doctor: "Dr. Smith", status: "In-Progress" },
  { id: 2, name: "Sarah Connor", dob: "25-08-1990", regno: "MRN002", complaint: "Shoulder Injury", doctor: "Dr. Williams", status: "Scheduled" },
  { id: 3, name: "Michael Vance", dob: "10-01-1975", regno: "MRN003", complaint: "Back Ache", doctor: "Dr. Smith", status: "Follow-up" },
];

const HomePage = () => {
  const navigate = useNavigate();
  
  // States
  const [patients, setPatients] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State for New Patient
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    complaint: "",
    doctor: "",
    status: "New",
  });

  // Handle Search Filtering
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.regno.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to Add Patient
  const handleAddPatient = () => {
    const newEntry = {
      ...formData,
      id: patients.length + 1,
      regno: `MRN00${patients.length + 1}`, // Auto-incrementing MRN
    };
    
    setPatients([newEntry, ...patients]); // Add to the top of the list
    setIsModalOpen(false); // Close modal
    setFormData({ name: "", dob: "", complaint: "", doctor: "", status: "New" }); // Reset form
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f8f8f8", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        {/* Header with Add Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A2027", fontFamily: "Comfortaa" }}>
              Patient Directory
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Philosopher" }}>
              Manage and search for patient records across the facility.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              borderRadius: 2,
              bgcolor: "#007FFF",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              fontFamily: "Comfortaa",
              boxShadow: "0px 4px 12px rgba(0,127,255,0.2)",
              "&:hover": { bgcolor: "#0062CC" },
            }}
          >
            New Patient
          </Button>
        </Box>

        {/* Search Bar */}
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

        {/* Patient Cards (Your Original Detailed Style) */}
        <Grid container spacing={2}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Grid size={{ xs: 12, sm: 6, md: 12 }} key={patient.id}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/patient/${patient.regno}`, { state: patient })}
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
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#EDF5FF", color: "#007FFF", borderRadius: "10px" }}>
                        <User size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontFamily: "Comfortaa" }}>
                          {patient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Philosopher" }}>
                          {patient.regno}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small"><ChevronRight size={20} /></IconButton>
                  </Box>

                  {/* Details Grid */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, mt: 3 }}>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{ fontFamily: "Comfortaa" }}>
                        DATE OF BIRTH
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Calendar size={14} color="#64748B" />
                        <Typography variant="body2" fontWeight={500} sx={{ fontFamily: "Philosopher" }}>{patient.dob}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{ fontFamily: "Comfortaa" }}>
                        CHIEF COMPLAINT
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Clipboard size={14} color="#64748B" />
                        <Typography variant="body2" fontWeight={500} sx={{ fontFamily: "Philosopher" }}>{patient.complaint}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{ fontFamily: "Comfortaa" }}>
                        ATTENDING DOCTOR
                      </Typography>
                      <Chip label={patient.doctor} size="small" sx={{ bgcolor: "#ecf4fd", fontWeight: 600, color: "#475569", fontFamily: "Philosopher" }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: "center", width: "100%", py: 8 }}>
              <Typography color="text.secondary">No patient records found.</Typography>
            </Box>
          )}
        </Grid>
      </Container>

      {/* Professional Add Patient Dialog */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: "Comfortaa", fontWeight: 700 }}>Add New Patient</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{
    "& .MuiInputBase-input": {
      fontFamily: "Philosopher",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Philosopher",
    }
  }}
            />
            <TextField
              label="Date of Birth"
              type="text"
              placeholder="DD-MM-YYYY"
              fullWidth
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              sx={{
    "& .MuiInputBase-input": {
      fontFamily: "Philosopher",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Philosopher",
    }
  }}
            />
            <TextField
              label="Chief Complaint"
              fullWidth
              value={formData.complaint}
              onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
              sx={{
    "& .MuiInputBase-input": {
      fontFamily: "Philosopher",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Philosopher",
    }
  }}
            />
            <TextField
              label="Attending Doctor"
              fullWidth
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              sx={{
    "& .MuiInputBase-input": {
      fontFamily: "Philosopher",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Philosopher",
    }
  }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: "text.secondary", fontFamily: "Comfortaa", textTransform: "none" }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddPatient}
            disabled={!formData.name || !formData.doctor}
            sx={{ bgcolor: "#007FFF", borderRadius: "10px", px: 4, fontFamily: "Comfortaa", textTransform:"none"}}
          >
            Save Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;