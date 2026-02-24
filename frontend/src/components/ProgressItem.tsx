
import { Typography, LinearProgress, Box } from "@mui/material";

const ProgressItem = ({ title, percent }) => {
  return (
    <Box>
      <Typography fontWeight="bold">
        {title} &nbsp; {percent}%
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          mt: 1,
          height: 8,
          borderRadius: 5
        }}
      />
    </Box>
  );
};

export default ProgressItem;