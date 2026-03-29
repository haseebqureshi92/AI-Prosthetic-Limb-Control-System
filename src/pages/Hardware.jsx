import { useState, useEffect } from 'react';
import { 
  Cpu, Wifi, WifiOff, Activity, Zap, AlertTriangle, 
  CheckCircle, RefreshCcw, Send, ShieldAlert, 
  BrainCircuit, RotateCcw, Hand, Key, Copy
} from 'lucide-react';
import api from '../services/api';

const Hardware = () => {
  const [deviceToken, setDeviceToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingCmd, setSendingCmd] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [trainingGesture, setTrainingGesture] = useState('GRIP');
  const [trainingResult, setTrainingResult] = useState(null);

  const fetchData = async () => {
    try {
      const [tokenRes, statusRes, historyRes] = await Promise.all([
        api.get('device-token/'),
        api.get('dashboard/'),
        api.get('commands/history/'),
      ]);
      setDeviceToken(tokenRes.data);
      setStatus(statusRes.data);
      setCmdHistory(historyRes.data);
    } catch (err) {
      console.error('Error fetching hardware data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (command) => {
    setSendingCmd(command);
    try {
      await api.post('commands/send/', { command });
      await fetchData(); // refresh history
    } catch (err) {
      console.error('Error sending command:', err);
    } finally {
      setSendingCmd('');
    }
  };

  const emergencyStop = async () => {
    setSendingCmd('STOP');
    try {
      await api.post('commands/emergency-stop/');
      await fetchData();
    } catch (err) {
      console.error('Emergency stop error:', err);
    } finally {
      setSendingCmd('');
    }
  };

  const regenerateToken = async () => {
    if (!window.confirm('Regenerate token? You must re-flash the Arduino firmware with the new token.')) return;
    try {
      const res = await api.post('device-token/');
      setDeviceToken({ ...deviceToken, token: res.data.token });
    } catch (err) {
      console.error(err);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(deviceToken?.token || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recordTraining = async () => {
    try {
      const res = await api.post('training/record/', { gesture: trainingGesture });
      setTrainingResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isConnected = status?.hw_connected;

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Loading Hardware Interface...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Hardware <span className="text-gradient">Control Panel</span></h1>
          <p className="text-muted">Manage your prosthetic limb connection and commands.</p>
        </div>
        <div className="flex-center" style={{ gap: '12px' }}>
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {isConnected ? 'Hardware Connected' : 'Hardware Offline'}
          </span>
        </div>
      </div>

      {/* Connection Status Banner */}
      <div className="glass-panel mb-4" style={{
        background: isConnected ? 'rgba(0,255,136,0.05)' : 'rgba(255,100,0,0.05)',
        border: `1px solid ${isConnected ? 'rgba(0,255,136,0.3)' : 'rgba(255,100,0,0.3)'}`,
      }}>
        <div className="flex-between">
          <div className="flex-center" style={{ gap: '16px' }}>
            {isConnected ? <Wifi size={28} className="text-gradient" /> : <WifiOff size={28} style={{ color: 'rgba(255,100,0,0.8)' }} />}
            <div>
              <h3>{isConnected ? '✅ Hardware Online & Transmitting' : '⚠️ Hardware Not Connected'}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                {isConnected
                  ? `Last data received: ${status?.hw_last_seen ? new Date(status.hw_last_seen).toLocaleTimeString() : 'Just now'}`
                  : 'Flash the Arduino firmware and connect to WiFi to start. See hardware/HARDWARE_SETUP.md'}
              </p>
            </div>
          </div>
          <div className="flex-center" style={{ gap: '12px' }}>
            <div className="glass-panel text-center" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Battery</p>
              <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{status?.battery_level || 0}%</p>
            </div>
            <div className="glass-panel text-center" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>AI Gesture</p>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{status?.ai_gesture || 'Idle'}</p>
            </div>
            <div className="glass-panel text-center" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Confidence</p>
              <p className="text-gradient" style={{ fontWeight: 700, fontSize: '1.2rem' }}>{status?.ai_confidence || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cols-2 mb-4" style={{ gap: '20px' }}>
        {/* Device Token */}
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <Key size={20} className="text-gradient" /> Device API Token
          </h3>
          <p className="text-muted mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            Copy this token and paste it into the <code>DEVICE_TOKEN</code> variable in your <strong>prosthetic_limb.ino</strong> firmware before flashing.
          </p>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            wordBreak: 'break-all',
            marginBottom: '12px',
            color: 'var(--accent-secondary)',
          }}>
            {deviceToken?.token || 'Loading...'}
          </div>
          <div className="flex-between">
            <button className="btn-secondary" onClick={copyToken} style={{ flex: 1, marginRight: '8px' }}>
              <Copy size={16} /> {copied ? 'Copied!' : 'Copy Token'}
            </button>
            <button className="btn-secondary" onClick={regenerateToken} style={{ flex: 1 }}>
              <RotateCcw size={16} /> Regenerate
            </button>
          </div>
          <div className="mt-4" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>Quick Connect Steps:</p>
            <ol style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '16px', lineHeight: '2' }}>
              <li>Copy token above</li>
              <li>Open <code>hardware/prosthetic_limb.ino</code></li>
              <li>Paste into <code>DEVICE_TOKEN = "..."</code></li>
              <li>Set your WiFi name & password</li>
              <li>Set SERVER_URL to your PC's IP address</li>
              <li>Flash to ESP32 — done!</li>
            </ol>
          </div>
        </div>

        {/* Motor Status */}
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <Cpu size={20} className="text-gradient" /> Motor Angles (AI Prediction)
          </h3>
          <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
            Current servo positions predicted by AI from EMG signal.
          </p>
          {status?.motor_angles && Object.keys(status.motor_angles).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(status.motor_angles).map(([joint, angle]) => (
                <div key={joint}>
                  <div className="flex-between mb-1">
                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{joint}</span>
                    <span className="text-gradient">{angle}°</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                      width: `${(angle / 180) * 100}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-center" style={{ height: '150px', flexDirection: 'column', gap: '12px' }}>
              <Cpu size={32} className="text-muted" />
              <p className="text-muted">No motor data yet. Connect hardware.</p>
            </div>
          )}
        </div>
      </div>

      {/* Remote Commands */}
      <div className="glass-panel mb-4">
        <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
          <Send size={20} className="text-gradient" /> Remote Command Center (SRS §3.2 UC-2)
        </h3>
        <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
          Commands are queued and sent to hardware within 100ms. Simulated in software until hardware is connected.
        </p>

        {/* Emergency Stop */}
        <div style={{
          padding: '16px',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '12px',
          marginBottom: '16px',
          background: 'rgba(239,68,68,0.05)',
        }}>
          <div className="flex-between">
            <div>
              <h4 style={{ color: 'rgb(239,68,68)', fontWeight: 700 }}>🛑 Emergency Stop</h4>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Immediately freezes all limb movement (SRS §5.2)</p>
            </div>
            <button
              onClick={emergencyStop}
              disabled={sendingCmd === 'STOP'}
              style={{
                padding: '12px 24px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.5)',
                borderRadius: '8px',
                color: 'rgb(239,68,68)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              <ShieldAlert size={18} style={{ marginRight: '8px', display: 'inline' }} />
              {sendingCmd === 'STOP' ? 'STOPPING...' : 'EMERGENCY STOP'}
            </button>
          </div>
        </div>

        {/* Command Grid */}
        <div className="grid-cols-4" style={{ gap: '12px' }}>
          {[
            { cmd: 'RELEASE',   label: 'Open Hand',     icon: '🖐️' },
            { cmd: 'GRIP',      label: 'Close / Grip',  icon: '✊' },
            { cmd: 'PINCH',     label: 'Pinch',         icon: '🤌' },
            { cmd: 'ROTATE_CW', label: 'Rotate CW',     icon: '🔃' },
            { cmd: 'ROTATE_CCW',label: 'Rotate CCW',    icon: '🔄' },
            { cmd: 'SLEEP',     label: 'Sleep Mode',    icon: '💤' },
            { cmd: 'CALIBRATE', label: 'Calibrate',     icon: '⚙️' },
          ].map(({ cmd, label, icon }) => (
            <button
              key={cmd}
              className="btn-secondary"
              style={{ padding: '16px 8px', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}
              onClick={() => sendCommand(cmd)}
              disabled={!!sendingCmd}
            >
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              {sendingCmd === cmd ? '...' : label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-cols-2 mb-4" style={{ gap: '20px' }}>
        {/* Training Mode */}
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <BrainCircuit size={20} className="text-gradient" /> Training Mode (SRS UC-4)
          </h3>
          <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
            Perform a gesture and label the last 50 sensor readings to train the AI model.
          </p>
          <select
            className="input-glass mb-3"
            value={trainingGesture}
            onChange={(e) => setTrainingGesture(e.target.value)}
          >
            <option value="GRIP">Power Grip (Close Fist)</option>
            <option value="OPEN">Open Hand</option>
            <option value="PINCH">Precision Pinch</option>
            <option value="ROTATE">Wrist Rotation</option>
            <option value="IDLE">Idle / Rest</option>
          </select>
          <button className="btn-primary" style={{ width: '100%' }} onClick={recordTraining}>
            <Activity size={16} /> Record Gesture Sample
          </button>
          {trainingResult && (
            <div className="mt-3" style={{ padding: '12px', background: 'rgba(0,255,136,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.2)' }}>
              <p style={{ fontSize: '0.85rem' }}>✅ {trainingResult.samples} samples labeled as <strong>{trainingResult.gesture}</strong></p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>{trainingResult.next_step}</p>
            </div>
          )}
        </div>

        {/* Command History */}
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            <Activity size={20} className="text-gradient" /> Command History
          </h3>
          <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cmdHistory.length > 0 ? cmdHistory.map((cmd) => (
              <div key={cmd.id} className="flex-between" style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div className="flex-center" style={{ gap: '10px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px',
                    background: cmd.command === 'STOP' ? 'rgba(239,68,68,0.2)' : 'rgba(0,240,255,0.1)',
                    color: cmd.command === 'STOP' ? 'rgb(239,68,68)' : 'var(--accent-primary)'
                  }}>{cmd.command}</span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{cmd.issued_by}</span>
                </div>
                <div className="flex-center" style={{ gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem',
                    color: cmd.status === 'executed' ? 'var(--status-success)' : cmd.status === 'delivered' ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}>{cmd.status}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(cmd.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )) : (
              <div className="flex-center" style={{ height: '100px' }}>
                <p className="text-muted">No commands sent yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hardware;
