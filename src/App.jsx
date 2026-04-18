import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense, lazy } from 'react';
import Splash from './components/Splash';
import Sidebar from './components/Sidebar';
import RealTimeSignals from './components/RealTimeSignals';

import './index.css';

// Lazy load components for better performance
const Welcome = lazy(() => import('./pages/Welcome'));
const LoginNew = lazy(() => import('./pages/LoginNew'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const HealthcareDashboard = lazy(() => import('./pages/HealthcareDashboard'));
const EMGData = lazy(() => import('./pages/EMGData'));
const LogsReports = lazy(() => import('./pages/LogsReports'));
const Settings = lazy(() => import('./pages/Settings'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Hardware = lazy(() => import('./pages/Hardware'));
const LUTs = lazy(() => import('./pages/LUTs'));
const GesturePrediction = lazy(() => import('./pages/GesturePrediction'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    color: 'var(--text-muted)'
  }}>
    Loading...
  </div>
);

const MainLayout = ({ children }) => {
  const role = localStorage.getItem('role');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar role={role} />
      <main style={{
        flex: 1,
        padding: '32px',
        position: 'relative',
        overflowY: 'auto',
        height: '100vh',
        background: 'var(--bg-main)',
        marginLeft: '260px',
        width: 'calc(100% - 260px)'
      }}>
        {children}
      </main>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  console.log('[App] Current route:', location.pathname);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={
          <Suspense fallback={<LoadingFallback />}>
            <Welcome />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<LoadingFallback />}>
            <LoginNew />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<LoadingFallback />}>
            <SignUp />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </Suspense>
        } />

        <Route path="/patient-dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><PatientDashboard /></MainLayout>
          </Suspense>
        } />
        <Route path="/healthcare-dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><HealthcareDashboard /></MainLayout>
          </Suspense>
        } />

        <Route path="/emg-data" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><EMGData /></MainLayout>
          </Suspense>
        } />
        <Route path="/logs" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><LogsReports /></MainLayout>
          </Suspense>
        } />
        <Route path="/luts" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><LUTs /></MainLayout>
          </Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><Settings /></MainLayout>
          </Suspense>
        } />
        <Route path="/alerts" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><Alerts /></MainLayout>
          </Suspense>
        } />
        <Route path="/hardware" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><Hardware /></MainLayout>
          </Suspense>
        } />
        <Route path="/gesture-prediction" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><GesturePrediction /></MainLayout>
          </Suspense>
        } />
        <Route path="/analytics" element={
          <Suspense fallback={<LoadingFallback />}>
            <MainLayout><Analytics /></MainLayout>
          </Suspense>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <RealTimeSignals position="bottom-right" />
    </Router>
  );
}

export default App;