import React from "react";
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Users } from "react-feather";

const CurrentComplaint = ({ headerData }) => {
  return (
    <Card
      sx={{
        py: 2,
        px: 3,
        borderRadius: 3,
        minHeight: "70vh",
        boxShadow: "none",
        border: "1px solid #C0C0C0"
      }}
    >
      <Typography
        fontWeight="bold"
        sx={{ fontFamily: "Comfortaa", fontSize: 22, mb: 2 , display: "flex", alignItems: "center", gap: 1 }}
      >
        <Users size={22} color="#2563eb"/>
        Conversation Status
      </Typography>

      {/* 1️⃣ Nurse & Patient Conversation */}
      <Accordion
        defaultExpanded
        disableGutters
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          "&:before": { display: "none" },
    "&.MuiAccordion-root": {
      borderRadius: 2
    },

    // when expanded also keep radius
    "&.Mui-expanded": {
      borderRadius: 2
    }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} sx={{fontFamily:"Philosopher"}}>
            Nurse & Patient Conversation
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography
            sx={{
              whiteSpace: "pre-line",
              fontFamily: "Philosopher",
              fontSize: 16,
              bgcolor: "#f8f9fa",
              p: 2,
              borderRadius: 2
            }}
          >
            {headerData}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 2️⃣ Needed Questions / Patient Summary */}
      <Accordion
        disableGutters
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          "&:before": { display: "none" },
              "&.MuiAccordion-root": {
      borderRadius: 2
    },

    // when expanded also keep radius
    "&.Mui-expanded": {
      borderRadius: 2
    }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600} sx={{fontFamily:"Philosopher"}}>
            Not Asked Questions
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography
            sx={{
              fontFamily: "Philosopher",
              fontSize: 16,
              bgcolor: "#f8f9fa",
              p: 2,
              borderRadius: 2
            }}
          >
            Summary will appear here...
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CurrentComplaint;