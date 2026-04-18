import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, ShieldCheck, BrainCircuit, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PageWrapper, staggerContainer, staggerItem, glowButtonParams, floatingAnimation, pulseAnimation, slideInFromLeft, slideInFromRight, fadeInUp } from '../utils/animations';
import { BASE_URL } from '../services/api';

const API = BASE_URL;

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
      await axios.post(`${API}/api/v1/register/`, {
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
    <PageWrapper className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Enhanced Floating Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          opacity: 0.08,
          zIndex: 0
        }}
        animate={{
          y: ['-25px', '25px'],
          rotate: [0, 180, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <BrainCircuit size={90} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '12%',
          opacity: 0.06,
          zIndex: 0
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.06, 0.12, 0.06],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <ShieldCheck size={80} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          opacity: 0.05,
          zIndex: 0
        }}
        animate={{
          x: ['-15px', '15px'],
          y: ['-10px', '10px'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <User size={60} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '60%',
          opacity: 0.04,
          zIndex: 0
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Lock size={50} />
      </motion.div>
      {/* Additional floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: 'linear-gradient(45deg, rgba(0,240,255,0.4), rgba(139, 92, 246, 0.4))',
            borderRadius: '50%',
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
            zIndex: 0
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="glass-panel" 
        style={{ 
          maxWidth: '480px', 
          width: '100%', 
          padding: '48px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}
        {...pulseAnimation}
        animate={{
          boxShadow: [
            '0 8px 32px rgba(0, 240, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            '0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            '0 8px 32px rgba(0, 240, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          ],
          borderColor: [
            'rgba(0, 240, 255, 0.2)',
            'rgba(139, 92, 246, 0.3)',
            'rgba(0, 240, 255, 0.2)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Floating elements inside the panel */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '8%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)',
            filter: 'blur(8px)',
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(6px)',
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div variants={staggerItem}>
          <Link to="/login" className="flex-center mb-4 text-muted" style={{ textDecoration: 'none', justifyContent: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </motion.div>

        <motion.div variants={staggerItem} className="flex-center mb-4" style={{ gap: '12px' }}>
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              filter: [
                'drop-shadow(0 0 0px rgba(0,240,255,0))',
                'drop-shadow(0 0 8px rgba(0,240,255,0.5))',
                'drop-shadow(0 0 0px rgba(0,240,255,0))'
              ]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.2, rotate: 45 }}
          >
            <BrainCircuit size={36} className="text-gradient" />
          </motion.div>
          <motion.h2 
            style={{ 
              fontSize: '1.6rem', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              textShadow: [
                '0 0 0px rgba(0,240,255,0)',
                '0 0 12px rgba(0,240,255,0.4)',
                '0 0 0px rgba(0,240,255,0)'
              ]
            }}
            transition={{ 
              backgroundPosition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              textShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            AI Prosthetic Limb <span className="text-gradient">and Web Control System</span>
          </motion.h2>
        </motion.div>

        <motion.p variants={staggerItem} className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Create your account to start your bionic journey.
        </motion.p>

        {error && (
          <motion.div variants={staggerItem} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-error)', color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignUp}>
          <motion.div variants={staggerItem} className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  color: ['var(--text-muted)', 'var(--accent-primary)', 'var(--text-muted)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
              <motion.input 
                type="text" 
                className="input-glass" 
                placeholder="Choose a username" 
                style={{ paddingLeft: '48px' }} 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'var(--accent-primary)',
                  boxShadow: '0 0 0 3px rgba(0, 240, 255, 0.1)'
                }}
                animate={{
                  borderColor: [
                    'rgba(0, 240, 255, 0.2)',
                    'rgba(139, 92, 246, 0.3)',
                    'rgba(0, 240, 255, 0.2)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  color: ['var(--text-muted)', 'var(--accent-primary)', 'var(--text-muted)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
              <motion.input 
                type="email" 
                className="input-glass" 
                placeholder="email@example.com" 
                style={{ paddingLeft: '48px' }} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'var(--accent-primary)',
                  boxShadow: '0 0 0 3px rgba(0, 240, 255, 0.1)'
                }}
                animate={{
                  borderColor: [
                    'rgba(0, 240, 255, 0.2)',
                    'rgba(139, 92, 246, 0.3)',
                    'rgba(0, 240, 255, 0.2)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  color: ['var(--text-muted)', 'var(--accent-secondary)', 'var(--text-muted)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
              <motion.input 
                type="password" 
                className="input-glass" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'var(--accent-secondary)',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                }}
                animate={{
                  borderColor: [
                    'rgba(139, 92, 246, 0.2)',
                    'rgba(0, 240, 255, 0.3)',
                    'rgba(139, 92, 246, 0.2)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-3">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  color: ['var(--text-muted)', 'var(--accent-secondary)', 'var(--text-muted)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
              <motion.input 
                type="password" 
                className="input-glass" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
                whileFocus={{ 
                  scale: 1.02, 
                  borderColor: 'var(--accent-secondary)',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
                }}
                animate={{
                  borderColor: [
                    'rgba(139, 92, 246, 0.2)',
                    'rgba(0, 240, 255, 0.3)',
                    'rgba(139, 92, 246, 0.2)'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-4">
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'block' }}>Primary Role</label>
            <div className="grid-cols-2" style={{ gap: '12px' }}>
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={() => setRole('patient')} 
                className={role === 'patient' ? 'btn-primary' : 'btn-secondary'} 
                style={{ 
                  padding: '12px',
                  background: role === 'patient' ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.1))' : 'rgba(0, 240, 255, 0.05)',
                  border: role === 'patient' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.2)'
                }}
                animate={role === 'patient' ? { 
                  boxShadow: [
                    '0 0 15px rgba(0, 240, 255, 0.3)',
                    '0 0 25px rgba(0, 240, 255, 0.5)',
                    '0 0 15px rgba(0, 240, 255, 0.3)'
                  ],
                  background: [
                    'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.1))',
                    'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 240, 255, 0.2))',
                    'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.1))'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  animate={role === 'patient' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Patient
                </motion.span>
              </motion.button>
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={() => setRole('healthcare')} 
                className={role === 'healthcare' ? 'btn-primary' : 'btn-secondary'} 
                style={{ 
                  padding: '12px',
                  background: role === 'healthcare' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))' : 'rgba(139, 92, 246, 0.05)',
                  border: role === 'healthcare' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(139, 92, 246, 0.2)'
                }}
                animate={role === 'healthcare' ? { 
                  boxShadow: [
                    '0 0 15px rgba(139, 92, 246, 0.3)',
                    '0 0 25px rgba(139, 92, 246, 0.5)',
                    '0 0 15px rgba(139, 92, 246, 0.3)'
                  ],
                  background: [
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.2))',
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <motion.span
                  animate={role === 'healthcare' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  Doctor
                </motion.span>
              </motion.button>
            </div>
          </motion.div>

          <motion.button 
            variants={staggerItem}
            {...glowButtonParams}
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '16px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem'
            }} 
            disabled={loading}
            whileHover={{
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)',
              scale: 1.02,
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.8), rgba(139, 92, 246, 0.8))'
            }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                '0 0 15px rgba(0, 240, 255, 0.3)',
                '0 0 25px rgba(0, 240, 255, 0.5)',
                '0 0 15px rgba(0, 240, 255, 0.3)'
              ],
              background: [
                'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(139, 92, 246, 0.9))',
                'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShieldCheck size={20} style={{ marginRight: '8px', display: 'inline' }} />
              {loading ? 'Creating Account...' : 'Sign Up Now'}
            </motion.span>
          </motion.button>
        </form>
      </motion.div>
    </PageWrapper>
  );
};

export default SignUp;