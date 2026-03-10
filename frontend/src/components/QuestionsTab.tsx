import { Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const QuestionsTab = ({ data }) => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>Follow-up Questions</Typography>
    <List>
      {data?.questions?.map((q, index) => (
        <ListItem key={index} divider>
          <ListItemText primary={q} />
        </ListItem>
      )) || "No questions found."}
    </List>
  </Paper>
);

export default QuestionsTab;