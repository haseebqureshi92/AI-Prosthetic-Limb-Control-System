import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import HealthcareDashboard from './pages/HealthcareDashboard';
import EMGData from './pages/EMGData';
import LogsReports from './pages/LogsReports';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import Hardware from './pages/Hardware';
import Sidebar from './components/Sidebar';

import './index.css';

const MainLayout = ({ children }) => {
  const role = localStorage.getItem('role');
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} />
      <main style={{
        flex: 1,
        padding: '32px',
        position: 'relative',
        overflowY: 'auto',
        height: '100vh',
        background: 'var(--bg-main)',
        width: '100%'
      }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/patient-dashboard" element={<MainLayout><PatientDashboard /></MainLayout>} />
        <Route path="/healthcare-dashboard" element={<MainLayout><HealthcareDashboard /></MainLayout>} />

        <Route path="/emg-data" element={<MainLayout><EMGData /></MainLayout>} />
        <Route path="/logs" element={<MainLayout><LogsReports /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
        <Route path="/hardware" element={<MainLayout><Hardware /></MainLayout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;