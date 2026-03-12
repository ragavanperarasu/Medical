import React from "react";
import { Typography, Paper, Box, Avatar, Stack } from "@mui/material";
import { User, Activity, MessageSquare } from "react-feather";

const TranscriptTab = ({ nurseAndPatientTranscript }) => {
  // Check if data exists and has items
  const hasData = nurseAndPatientTranscript && nurseAndPatientTranscript.length > 0;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: '12px', 
        border: '1px solid #C0C0C0', 
        height: '70vh', // Changed to height to keep container consistent
        overflowY: 'auto',
        background: "#ffffff" 
      }}
    >
      {/* Header remains visible even if empty */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, px: hasData ? 30 : 2 }}>
        <Activity size={20} color="#1976d2" />
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Comfortaa' }}>
          Consultation Transcript
        </Typography>
      </Box>

      {!hasData ? (
        /* --- EMPTY STATE VIEW --- */
        <Stack 
          alignItems="center" 
          justifyContent="center" 
          sx={{ height: '80%', opacity: 0.5 }}
          spacing={2}
        >
          <MessageSquare size={48} color="#94a3b8" strokeWidth={1} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Comfortaa', 
              color: '#64748b',
              textAlign: 'center' 
            }}
          >
            No conversation available
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            The transcript will appear here once the consultation begins.
          </Typography>
        </Stack>
      ) : (
        /* --- CHAT LIST VIEW --- */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: { xs: 2, md: 30 } }}>
          {nurseAndPatientTranscript.map((chat) => {
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

                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: isNurse ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      bgcolor: isNurse ? '#f0f4ff' : '#f5f7fb',
                      border: isNurse ? '1px solid #d1d9ff' : '1px solid #e0e0e0',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#333', 
                        lineHeight: 1.5, 
                        fontSize: 18, 
                        fontFamily: 'Philosopher' 
                      }}
                    >
                      {chat.message}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default TranscriptTab;