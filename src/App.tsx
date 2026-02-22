import React from "react";
import { Box, Container, Grid } from "@mui/material";
import HeaderBar from "./components/HeaderBar";
import PreviousHealthData from "./components/PreviousHealthData";
import CurrentComplaint from "./components/CurrentComplaint";
import DataProgress from "./components/DataProgress";

function App() {
  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 2}}>
      <Container maxWidth="xl">
        <HeaderBar />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <PreviousHealthData />
          </Grid>

          <Grid item xs={12} md={6}>
            <CurrentComplaint />
          </Grid>

          <Grid item xs={12} md={3}>
            <DataProgress />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;