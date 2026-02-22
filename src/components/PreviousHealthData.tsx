import React from "react";
import { Card, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicationCard from "./MedicationCard";

const PreviousHealthData = () => {
  return (
    <Card sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Previous Health Data
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Medical History (2)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Diabetes</Typography>
          <Typography>Hypertension</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Medications (2)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MedicationCard
            name="Metformin"
            dose="500mg Twice daily"
          />
          <MedicationCard
            name="Lisinopril"
            dose="10mg Once daily"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Allergies (2)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Peanuts</Typography>
          <Typography>Dust</Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default PreviousHealthData;