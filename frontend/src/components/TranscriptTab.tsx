import React from "react";
import { Typography, Paper, Box, Avatar } from "@mui/material";
import { User, Activity } from "react-feather";

const TranscriptTab = ({ nurseAndPatientTranscript }) => {
  console.log("TranscriptTab nurseAndPatientTranscript:", nurseAndPatientTranscript);``
  // Static data representing the conversation
  const staticConversation = [
    {
      sender: "Nurse",
      message: "Good morning! How are you feeling after your medication?",
    },
    {
      sender: "Patient",
      message: "I feel a bit better, but I still have a slight headache.I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?",
    },
    {
      sender: "Nurse",
      message: "I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?",
    },
    {
      sender: "Patient",
      message: "Yes, I've had I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?I'll make a note of that. Have you been drinking enough water today?about three glasses so far.",
    },
    {
      sender: "Nurse",
      message: "Good morning! How are you feeling after your medication?",
    },
    {
      sender: "Patient",
      message: "I feel a bit better, but I still have a slight headache.",
    },
    {
      sender: "Nurse",
      message: "I'll make a note of that. Have you been drinking enough water today?",
    },
    {
      sender: "Patient",
      message: "Yes, I've had about three glasses so far.",
    },
    {
      sender: "Nurse",
      message: "Good morning! How are you feeling after your medication?",
    },
    {
      sender: "Patient",
      message: "I feel a bit better, but I still have a slight headache.",
    },
    {
      sender: "Nurse",
      message: "I'll make a note of that. Have you been drinking enough water today?",
    },
    {
      sender: "Patient",
      message: "Yes, I've had about three glasses so far.",
    },
  ];

  // If you later have dynamic data in data.transcript, 
  // you can replace staticConversation with that array.
  const chatData = nurseAndPatientTranscript;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: '12px', 
        border: '1px solid #C0C0C0', 
        maxHeight: '70vh', 
        overflowY: 'auto',
        background: "#ffffff" 
      }}
    >
      

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 30 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Activity size={20} color="#1976d2" />
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Comfortaa' }}>
          Consultation Transcript
        </Typography>
      </Box>
        {chatData.map((chat) => {
          const isNurse = chat.sender === "Nurse";

          return (
            <Box
              key={chat.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isNurse ? 'flex-start' : 'flex-end',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isNurse ? 'row' : 'row-reverse',
                  alignItems: 'flex-end',
                  gap: 1,
                  maxWidth: '80%',
                }}
              >
                {/* Icon/Avatar */}
                <Avatar
                  sx={{
                    bgcolor: isNurse ? '#e3f2fd' : '#f1f1f1',
                    color: isNurse ? '#1976d2' : '#666',
                    width: 32,
                    height: 32
                  }}
                >
                  {isNurse ? <Activity size={16} /> : <User size={16} />}
                </Avatar>

                {/* Message Bubble */}
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: isNurse ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    bgcolor: isNurse ? '#f0f4ff' : '#f5f7fb',
                    border: isNurse ? '1px solid #d1d9ff' : '1px solid #e0e0e0',
                  }}
                >
                  {/* <Typography 
                    variant="caption" 
                    sx={{ fontWeight: 'bold', color: isNurse ? '#1976d2' : '#555', display: 'block', fontSize: 16, fontFamily: 'Comfortaa' }}
                  >
                    {chat.sender}
                  </Typography> */}
                  <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.5, fontSize: 18, fontFamily: 'Philosopher' }}>
                    {chat.message}
                  </Typography>
                </Box>
              </Box>
              
              {/* Timestamp */}
              {/* <Typography 
                variant="caption" 
                sx={{ mt: 0.5, mx: 5, color: '#999', fontSize: '0.7rem' }}
              >
                {chat.timestamp}
              </Typography> */}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default TranscriptTab;