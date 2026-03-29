import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Step 1: Obtain JWT tokens
      const response = await axios.post(`${API}/api/token/`, { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', username);

      // Step 2: Fetch actual role from backend (SRS §2.2 — user classes)
      const profileRes = await axios.get(`${API}/api/v1/profile/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const actualRole = profileRes.data.role;  // 'patient' | 'healthcare' | 'admin'
      localStorage.setItem('role', actualRole);

      // Step 3: Navigate based on real DB role
      if (actualRole === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/healthcare-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '48px' }}>
        <div className="flex-center mb-4" style={{ gap: '12px' }}>
          <BrainCircuit size={32} className="text-gradient" />
          <h2 style={{ fontSize: '1.8rem' }}>Bionic<span className="text-gradient">AI</span></h2>
        </div>

        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '32px' }}>
          Please sign in to access your control system.
        </p>

        {error && (
          <div style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--status-error)',
            color: 'var(--status-error)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-glass" 
                placeholder="Enter your username" 
                style={{ paddingLeft: '48px' }} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="input-glass" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'block' }}>Access Role</label>
            <div className="grid-cols-2" style={{ gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => setRole('patient')}
                className={role === 'patient' ? 'btn-primary' : 'btn-secondary'} 
                style={{ padding: '10px' }}
              >
                Patient
              </button>
              <button 
                type="button" 
                onClick={() => setRole('healthcare')}
                className={role === 'healthcare' ? 'btn-primary' : 'btn-secondary'} 
                style={{ padding: '10px' }}
              >
                Doctor
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
            <ShieldCheck size={20} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            No account? <Link to="/signup" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
          </p>
          <div style={{ marginTop: '16px' }}>
            <Link to="/forgot-password" className="text-muted" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
