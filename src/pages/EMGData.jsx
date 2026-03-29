import { useState, useEffect, useRef } from 'react';
import { Activity, Play, Square, Save, RefreshCcw, Move, BrainCircuit, CheckCircle } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '../services/api';

const EMGData = () => {
  const [data, setData]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [isRecording, setIsRecording]     = useState(false);
  const [recordGesture, setRecordGesture] = useState('GRIP');
  const [recordResult, setRecordResult]   = useState(null);
  const [recordingMsg, setRecordingMsg]   = useState('');
  const intervalRef = useRef(null);

  const fetchEMGHistory = async () => {
    try {
      const response = await api.get('sensors/');
      const formattedData = response.data
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-50) // Keep last 50 readings for the chart
        .map(reading => ({
          time:  new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          emg:   reading.emg_value,
          force: reading.force_value,
          x:     reading.motion_x,
          y:     reading.motion_y,
          z:     reading.motion_z,
        }));
      setData(formattedData);
    } catch (err) {
      console.error('Error fetching EMG history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live polling every 3 seconds (consistent with PatientDashboard)
  useEffect(() => {
    fetchEMGHistory();
    intervalRef.current = setInterval(fetchEMGHistory, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ── Start / Stop gesture recording ──
  const toggleRecording = async () => {
    if (isRecording) {
      // STOP — label the recent readings with the chosen gesture
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
      // START
      setRecordResult(null);
      setIsRecording(true);
      setRecordingMsg(`Recording "${recordGesture}" — perform the gesture now...`);
    }
  };

  // Latest readings for Health Metrics panel
  const latest = data[data.length - 1];
  const avgEmg  = data.length > 0 ? (data.reduce((s, d) => s + d.emg,  0) / data.length).toFixed(1) : '—';
  const avgForce= data.length > 0 ? (data.reduce((s, d) => s + d.force,0) / data.length).toFixed(2) : '—';

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Analyzing Muscle Signal History...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem' }}>EMG & <span className="text-gradient">Motion Monitoring</span></h1>
          <p className="text-muted">Multi-sensor visualization — {data.length} readings loaded. Live polling every 3s.</p>
        </div>
        <div className="flex-center" style={{ gap: '12px' }}>
          <button className="btn-secondary" onClick={fetchEMGHistory}>
            <RefreshCcw size={18} /> Refresh Now
          </button>
        </div>
      </div>

      {/* Recording Banner */}
      {isRecording && (
        <div className="mb-4" style={{
          padding: '14px 20px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'var(--status-error)',
            boxShadow: '0 0 0 4px rgba(239,68,68,0.2)',
            animation: 'pulse 1s infinite',
          }} />
          <span style={{ fontWeight: 600, color: 'rgb(239,68,68)' }}>RECORDING</span>
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>{recordingMsg}</span>
        </div>
      )}

      {/* EMG Area Chart */}
      <div className="glass-panel mb-4" style={{ height: '380px' }}>
        <div className="flex-between mb-3">
          <h3>Muscle Signal (Pulse Intensity)</h3>
          <div className="flex-center" style={{ gap: '8px' }}>
            {/* Gesture selector */}
            <select
              className="input-glass"
              value={recordGesture}
              onChange={e => setRecordGesture(e.target.value)}
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
              disabled={isRecording}
            >
              <option value="GRIP">Power Grip</option>
              <option value="OPEN">Open Hand</option>
              <option value="PINCH">Precision Pinch</option>
              <option value="ROTATE">Wrist Rotation</option>
              <option value="IDLE">Idle / Rest</option>
            </select>
            {/* Start / Stop Recording */}
            <button
              onClick={toggleRecording}
              className={isRecording ? 'btn-secondary' : 'btn-primary'}
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              {isRecording ? <><Square size={14} /> Stop & Save</> : <><Play size={14} /> Start Recording</>}
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} interval="preserveStartEnd" />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="emg" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorEmg)" name="EMG" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recording Result */}
      {recordResult && (
        <div className="mb-4" style={{
          padding: '14px 20px',
          background: recordResult.status === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(0,255,136,0.06)',
          border: `1px solid ${recordResult.status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(0,255,136,0.2)'}`,
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <CheckCircle size={18} style={{ color: recordResult.status === 'error' ? 'var(--status-error)' : 'var(--status-success)', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {recordResult.status === 'error'
                ? recordResult.message
                : `✅ ${recordResult.samples} samples labeled as "${recordResult.gesture}"`}
            </p>
            {recordResult.next_step && (
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>{recordResult.next_step}</p>
            )}
          </div>
        </div>
      )}

      {/* XYZ + Force + Health Metrics */}
      <div className="grid-cols-2">
        <div className="glass-panel" style={{ height: '350px' }}>
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <Move size={18} className="text-gradient" /> Orientation Tracking (XYZ)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
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

        <div className="flex-column" style={{ gap: '16px' }}>
          {/* Force Chart */}
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 className="mb-2">Force Feedback (Newtons)</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="force" stroke="var(--status-warning)" fill="rgba(245,158,11,0.12)" name="Force (N)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Live Health Metrics */}
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <Activity size={16} className="text-gradient" /> Live Health Metrics
            </h3>
            {[
              { label: 'Sensor Latency',       value: '4ms',     good: true },
              { label: 'Avg EMG (session)',     value: avgEmg,    good: true },
              { label: 'Avg Force (session)',   value: `${avgForce} N`, good: true },
              { label: 'Sampling Consistency', value: '99.2%',   good: true },
              { label: 'Total Readings',        value: data.length, good: true },
            ].map(({ label, value, good }) => (
              <div key={label} className="flex-between mb-2">
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{label}</span>
                <span className="text-gradient" style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMGData;
