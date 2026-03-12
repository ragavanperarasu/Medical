import React from 'react';
import { 
  Paper, Typography, Box, Grid, Chip, Divider, Stack 
} from '@mui/material';
import { 
  Calendar, Hash, Activity, User, Clock, CheckCircle, AlertCircle 
} from 'react-feather';
import { useNavigate } from "react-router-dom";

const PatientStatus = ({ currentPatientData, nurseAndPatientTranscript }) => {
  const navigate = useNavigate();

  return (
   
      <Paper 
        elevation={0} 
        sx={{ 
          px: 3, 
          py:2,
          borderRadius: '16px', 
          border: '1px solid #C0C0C0', 
          bgcolor: 'white' 
        }}
      >
        {/* Header: Name and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
            <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Comfortaa", fontSize: 18 , display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <User size={22} color="#2563eb"/>
                    Current Complaint 
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ml:4, fontFamily:'Philosopher'}} >
              Real-time update for {currentPatientData.regno}
            </Typography></Box>
          <Chip 
            icon={<CheckCircle size={16} />}
            onClick={() => navigate("/review",{ state: { currentPatientData, nurseAndPatientTranscript } })}
            label={"Patient Review"} 
            sx={{ 
              bgcolor: "#29AB87", 
              color: "#ffffff", 
              fontWeight: 700,
              fontFamily: 'Comfortaa',
              fontSize: 14,
              px: 1,
              borderRadius: 2,
              '& .MuiChip-icon': { color: 'inherit' }
            }} 
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Status Details Grid */}
        <Grid container spacing={3} justifyContent={'space-between'}>
          {/* Appointment Date */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Calendar size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'Comfortaa',  }}>
                  Date of Birth
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'Philosopher' }}>
                {currentPatientData.dob}
              </Typography>
            </Stack>
          </Grid>


          {/* Attending Doctor */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <User size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.5px', fontFamily: 'Comfortaa' }}>
                  Attending Doctor
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 , fontFamily: 'Philosopher'}}>
                {currentPatientData.doctor}
              </Typography>
            </Stack>
          </Grid>

          {/* Chief Complaint */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Activity size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.5px', fontFamily: 'Comfortaa' }}>
                  Complaint
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3, color: '#D32F2F', fontFamily: 'Philosopher' }}>
                {currentPatientData.complaint}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
  );
};

export default PatientStatus;