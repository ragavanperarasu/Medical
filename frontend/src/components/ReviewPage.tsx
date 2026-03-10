import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Tabs, Tab, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
// Import Feather Icons
import { FileText, HelpCircle, MessageSquare, Clipboard } from "react-feather";

import ReviewHeaderBar from "./ReviewHeaderBar";
import SummaryTab from "./SummaryTab";
import QuestionsTab from "./QuestionsTab";
import TranscriptTab from "./TranscriptTab";

const ReviewPage = () => {
  const [patientData, setPatientData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setPatientData(location.state);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 2 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            bgcolor: "#f5f7fb",
            pt: 1,
            pb: 2,
          }}
        >
          <ReviewHeaderBar patientData={patientData} />

          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              px: 3, 
              borderRadius: '12px', 
              border: '1px solid #C0C0C0', 
              boxShadow: 'none' 
            }}
          >


            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="review page tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: '64px',
                  fontFamily: 'Comfortaa',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }
              }}
            >
              <Tab 
                icon={<FileText size={18}  />} 
                iconPosition="start" 
                label="Summary" 
              />
              <Tab 
                icon={<HelpCircle size={18} />} 
                iconPosition="start" 
                label="Questions" 
              />
              <Tab 
                icon={<MessageSquare size={18}  />} 
                iconPosition="start" 
                label="Transcript" 
              />
            </Tabs>
          </Paper>
        </Box>

        {/* Tab Content Area */}
        <Grid container spacing={1} sx={{ mt: 0 }}>
          <Grid size={12}>
            {activeTab === 0 && <SummaryTab data={patientData} />}
            {activeTab === 1 && <QuestionsTab data={patientData} />}
            {activeTab === 2 && <TranscriptTab data={patientData} />}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReviewPage;