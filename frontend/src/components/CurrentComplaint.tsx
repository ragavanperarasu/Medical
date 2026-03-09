import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid
} from "@mui/material";
import { HelpCircle, MessageSquare, Info, CheckCircle, Activity } from "react-feather";

const CurrentComplaint = ({ patientQus }) => {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (patientQus?.questions_to_ask) {
      setActiveQuestions(patientQus.questions_to_ask);
      setCompletedQuestions([]);
    }
  }, [patientQus]);

  const handleMarkAsDone = (questionText) => {
    const questionToMove = activeQuestions.find((q) => q.question === questionText);
    if (questionToMove) {
      setCompletedQuestions((prev) => [...prev, questionToMove]);
      setActiveQuestions((prev) => prev.filter((q) => q.question !== questionText));
    }
  };

  const handleOpenReason = (item) => {
    setSelectedQuestion(item);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <Card
      sx={{
        py: 3,
        px: 3,
        borderRadius: 4,
        minHeight: "50vh",
        border: "1px solid #C0C0C0",
        bgcolor: "#fff",
        boxShadow: "none",
        mt: 2,
      }}
    >
 {/* SECTION 1: Suspected Causes */}
      <Box sx={{ mb: 4 }}>
  <Typography
    variant="subtitle1"
    sx={{ 
      fontWeight: 700, 
      fontFamily: "Comfortaa", 
      display: "flex", 
      alignItems: "center", 
      gap: 1.5, 
      mb: 2.5, 
      color: "#1e293b" 
    }}
  >
    <Activity size={20} color="#ef4444" />
    Suspected Clinical Causes
  </Typography>

  <Grid container spacing={2}>
    {patientQus?.suspected_cause?.map((item, index) => {
      // Professional color logic based on probability
      const isHighProb = item.probability >= 40;
      const bgColor = isHighProb ? "#eff6ff" : "#f8fafc";
      const borderColor = isHighProb ? "#bfdbfe" : "#e2e8f0";
      const textColor = isHighProb ? "#1e40af" : "#475569";

      return (
        <Grid size={6} key={index}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 3,
              bgcolor: bgColor,
              border: `1px solid ${borderColor}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-2px)" }
            }}
          >
            <Typography 
              sx={{ 
                fontFamily: "Philosopher", 
                fontSize: 14, 
                fontWeight: 700, 
                color: textColor 
              }}
            >
              {item.cause}
            </Typography>
            
            <Box sx={{ textAlign: "right" }}>
              <Typography 
                sx={{ 
                  fontFamily: "Comfortaa", 
                  fontSize: 15, 
                  fontWeight: 800, 
                  color: isHighProb ? "#2563eb" : "#64748b" 
                }}
              >
                {item.probability}%
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: "Philosopher", 
                  fontSize: 10, 
                  textTransform: "uppercase", 
                  letterSpacing: 1,
                  color: isHighProb ? "#60a5fa" : "#94a3b8",
                  lineHeight: 1
                }}
              >
                Match
              </Typography>
            </Box>
          </Box>
        </Grid>
      );
    })}
  </Grid>
</Box>
      <Divider sx={{ mb: 3 }} />

      {/* SECTION 2: Follow-up Questions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontFamily: "Comfortaa", display: "flex", alignItems: "center", gap: 1.5, fontSize: 18 }}
        >
          <MessageSquare size={22} color="#2563eb" />
          Recommended Follow-up
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={`${activeQuestions.length} Required`}
            sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontFamily: "Comfortaa" }}
          />
        </Box>
      </Box>

      <Stack
        spacing={2}
        sx={{
          maxHeight: "35vh", // Adjusted height due to the cause section
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "10px" },
          "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" },
        }}
      >
        {activeQuestions.length > 0 ? (
          activeQuestions.map((item, index) => (
            <Box
              key={item.question}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #F3F4F6",
                bgcolor: "#F9FAFB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "0.2s ease-in-out",
                "&:hover": { bgcolor: "#fff", borderColor: "#2563eb" },
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Typography sx={{ color: "#9CA3AF", fontWeight: 700, fontFamily: "Philosopher", mt: 0.2 }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontFamily: "Philosopher", fontSize: 15, fontWeight: 500, color: "#374151" }}>
                  {item.question}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<HelpCircle size={14} />}
                  onClick={() => handleOpenReason(item)}
                  sx={{ textTransform: "none", fontFamily: "Comfortaa", color: "#64748b" }}
                >
                  Why?
                </Button>
                <Tooltip title="Mark Asked">
                  <IconButton onClick={() => handleMarkAsDone(item.question)} size="small">
                    <CheckCircle size={18} color="#9CA3AF" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography sx={{ fontFamily: "Philosopher", color: "#64748b" }}>
              All diagnostics complete.
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Clinical Reasoning Dialog */}
      <Dialog open={modalOpen} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: "450px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "Comfortaa", fontWeight: 700 }}>
          <Info size={20} color="#2563eb" />
          Clinical Reasoning
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Philosopher", color: "#4B5563", lineHeight: 1.6 }}>
            {selectedQuestion?.reason}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth variant="contained" onClick={handleClose} sx={{ borderRadius: 2, bgcolor: "#2563eb", fontFamily: "Comfortaa", textTransform: "none" }}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const Chip = ({ label, sx }) => (
  <Box sx={{ ...sx, px: 1.5, py: 0.5, borderRadius: 5, fontSize: "0.75rem" }}>
    {label}
  </Box>
);

export default CurrentComplaint;