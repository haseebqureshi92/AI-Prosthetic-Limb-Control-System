import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, BrainCircuit } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PageWrapper, staggerContainer, staggerItem, glowButtonParams, floatingAnimation, pulseAnimation, slideInFromLeft, slideInFromRight, fadeInUp } from '../utils/animations';
import { BASE_URL } from '../services/api';

const API = BASE_URL;

const Login = () => {
  const [role, setRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('Login component rendered');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Logic
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await axios.post(`${API}/api/v1/register/`, {
          username,
          email,
          password,
          role
        });
        // Auto login after successful registration
        const response = await axios.post(`${API}/api/token/`, { username, password });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        navigate(role === 'healthcare' || role === 'admin' ? '/healthcare-dashboard' : '/patient-dashboard');
      } else {
        // Login Logic
        const response = await axios.post(`${API}/api/token/`, { username, password });
        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', username);

        const profileRes = await axios.get(`${API}/api/v1/profile/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        const actualRole = profileRes.data?.role || 'patient';
        localStorage.setItem('role', actualRole);

        console.log('[Login] authenticated as', actualRole, 'using', API);

        if (actualRole === 'healthcare' || actualRole === 'admin') {
          console.log('Navigating to healthcare dashboard');
          navigate('/healthcare-dashboard');
        } else {
          console.log('Navigating to patient dashboard');
          navigate('/patient-dashboard');
        }
      }
    } catch (err) {
      console.error(isSignUp ? 'Signup error:' : 'Login error:', err);
      const message = err.response?.data?.detail || err.response?.data?.error || err.response?.data?.message || err.message || (isSignUp ? 'Registration failed. Username may already exist.' : 'Invalid credentials. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
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
        <Lock size={60} />
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
        <User size={50} />
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
          position: 'relative', 
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
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
        <motion.div variants={staggerItem} className="flex-center mb-4" style={{ gap: '12px' }} {...floatingAnimation}>
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
            {isSignUp ? 'Create New Account' : 'Welcome Back'}
          </motion.h2>
        </motion.div>

        <motion.p variants={staggerItem} className="text-muted" style={{ textAlign: 'center', marginBottom: '32px' }}>
          {isSignUp ? 'Sign up to access your prosthetic control system' : 'Please sign in to access your control system'}
        </motion.p>

        {/* Toggle Login/Signup */}
        <motion.div variants={staggerItem} className="grid-cols-2 mb-4" style={{ gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsSignUp(false)}
            className={!isSignUp ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              padding: '12px',
              background: !isSignUp ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.1))' : 'rgba(0, 240, 255, 0.05)',
              border: !isSignUp ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.2)'
            }}
            animate={!isSignUp ? { 
              boxShadow: [
                '0 0 15px rgba(0, 240, 255, 0.3)',
                '0 0 25px rgba(0, 240, 255, 0.5)',
                '0 0 15px rgba(0, 240, 255, 0.3)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.span
              animate={!isSignUp ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              Login
            </motion.span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsSignUp(true)}
            className={isSignUp ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              padding: '12px',
              background: isSignUp ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))' : 'rgba(139, 92, 246, 0.05)',
              border: isSignUp ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(139, 92, 246, 0.2)'
            }}
            animate={isSignUp ? { 
              boxShadow: [
                '0 0 15px rgba(139, 92, 246, 0.3)',
                '0 0 25px rgba(139, 92, 246, 0.5)',
                '0 0 15px rgba(139, 92, 246, 0.3)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <motion.span
              animate={isSignUp ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              Sign Up
            </motion.span>
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            variants={staggerItem}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--status-error)',
              color: 'var(--status-error)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <motion.div variants={staggerItem} className="mb-3" {...slideInFromLeft}>
              <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Email</label>
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
                  type="email"
                  className="input-glass"
                  placeholder="Enter your email"
                  style={{ paddingLeft: '48px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={isSignUp}
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
          )}

          <motion.div variants={staggerItem} className="mb-3" {...slideInFromLeft}>
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  color: ['var(--text-muted)', 'var(--accent-primary)', 'var(--text-muted)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
              <motion.input
                type="text"
                className="input-glass"
                placeholder="Enter your username"
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
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-3" {...slideInFromRight}>
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

          {isSignUp && (
            <motion.div variants={staggerItem} className="mb-3" {...slideInFromRight}>
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
                  required={isSignUp}
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
          )}

          <motion.div variants={staggerItem} className="mb-4" {...fadeInUp}>
            <label className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'block' }}>Access Role</label>
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
                  Healthcare
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
              padding: '14px', 
              fontSize: '1rem',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600'
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
              {loading ? (isSignUp ? 'Creating Account...' : 'Authenticating...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </motion.span>
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ duration: loading ? 1 : 0, repeat: loading ? Infinity : 0, ease: 'linear' }}
              style={{ display: 'inline-block', marginLeft: '8px' }}
            >
              <Lock size={18} />
            </motion.div>
          </motion.button>
        </form>

        {isSignUp ? (
          <motion.div variants={staggerItem} className="flex-center mt-4" style={{ gap: '8px' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Already have an account?</span>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Login here
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={staggerItem} className="flex-center mt-3" style={{ gap: '12px' }}>
              <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Forgot Password?
              </Link>
            </motion.div>

            <motion.div variants={staggerItem} className="flex-center mt-4" style={{ gap: '8px' }}>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Don't have an account?</span>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default Login;
