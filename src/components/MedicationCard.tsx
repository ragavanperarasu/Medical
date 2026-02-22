import React from "react";
import { Card, Typography, Box, Chip, Stack } from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

const MedicationCard = ({ name, dose }) => {
  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        background: "#f9fbff",
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #e5e7eb"
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalPharmacyIcon color="success" />
          <Box>
            <Typography fontWeight="bold">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Current
            </Typography>
          </Box>
        </Stack>

        <Chip label="normal" color="success" size="small" />
      </Stack>

      <Typography fontWeight="bold" mt={1}>
        {dose}
      </Typography>
    </Card>
  );
};

export default MedicationCard;