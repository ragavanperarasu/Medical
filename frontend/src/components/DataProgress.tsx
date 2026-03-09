import React, { useState } from 'react';
import { 
  Card, Typography, Stack, Accordion, AccordionSummary, 
  AccordionDetails, Box, LinearProgress, IconButton 
} from "@mui/material";
import { ChevronDown, CheckCircle, XCircle, Activity, Clipboard } from "react-feather";

// 1. Separate JSON Data Structure
const INITIAL_SECTIONS = [
  {
    id: "chief_complaint",
    name: "Chief Complaint",
    statements: [
      { id: "c1", question: "Location of Pain (knee, back, shoulder, etc.)", status: false },
      { id: "c2", question: "Duration of Pain", status: false },
      { id: "c3", question: "Pain Severity (1-10 scale)", status: false },
      { id: "c4", question: "Type of Pain (sharp, dull, burning)", status: false }
    ]
  },
  {
    id: "injury_history",
    name: "Injury History",
    statements: [
      { id: "i1", question: "Recent Fall or Accident", status: false },
      { id: "i2", question: "Sports Injury", status: false },
      { id: "i3", question: "Previous Fracture", status: false }
    ]
  },
  {
    id: "movement_function",
    name: "Movement & Function",
    statements: [
      { id: "mf1", question: "Difficulty Walking", status: false },
      { id: "mf2", question: "Difficulty Standing", status: false },
      { id: "mf3", question: "Joint Stiffness", status: false },
      { id: "mf4", question: "Limited Range of Motion", status: false }
    ]
  },
  {
    id: "swelling_symptoms",
    name: "Swelling & Physical Symptoms",
    statements: [
      { id: "s1", question: "Joint Swelling", status: false },
      { id: "s2", question: "Redness Around Joint", status: false },
      { id: "s3", question: "Warmth Around Joint", status: false }
    ]
  },
  {
    id: "medical_history",
    name: "Orthopedic Medical History",
    statements: [
      { id: "mh1", question: "Previous Bone Surgery", status: false },
      { id: "mh2", question: "Arthritis History", status: false },
      { id: "mh3", question: "Osteoporosis", status: false }
    ]
  },
  {
    id: "lifestyle_activity",
    name: "Lifestyle & Physical Activity",
    statements: [
      { id: "l1", question: "Daily Physical Activity", status: false },
      { id: "l2", question: "Heavy Lifting at Work", status: false },
      { id: "l3", question: "Sports Participation", status: false }
    ]
  },
  {
    id: "medications",
    name: "Medications",
    statements: [
      { id: "m1", question: "Pain Relief Medications", status: false },
      { id: "m2", question: "Anti-inflammatory Drugs", status: false },
      { id: "m3", question: "Calcium or Bone Supplements", status: false }
    ]
  }
];

const DataProgress = () => {
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  // 2. Logic to calculate percentage for a specific section
  const calculateSectionProgress = (statements) => {
    if (statements.length === 0) return 0;
    const completed = statements.filter(s => s.status).length;
    return Math.round((completed / statements.length) * 100);
  };

  // 3. Logic to toggle status by ID
  const toggleStatement = (sectionId, statementId) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            statements: section.statements.map(s => 
              s.id === statementId ? { ...s, status: !s.status } : s
            )
          };
        }
        return section;
      })
    );
  };

  return (
    <Card sx={{px:3,pb:3, borderRadius: 4, border: '1px solid #C0C0C0', boxShadow: 'none', bgcolor: 'white', minHeight: '88vh', overflowY:'auto', maxHeight:'50vh', pr: 1,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "10px", mt:10, mb:5 },
          "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" },}}>
      <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontFamily: "Comfortaa",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#000000",
                position: "sticky",
                top: 0,
                zIndex: 1,
                bgcolor: "white",
                py: 2
              }}
            >
              <Clipboard size={22} color="#2563eb" />
              Health Status
            </Typography>

      <Stack spacing={2}>
        {/* 4. Map through the JSON Sections */}
        {sections.map((section) => {
          const progress = calculateSectionProgress(section.statements);
          
          return (
            <Accordion 
              key={section.id}
              elevation={0} 
              disableGutters 
              
              sx={{ 
                '&:before': { display: 'none' },
                border: '1px solid #F0F2F5',
                borderRadius: '12px !important',
                overflow: 'hidden'
              }}
            >
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Box sx={{ width: '100%', mr: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="700" color="#334155" sx={{ fontFamily: 'Philosopher' }}>
                      {section.name}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color={progress === 100 ? "success.main" : "primary"} fontFamily={'Philosopher'}>
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    color={progress === 100 ? "success" : "primary"}
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9' }} 
                  />
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ bgcolor: '#F8FAFC', px: 2, pb: 2 }}>
                <Stack spacing={0.5}>
                  {/* 5. Map through Statements in each section */}
                  {section.statements.map((stmt) => (
                    <Box 
                      key={stmt.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        transition: '0.2s',
                        '&:hover': { bgcolor: '#F1F5F9' }
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'Philosopher' }}>
                        {stmt.question}
                      </Typography>
                      
                      <IconButton 
                        onClick={() => toggleStatement(section.id, stmt.id)} 
                        size="small"
                        sx={{ transition: 'transform 0.1s active' }}
                      >
                        {stmt.status ? (
                          <CheckCircle size={18} color="#2E7D32" />
                        ) : (
                          <XCircle size={18} color="#D32F2F" />
                        )}
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Card>
  );
};

export default DataProgress;