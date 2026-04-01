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

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glass)',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }} className="mobile-topbar">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '6px', borderRadius: '8px', display: 'flex'
          }}>
            <BrainCircuit size={20} color="#000" />
          </div>
          <h2 style={{ fontSize: '1rem' }}>Bionic<span className="text-gradient">AI</span></h2>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className="glass-panel sidebar" style={{
        width: '260px',
        height: '100vh',
        borderRadius: '0',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div className="flex-center mb-4" style={{ gap: '12px', justifyContent: 'flex-start' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '8px', borderRadius: '12px', display: 'flex'
          }}>
            <BrainCircuit size={24} color="#000" />
          </div>
          <h2 style={{ fontSize: '1.2rem' }}>Bionic<span className="text-gradient">AI</span></h2>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, marginTop: '32px' }}>
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => (
              <li key={item.name} style={{ marginBottom: '8px' }}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                  })}
                >
                  {item.icon}
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <button
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'flex-start', marginTop: 'auto' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;