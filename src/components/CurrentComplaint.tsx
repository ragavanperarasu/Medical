import React from "react";
import { Card, Typography, Box } from "@mui/material";

const CurrentComplaint = () => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Typography variant="h5" fontWeight="bold">
        Current Complaint...
      </Typography>

      <Typography variant="h6" mt={2}>
        Stiff Neck &nbsp;&nbsp; Fever &nbsp;&nbsp; ......
      </Typography>

      <Box
        sx={{
          mt: 5,
          height: 300,
          borderRadius: 3,
          background: "#f9fbff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "gray"
        }}
      >
        Start recording to see assessment questions
      </Box>
    </Card>
  );
};

export default CurrentComplaint;