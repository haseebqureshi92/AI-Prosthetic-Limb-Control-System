import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, FileText, Settings, 
  Bell, LogOut, BrainCircuit, LayoutGrid, Cpu, Menu, X, Table,
  Eye, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/patient-dashboard' },
    ...(role === 'admin' || role === 'healthcare' ? [{ name: 'Patient Portal', icon: <LayoutGrid size={20} />, path: '/healthcare-dashboard' }] : []),
    { name: 'EMG Signals', icon: <Activity size={20} />, path: '/emg-data' },
    { name: 'Hardware', icon: <Cpu size={20} />, path: '/hardware' },
    { name: 'AI Prediction', icon: <Eye size={20} />, path: '/gesture-prediction' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/logs' },
    { name: 'LUTs', icon: <Table size={20} />, path: '/luts' },
    { name: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        background: 'var(--bg-panel)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glass)', zIndex: 1001,
        alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
      }} className="mobile-topbar">

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div style={{
            background: 'var(--accent-gradient)',
            padding: '6px', borderRadius: '8px', display: 'flex'
          }}
          animate={{
            background: ['var(--accent-gradient)', 'var(--accent-gradient-alt)', 'var(--accent-gradient)']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrainCircuit size={20} color="#fff" />
          </motion.div>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
            <span>AI Prosthetic Limb</span>
            <span className="text-gradient" style={{
              fontSize: '0.75rem'
            }}>and Web Control System</span>
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'var(--accent-gradient)',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isOpen ? <X size={20} color="#fff" /> : <Menu size={20} color="#fff" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1002,
          }} />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: '260px', height: '100vh', background: 'var(--bg-panel)',
          backdropFilter: 'blur(12px)', borderRight: '1px solid var(--border-glass)',
          display: 'flex', flexDirection: 'column', padding: '32px 20px',
          position: 'fixed', top: 0, left: 0, flexShrink: 0, zIndex: 1003,
          boxShadow: 'var(--shadow-lg)'
        }} className="sidebar">

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <motion.div style={{
            background: 'var(--accent-gradient)',
            padding: '8px', borderRadius: '12px', display: 'flex'
          }}
          animate={{
            rotate: [0, 5, -5, 0],
            background: ['var(--accent-gradient)', 'var(--accent-gradient-alt)', 'var(--accent-gradient)']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrainCircuit size={24} color="#fff" />
          </motion.div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
            <span>AI Prosthetic Limb</span>
            <span className="text-gradient" style={{
              fontSize: '0.85rem'
            }}>and Web Control System</span>
          </h2>
        </motion.div>

        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <motion.ul variants={staggerContainer} initial="hidden" animate="visible" style={{ listStyle: 'none', padding: 0, paddingBottom: '20px' }}>
            {navItems.map((item) => (
              <motion.li variants={staggerItem} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }} key={item.name} style={{ marginBottom: '8px' }}>
                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ borderRadius: '12px' }}
                >
                <NavLink
                  to={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    console.log('[Sidebar] Navigating to:', item.path);
                    window.location.href = item.path;
                  }}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                    borderRadius: '12px', textDecoration: 'none',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    border: isActive ? '1px solid transparent' : '1px solid var(--border-glass)',
                    transition: 'all 0.3s ease', fontSize: '0.95rem', fontWeight: 600,
                    boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                    cursor: 'pointer'
                  })}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginTop: 'auto', paddingTop: '24px', position: 'sticky', bottom: 0, background: 'var(--bg-panel)' }}
        >
          <NavLink
            to="/"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.location.href = '/';
            }}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
              borderRadius: '12px', textDecoration: 'none',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-gradient)' : 'transparent',
              border: isActive ? '1px solid transparent' : '1px solid var(--border-glass)',
              transition: 'all 0.3s ease', fontSize: '0.95rem', fontWeight: 600,
              boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
              cursor: 'pointer'
            })}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </motion.div>
      </motion.aside>
    </>
  );
};

export default Sidebar;