
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails, Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Users } from "react-feather";

const CurrentComplaint = ({ headerData, headerData2 }) => {
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
            Patient Summary
          </Typography>
        </AccordionSummary>

<AccordionDetails>
  <Box
    sx={{
      fontFamily: "Philosopher",
      fontSize: 16,
      bgcolor: "#f8f9fa",
      p: 3,
      borderRadius: 2
    }}
  >
    {/* Domain */}
    <Typography fontWeight={700} mb={1}>
      Department: {headerData2?.domain}
    </Typography>

    {/* Risk Level */}
    <Typography fontWeight={600} mb={1}>
      Risk Level: {headerData2?.risk_level}
    </Typography>

    {/* Clinical Impression */}
    <Typography mb={2}>
      <strong>Clinical Impression:</strong><br />
      {headerData2?.clinical_impression}
    </Typography>

    {/* Follow Up Questions */}
    <Typography fontWeight={600} mb={1}>
      Follow-up Questions:
    </Typography>

    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
      {headerData2?.follow_up_questions?.map((q, index) => (
        <li key={index}>
          <Typography>{q}</Typography>
        </li>
      ))}
    </Box>

    {/* Recommendation */}
    <Typography>
      <strong>Recommendation:</strong><br />
      {headerData2?.recommendation}
    </Typography>
  </Box>
</AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CurrentComplaint;