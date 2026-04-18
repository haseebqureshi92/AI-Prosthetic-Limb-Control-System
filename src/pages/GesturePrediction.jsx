import { useState, useEffect, useRef } from 'react';
import { Brain, Eye, Zap, Target, Wifi, WifiOff, Activity, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const GesturePrediction = () => {
  const [currentPrediction, setCurrentPrediction] = useState({
    gesture: 'NEUTRAL',
    confidence: 0,
    emg_value: 0,
    timestamp: new Date().toISOString()
  });
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [gestureStats, setGestureStats] = useState([]);
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchPredictionData = async () => {
    try {
      const response = await api.get('ai/prediction/');
      const prediction = response.data.current_prediction;
      const history = response.data.prediction_history;
      const stats = response.data.gesture_statistics;
      
      setCurrentPrediction(prediction);
      setPredictionHistory(history);
      setGestureStats(stats);
      setHardwareConnected(true);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setHardwareConnected(false);
      // Show no data when hardware is disconnected
      setCurrentPrediction({
        gesture: 'NO_SIGNAL',
        confidence: 0,
        emg_value: 0,
        timestamp: new Date().toISOString()
      });
      setPredictionHistory([]);
      setGestureStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictionData();
    // Optimized refresh rate - every 500ms for smooth prediction
    intervalRef.current = setInterval(fetchPredictionData, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'var(--status-success)';
    if (confidence >= 60) return 'var(--status-warning)';
    return 'var(--status-error)';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FEB019', '#FF5630', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <Brain className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading AI prediction engine...
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
              AI Prediction: <span style={{ color: hardwareConnected ? 'var(--status-success)' : 'var(--status-error)' }}>
                {hardwareConnected ? 'Active' : 'Offline'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {hardwareConnected ? 'Real-time gesture recognition active' : 'Using simulated predictions'}
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
          <span className="text-gradient-alt">AI Gesture Prediction</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Real-time artificial intelligence gesture recognition and prediction system
        </motion.p>
      </motion.div>

      {/* Current Prediction Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel"
          style={{ padding: '32px', borderRadius: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
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
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '16px' }}
          >
            <Eye size={48} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Current Gesture</h3>
          <motion.div 
            style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'var(--accent-primary)',
              marginBottom: '16px'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {currentPrediction.gesture}
          </motion.div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            EMG Value: <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{currentPrediction.emg_value.toFixed(1)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel"
          style={{ padding: '32px', borderRadius: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
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
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '16px' }}
          >
            <Target size={48} style={{ color: 'var(--accent-secondary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Confidence Level</h3>
          <motion.div 
            style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: getConfidenceColor(currentPrediction.confidence),
              marginBottom: '16px'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {currentPrediction.confidence.toFixed(1)}%
          </motion.div>
          <div style={{ height: '8px', background: 'var(--border-glass)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              style={{ 
                height: '100%', 
                background: getConfidenceColor(currentPrediction.confidence),
                width: `${currentPrediction.confidence}%`
              }}
              animate={{ width: [0, currentPrediction.confidence + '%'] }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Prediction History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel"
        style={{ padding: '32px', borderRadius: '16px', marginBottom: '32px' }}
      >
        <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={{ rotate: [0, 180, -180, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TrendingUp size={20} style={{ color: 'var(--accent-tertiary)' }} />
          </motion.div>
          Prediction History
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionHistory}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
              <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="confidence" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorConfidence)" name="Confidence %" />
              <Line type="monotone" dataKey="emg_value" stroke="var(--accent-secondary)" strokeWidth={2} dot={false} name="EMG Value" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gesture Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-panel"
        style={{ padding: '32px', borderRadius: '16px' }}
      >
        <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Zap size={20} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          Gesture Performance Analytics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {gestureStats.map((stat, index) => (
            <motion.div
              key={stat.gesture}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(0, 240, 255, 0.06)',
                border: '1px solid rgba(0, 240, 255, 0.12)',
                textAlign: 'center'
              }}
            >
              <h4 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>{stat.gesture}</h4>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
                {stat.count}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Accuracy: <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>{stat.accuracy.toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GesturePrediction;
