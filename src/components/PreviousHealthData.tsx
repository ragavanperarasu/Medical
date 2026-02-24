
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicationCard from "./MedicationCard";
import { Activity } from "react-feather";

const healthSections = [
  {
    title: "Medical History",
    bgColor: "#e9f8ff",
    items: ["Diabetes", "Hypertension"],
    type: "text",
  },
  {
    title: "Medications",
    bgColor: "#F1F8FF",
    items: [
      { name: "Metformin", dose: "500mg Twice daily" },
      { name: "Lisinopril", dose: "10mg Once daily" },
    ],
    type: "medication",
    defaultExpanded: true,
  },
  {
    title: "Allergies",
    bgColor: "#FFF4F4",
    items: ["Peanuts", "Dust"],
    type: "text",
  },
];

const PreviousHealthData = () => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #C0C0C0",
        minHeight: "70vh",
        minWidth: 280,
      }}
    >

<Typography
  variant="h6"
  fontWeight="bold"
  mb={2}
  sx={{
    fontFamily: "Comfortaa",
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "#000000",
  }}
>
  <Activity size={22} color="#2563eb" />
  Health Status
</Typography>

      {healthSections.map((section, index) => (
        <Accordion
  key={index}
  defaultExpanded={section.defaultExpanded || false}
  disableGutters
  sx={{
    mb: 2,
    borderRadius: 2,
    boxShadow: "none",
    bgcolor: "white",
    border: "1px solid #E0E0E0",

    // remove default divider line
    "&:before": { display: "none" },

    // force full rounded corners
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
            <Typography sx={{fontFamily:"Philosopher"}}>
              {section.title} ({section.items.length})
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {section.type === "text" &&
              section.items.map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    bgcolor: "#F0F8FF",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    mb: 1,
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: "Philosopher",
                    //border: "1px solid #E0E0E0"
                  }}
                >
                  {item}
                </Typography>
              ))}

            {section.type === "medication" &&
              section.items.map((med, i) => (
                <MedicationCard key={i} name={med.name} dose={med.dose} />
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Card>
  );
};

export default PreviousHealthData;
