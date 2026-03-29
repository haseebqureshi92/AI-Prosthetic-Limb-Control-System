import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  FileText, 
  Settings, 
  Bell, 
  LogOut, 
  BrainCircuit,
  LayoutGrid,
  Cpu
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard',    icon: <LayoutDashboard size={20} />, path: '/patient-dashboard' },
    ...(role === 'admin' || role === 'healthcare' ? [{ name: 'Patient Portal', icon: <LayoutGrid size={20} />, path: '/healthcare-dashboard' }] : []),
    { name: 'EMG Signals',  icon: <Activity size={20} />,        path: '/emg-data' },
    { name: 'Hardware',     icon: <Cpu size={20} />,             path: '/hardware' },
    { name: 'Reports',      icon: <FileText size={20} />,        path: '/logs' },
    { name: 'Alerts',       icon: <Bell size={20} />,            path: '/alerts' },
    { name: 'Settings',     icon: <Settings size={20} />,        path: '/settings' },
  ];

  return (
    <aside className="glass-panel" style={{
      width: '280px',
      height: '100vh',
      borderRadius: '0',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 20px',
      position: 'sticky',
      top: 0
    }}>
      <div className="flex-center mb-4" style={{ gap: '12px', justifyContent: 'flex-start' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex'
        }}>
          <BrainCircuit size={24} color="#000" />
        </div>
        <h2 style={{ fontSize: '1.2rem' }}>Bionic<span className="text-gradient">AI</span></h2>
      </div>

      <nav style={{ flex: 1, marginTop: '32px' }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item.name} style={{ marginBottom: '8px' }}>
              <NavLink
                to={item.path}
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
                  border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent'
                })}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button 
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        className="btn-secondary" 
        style={{ width: '100%', justifyContent: 'flex-start', marginTop: 'auto' }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
