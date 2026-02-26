import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, TextField, Container, 
  Paper, InputAdornment, Box, Grid, Avatar, Chip, IconButton 
} from '@mui/material';
import { Search, Calendar, Hash, Clipboard, User, ChevronRight } from 'react-feather';

// Static Patient Data
const initialPatients = [
  { id: 1, name: "John Doe", dob: "12-05-1985", regno: "REG001", complaint: "Knee Pain", doctor: "Dr. Smith", status: "In-Progress" },
  { id: 2, name: "Sarah Connor", dob: "25-08-1990", regno: "REG002", complaint: "Shoulder Injury", doctor: "Dr. Williams", status: "Scheduled" },
  { id: 3, name: "Michael Vance", dob: "10-01-1975", regno: "REG003", complaint: "Back Ache", doctor: "Dr. Smith", status: "Follow-up" },
  { id: 4, name: "Elena Gilbert", dob: "05-11-1995", regno: "REG004", complaint: "Ankle Sprain", doctor: "Dr. Brown", status: "New" },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = initialPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.regno.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#F4F7F9', minHeight: '100vh', pb: 4 }}>
      {/* Professional Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E0E4E8' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Hospital Logo from public folder */}
            <img src="/logo.svg" alt="OrthoOne Logo" style={{ height: '32px', width: 'auto' }} />
            {/* <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#1A2027' }}>
              ORTHO<span style={{ color: '#007FFF' }}>ONE</span>
            </Typography> */}
          </Box>
          <Avatar sx={{ bgcolor: '#007FFF', width: 35, height: 35, fontSize: '0.875rem' }}>AD</Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 6 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A2027', mb: 1 }}>
            Patient Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and search for patient records across the facility.
          </Typography>
        </Box>

        {/* Search Bar - Enhanced with Shadow */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, ID, or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            mb: 4, 
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: '12px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
              '& fieldset': { border: '1px solid #E0E4E8' },
            }
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
              <Grid item xs={12} key={patient.id}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    border: '1px solid #E0E4E8',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#007FFF',
                      boxShadow: '0px 4px 20px rgba(0,127,255,0.08)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#EDF5FF', color: '#007FFF', borderRadius: '10px' }}>
                        <User size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {patient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Hash size={12} style={{ marginRight: 4 }} /> {patient.regno}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <ChevronRight size={20} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mt: 3 }}>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>DATE OF BIRTH</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={14} color="#64748B" />
                        <Typography variant="body2" fontWeight={500}>{patient.dob}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>CHIEF COMPLAINT</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clipboard size={14} color="#64748B" />
                        <Typography variant="body2" fontWeight={500}>{patient.complaint}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>ATTENDING DOCTOR</Typography>
                      <Chip 
                        label={patient.doctor} 
                        size="small" 
                        sx={{ bgcolor: '#F1F5F9', fontWeight: 600, color: '#475569' }} 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', py: 8 }}>
              <Typography color="text.secondary">No patient records match your search.</Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;