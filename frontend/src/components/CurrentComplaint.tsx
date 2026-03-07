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
} from "@mui/material";
import { HelpCircle, MessageSquare, Info, CheckCircle } from "react-feather";

const CurrentComplaint = ({ patientQus }) => {
  // 1. Initialize states with empty arrays to prevent "undefined" errors
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 2. Synchronize internal state when patientQus prop changes (API arrival)
  useEffect(() => {
    if (patientQus?.questions_to_ask) {
      setActiveQuestions(patientQus.questions_to_ask);
      setCompletedQuestions([]); // Reset done list if new data arrives
    }
  }, [patientQus]);

  // 3. Handle Question Completion using the question text as the key
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
        mt: 2
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontFamily: "Comfortaa", display: "flex", alignItems: "center", gap: 1.5, fontSize: 18 }}
        >
          <MessageSquare size={22} color="#2563eb" />
          Required Follow-up Questions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`${activeQuestions.length} Pending`} 
            sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontFamily: "Comfortaa" }} 
          />
          {completedQuestions.length > 0 && (
            <Chip 
              label={`${completedQuestions.length} Done`} 
              sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontFamily: "Comfortaa" }} 
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Questions List */}
      <Stack 
        spacing={2} 
        sx={{ 
          maxHeight: "48vh", 
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
              key={item.question} // Use question text as key if no ID exists
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #F3F4F6",
                bgcolor: "#F9FAFB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#fff",
                  borderColor: "#2563eb",
                  boxShadow: "0px 4px 12px rgba(37,99,235,0.08)"
                }
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Typography sx={{ color: "#9CA3AF", fontWeight: 700, fontFamily: "Philosopher", mt: 0.2 }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontFamily: "Philosopher", fontSize: 16, fontWeight: 500, color: "#374151" }}>
                  {item.question}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<HelpCircle size={14} />}
                  onClick={() => handleOpenReason(item)}
                  sx={{
                    textTransform: "none",
                    fontFamily: "Comfortaa",
                    fontWeight: 600,
                    color: "#64748b",
                    "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" }
                  }}
                >
                  Why?
                </Button>
                
                <Tooltip title="Mark as Asked">
                  <IconButton 
                    onClick={() => handleMarkAsDone(item.question)}
                    sx={{ 
                      color: "#9CA3AF", 
                      "&:hover": { color: "#16a34a", bgcolor: "#f0fdf4" } 
                    }}
                  >
                    <CheckCircle size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ fontFamily: "Philosopher", color: "#64748b" }}>
              {patientQus?.questions_to_ask ? "All follow-up questions have been addressed." : "No follow-up questions required yet."}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Reasoning Dialog remains similar but with safer chaining */}
      <Dialog 
        open={modalOpen} 
        onClose={handleClose}
        PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: "450px" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "Comfortaa", fontWeight: 700 }}>
          <Info size={20} color="#2563eb" />
          Clinical Reasoning
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: "#F0F7FF", p: 2, borderRadius: 2, mb: 2 }}>
            <Typography sx={{ fontFamily: "Philosopher", fontSize: 15, fontStyle: "italic", color: "#374151" }}>
              "{selectedQuestion?.question}"
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "Philosopher", color: "#4B5563", lineHeight: 1.6 }}>
            {selectedQuestion?.reason || "Reasoning not provided for this question."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleClose}
            sx={{ borderRadius: 2, bgcolor: "#2563eb", fontFamily: "Comfortaa", textTransform: "none", py: 1 }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const Chip = ({ label, sx }) => (
  <Box sx={{ ...sx, px: 1.5, py: 0.5, borderRadius: 5, fontSize: '0.75rem' }}>
    {label}
  </Box>
);

export default CurrentComplaint;