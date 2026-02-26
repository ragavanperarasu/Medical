import {useState, useEffect} from 'react'
import { Box, Container, Grid} from "@mui/material";
import { useLocation } from "react-router-dom";



import PreviousHealthData from "./PreviousHealthData";
import CurrentComplaint from "./CurrentComplaint";
import PatientStatus from './PatientStatus';
import DataProgress from "./DataProgress";
import HeaderBar from './HeaderBar'

const PatientPage = () => {
const [headerData, setHeaderData] = useState("Start you conversation by clicking the start recording button.");
const [headerData2, setHeaderData2] = useState("Start you conversation by clicking the start recording button.");
const [patientData, setPatientData] = useState({});
const location = useLocation();

useEffect(() => {
const data = location.state;
setPatientData(data);
}, []);

  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 2}}>
      <Container maxWidth="xl">
        <HeaderBar
        patientData={patientData}
  setHeaderData={setHeaderData}
  setHeaderData2={setHeaderData2}
/>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <PreviousHealthData />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PatientStatus patientData={patientData} />
          </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
                <DataProgress />
                </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PatientPage
