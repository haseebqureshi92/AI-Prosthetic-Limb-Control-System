import { useState, useEffect } from 'react';
import { 
  Activity, Battery, Zap, CheckCircle, RefreshCcw, 
  Settings, BrainCircuit, ShieldCheck, Wifi, WifiOff,
  Hand, RotateCcw, ShieldAlert, Cpu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import ProstheticArm3D from '../components/ProstheticArm3D';

const PatientDashboard = () => {
  const [stats, setStats]       = useState(null);
  const [emgHistory, setEmgHistory] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sendingCmd, setSendingCmd] = useState('');
  const [settings, setSettings] = useState({ sensitivity: 75, speed: 60 });
  const [updating, setUpdating] = useState(false);
  const username = localStorage.getItem('username') || 'Patient';

  const fetchData = async () => {
    try {
      const [statsRes, settingsRes, sensorsRes] = await Promise.all([
        api.get('dashboard/'),
        api.get('settings/current/'),
        api.get('sensors/'),
      ]);

      setStats(statsRes.data);
      setSettings(settingsRes.data);

      // Build rolling EMG history for chart (last 12 readings)
      const readings = sensorsRes.data.slice(0, 12).reverse();
      setEmgHistory(readings.map((r, i) => ({
        time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        emg:   r.emg_value,
        force: r.force_value,
      })));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // live update every 3s
    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (command) => {
    setSendingCmd(command);
    try {
      if (command === 'STOP') {
        await api.post('commands/emergency-stop/');
      } else {
        await api.post('commands/send/', { command });
      }
      await fetchData();
    } catch (err) {
      console.error('Command error:', err);
    } finally {
      setSendingCmd('');
    }
  };

  const handleUpdateSettings = async () => {
    setUpdating(true);
    try {
      await api.patch('settings/current/', { sensitivity: settings.sensitivity, speed: settings.speed });
    } catch (err) {
      console.error('Settings error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Synchronizing with Bionic Arm...</p>
      </div>
    );
  }

  const isHwConnected = stats?.hw_connected;
  const aiGesture     = stats?.ai_gesture     || 'Idle / Resting';
  const aiConfidence  = stats?.ai_confidence  || 0;
  const motorAngles   = stats?.motor_angles   || {};

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, <span className="text-gradient">{username}</span></h1>
          <p className="text-muted">Real-time bionic limb monitoring and control.</p>
        </div>
        <div className="flex-center" style={{ gap: '16px' }}>
          <div className="flex-center" style={{ gap: '8px' }}>
            {isHwConnected
              ? <Wifi size={18} className="text-gradient" />
              : <WifiOff size={18} style={{ color: 'rgba(255,100,0,0.8)' }} />}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {isHwConnected ? 'Hardware Live' : 'Simulation Mode'}
            </span>
          </div>
          <span className={`status-dot ${stats?.status === 'Online' ? 'online' : 'offline'}`}></span>
          <span style={{ fontWeight: 500 }}>System {stats?.status || 'Offline'}</span>
        </div>
      </div>

      {/* Simulation notice */}
      {!isHwConnected && (
        <div className="mb-4" style={{
          padding: '12px 20px',
          background: 'rgba(255,170,0,0.08)',
          border: '1px solid rgba(255,170,0,0.3)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <Cpu size={20} style={{ color: 'rgba(255,170,0,0.9)' }} />
          <p style={{ fontSize: '0.9rem' }}>
            <strong style={{ color: 'rgba(255,170,0,0.9)' }}>Simulation Mode</strong>
            {' '}— No hardware connected. Data is simulated. Go to{' '}
            <a href="/hardware" style={{ color: 'var(--accent-primary)' }}>Hardware Control Panel</a>
            {' '}for connection instructions.
          </p>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid-cols-4 mb-4">
        <div className="glass-panel text-center">
          <Battery size={28} className="text-gradient mb-1" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats?.battery_level ?? 0}%</h2>
          <p className="text-muted">Battery</p>
          <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
            <div style={{ width: `${stats?.battery_level ?? 0}%`, height: '100%', borderRadius: '2px',
              background: (stats?.battery_level ?? 0) > 30 ? 'var(--accent-primary)' : 'var(--status-error)', transition: 'width 1s ease' }} />
          </div>
        </div>
        <div className="glass-panel text-center">
          <Activity size={28} className="text-gradient mb-1" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats?.latest_emg?.toFixed(1) ?? '—'}</h2>
          <p className="text-muted">EMG Value</p>
        </div>
        <div className="glass-panel text-center">
          <Zap size={28} className="text-gradient mb-1" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stats?.latest_force?.toFixed(2) ?? '—'} N</h2>
          <p className="text-muted">Grip Force</p>
        </div>
        <div className="glass-panel text-center">
          <CheckCircle size={28} className="text-gradient mb-1" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{aiConfidence.toFixed(1)}%</h2>
          <p className="text-muted">AI Confidence</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-cols-2 mb-4" style={{ gap: '20px' }}>

        {/* EMG Chart */}
        <div className="glass-panel" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between mb-3">
            <h3>EMG Signal Pulse</h3>
            <Activity className="text-muted" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emgHistory}>
                <defs>
                  <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-primary)' }}
                />
                <Area type="monotone" dataKey="emg" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSignal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Inference + 3D Arm */}
        <div className="flex-column" style={{ gap: '20px' }}>
          {/* AI Inference */}
          <div className="glass-panel">
            <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <BrainCircuit size={20} className="text-gradient" /> AI Inference (Live)
            </h3>
            <div className="flex-between" style={{ padding: '14px', background: 'rgba(0,240,255,0.04)', borderRadius: '12px', border: '1px solid var(--border-glow)', marginBottom: '12px' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Predicted Gesture</p>
                <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{aiGesture}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Confidence</p>
                <p className="text-gradient" style={{ fontWeight: 700, fontSize: '1.3rem' }}>{aiConfidence.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex-between">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Model</span>
              <span style={{ fontSize: '0.8rem' }}>BionicAI v2 (SVM)</span>
            </div>
          </div>

          {/* 3D Arm */}
          <ProstheticArm3D gesture={aiGesture} motorAngles={motorAngles} />
        </div>
      </div>

      {/* Remote Controls */}
      <div className="glass-panel mb-4">
        <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
          <ShieldCheck size={20} className="text-gradient" /> Remote Manual Overrides
        </h3>
        <div className="grid-cols-5" style={{ gap: '12px' }}>
          {[
            { cmd: 'RELEASE',    label: 'Open Hand',   emoji: '🖐️' },
            { cmd: 'GRIP',       label: 'Close Hand',  emoji: '✊' },
            { cmd: 'PINCH',      label: 'Pinch',       emoji: '🤌' },
            { cmd: 'ROTATE_CW',  label: 'Rotate CW',   emoji: '🔃' },
            { cmd: 'CALIBRATE',  label: 'Calibrate',   emoji: '⚙️' },
          ].map(({ cmd, label, emoji }) => (
            <button
              key={cmd}
              className="btn-secondary"
              style={{ padding: '14px 8px', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}
              onClick={() => sendCommand(cmd)}
              disabled={!!sendingCmd}
            >
              <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
              {sendingCmd === cmd ? '...' : label}
            </button>
          ))}
        </div>
        {/* Emergency stop */}
        <button
          onClick={() => sendCommand('STOP')}
          disabled={!!sendingCmd}
          style={{
            width: '100%', marginTop: '12px', padding: '14px',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '12px', cursor: 'pointer',
            color: 'rgb(239,68,68)', fontWeight: 700, fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <ShieldAlert size={20} />
          {sendingCmd === 'STOP' ? 'STOPPING...' : '🛑 EMERGENCY STOP — Freeze All Movement'}
        </button>
      </div>

      {/* Calibration + Logs */}
      <div className="grid-cols-2" style={{ gap: '20px' }}>
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <Settings size={20} className="text-gradient" /> Quick Calibration
          </h3>
          <div className="mb-4">
            <label className="text-muted flex-between mb-1" style={{ fontSize: '0.9rem' }}>
              Grip Sensitivity <span>{settings.sensitivity}%</span>
            </label>
            <input type="range" className="input-glass" value={settings.sensitivity}
              onChange={(e) => setSettings({ ...settings, sensitivity: parseInt(e.target.value) })} />
          </div>
          <div className="mb-4">
            <label className="text-muted flex-between mb-1" style={{ fontSize: '0.9rem' }}>
              Movement Speed <span>{settings.speed}%</span>
            </label>
            <input type="range" className="input-glass" value={settings.speed}
              onChange={(e) => setSettings({ ...settings, speed: parseInt(e.target.value) })} />
          </div>
          <button className="btn-primary" onClick={handleUpdateSettings} disabled={updating} style={{ width: '100%', padding: '12px' }}>
            {updating ? 'Updating...' : 'Apply Calibration'}
          </button>
        </div>

        <div className="glass-panel">
          <h3 className="mb-3">Recent Activity Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.recent_logs?.length > 0 ? stats.recent_logs : [
              { event_name: 'System started', timestamp: new Date().toISOString(), level: 'info' },
            ]).map((log, i) => (
              <div key={i} className="flex-between" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle color={log.level === 'error' ? 'var(--status-error)' : log.level === 'warning' ? 'var(--status-warning)' : 'var(--status-success)'} size={15} />
                  <span style={{ fontSize: '0.9rem' }}>{log.event_name}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
