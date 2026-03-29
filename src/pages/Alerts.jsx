import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, RefreshCcw } from 'lucide-react';
import api from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('logs/');
      // Filter for warnings and errors
      const warningAlerts = response.data.filter(log => log.level === 'warning' || log.level === 'error');
      setAlerts(warningAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getIcon = (level) => {
    switch (level) {
      case 'warning': return <AlertTriangle color="var(--status-warning)" />;
      case 'error': return <AlertCircle color="var(--status-error)" />;
      default: return <Info color="var(--accent-primary)" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Loading System Notifications...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <h1 style={{ fontSize: '2rem' }}>System <span className="text-gradient">Alerts & Notifications</span></h1>
        <button className="btn-secondary" onClick={fetchAlerts}>Refresh</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alerts.length > 0 ? alerts.map((alert, i) => (
          <div key={alert.id} className="glass-panel animate-fade-in">
            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getIcon(alert.level)}
                <div>
                  <h4 style={{ fontWeight: 600 }}>{alert.event_name}</h4>
                  <p style={{ fontSize: '0.85rem' }}>{alert.message}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                     <span className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {alert.emp_id || 'SYSTEM'}</span>
                     <span className="text-muted" style={{ fontSize: '0.75rem' }}>Precision: {alert.performance_metric ? alert.performance_metric.toFixed(1) : 'N/A'}%</span>
                  </div>
                </div>
              </div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )) : (
          <div className="glass-panel text-center" style={{ padding: '60px' }}>
            <Bell size={48} className="text-muted mb-2" style={{ opacity: 0.3 }} />
            <h3 className="text-muted">No high-priority alerts</h3>
            <p className="text-muted">All systems are functioning within normal parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
