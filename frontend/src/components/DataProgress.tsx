import React, { useState } from 'react';
import { 
  Card, Typography, Stack, Accordion, AccordionSummary, 
  AccordionDetails, Box, LinearProgress, IconButton 
} from "@mui/material";
import { ChevronDown, CheckCircle, XCircle, Activity, Clipboard } from "react-feather";

// 1. Separate JSON Data Structure
const INITIAL_SECTIONS = [
  {
    id: "med_hist",
    name: "Medical History",
    statements: [
      { id: "h1", question: "Previous Surgeries", status: true },
      { id: "h2", question: "Chronic Conditions", status: false },
      { id: "h3", question: "Family History", status: true },
    ]
  },
  {
    id: "meds",
    name: "Medications & Supplements",
    statements: [
      { id: "m1", question: "Daily Vitamins", status: false },
      { id: "m2", question: "Herbal Remedies", status: false },
      { id: "m3", question: "Prescription Meds", status: true },
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
    <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #C0C0C0', boxShadow: 'none', bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Clipboard size={20} color="#007FFF" />
        <Typography variant="h6" fontWeight="800" sx={{ color: '#1A2027', fontFamily: 'Comfortaa' }}>
          Data Collection Progress
        </Typography>
      </Box>

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