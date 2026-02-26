import React from 'react';
import { 
  Paper, Typography, Box, Grid, Chip, Divider, Stack 
} from '@mui/material';
import { 
  Calendar, Hash, Activity, User, Clock, CheckCircle, AlertCircle 
} from 'react-feather';

const PatientStatus = ({ patientData }) => {
  // Logic to determine status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case 'In-Progress':
        return { color: '#007FFF', bgcolor: '#EDF5FF', icon: <Clock size={16} /> };
      case 'Completed':
        return { color: '#2E7D32', bgcolor: '#E8F5E9', icon: <CheckCircle size={16} /> };
      default:
        return { color: '#ED6C02', bgcolor: '#FFF4E5', icon: <AlertCircle size={16} /> };
    }
  };

  const statusStyle = getStatusConfig(patientData.status);

  return (
   
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: '16px', 
          border: '1px solid #C0C0C0', 
          bgcolor: 'white' 
        }}
      >
        {/* Header: Name and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
            <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Comfortaa", fontSize: 22 , display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <User size={22} color="#2563eb"/>
                    Current Complaint 
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ml:4, fontFamily:'Philosopher'}} >
              Real-time update for {patientData.regno}
            </Typography></Box>
          <Chip 
            icon={statusStyle.icon}
            label={patientData.status} 
            sx={{ 
              bgcolor: statusStyle.bgcolor, 
              color: statusStyle.color, 
              fontWeight: 700,
              fontFamily: 'Philosopher',
              px: 1,
              '& .MuiChip-icon': { color: 'inherit' }
            }} 
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Status Details Grid */}
        <Grid container spacing={3} justifyContent={'space-between'}>
          {/* Appointment Date */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Calendar size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'Comfortaa' }}>
                  DATE OF BIRTH
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'Philosopher' }}>
                {patientData.dob}
              </Typography>
            </Stack>
          </Grid>

          {/* Registration Number */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Hash size={16} />
                <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                  REG NO
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
                {patientData.regno}
              </Typography>
            </Stack>
          </Grid> */}

          {/* Attending Doctor */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <User size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.5px', fontFamily: 'Comfortaa' }}>
                  ATTENDING DOCTOR
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 , fontFamily: 'Philosopher'}}>
                {patientData.doctor}
              </Typography>
            </Stack>
          </Grid>

          {/* Chief Complaint */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Activity size={16} color="#2563eb"/>
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.5px', fontFamily: 'Comfortaa' }}>
                  COMPLAINT
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3, color: '#D32F2F', fontFamily: 'Philosopher' }}>
                {patientData.complaint}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
  );
};

export default PatientStatus;