import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, BrainCircuit, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_URL } from '../services/api';

const API = BASE_URL;

const LoginNew = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters!');
          setLoading(false);
          return;
        }

        await axios.post(`${API}/api/v1/register/`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        setSuccessMessage('✅ Account created successfully! Logging you in...');
        
        const loginResponse = await axios.post(`${API}/api/token/`, {
          username: formData.username,
          password: formData.password
        });

        const { access, refresh } = loginResponse.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('role', formData.role);

        setTimeout(() => {
          navigate(formData.role === 'healthcare' || formData.role === 'admin' ? '/healthcare-dashboard' : '/patient-dashboard');
        }, 1500);
        
      } else {
        const response = await axios.post(`${API}/api/token/`, {
          username: formData.username,
          password: formData.password
        });

        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', formData.username);

        const profileRes = await axios.get(`${API}/api/v1/profile/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        
        const actualRole = profileRes.data?.role || 'patient';
        localStorage.setItem('role', actualRole);

        setSuccessMessage('✅ Login successful! Redirecting...');
        
        setTimeout(() => {
          navigate(actualRole === 'healthcare' || actualRole === 'admin' ? '/healthcare-dashboard' : '/patient-dashboard');
        }, 1000);
      }
    } catch (err) {
      const message = err.response?.data?.detail || 
                     err.response?.data?.error || 
                     err.response?.data?.message ||
                     err.response?.data?.username?.[0] ||
                     err.message || 
                     (isSignUp ? 'Registration failed. Username may already exist.' : 'Invalid username or password.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 25%, #FFFFFF 50%, #F0F9FF 75%, #F8FAFC 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.6
      }} />

      {/* Floating Orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(14, 165, 233, ${0.08 - i * 0.01}) 0%, transparent 70%)`,
            left: `${10 + i * 20}%`,
            top: `${20 + i * 10}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Particle Effects */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'rgba(14, 165, 233, 0.3)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px rgba(14, 165, 233, 0.5)',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '480px',
          width: '100%',
        }}
      >
        {/* Glow Effect Behind Card */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Card */}
        <motion.div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(14, 165, 233, 0.2)',
            borderRadius: '28px',
            padding: '45px',
            boxShadow: '0 25px 80px rgba(14, 165, 233, 0.15), 0 0 40px rgba(14, 165, 233, 0.1)',
          }}
          whileHover={{
            boxShadow: '0 30px 90px rgba(14, 165, 233, 0.2), 0 0 50px rgba(14, 165, 233, 0.15)',
          }}
        >
          {/* Logo & Header */}
          <motion.div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <motion.div
              style={{
                display: 'inline-flex',
                padding: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1))',
                border: '2px solid rgba(14, 165, 233, 0.3)',
                marginBottom: '20px',
                position: 'relative',
              }}
              animate={{
                boxShadow: ['0 0 20px rgba(14, 165, 233, 0.3)', '0 0 40px rgba(14, 165, 233, 0.5)', '0 0 20px rgba(14, 165, 233, 0.3)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <BrainCircuit size={48} style={{ color: '#0EA5E9' }} />
              </motion.div>
              
              {/* Orbiting Sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles
                    size={12}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: '#38BDF8',
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.h1
              style={{
                fontSize: '2rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #0F172A 0%, #0EA5E9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h1>
            
            <motion.p
              style={{
                color: '#64748B',
                fontSize: '1rem',
                lineHeight: '1.5',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isSignUp ? 'Join us to experience AI-powered prosthetics' : 'Sign in to access your control system'}
            </motion.p>
          </motion.div>

          {/* Toggle Tabs */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '30px',
              background: 'rgba(241, 245, 249, 0.5)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={() => setIsSignUp(false)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: !isSignUp ? 'linear-gradient(135deg, #0EA5E9, #38BDF8)' : 'transparent',
                color: !isSignUp ? 'white' : '#64748B',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                boxShadow: !isSignUp ? '0 4px 15px rgba(14, 165, 233, 0.4)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsSignUp(true)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: isSignUp ? 'linear-gradient(135deg, #0EA5E9, #38BDF8)' : 'transparent',
                color: isSignUp ? 'white' : '#64748B',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                boxShadow: isSignUp ? '0 4px 15px rgba(14, 165, 233, 0.4)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#DC2626',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                ❌ {error}
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#059669',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Email Field - Sign Up Only */}
              {isSignUp && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginBottom: '18px', overflow: 'hidden' }}
                >
                  <label style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <motion.input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                      whileFocus={{ scale: 1.02 }}
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        borderRadius: '14px',
                        border: '2px solid rgba(148, 163, 184, 0.2)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        color: '#0F172A',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0EA5E9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username Field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <motion.input
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  placeholder="Enter your username"
                  required
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: '14px',
                    border: '2px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0EA5E9';
                    e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: isSignUp ? '18px' : '24px' }}>
              <label style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 48px',
                    borderRadius: '14px',
                    border: '2px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0EA5E9';
                    e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </div>

            {/* Confirm Password - Sign Up Only */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  key="confirm-password"
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginBottom: '18px', overflow: 'hidden' }}
                >
                  <label style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <motion.input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      required
                      whileFocus={{ scale: 1.02 }}
                      style={{
                        width: '100%',
                        padding: '14px 48px 14px 48px',
                        borderRadius: '14px',
                        border: '2px solid rgba(148, 163, 184, 0.2)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        color: '#0F172A',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.3s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0EA5E9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: '4px',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Selection */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                Access Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <motion.button
                  type="button"
                  onClick={() => updateField('role', 'patient')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: formData.role === 'patient' ? '2px solid #0EA5E9' : '2px solid rgba(148, 163, 184, 0.2)',
                    background: formData.role === 'patient' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                    color: formData.role === 'patient' ? '#0EA5E9' : '#64748B',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {formData.role === 'patient' && <CheckCircle size={16} />}
                  Patient
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => updateField('role', 'healthcare')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: formData.role === 'healthcare' ? '2px solid #0EA5E9' : '2px solid rgba(148, 163, 184, 0.2)',
                    background: formData.role === 'healthcare' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                    color: formData.role === 'healthcare' ? '#0EA5E9' : '#64748B',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {formData.role === 'healthcare' && <CheckCircle size={16} />}
                  Healthcare
                </motion.button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.05rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginBottom: '20px',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(14, 165, 233, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                    }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            {/* Toggle Link */}
            <p style={{
              textAlign: 'center',
              color: '#64748B',
              fontSize: '0.95rem',
              marginBottom: 0,
            }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <motion.button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccessMessage('');
                }}
                whileHover={{ scale: 1.05 }}
                style={{
                  color: '#0EA5E9',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  padding: 0,
                }}
              >
                {isSignUp ? 'Login here' : 'Sign up here'}
              </motion.button>
            </p>
          </form>
        </motion.div>
      </motion.div>

      {/* CSS Animation */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LoginNew;
