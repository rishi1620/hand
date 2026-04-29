import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorLayout from './pages/doctor/Layout';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorSession from './pages/doctor/Session';
import DoctorReports from './pages/doctor/Reports';
import DoctorCalendar from './pages/doctor/Calendar';
import DoctorTeleRehab from './pages/doctor/TeleRehab';
import DoctorSettings from './pages/doctor/Settings';

import PatientLayout from './pages/patient/Layout';
import PatientDashboard from './pages/patient/Dashboard';
import PatientSessions from './pages/patient/Sessions';
import PatientLiveSession from './pages/patient/LiveSession';
import PatientReports from './pages/patient/Reports';
import PatientTeleRehab from './pages/patient/TeleRehab';
import PatientGames from './pages/patient/Games';
import PatientProfile from './pages/patient/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Doctor Routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="session" element={<DoctorSession />} />
          <Route path="reports" element={<DoctorReports />} />
          <Route path="calendar" element={<DoctorCalendar />} />
          <Route path="tele-rehab" element={<DoctorTeleRehab />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>

        {/* Patient Routes */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="sessions" element={<PatientSessions />} />
          <Route path="live" element={<PatientLiveSession />} />
          <Route path="reports" element={<PatientReports />} />
          <Route path="tele-rehab" element={<PatientTeleRehab />} />
          <Route path="games" element={<PatientGames />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

