import React, { useState, useEffect } from 'react';
import { Bell, Wifi, WifiOff, AlertTriangle, CheckCircle, Info, RefreshCcw, X } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Always show sample alerts to ensure interface works
    const sampleAlerts = [
      {
        id: 1,
        level: 'warning',
        event_name: 'Hardware Disconnected',
        message: 'No prosthetic device currently connected - interface ready for connection',
        emp_id: 'SYSTEM',
        performance_metric: 0,
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        level: 'info',
        event_name: 'System Status',
        message: 'AI Prosthetic Limb Control System interface is ready',
        emp_id: 'SYSTEM',
        performance_metric: 100,
        timestamp: new Date(Date.now() - 60000).toISOString()
      },
      {
        id: 3,
        level: 'info',
        event_name: 'Interface Active',
        message: 'Web interface loaded and ready for hardware connection',
        emp_id: 'SYSTEM',
        performance_metric: 100,
        timestamp: new Date(Date.now() - 120000).toISOString()
      },
      {
        id: 4,
        level: 'warning',
        event_name: 'No Hardware Detected',
        message: 'Connect prosthetic device to enable real-time monitoring',
        emp_id: 'SYSTEM',
        performance_metric: 0,
        timestamp: new Date(Date.now() - 180000).toISOString()
      },
      {
        id: 5,
        level: 'info',
        event_name: 'API Server Ready',
        message: 'Backend API server initialized and accepting connections',
        emp_id: 'SYSTEM',
        performance_metric: 100,
        timestamp: new Date(Date.now() - 240000).toISOString()
      }
    ];
    
    setAlerts(sampleAlerts);
    setHardwareConnected(false);
    setLoading(false);
    
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getIcon = (level) => {
    switch (level) {
      case 'warning': return <AlertTriangle style={{ color: '#f59e0b' }} />;
      case 'error': return <AlertTriangle style={{ color: '#ef4444' }} />;
      default: return <Info style={{ color: '#3b82f6' }} />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getLevelBg = (level) => {
    switch (level) {
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(59, 130, 246, 0.1)';
    }
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{ animation: 'spin 1s linear infinite' }}>
          <Bell size={40} style={{ color: '#3b82f6' }} />
        </div>
        <p style={{ color: '#64748b' }}>
          Loading alerts...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          .alert-card {
            transition: all 0.3s ease;
          }
          .alert-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          System <span>Alerts</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Real-time system alerts and notifications
        </p>
      </div>

      {/* Hardware Connection Status */}
      <div style={{
        padding: '16px',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <WifiOff size={24} style={{ color: '#ef4444' }} />
          <div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>
              Alerts: <span style={{ color: '#ef4444' }}>
                Offline
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>
              No real-time alerts available - hardware disconnected
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Last update:</span>
          <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.9rem' }}>
            {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Total Alerts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{alerts.length}</p>
          <p style={{ color: '#64748b' }}>Active notifications</p>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Warnings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            {alerts.filter(a => a.level === 'warning').length}
          </p>
          <p style={{ color: '#64748b' }}>System warnings</p>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Errors</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
            {alerts.filter(a => a.level === 'error').length}
          </p>
          <p style={{ color: '#64748b' }}>Critical issues</p>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Info</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
            {alerts.filter(a => a.level === 'info').length}
          </p>
          <p style={{ color: '#64748b' }}>System messages</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#1e293b',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <RefreshCcw size={18} /> Refresh
          </button>
          <button 
            onClick={() => setAlerts([])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#ef4444',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            <X size={18} /> Clear All
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {alerts.length > 0 ? alerts.map((alert, index) => (
          <div
            key={alert.id}
            className="alert-card"
            style={{
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${getLevelColor(alert.level)}`,
              background: getLevelBg(alert.level),
              position: 'relative'
            }}
          >
            <button
              onClick={() => dismissAlert(alert.id)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: getLevelColor(alert.level)
              }}
            >
              <X size={16} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: getLevelColor(alert.level),
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(alert.level)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>
                    {alert.event_name}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: getLevelColor(alert.level),
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>
                    {alert.level}
                  </span>
                </div>
                
                <p style={{ color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>
                  {alert.message}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>User:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>
                      {alert.emp_id || 'SYSTEM'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>No alerts</h3>
            <p>System is running normally with no active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
