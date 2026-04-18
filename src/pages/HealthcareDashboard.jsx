import React, { useState, useEffect } from 'react';
import { Users, Search, Activity, ArrowRight, RefreshCcw, TrendingUp, ShieldCheck, Battery, Cpu, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';

const HealthcareDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [hardwareConnected, setHardwareConnected] = useState(false);

  const fetchPatients = async () => {
    try {
      // First check if hardware is connected
      const hardwareRes = await api.get('hardware/status/');
      if (!hardwareRes.data.connected) {
        setHardwareConnected(false);
        setPatients([]);
        setLoading(false);
        return;
      }

      // Hardware is connected - fetch real patient data
      const response = await api.get('patients/');
      const pts = response.data || [];
      
      // Only show patients with connected hardware
      const connectedPatients = pts.filter(p => p.hardware_connected);
      setPatients(connectedPatients);
      setHardwareConnected(true);
      setLoading(false);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching patients:', err);
      setHardwareConnected(false);
      setPatients([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate real averages from connected patients
  const avgBattery = patients.length > 0 
    ? patients.reduce((sum, p) => sum + (p.battery_level || 0), 0) / patients.length 
    : null;
  const avgConfidence = patients.length > 0 
    ? patients.reduce((sum, p) => sum + (p.ai_confidence || 0), 0) / patients.length 
    : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{ animation: 'spin 1s linear infinite' }}>
          <RefreshCcw size={40} style={{ color: '#3b82f6' }} />
        </div>
        <p style={{ color: '#64748b' }}>Checking hardware connection...</p>
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
          .glass-panel {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            padding: 24px;
          }
          .text-gradient {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-gradient-alt {
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-muted {
            color: #64748b;
          }
          .btn-secondary {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
            color: #1e293b;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .btn-secondary:hover {
            background: #f8fafc;
            transform: translateY(-1px);
          }
          .input-glass {
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: rgba(255, 255, 255, 0.9);
            color: #1e293b;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.3s ease;
          }
          .input-glass:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .grid-cols-4 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
          }
          .grid-cols-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
          .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      
      {/* Hardware Connection Status */}
      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ animation: 'spin 2s linear infinite' }}>
            {hardwareConnected ? 
              <Wifi size={24} style={{ color: '#10b981' }} /> : 
              <WifiOff size={24} style={{ color: '#ef4444' }} />
            }
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b' }}>
              Hardware Status: <span style={{ color: hardwareConnected ? '#10b981' : '#ef4444' }}>
                {hardwareConnected ? 'Connected' : 'Disconnected'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>
              {hardwareConnected ? 'Real-time patient monitoring active' : 'No prosthetic devices connected'}
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

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#1e293b' }}>
          Healthcare <span className="text-gradient-alt">Professional Portal</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '24px' }}>
          Monitor and manage multiple patient bionic systems.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={20} style={{ color: '#64748b' }} />
          <input
            type="text"
            className="input-glass"
            placeholder="Search patients..."
            style={{ maxWidth: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-secondary" onClick={fetchPatients}>
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Real-Time Analytics - Only show when hardware connected */}
      {hardwareConnected ? (
        <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
          <div className="glass-panel text-center">
            <Users size={32} className="text-gradient" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>
              {patients.length}
            </h2>
            <p className="text-muted">Connected Patients</p>
          </div>
          
          <div className="glass-panel text-center">
            <Activity size={32} className="text-gradient" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>
              {avgConfidence !== null ? `${avgConfidence.toFixed(1)}%` : '---'}
            </h2>
            <p className="text-muted">Avg. AI Accuracy</p>
          </div>
          
          <div className="glass-panel text-center">
            <Cpu size={32} className="text-gradient" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>
              {patients.length > 0 ? '148/s' : '---'}
            </h2>
            <p className="text-muted">Inference Rate</p>
          </div>
          
          <div className="glass-panel text-center">
            <ShieldCheck size={32} className="text-gradient" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: '8px 0' }}>
              {patients.length > 0 ? '32ms' : '---'}
            </h2>
            <p className="text-muted">Avg. Latency</p>
          </div>
        </div>
      ) : (
        <div className="glass-panel text-center" style={{ marginBottom: '32px', padding: '60px' }}>
          <WifiOff size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No Hardware Connected</h3>
          <p className="text-muted">
            Connect prosthetic devices to enable real-time patient monitoring
          </p>
        </div>
      )}

      {/* Patient Directory - Only show connected patients */}
      {hardwareConnected && (
        <div className="glass-panel">
          <h3 style={{ marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            Connected Patients ({patients.length})
          </h3>
          
          {filteredPatients.length > 0 ? (
            <div className="grid-cols-3">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  style={{ 
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    background: 'rgba(16, 185, 129, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{patient.username}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 500 }}>Connected</span>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 12px 0' }}>{patient.email}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Battery size={16} style={{ color: (patient.battery_level || 0) > 20 ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Battery: {patient.battery_level || 0}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        AI: {patient.ai_confidence || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No connected patients found</h3>
              <p>Connected patients will appear here when prosthetic devices are online</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthcareDashboard;
