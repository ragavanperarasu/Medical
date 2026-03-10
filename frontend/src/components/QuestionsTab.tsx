import React from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  Chip, 
  Button, 
  Stack 
} from "@mui/material";
import { HelpCircle, Play, Info, AlertTriangle, AlertCircle, CheckCircle, Activity } from "react-feather";

const QuestionsTab = ({ data }) => {
  // Static data for demonstration
  const staticQuestions = [
    {
      id: 1,
      question: "Have you experienced any chest pain or shortness of breath since starting the medication?",
      reason: "Assess for potential adverse cardiovascular reactions or pulmonary edema.",
      priority: "High",
    },
    {
      id: 2,
      question: "Have you experienced any chest pain or shortness of breath since starting the medication?",
      reason: "Assess for potential adverse cardiovascular reactions or pulmonary edema.",
      priority: "High",
    },
    {
      id: 3,
      question: "Are you monitoring your blood glucose levels twice daily as discussed?",
      reason: "Ensure glycemic control is maintained within the target range (80-130 mg/dL).",
      priority: "Medium",
    },
    {
      id: 4,
      question: "How has your sleep quality been over the last three nights?",
      reason: "Evaluate if the current dosage timing is causing insomnia or restlessness.",
      priority: "Low",
    },
  ];

  const questionsList = data?.questionsArray || staticQuestions;

  // Professional Medical Theme Config
  const getLevelStyles = (priority) => {
    switch (priority) {
      case "High":
        return { 
          color: "#c62828", 
          border: "#ffcdd2", 
          bg: "#fff5f5", 
          label: "CRITICAL",
          icon: <AlertCircle size={20} />
        };
      case "Medium":
        return { 
          color: "#ed6c02", 
          border: "#ffe0b2", 
          bg: "#fff9f2", 
          label: "MODERATE",
          icon: <AlertTriangle size={20} />
        };
      case "Low":
        return { 
          color: "#2e7d32", 
          border: "#c8e6c9", 
          bg: "#fafffa", 
          label: "ROUTINE",
          icon: <CheckCircle size={20} />
        };
      default:
        return { 
          color: "#546e7a", 
          border: "#cfd8dc", 
          bg: "#f8f9fa", 
          label: "GENERAL",
          icon: <HelpCircle size={20} />
        };
    }
  };

  return (
    <Box sx={{border: '1px solid #C0C0C0', borderRadius: '12px', px:30, py:3, background: "#ffffff" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HelpCircle size={20} color="#1976d2" />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Comfortaa' }}>
                          Unanswered Questions
                        </Typography>
                      </Box>
      {questionsList.map((item, index) => {
        const style = getLevelStyles(item.priority);

        return (
          <Paper
            key={item.id || index}
            elevation={0}
            sx={{
              p: 0, // Set to 0 to handle internal padding with the colored left border
              borderRadius: "16px",
              border: `1.5px solid ${style.border}`,
              background: style.bg,
              overflow: 'hidden',
              transition: "all 0.3s ease",
              "&:hover": { 
                boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
                borderColor: style.color 
              }
            }}
          >
            <Stack direction="row">
            

              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                spacing={2} 
                sx={{ p: 3, width: '100%' }}
              >
                        
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  {/* Icon Box */}
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: '12px', 
                      bgcolor: '#ffffff', 
                      color: style.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 'fit-content',
                      boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                      border: `1px solid ${style.border}`
                    }}
                  >
                    {style.icon}
                  </Box>
                  
                  <Box>
                    <Chip 
                      label={style.label} 
                      size="small" 
                      sx={{ 
                        bgcolor: style.color, 
                        color: '#fff', 
                        fontWeight: '900',
                        fontSize: '0.65rem',
                        fontFamily: 'Comfortaa',
                        mb: 1.5,
                        px: 1
                      }} 
                    />

                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: '700', 
                        color: '#2c3e50', 
                        mb: 1, 
                        fontFamily: 'Comfortaa',
                        lineHeight: 1.4
                      }}
                    >
                      {item.question}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                      <Info size={14} style={{ marginTop: 3, color: style.color }} />
                      <Typography variant="body2" sx={{ color: '#546e7a', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 'bold' }}>Reasoning:</span> {item.reason}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<Play size={18} fill="currentColor" />}
                  sx={{
                    borderRadius: '10px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontFamily: 'Comfortaa',
                    fontWeight: 'bold',
                    bgcolor: style.color, // Button matches the priority color
                    '&:hover': { 
                        bgcolor: style.color,
                        filter: 'brightness(0.9)'
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Resume to Ask
                </Button>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Box></Box>
  );
};

export default QuestionsTab;