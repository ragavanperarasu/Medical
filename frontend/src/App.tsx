import {useState} from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import PatientPage from './components/PatientPage';
import ThreeDViewer from './components/ThreeDViewer';
import ReviewPage from './components/ReviewPage';

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patient/:id" element={<PatientPage />} />  
      <Route path="/viewer/:id" element={<ThreeDViewer />} />
      <Route path="/review" element={<ReviewPage />} />
    </Routes>
  )
}

export default App