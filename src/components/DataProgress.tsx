
import { Card, Typography, Stack } from "@mui/material";
import ProgressItem from "./ProgressItem";

const DataProgress = () => {
  return (
    <Card sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Data Collection Progress
      </Typography>

      <Stack spacing={3}>
        <ProgressItem
          title="Medical History"
          percent={67}
        />

        <ProgressItem
          title="Medications"
          percent={38}
        />
      </Stack>
    </Card>
  );
};

export default DataProgress;