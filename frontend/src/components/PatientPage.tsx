import {useState, useEffect} from 'react'
import { Box, Container, Grid} from "@mui/material";
import { useLocation } from "react-router-dom";



import PreviousHealthData from "./PreviousHealthData";
import CurrentComplaint from "./CurrentComplaint";
import PatientStatus from './PatientStatus';
import DataProgress from "./DataProgress";
import HeaderBar from './HeaderBar'

const PatientPage = () => {
const [nurseAndPatientTranscript, setNurseAndPatientTranscript] = useState([]);
const [headerData2, setHeaderData2] = useState([]);
const [patientHelthData, setPatientHelthData] = useState();
const [patientData, setPatientData] = useState({});
const location = useLocation();

useEffect(() => {
const data = location.state;
setPatientData(data);
}, []);

 useEffect(() => {
  const handleBeforeUnload = (event) => {
    const message = "Your conversation may be lost. Are you sure?";
    event.preventDefault();
    event.returnValue = message;
    return message;
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 2}}>
      <Container maxWidth="xl">
        <Box sx={{position:'sticky', top:15, zIndex:100, pb:2, bgcolor:'#f5f7fb'}}>
        <HeaderBar
        patientData={patientData}
        patientHelthData={patientHelthData}
  setNurseAndPatientTranscript={setNurseAndPatientTranscript}
  setHeaderData2={setHeaderData2}

/></Box>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <PreviousHealthData setPatientHelthData={setPatientHelthData} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PatientStatus patientData={patientData} nurseAndPatientTranscript={nurseAndPatientTranscript} />
            <CurrentComplaint patientQus={headerData2} />
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
