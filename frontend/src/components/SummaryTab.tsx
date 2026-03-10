import { Typography, Paper, Box } from "@mui/material";

const SummaryTab = ({ data }) => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>Case Summary</Typography>
    <Typography variant="body1" color="text.secondary">
      {data?.summary || "No summary available for this patient."}
    </Typography>
  </Paper>
);

export default SummaryTab;