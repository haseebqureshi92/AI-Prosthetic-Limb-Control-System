import { useState, useEffect } from 'react';
import { FileText, Save, Download, RefreshCcw } from 'lucide-react';
import api from '../services/api';

const LogsReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await api.get('logs/');
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Event,Message,Level\n"
      + logs.map(l => `${l.timestamp},${l.event_name},${l.message},${l.level}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bionic_logs.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Generating Historical Reports...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <h1 style={{ fontSize: '2rem' }}>System <span className="text-gradient">Logs & Reports</span></h1>
        <div className="flex-center" style={{ gap: '12px' }}>
          <button className="btn-secondary" onClick={fetchLogs}><RefreshCcw size={18} /> Refresh</button>
          <button className="btn-primary" onClick={handleDownload} disabled={logs.length === 0}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>
      
      <div className="glass-panel">
        <h3 className="mb-3">Activity History</h3>
        {logs.length > 0 ? (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Timestamp</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Event</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>ID/Metric</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Level</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontWeight: 500 }}>{log.event_name}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{log.message}</p>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                      <div className="flex-column">
                        <span>{log.emp_id || 'SYS'}</span>
                        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{log.performance_metric ? `${log.performance_metric.toFixed(1)}%` : '-'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: log.level === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: log.level === 'error' ? 'var(--status-error)' : 'var(--text-muted)'
                      }}>
                        {log.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '60px' }}>
            <FileText size={48} className="text-gradient mb-2" />
            <h3>No reports generated yet.</h3>
            <p className="text-muted">Start sensor data recording to create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsReports;
