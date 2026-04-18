import { useState, useEffect, useRef } from 'react';
import { Activity, Play, Square, Save, RefreshCcw, Move, BrainCircuit, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '../services/api';
import HardwareConnection from '../components/HardwareConnection';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const EMGData = () => {
  const [data, setData]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [isRecording, setIsRecording]     = useState(false);
  const [recordGesture, setRecordGesture] = useState('GRIP');
  const [recordResult, setRecordResult]   = useState(null);
  const [recordingMsg, setRecordingMsg]   = useState('');
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const intervalRef = useRef(null);
  const connectionCheckRef = useRef(null);

  const fetchEMGHistory = async () => {
    try {
      // First check if hardware is connected
      const hardwareRes = await api.get('hardware/status/');
      if (!hardwareRes.data.connected) {
        setHardwareConnected(false);
        setData([]);
        setLoading(false);
        return;
      }
      
      // Hardware is connected - fetch real EMG data
      const response = await api.get('sensors/');
      const readings = response.data.slice(0, 30).reverse();
      const formattedData = readings.map((reading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        emg:   reading.emg_value,
        force: reading.force_value,
        x:     reading.motion_x,
        y:     reading.motion_y,
        z:     reading.motion_z,
      }));
      setData(formattedData);
      setLastUpdate(Date.now());
      setHardwareConnected(true);
    } catch (err) {
      console.error('Error fetching EMG history:', err);
      setHardwareConnected(false);
      // Show no data when hardware is disconnected
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const checkHardwareConnection = async () => {
    try {
      const response = await api.get('hardware/status/');
      const isConnected = response.data.connected;
      setHardwareConnected(isConnected);
      
      // If hardware disconnected, clear data
      if (!isConnected) {
        setData([]);
      }
    } catch (err) {
      setHardwareConnected(false);
      setData([]);
    }
  };

  useEffect(() => {
    fetchEMGHistory();
    checkHardwareConnection();
    
    intervalRef.current = setInterval(fetchEMGHistory, 1000);
    connectionCheckRef.current = setInterval(checkHardwareConnection, 2000);
    
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(connectionCheckRef.current);
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingMsg('');
      try {
        const res = await api.post('training/record/', { gesture: recordGesture });
        setRecordResult(res.data);
      } catch (err) {
        console.error('Training record error:', err);
        setRecordResult({ status: 'error', message: 'Failed to save recording.' });
      }
    } else {
      setRecordResult(null);
      setIsRecording(true);
      setRecordingMsg(`Recording "${recordGesture}" - perform gesture now...`);
    }
  };

  const latest = data[data.length - 1];
  const avgEmg  = data.length > 0 ? (data.reduce((s, d) => s + d.emg,  0) / data.length).toFixed(1) : '---';
  const avgForce= data.length > 0 ? (data.reduce((s, d) => s + d.force,0) / data.length).toFixed(2) : '---';

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <Activity className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading EMG data...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hardware Connection Component */}
      <HardwareConnection onConnectionChange={(connected) => setHardwareConnected(connected)} />
      
      <motion.div 
        variants={staggerItem}
        className="glass-panel mb-4" 
        style={{ 
          padding: '16px', 
          border: hardwareConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          background: hardwareConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {hardwareConnected ? 
              <Wifi size={24} style={{ color: 'var(--status-success)' }} /> : 
              <WifiOff size={24} style={{ color: 'var(--status-error)' }} />
            }
          </motion.div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
              Hardware Status: <span style={{ color: hardwareConnected ? 'var(--status-success)' : 'var(--status-error)' }}>
                {hardwareConnected ? 'Connected' : 'Disconnected'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {hardwareConnected ? 'Real-time EMG signals active' : 'Using simulated data'}
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
          <span className="text-gradient-alt">EMG Signal Monitor</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Real-time electromyography signal analysis and gesture recording
        </motion.p>
      </motion.div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
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
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
            </motion.div>
            <span className="text-gradient">Live Signal</span>
          </h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="emg" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorEmg)" name="EMG" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
              <BrainCircuit size={20} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
            <span className="text-gradient-alt">Motion Tracking</span>
          </h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[-2, 2]} />
                <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="x" stroke="#FF5733" strokeWidth={2} dot={false} name="Pitch (X)" />
                <Line type="monotone" dataKey="y" stroke="#33FF57" strokeWidth={2} dot={false} name="Roll (Y)" />
                <Line type="monotone" dataKey="z" stroke="#3357FF" strokeWidth={2} dot={false} name="Yaw (Z)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
        <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={{ rotate: [0, 180, -180, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Move size={20} style={{ color: 'var(--accent-tertiary)' }} />
          </motion.div>
          <span className="text-gradient">Gesture Recording</span>
        </h3>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Latest EMG</div>
            <motion.div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {latest?.emg?.toFixed(1) || '---'}
            </motion.div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Average EMG</div>
            <motion.div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              {avgEmg}
            </motion.div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Force</div>
            <motion.div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-tertiary)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              {avgForce}
            </motion.div>
          </div>
        </div>

        {/* Recording Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <select
            value={recordGesture}
            onChange={(e) => setRecordGesture(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-glass)',
              color: 'var(--text-main)',
              fontSize: '1rem'
            }}
          >
            <option value="GRIP">Grip</option>
            <option value="OPEN">Open Hand</option>
            <option value="POINT">Point</option>
            <option value="THUMB">Thumb Up</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            className={isRecording ? "btn-secondary" : "btn-primary"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isRecording ? <Square size={18} /> : <Play size={18} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </motion.button>
        </div>

        {/* Recording Message */}
        {recordingMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: 'var(--accent-primary)',
              textAlign: 'center',
              marginBottom: '16px'
            }}
          >
            {recordingMsg}
          </motion.div>
        )}

        {/* Recording Result */}
        {recordResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px',
              background: recordResult.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${recordResult.status === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              color: recordResult.status === 'success' ? 'var(--status-success)' : 'var(--status-error)',
              textAlign: 'center'
            }}
          >
            {recordResult.message}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EMGData;
