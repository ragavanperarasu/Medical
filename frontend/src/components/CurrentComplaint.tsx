import React, { useState } from "react";
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

const initialQuestions = [
  { id: 1, question: "Have you experienced any chest pain or shortness of breath today?", reason: "To rule out immediate cardiac distress or pulmonary embolism symptoms." },
  { id: 2, question: "Is the pain localized to one spot or does it radiate elsewhere?", reason: "Radiation patterns can distinguish between musculoskeletal and referred organ pain." },
  { id: 3, question: "When did the symptoms first start, and was the onset sudden?", reason: "Sudden onset often points to acute trauma; gradual suggests inflammatory issues." },
  { id: 4, question: "Are you currently taking any blood thinners or anticoagulants?", reason: "Crucial for determining surgical risk or physical exam safety." },
  { id: 5, question: "Does anything specific make the pain better or worse?", reason: "Helps identify mechanical vs systemic triggers." },
  { id: 6, question: "Have you noticed any swelling or redness in your lower extremities?", reason: "Screens for Deep Vein Thrombosis (DVT)." },
  { id: 7, question: "Have you had a fever or chills in the last 24 hours?", reason: "Identifies systemic infection or inflammatory response." },
  { id: 8, question: "Rate your pain on a scale of 1-10 at this exact moment.", reason: "Establishes a clinical baseline for pain management." },
  { id: 9, question: "Have you had any previous surgeries related to this specific area?", reason: "Surgical history alters physical presentation and diagnostic approach." },
  { id: 10, question: "Are you experiencing any numbness or tingling?", reason: "Assesses neurological involvement or nerve compression." },
];

const CurrentComplaint = () => {
  // State Management
  const [activeQuestions, setActiveQuestions] = useState(initialQuestions);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle Question Completion
  const handleMarkAsDone = (id) => {
    const questionToMove = activeQuestions.find((q) => q.id === id);
    if (questionToMove) {
      setCompletedQuestions((prev) => [...prev, questionToMove]);
      setActiveQuestions((prev) => prev.filter((q) => q.id !== id));
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
        minHeight: "70vh",
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
          sx={{ fontWeight: 700, fontFamily: "Comfortaa", display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <MessageSquare size={22} color="#2563eb" />
          Required Follow-up Questions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`${activeQuestions.length} Pending`} 
            size="small" 
            sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontFamily: "Comfortaa" }} 
          />
          {completedQuestions.length > 0 && (
            <Chip 
              label={`${completedQuestions.length} Done`} 
              size="small" 
              sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontFamily: "Comfortaa" }} 
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Questions List - Scrollable */}
      <Stack 
        spacing={2} 
        sx={{ 
          maxHeight: "520px", 
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
              key={item.id}
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
                    onClick={() => handleMarkAsDone(item.id)}
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
              All follow-up questions have been addressed.
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Clinical Reasoning Dialog */}
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
            <Typography variant="body2" sx={{ color: "#1E40AF", fontWeight: 600, mb: 0.5, fontFamily: "Philosopher" }}>
              Selected Question:
            </Typography>
            <Typography sx={{ fontFamily: "Philosopher", fontSize: 15, fontStyle: "italic", color: "#374151" }}>
              "{selectedQuestion?.question}"
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "Philosopher", color: "#4B5563", lineHeight: 1.6 }}>
            {selectedQuestion?.reason}
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

// Helper component for the header chips
const Chip = ({ label, size, sx }) => (
  <Box sx={{ ...sx, px: 1.5, py: 0.5, borderRadius: 5, fontSize: '0.75rem' }}>
    {label}
  </Box>
);

export default CurrentComplaint;