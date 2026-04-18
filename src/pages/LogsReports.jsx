import React from 'react';

const LogsReports = () => {
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#1e293b' }}>
        System <span style={{ color: '#3b82f6' }}>Logs & Reports</span>
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px' }}>
        Comprehensive system activity logs and performance reports
      </p>
      
      <div style={{
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>System Status</h2>
        <p style={{ color: '#64748b', marginBottom: '8px' }}>
          <strong>Status:</strong> Interface Active
        </p>
        <p style={{ color: '#64748b', marginBottom: '8px' }}>
          <strong>Hardware:</strong> Disconnected
        </p>
        <p style={{ color: '#64748b' }}>
          <strong>Last Update:</strong> {new Date().toLocaleString()}
        </p>
      </div>

      <div style={{
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>Recent Activity</h2>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#1e293b' }}>
            System Initialized
          </p>
          <p style={{ margin: '0 0 8px 0', color: '#64748b' }}>
            AI Prosthetic Limb Control System started successfully
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            {new Date().toLocaleString()}
          </p>
        </div>
        <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#92400e' }}>
            Hardware Disconnected
          </p>
          <p style={{ margin: '0 0 8px 0', color: '#92400e' }}>
            No prosthetic device currently connected - interface ready for connection
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>
            {new Date(Date.now() - 60000).toLocaleString()}
          </p>
        </div>
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#1e40af' }}>
            Interface Ready
          </p>
          <p style={{ margin: '0 0 8px 0', color: '#1e40af' }}>
            Web interface loaded and ready for hardware connection
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af' }}>
            {new Date(Date.now() - 120000).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#ffffff'
      }}>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>System Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>3</div>
            <div style={{ color: '#64748b' }}>Total Logs</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>1</div>
            <div style={{ color: '#64748b' }}>Warnings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>0</div>
            <div style={{ color: '#64748b' }}>Errors</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>2</div>
            <div style={{ color: '#64748b' }}>Info</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsReports;
