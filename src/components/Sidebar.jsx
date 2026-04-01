import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, FileText, Settings, 
  Bell, LogOut, BrainCircuit, LayoutGrid, Cpu, Menu, X
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/patient-dashboard' },
    ...(role === 'admin' || role === 'healthcare' ? [{ name: 'Patient Portal', icon: <LayoutGrid size={20} />, path: '/healthcare-dashboard' }] : []),
    { name: 'EMG Signals', icon: <Activity size={20} />, path: '/emg-data' },
    { name: 'Hardware', icon: <Cpu size={20} />, path: '/hardware' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/logs' },
    { name: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '60px',
        background: 'rgba(7,11,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1001,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }} className="mobile-topbar">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00F0FF, #0075FF)',
            padding: '6px', borderRadius: '8px', display: 'flex'
          }}>
            <BrainCircuit size={20} color="#000" />
          </div>
          <h2 style={{ fontSize: '1rem', color: '#fff' }}>
            Bionic<span style={{
              background: 'linear-gradient(90deg, #00F0FF, #0075FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AI</span>
          </h2>
        </div>

        {/* Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)} style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>
      </div>

      {/* ── Dark Overlay ── */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1002,
        }} />
      )}

      {/* ── Sidebar Panel ── */}
      <aside style={{
        width: '260px',
        height: '100vh',
        background: 'rgba(16,24,44,0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 1003,
        // Mobile styles via inline
        transition: 'transform 0.3s ease',
      }} className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00F0FF, #0075FF)',
            padding: '8px', borderRadius: '12px', display: 'flex'
          }}>
            <BrainCircuit size={24} color="#000" />
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>
            Bionic<span style={{
              background: 'linear-gradient(90deg, #00F0FF, #0075FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AI</span>
          </h2>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {navItems.map((item) => (
              <li key={item.name} style={{ marginBottom: '8px' }}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: isActive ? '#00F0FF' : '#94A3B8',
                    background: isActive ? 'rgba(0,240,255,0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  })}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '12px 16px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#94A3B8',
          cursor: 'pointer',
          fontSize: '0.95rem',
          marginTop: 'auto',
        }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;