import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, BrainCircuit, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageWrapper, staggerContainer, staggerItem } from '../utils/animations';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <PageWrapper className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="glass-panel" style={{ maxWidth: '450px', width: '100%', padding: '48px' }}>
        <motion.div variants={staggerItem}>
          <Link to="/login" className="flex-center mb-4 text-muted" style={{ textDecoration: 'none', justifyContent: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </motion.div>

        <motion.div variants={staggerItem} className="flex-center mb-4" style={{ gap: '12px' }}>
          <BrainCircuit size={32} className="text-gradient" />
          <h2 style={{ fontSize: '1.8rem' }}>Reset Password</h2>
        </motion.div>

        {!submitted ? (
          <>
            <motion.p variants={staggerItem} className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </motion.p>

            <motion.form variants={staggerContainer} initial="hidden" animate="visible" onSubmit={handleSubmit}>
              <motion.div variants={staggerItem} className="mb-4">
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
              </motion.div>

              <motion.button variants={staggerItem} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                <Send size={20} />
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </motion.button>
            </motion.form>
          </>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center">
            <motion.div variants={staggerItem} className="mb-4" style={{ padding: '20px', borderRadius: '50%', background: 'rgba(0, 255, 136, 0.1)', display: 'inline-block' }}>
                <Mail size={40} className="text-gradient" />
            </motion.div>
            <motion.h3 variants={staggerItem} className="mb-2">Check your email</motion.h3>
            <motion.p variants={staggerItem} className="text-muted mb-4">
              We've sent password reset instructions to <b>{email}</b>.
            </motion.p>
            <motion.button variants={staggerItem} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ width: '100%' }} onClick={() => setSubmitted(false)}>
              Try another email
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default ForgotPassword;
