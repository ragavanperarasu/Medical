import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App





// import {useState} from "react";
// import { Box, Container, Grid} from "@mui/material";

// import HeaderBar from "./components/HeaderBar";
// import PreviousHealthData from "./components/PreviousHealthData";
// import CurrentComplaint from "./components/CurrentComplaint";
// // import DataProgress from "./components/DataProgress";

// function App() {
//   const [headerData, setHeaderData] = useState("Start you conversation by clicking the start recording button.");
//   const [headerData2, setHeaderData2] = useState("Start you conversation by clicking the start recording button.");
//   return (
//     <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 2}}>
//       <Container maxWidth="xl">
//         <HeaderBar
//   setHeaderData={setHeaderData}
//   setHeaderData2={setHeaderData2}
// />

//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           <Grid size={{ xs: 12, md: 3 }}>
//             <PreviousHealthData />
//           </Grid>

//           <Grid size={{ xs: 12, md: 9 }}>
//             <CurrentComplaint headerData={headerData} headerData2={headerData2} />
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export default App;