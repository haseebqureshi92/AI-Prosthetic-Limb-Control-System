import { useState, useEffect, useRef } from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, Users, Activity, Wifi, WifiOff } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import api from '../services/api';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    daily_usage: [],
    gesture_frequency: [],
    performance_metrics: [],
    system_health: {
      uptime: 0,
      avg_response_time: 0,
      error_rate: 0,
      success_rate: 0
    },
    user_activity: {
      active_users: 0,
      total_sessions: 0,
      avg_session_duration: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const intervalRef = useRef(null);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('analytics/');
      setAnalytics(response.data);
      setHardwareConnected(true);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setHardwareConnected(false);
      // Show no data when hardware is disconnected
      setAnalytics({
        daily_usage: [],
        gesture_frequency: [],
        performance_metrics: [],
        system_health: {
          uptime: 0,
          avg_response_time: 0,
          error_rate: 0,
          success_rate: 0
        },
        user_activity: {
          active_users: 0,
          total_sessions: 0,
          avg_session_duration: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Optimized refresh rate - every 3 seconds for better performance
    intervalRef.current = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FEB019', '#FF5630', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <BarChart3 className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading analytics dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
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
              Analytics: <span style={{ color: hardwareConnected ? 'var(--status-success)' : 'var(--status-error)' }}>
                {hardwareConnected ? 'Live' : 'Offline'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {hardwareConnected ? 'Real-time system analytics active' : 'Using cached analytics data'}
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
          <span className="text-gradient-alt">Advanced Analytics Dashboard</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Comprehensive system performance metrics and usage analytics
        </motion.p>
      </motion.div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '12px' }}
          >
            <TrendingUp size={32} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>System Uptime</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {analytics.system_health.uptime}%
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '12px' }}
          >
            <Clock size={32} style={{ color: 'var(--accent-secondary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Avg Response Time</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            {analytics.system_health.avg_response_time}ms
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: [0, 180, -180, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '12px' }}
          >
            <Users size={32} style={{ color: 'var(--accent-tertiary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Active Users</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-tertiary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            {analytics.user_activity.active_users}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px', textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '12px' }}
          >
            <Activity size={32} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Success Rate</h3>
          <motion.div 
            style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            {analytics.system_health.success_rate}%
          </motion.div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px' }}
        >
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
            </motion.div>
            Daily Usage Statistics
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.daily_usage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="sessions" fill="var(--accent-primary)" name="Sessions" />
                <Bar dataKey="gestures" fill="var(--accent-secondary)" name="Gestures" />
                <Bar dataKey="errors" fill="var(--status-error)" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel"
          style={{ padding: '24px', borderRadius: '16px' }}
        >
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <PieChart size={20} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
            Gesture Frequency Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={analytics.gesture_frequency}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ gesture, count }) => `${gesture}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.gesture_frequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-panel"
        style={{ padding: '32px', borderRadius: '16px' }}
      >
        <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={{ rotate: [0, 180, -180, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Activity size={20} style={{ color: 'var(--accent-tertiary)' }} />
          </motion.div>
          24-Hour Performance Metrics
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.performance_metrics}>
              <defs>
                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="response_time" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorResponse)" name="Response Time (ms)" />
              <Area type="monotone" dataKey="accuracy" stroke="var(--accent-secondary)" fillOpacity={1} fill="url(#colorAccuracy)" name="Accuracy (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
