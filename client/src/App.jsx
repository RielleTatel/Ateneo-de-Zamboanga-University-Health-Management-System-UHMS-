import React, { useState } from 'react';
import { patientsData } from './data/patientData';
import Sidebar from './Components/Layout/Sidebar';
import RecordsPage from './Components/Pages/RecordsPage';
import ProfilePage from './Components/Pages/ProfilePage';
import ClinicalRecordsPage from './Components/Pages/ClinicalRecordsPage';
import ImmunizationPage from './Components/Pages/ImmunizationPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('records');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const currentPatientDetails = selectedPatient ? patientsData[selectedPatient.id] : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'records' && (
        <RecordsPage 
          setCurrentPage={setCurrentPage} 
          setSelectedPatient={setSelectedPatient} 
        />
      )}
      
      {currentPage === 'profile' && currentPatientDetails && (
        <ProfilePage 
          setCurrentPage={setCurrentPage} 
          patientDetails={currentPatientDetails} 
        />
      )}
      
      {currentPage === 'clinical-records' && (
      <ClinicalRecordsPage 
         setCurrentPage={setCurrentPage}
          patientDetails={currentPatientDetails}
        />
      )}
      
      {currentPage === 'immunization' && currentPatientDetails && (
        <ImmunizationPage 
          setCurrentPage={setCurrentPage} 
          patientDetails={currentPatientDetails} 
        />
      )}
    </div>
  );
};

export default App;