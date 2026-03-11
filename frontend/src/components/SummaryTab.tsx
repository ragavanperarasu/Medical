import React, { useState } from "react";
import {
  Typography, Paper, Box, Grid, Stack, Divider, Button, 
  IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import {
  Edit3, Clipboard, ChevronDown, ArrowRight, HelpCircle, AlertCircle, CheckCircle
} from "react-feather";

const INITIAL_SECTIONS = [
  {
    id: "chief_complaint",
    name: "Chief Complaint",
    statements: [
      { id: "c1", question: "Location of Pain (knee, back, shoulder, etc.)", answer: "Right Knee", status: true },
      { id: "c2", question: "Duration of Pain", answer: "3 Weeks", status: true },
      { id: "c3", question: "Pain Severity (1-10 scale)", answer: "7", status: true },
      { id: "c4", question: "Type of Pain (sharp, dull, burning)", answer: "Sharp when climbing stairs", status: true }
    ]
  },
  {
    id: "injury_history",
    name: "Injury History",
    statements: [
      { id: "i1", question: "Recent Fall or Accident", answer: "None", status: true },
      { id: "i2", question: "Sports Injury", answer: "Not provided", status: false },
      { id: "i3", question: "Previous Fracture", answer: "None", status: true }
    ]
  },
  {
    id: "movement_function",
    name: "Movement & Function",
    statements: [
      { id: "mf1", question: "Difficulty Walking", answer: "Mild limp", status: true },
      { id: "mf2", question: "Difficulty Standing", answer: "Pain after 10 mins", status: true },
      { id: "mf3", question: "Joint Stiffness", answer: "Worse in morning", status: true },
      { id: "mf4", question: "Limited Range of Motion", answer: "Cannot fully flex", status: true }
    ]
  },
  {
    id: "swelling_symptoms",
    name: "Swelling & Physical Symptoms",
    statements: [
      { id: "s1", question: "Joint Swelling", answer: "Visible swelling", status: true },
      { id: "s2", question: "Redness Around Joint", answer: "None", status: true },
      { id: "s3", question: "Warmth Around Joint", answer: "Slightly warm", status: true }
    ]
  },
  {
    id: "medical_history",
    name: "Orthopedic Medical History",
    statements: [
      { id: "mh1", question: "Previous Bone Surgery", answer: "None", status: true },
      { id: "mh2", question: "Arthritis History", answer: "Family history only", status: true },
      { id: "mh3", question: "Osteoporosis", answer: "None", status: true }
    ]
  },
  {
    id: "lifestyle_activity",
    name: "Lifestyle & Physical Activity",
    statements: [
      { id: "l1", question: "Daily Physical Activity", answer: "Sedentary office job", status: true },
      { id: "l2", question: "Heavy Lifting at Work", answer: "No", status: true },
      { id: "l3", question: "Sports Participation", answer: "Weekend cycling", status: true }
    ]
  }
];

const SummaryTab = () => {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [summaryText, setSummaryText] = useState("Patient presents with right knee pain localized to the medial aspect, onset 3 weeks ago. Pain severity rated 7/10.");
  const [editModal, setEditModal] = useState({ open: false, sectionId: null, stmtId: null, value: "", isSummary: false });

  const cardStyle = { p: 3, borderRadius: "12px", border: "1px solid #e0e6ed", mb: 2, boxShadow: "none" };
  const sectionTitleStyle = { fontWeight: "bold", color: "#4a5568", fontFamily: "Comfortaa", fontSize: 16};

  const handleOpenEdit = (sectionId, stmtId, currentValue, isSummary = false) => {
    setEditModal({ open: true, sectionId, stmtId, value: currentValue, isSummary });
  };

  const handleSave = () => {
    if (editModal.isSummary) {
      setSummaryText(editModal.value);
    } else {
      const updatedSections = sections.map(sec => {
        if (sec.id === editModal.sectionId) {
          return {
            ...sec,
            statements: sec.statements.map(st => 
              st.id === editModal.stmtId ? { ...st, answer: editModal.value, status: editModal.value.length > 0 } : st
            )
          };
        }
        return sec;
      });
      setSections(updatedSections);
    }
    setEditModal({ ...editModal, open: false });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 3, bgcolor: "#fff", borderRadius: "12px", border: "1px solid #C0C0C0" }}>
      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Clipboard size={22} color="#4a5568" />
        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "Comfortaa" }}>Patient Intake Summary</Typography>
      </Stack>

      {/* Main Complaint & Summary */}
      <Paper sx={cardStyle}>
        <Typography sx={sectionTitleStyle}>Current Complaint</Typography>
        <Typography variant="h6" sx={{ fontFamily:"Philosopher" }}>Knee Pain</Typography>
      </Paper>

      {/* Static Summary Section */}
      <Paper sx={{ ...cardStyle, border: "1px solid #bee3f8", bgcolor: "#f0f9ff", position: 'relative' }}>
        <Typography sx={{ ...sectionTitleStyle, color: "#2b6cb0" }}>Clinical Summary</Typography>
        <Typography variant="body2" sx={{ color: "#2d3748", mt: 1, lineHeight: 1.6, pr: 4, fontFamily: "Philosopher", fontSize: 18 }}>
          {summaryText}
        </Typography>
        <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12 }} onClick={() => handleOpenEdit(null, null, summaryText, true)}>
          <Edit3 size={16} color="#ed6c02" />
        </IconButton>
      </Paper>

      {/* 2-Column Grid for Questions */}
      <Grid container spacing={2}>
        {sections.map((section) => (
          <Grid size={{ xs: 12, md: 4 }} key={section.id}>
            <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown size={20}/>}>
                <Typography sx={{ ...sectionTitleStyle, textTransform: 'None', letterSpacing: 0.5 }}>{section.name}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {section.statements.map((stmt) => (
                  <Box key={stmt.id} sx={{ mb: 2, p: 1.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #edf2f7' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.5} sx={{ width: '90%' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <HelpCircle size={12} color="#94a3b8" />
                          <Typography sx={{ fontSize: 14, color: '#64748b', fontFamily: "Philosopher" }}>{stmt.question}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {stmt.status ? <CheckCircle size={14} color="#10b981" /> : <AlertCircle size={14} color="#ef4444" />}
                          <Typography sx={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 700, fontFamily: "Philosopher" }}>{stmt.answer}</Typography>
                        </Stack>
                      </Stack>
                      <IconButton size="small" onClick={() => handleOpenEdit(section.id, stmt.id, stmt.answer)}>
                        <Edit3 size={14} color="#ed6c02" />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" endIcon={<ArrowRight size={18} />} sx={{ bgcolor: "#10b981", borderRadius: "8px", px: 4, py: 1.2, fontWeight: "bold", textTransform: 'none', "&:hover": { bgcolor: "#059669" } }}>
          Submit to Doctor
        </Button>
      </Box>

      {/* Reusable Edit Dialog */}
      <Dialog open={editModal.open} onClose={() => setEditModal({ ...editModal, open: false })} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: 'Comfortaa', fontWeight: 'bold' }}>Edit Information</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Response"
            value={editModal.value}
            onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditModal({ ...editModal, open: false })} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#ed6c02', '&:hover': { bgcolor: '#c05602' } }}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SummaryTab;