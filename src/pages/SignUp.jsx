import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, ShieldCheck, BrainCircuit, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const SignUp = () => {
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/register/', {
        username,
        email,
        password,
        role,
      });

      alert('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.username?.[0] || 'Failed to create account. Username might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '48px' }}>
        <Link to="/login" className="flex-center mb-4 text-muted" style={{ textDecoration: 'none', justifyContent: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="flex-center mb-4" style={{ gap: '12px' }}>
          <BrainCircuit size={32} className="text-gradient" />
          <h2 style={{ fontSize: '1.8rem' }}>Join Bionic<span className="text-gradient">AI</span></h2>
        </div>

        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Create your account to start your bionic journey.
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

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-glass" 
                placeholder="Choose a username" 
                style={{ paddingLeft: '48px' }} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="input-glass" 
                placeholder="email@example.com" 
                style={{ paddingLeft: '48px' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          <div className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="input-glass" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'block' }}>Primary Role</label>
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
            {loading ? 'Creating Account...' : 'Sign Up Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
