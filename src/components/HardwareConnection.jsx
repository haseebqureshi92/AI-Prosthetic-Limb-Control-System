import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Link, Link2, Shield, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

const HardwareConnection = ({ onConnectionChange }) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [deviceToken, setDeviceToken] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const checkConnection = async () => {
    try {
      const response = await api.get('hardware/status/');
      const status = response.data;
      
      if (status.connected) {
        setConnectionStatus('connected');
        setDeviceToken(status.device_token || '');
        setError('');
        onConnectionChange(true);
      } else {
        setConnectionStatus('disconnected');
        setDeviceToken('');
        onConnectionChange(false);
      }
      setLastUpdate(Date.now());
    } catch (err) {
      setConnectionStatus('error');
      setError('Unable to check hardware status');
      onConnectionChange(false);
    }
  };

  const connectHardware = async () => {
    setConnecting(true);
    setError('');
    
    try {
      // Generate connection request
      const response = await api.post('hardware/connect/', {
        request_type: 'connection_init',
        timestamp: new Date().toISOString()
      });
      
      if (response.data.success) {
        // Poll for connection status
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await api.get('hardware/status/');
            if (statusResponse.data.connected) {
              clearInterval(pollInterval);
              setConnectionStatus('connected');
              setDeviceToken(statusResponse.data.device_token || '');
              setConnecting(false);
              onConnectionChange(true);
            }
          } catch (err) {
            clearInterval(pollInterval);
            setConnectionStatus('error');
            setError('Connection failed');
            setConnecting(false);
            onConnectionChange(false);
          }
        }, 1000);
        
        // Timeout after 30 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
          if (connecting) {
            setConnectionStatus('timeout');
            setError('Connection timeout - please try again');
            setConnecting(false);
            onConnectionChange(false);
          }
        }, 30000);
        
      } else {
        setError(response.data.message || 'Connection failed');
        setConnecting(false);
        onConnectionChange(false);
      }
    } catch (err) {
      setError('Unable to connect to hardware');
      setConnecting(false);
      onConnectionChange(false);
    }
  };

  const disconnectHardware = async () => {
    try {
      await api.post('hardware/disconnect/');
      setConnectionStatus('disconnected');
      setDeviceToken('');
      onConnectionChange(false);
    } catch (err) {
      setError('Error disconnecting hardware');
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle size={24} style={{ color: 'var(--status-success)' }} />;
      case 'connecting':
        return <RefreshCcw size={24} style={{ color: 'var(--accent-primary)' }} className="spinning" />;
      case 'error':
      case 'timeout':
        return <AlertCircle size={24} style={{ color: 'var(--status-error)' }} />;
      default:
        return <WifiOff size={24} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Hardware Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      case 'timeout':
        return 'Connection Timeout';
      default:
        return 'Hardware Disconnected';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'var(--status-success)';
      case 'connecting':
        return 'var(--accent-primary)';
      case 'error':
      case 'timeout':
        return 'var(--status-error)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="glass-panel"
      style={{ padding: '24px', marginBottom: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <motion.div
          animate={{ rotate: connectionStatus === 'connecting' ? 360 : 0 }}
          transition={{ duration: 1, repeat: connectionStatus === 'connecting' ? Infinity : 0, ease: 'linear' }}
        >
          {getStatusIcon()}
        </motion.div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>
            Hardware Connection
          </h3>
          <p style={{ margin: '4px 0 0 0', color: getStatusColor(), fontWeight: 500 }}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--status-error)',
            marginBottom: '16px',
            fontSize: '0.9rem'
          }}
        >
          {error}
        </motion.div>
      )}

      {deviceToken && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={16} style={{ color: 'var(--status-success)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Device Token</span>
          </div>
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-glass)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: 'var(--text-main)',
            wordBreak: 'break-all'
          }}>
            {deviceToken}
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {connectionStatus === 'disconnected' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connectHardware}
            disabled={connecting}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: connecting ? 0.7 : 1,
              cursor: connecting ? 'not-allowed' : 'pointer'
            }}
          >
            <Link2 size={18} />
            {connecting ? 'Connecting...' : 'Connect Hardware'}
          </motion.button>
        )}

        {connectionStatus === 'connected' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={disconnectHardware}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <WifiOff size={18} />
            Disconnect
          </motion.button>
        )}

        {(connectionStatus === 'error' || connectionStatus === 'timeout') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connectHardware}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCcw size={18} />
            Retry Connection
          </motion.button>
        )}
      </div>

      <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <p>Last update: {new Date(lastUpdate).toLocaleTimeString()}</p>
        <p style={{ marginTop: '4px' }}>
          {connectionStatus === 'connected' 
            ? 'Hardware is connected and ready for real-time monitoring'
            : 'Connect hardware to enable real-time EMG signals and control'
          }
        </p>
      </div>

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default HardwareConnection;
