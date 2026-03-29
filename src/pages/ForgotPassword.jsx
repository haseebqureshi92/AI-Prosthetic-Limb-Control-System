import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, BrainCircuit, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mocking the password reset request
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '48px' }}>
        <Link to="/login" className="flex-center mb-4 text-muted" style={{ textDecoration: 'none', justifyContent: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="flex-center mb-4" style={{ gap: '12px' }}>
          <BrainCircuit size={32} className="text-gradient" />
          <h2 style={{ fontSize: '1.8rem' }}>Reset Password</h2>
        </div>

        {!submitted ? (
          <>
            <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                <Send size={20} />
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4" style={{ padding: '20px', borderRadius: '50%', background: 'rgba(0, 255, 136, 0.1)', display: 'inline-block' }}>
                <Mail size={40} className="text-gradient" />
            </div>
            <h3 className="mb-2">Check your email</h3>
            <p className="text-muted mb-4">
              We've sent password reset instructions to <b>{email}</b>.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setSubmitted(false)}>
              Try another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
