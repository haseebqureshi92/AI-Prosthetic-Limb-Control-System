import { useState, useEffect } from 'react';
import { 
  Activity, Battery, Zap, CheckCircle, RefreshCcw, 
  Settings, BrainCircuit, ShieldCheck, Wifi, WifiOff,
  Hand, RotateCcw, ShieldAlert, Cpu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import ProstheticArm3D from '../components/ProstheticArm3D';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, hoverEffect, pulseAnimation, slideInFromLeft, slideInFromRight, fadeInUp } from '../utils/animations';

const PatientDashboard = () => {
  const [stats, setStats]       = useState(null);
  const [emgHistory, setEmgHistory] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sendingCmd, setSendingCmd] = useState('');
  const [settings, setSettings] = useState({ sensitivity: 75, speed: 60 });
  const [updating, setUpdating] = useState(false);
  const username = localStorage.getItem('username') || 'Patient';

  const fetchData = async () => {
    try {
      // Only fetch if hardware is connected
      const hardwareRes = await api.get('hardware/status/');
      if (!hardwareRes.data.connected) {
        // Hardware not connected - show no data
        setStats(null);
        setEmgHistory([]);
        setLoading(false);
        return;
      }
      
      // Hardware is connected - fetch real data
      const statsRes = await api.get('dashboard/');
      setStats(statsRes.data);
      
      try {
        const settingsRes = await api.get('settings/current/');
        setSettings(settingsRes.data);
      } catch (settingsErr) {
        console.log('Settings not available, using defaults');
      }
      
      try {
        const sensorsRes = await api.get('sensors/');
        const readings = sensorsRes.data.slice(0, 12).reverse();
        setEmgHistory(readings.map((r, i) => ({
          time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          emg:   r.emg_value,
          force: r.force_value,
        })));
      } catch (sensorsErr) {
        console.log('Sensor data not available');
        setEmgHistory([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Set default empty state when hardware not connected
      setStats(null);
      setEmgHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Slower refresh rate to avoid performance issues
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (cmd) => {
    try {
      setSendingCmd(cmd);
      await api.post('hardware/command/', { command: cmd });
    } catch (err) {
      console.error('Command error:', err);
    } finally {
      setSendingCmd('');
    }
  };

  const updateSettings = async () => {
    try {
      setUpdating(true);
      await api.post('settings/update/', settings);
    } catch (err) {
      console.error('Settings update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <BrainCircuit className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading your prosthetic control center...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '32px' }}
      >
        <motion.h1 
          style={{ fontSize: '2.5rem', marginBottom: '8px' }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Welcome back, <span className="text-gradient-alt">{username}</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Your prosthetic limb control center - Real-time monitoring and control
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}
      >
        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Battery style={{ color: 'var(--accent-primary)' }} size={24} />
            </motion.div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }} className="text-gradient">Battery Status</h3>
          </div>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {stats ? `${stats.battery_level}%` : '---'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            {stats ? stats.battery_status : 'No Hardware Connected'}
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient-alt)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Activity style={{ color: 'var(--accent-secondary)' }} size={24} />
            </motion.div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }} className="text-gradient-alt">Signal Strength</h3>
          </div>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            {stats ? stats.signal_strength : '---'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            {stats ? 'EMG Signal Quality' : 'No Hardware Connected'}
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <motion.div
              animate={{ rotate: [0, 180, -180, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cpu style={{ color: 'var(--accent-tertiary)' }} size={24} />
            </motion.div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }} className="text-gradient">Processing</h3>
          </div>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-tertiary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {stats ? `${stats.processing_speed}ms` : 'No Hardware Connected'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            CPU Usage
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'linear-gradient(90deg, var(--status-success), var(--accent-primary))'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CheckCircle style={{ color: 'var(--status-success)' }} size={24} />
            </motion.div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }} className="text-gradient">System Status</h3>
          </div>
          <motion.div 
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-success)' }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {stats ? 'Online' : 'No Hardware Connected'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            {stats ? 'All systems operational' : 'No Hardware Connected'}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* EMG Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel"
          style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }} className="text-gradient">
            Recent EMG Activity
          </h3>
          <div style={{ height: '250px' }}>
            {stats && emgHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emgHistory}>
                  <defs>
                    <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="emg" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorEmg)" name="EMG" />
                  <Area type="monotone" dataKey="force" stroke="var(--accent-secondary)" fillOpacity={0.3} fill="var(--accent-secondary)" name="Force" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <Activity size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p>No EMG Data Available</p>
                <p style={{ fontSize: '0.9rem' }}>Connect hardware to view real-time signals</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 3D Arm Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel"
          style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient-alt)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }} className="text-gradient-alt">
            Prosthetic Arm Visualization
          </h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProstheticArm3D />
          </div>
        </motion.div>
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-panel"
        style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '4px',
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary), var(--accent-secondary))'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }} className="text-gradient">
          Quick Controls
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { cmd: 'open', icon: <Hand size={18} />, label: 'Open Hand', color: 'var(--accent-primary)' },
            { cmd: 'close', icon: <Hand size={18} />, label: 'Close Hand', color: 'var(--accent-secondary)' },
            { cmd: 'rotate_cw', icon: <RotateCcw size={18} />, label: 'Rotate CW', color: 'var(--accent-tertiary)' },
            { cmd: 'calibrate', icon: <Settings size={18} />, label: 'Calibrate', color: 'var(--status-warning)' }
          ].map((action, idx) => (
            <motion.button
              key={action.cmd}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendCommand(action.cmd)}
              disabled={sendingCmd === action.cmd || !stats}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                background: sendingCmd === action.cmd || !stats ? 'var(--text-muted)' : action.color,
                color: action.color,
                fontSize: '1rem',
                fontWeight: '600',
                cursor: sendingCmd === action.cmd || !stats ? 'not-allowed' : 'pointer',
                opacity: sendingCmd === action.cmd || !stats ? 0.6 : 1
              }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>

        {/* Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }} className="text-gradient">Sensitivity Settings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  Sensitivity: {settings.sensitivity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sensitivity}
                  onChange={(e) => setSettings({...settings, sensitivity: parseInt(e.target.value)})}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  Speed: {settings.speed}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.speed}
                  onChange={(e) => setSettings({...settings, speed: parseInt(e.target.value)})}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }} className="text-gradient-alt">Connection Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Wifi size={24} style={{ color: 'var(--status-success)' }} />
              </motion.div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Connected</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Signal: Excellent</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={updateSettings}
              disabled={updating}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              {updating ? 'Updating...' : 'Save Settings'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatientDashboard;
