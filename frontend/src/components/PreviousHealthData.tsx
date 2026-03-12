import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button, Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Activity, Plus, Edit3, Trash2 } from "react-feather";

const PreviousHealthData = ({setPatientHelthStatus, currentPatientData}) => {
  // 1. Manage health data in state
  const [healthData, setHealthData] = useState(currentPatientData.healthData);

  useEffect(()=>{
    setPatientHelthStatus(healthData)
  },[healthData])

  // 2. State for Dialog
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [editIndex, setEditIndex] = useState(null); // null means adding new
  const [inputValue, setInputValue] = useState("");

  // Handlers
  const handleOpenDialog = (section, index = null) => {
    setCurrentSection(section);
    setEditIndex(index);
    setInputValue(index !== null ? healthData[section][index] : "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInputValue("");
  };

  const handleSave = () => {
    const updatedSection = [...healthData[currentSection]];
    if (editIndex !== null) {
      updatedSection[editIndex] = inputValue;
    } else {
      updatedSection.push(inputValue);
    }

    setHealthData({ ...healthData, [currentSection]: updatedSection });
    handleClose();
  };

  const handleDelete = (section, index) => {
    const updatedSection = healthData[section].filter((_, i) => i !== index);
    setHealthData({ ...healthData, [section]: updatedSection });
  };

  return (
    <Card
      sx={{
        px: 2,
        pb: 2,
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #C0C0C0",
        minHeight: "88vh",
        maxHeight: "88vh",
        minWidth: 280,
        overflowY: "auto",
        pr: 1,
        "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "10px", mt:8, mb:4 },
          "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px"},
      }}
    >
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
        <Activity size={22} color="#2563eb" />
        Health Status
      </Typography>
      <Box sx={{}}>
      {Object.entries(healthData).map(([title, items], index) => (
        <Accordion
          key={title}
          defaultExpanded={index === 0} // Expand first section by default
          disableGutters
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "none",
            bgcolor: "white",
            border: "1px solid #E0E0E0",
            "&:before": { display: "none" },
            "&.MuiAccordion-root": { borderRadius: 2 },
            "&.Mui-expanded": { borderRadius: 2 },

          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", pr: 1 }}>
              <Typography sx={{ fontFamily: "Philosopher", fontWeight: 600 }}>
                {title} ({items.length})
              </Typography>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation(); // prevent accordion from toggling
                  handleOpenDialog(title);
                }}
                sx={{ bgcolor: "#f0f6ff", color: "#2563eb" }}
              >
                <Plus size={16} />
              </IconButton>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={1}>
              {items.map((item, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    bgcolor: "#F8FAFC",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: "1px solid #f1f5f9"
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontFamily: "Philosopher" }}>
                    {item}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => handleOpenDialog(title, i)}>
                      <Edit3 size={14} color="#64748b" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(title, i)}>
                      <Trash2 size={14} color="#ef4444" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Shared Edit/Add Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "Comfortaa" }}>
          {editIndex !== null ? "Edit Item" : `Add to ${currentSection}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Details"
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit" sx={{textTransform:"none", fontFamily:"Philosopher"}}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!inputValue.trim()}
            sx={{ borderRadius: 2, textTransform: "none", fontFamily:"Philosopher"}}
          >
            Save Information
          </Button>
        </DialogActions>
      </Dialog></Box>
    </Card>
  );
};

export default PreviousHealthData;