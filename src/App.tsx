import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

import Contact from "./pages/public/Contact";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";

import DoctorLayout from "./pages/doctor/Layout";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorSession from "./pages/doctor/Session";
import DoctorReports from "./pages/doctor/Reports";
import DoctorCalendar from "./pages/doctor/Calendar";
import DoctorTeleRehab from "./pages/doctor/TeleRehab";
import DoctorSettings from "./pages/doctor/Settings";

import PatientLayout from "./pages/patient/Layout";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientSessions from "./pages/patient/Sessions";
import PatientLiveSession from "./pages/patient/LiveSession";
import PatientReports from "./pages/patient/Reports";
import PatientTeleRehab from "./pages/patient/TeleRehab";
import PatientGames from "./pages/patient/Games";
import PatientProfile from "./pages/patient/Profile";

import PhysioLayout from "./pages/physio/Layout";
import PhysioDashboard from "./pages/physio/Dashboard";

import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

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

          {/* Physio Routes */}
          <Route path="/physio" element={<PhysioLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PhysioDashboard />} />
            <Route path="patients" element={<PhysioDashboard />} />
            <Route path="session" element={<PhysioDashboard />} />
            <Route path="reports" element={<PhysioDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="audit" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
