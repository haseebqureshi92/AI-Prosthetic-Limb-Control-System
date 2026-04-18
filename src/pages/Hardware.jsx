import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Battery, Wifi, WifiOff, Activity, Key, Send, Power, RefreshCcw, Copy, Check, CheckCircle, AlertTriangle, Zap
} from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const Hardware = () => {
  const [deviceToken, setDeviceToken] = useState(null);
  const [status, setStatus] = useState({
    connected: false,
    battery: null,
    temperature: null,
    signal_strength: null,
    cpu_load: null,
    memory_usage: null
  });
  const [loading, setLoading] = useState(true);
  const [sendingCmd, setSendingCmd] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await api.get('hardware/status/');
      const hardwareStatus = response.data;
      
      // Always set status regardless of connection
      setStatus({
        connected: hardwareStatus.connected || false,
        battery: hardwareStatus.battery || null,
        temperature: hardwareStatus.temperature || null,
        signal_strength: hardwareStatus.signal_strength || null,
        cpu_load: hardwareStatus.cpu_load || null,
        memory_usage: hardwareStatus.memory_usage || null
      });
      
      setDeviceToken(hardwareStatus.device_token || null);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching hardware data:', err);
      // Show default disconnected state
      setStatus({
        connected: false,
        battery: null,
        temperature: null,
        signal_strength: null,
        cpu_load: null,
        memory_usage: null
      });
      setDeviceToken(null);
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async (cmd) => {
    try {
      setSendingCmd(cmd);
      await api.post('hardware/command/', { command: cmd });
      setCmdHistory(prev => [{ cmd, timestamp: new Date().toLocaleTimeString(), status: 'success' }, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error('Command error:', err);
      setCmdHistory(prev => [{ cmd, timestamp: new Date().toLocaleTimeString(), status: 'error' }, ...prev.slice(0, 9)]);
    } finally {
      setSendingCmd('');
    }
  };

  const copyToken = () => {
    if (deviceToken) {
      navigator.clipboard.writeText(deviceToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <Cpu className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Initializing hardware interface...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hardware Connection Status */}
      <motion.div 
        variants={staggerItem}
        className="glass-panel mb-4" 
        style={{ 
          padding: '16px', 
          border: status.connected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          background: status.connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {status.connected ? 
              <Wifi size={24} style={{ color: 'var(--status-success)' }} /> : 
              <WifiOff size={24} style={{ color: 'var(--status-error)' }} />
            }
          </motion.div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
              Hardware Status: <span style={{ color: status.connected ? 'var(--status-success)' : 'var(--status-error)' }}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {status.connected ? 'Prosthetic limb controller active' : 'No hardware device detected'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last update:</span>
          <motion.span 
            style={{ 
              color: 'var(--accent-primary)', 
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            {new Date(lastUpdate).toLocaleTimeString()}
          </motion.span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
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
          <span className="text-gradient-alt">Hardware Control</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Real-time prosthetic limb hardware monitoring and control interface
        </motion.p>
      </motion.div>

      {/* Device Token */}
      <motion.div
        variants={staggerItem}
        className="glass-panel mb-4"
        style={{ padding: '24px', borderRadius: '16px' }}
      >
        <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={20} style={{ color: 'var(--accent-primary)' }} />
          Device Authentication Token
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={deviceToken || 'No Hardware Connected'}
            readOnly
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-glass)',
              color: 'var(--text-main)',
              fontFamily: 'monospace'
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToken}
            className="btn-secondary"
            disabled={!deviceToken}
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
      </motion.div>

      {/* Real-time Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          variants={staggerItem}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: status.battery !== null && status.battery > 20 ? 'var(--accent-gradient)' : 'var(--status-error)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Battery size={20} style={{ color: status.battery !== null && status.battery > 20 ? 'var(--accent-primary)' : 'var(--status-error)' }} />
            </motion.div>
            Battery Level
          </h3>
          <motion.div 
            style={{ fontSize: '2.5rem', fontWeight: 'bold', color: status.battery !== null && status.battery > 20 ? 'var(--accent-primary)' : 'var(--status-error)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {status.battery !== null ? `${status.battery}%` : '---'}
          </motion.div>
          <div style={{ marginTop: '12px', height: '8px', background: 'var(--border-glass)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              style={{ 
                height: '100%', 
                background: status.battery !== null && status.battery > 20 ? 'var(--accent-gradient)' : 'var(--status-error)',
                width: status.battery !== null ? `${status.battery}%` : '0%'
              }}
              animate={{ width: status.battery !== null ? [0, status.battery + '%'] : [0, '0%'] }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
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
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={20} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
            Signal Strength
          </h3>
          <motion.div 
            style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            {status.signal_strength !== null ? status.signal_strength : '---'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            EMG Signal Quality
          </p>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
        >
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
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, 180, -180, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cpu size={20} style={{ color: 'var(--accent-tertiary)' }} />
            </motion.div>
            CPU Load
          </h3>
          <motion.div 
            style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-tertiary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {status.cpu_load !== null ? `${status.cpu_load}%` : '---'}
          </motion.div>
          <div style={{ marginTop: '12px', height: '8px', background: 'var(--border-glass)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              style={{ 
                height: '100%', 
                background: status.cpu_load !== null && status.cpu_load > 80 ? 'var(--status-error)' : 'var(--accent-tertiary)',
                width: status.cpu_load !== null ? `${status.cpu_load}%` : '0%'
              }}
              animate={{ width: status.cpu_load !== null ? [0, status.cpu_load + '%'] : [0, '0%'] }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--status-success)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Zap size={20} style={{ color: 'var(--status-success)' }} />
            </motion.div>
            Temperature
          </h3>
          <motion.div 
            style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-success)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            {status.temperature !== null ? `${status.temperature}°C` : '---'}
          </motion.div>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            Device Temperature
          </p>
        </motion.div>
      </div>

      {/* Control Commands */}
      <motion.div
        variants={staggerItem}
        className="glass-panel"
        style={{ padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
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
            { cmd: 'grip', icon: <Power size={18} />, label: 'Grip', color: 'var(--accent-primary)' },
            { cmd: 'open', icon: <Power size={18} />, label: 'Open', color: 'var(--accent-secondary)' },
            { cmd: 'calibrate', icon: <RefreshCcw size={18} />, label: 'Calibrate', color: 'var(--status-warning)' },
            { cmd: 'reset', icon: <RefreshCcw size={18} />, label: 'Reset', color: 'var(--status-error)' }
          ].map((action, idx) => (
            <motion.button
              key={action.cmd}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendCommand(action.cmd)}
              disabled={sendingCmd === action.cmd || !status.connected}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                background: sendingCmd === action.cmd || !status.connected ? 'var(--text-muted)' : action.color,
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: sendingCmd === action.cmd || !status.connected ? 'not-allowed' : 'pointer',
                opacity: sendingCmd === action.cmd || !status.connected ? 0.6 : 1
              }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>

        {/* Command History */}
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Command History</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {cmdHistory.length > 0 ? cmdHistory.map((cmd, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  background: cmd.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: cmd.status === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {cmd.status === 'success' ? <CheckCircle size={16} style={{ color: 'var(--status-success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--status-error)' }} />}
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{cmd.cmd}</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cmd.timestamp}</span>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <Send size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No commands sent yet</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hardware;
