
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
          <LocalPharmacyIcon color="success" sx={{fontSize:18}} />
          <Box>
            <Typography fontWeight="bold" sx={{fontFamily:'Philosopher', fontSize: 15}}>{name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{fontFamily:'Philosopher', fontSize: 14}}>
              Current
            </Typography>
          </Box>
        </Stack>

        <Chip label="Normal" color="success" size="small" sx={{fontFamily:"Philosopher"}}/>
      </Stack>

      <Typography mt={1} sx={{fontFamily:"Philosopher", fontSize: 16}}>
        {dose}
      </Typography>
    </Card>
  );
};

export default MedicationCard;