import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Brain, Shield, Bell, Save, RefreshCcw, Zap, RotateCcw, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    sensitivity: 75,
    speed: 60,
    actuator_limit: 100,
    is_active: true
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [keysRotating, setKeysRotating] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get('settings/current/');
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('settings/current/', settings);
      showToast('✅ System configuration updated successfully.');
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('❌ Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKeys = async () => {
    if (!window.confirm('Rotate device encryption key? You must re-flash the Arduino firmware with the new token.')) return;
    setKeysRotating(true);
    try {
      await api.post('device-token/');
      showToast('🔑 Encryption keys rotated. Re-flash firmware with new token from Hardware panel.');
    } catch (err) {
      console.error('Key rotation error:', err);
      showToast('❌ Key rotation failed. Please try again.');
    } finally {
      setKeysRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <RefreshCcw className="animate-spin text-gradient" size={40} />
        <p className="text-muted">Accessing System Configuration...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          padding: '14px 22px',
          background: 'rgba(16, 24, 44, 0.95)',
          border: '1px solid var(--border-glow)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease',
          maxWidth: '380px',
        }}>
          {toast}
        </div>
      )}

      <div className="flex-between mb-4">
        <h1 style={{ fontSize: '2rem' }}>System <span className="text-gradient">Settings</span></h1>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
      
      <div className="grid-cols-2">
        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}><Brain size={20} className="text-gradient" /> Calibration & AI</h3>
          <p className="text-muted mb-4">Fine-tune the limb performance and AI reaction parameters.</p>
          
          <div className="mb-4">
            <label className="text-muted flex-between mb-1">
              Grip Sensitivity
              <span>{settings.sensitivity}%</span>
            </label>
            <input 
              type="range" 
              className="input-glass" 
              value={settings.sensitivity}
              onChange={(e) => setSettings({...settings, sensitivity: parseInt(e.target.value)})}
            />
          </div>

          <div className="mb-4">
            <label className="text-muted flex-between mb-1">
              Movement Speed
              <span>{settings.speed}%</span>
            </label>
            <input 
              type="range" 
              className="input-glass" 
              value={settings.speed}
              onChange={(e) => setSettings({...settings, speed: parseInt(e.target.value)})}
            />
          </div>

          <div className="mb-2">
            <label className="text-muted flex-between mb-1">
              Actuator Force Limit
              <span>{settings.actuator_limit}N</span>
            </label>
            <input 
              type="range" 
              className="input-glass" 
              min="10" 
              max="200"
              value={settings.actuator_limit}
              onChange={(e) => setSettings({...settings, actuator_limit: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="glass-panel">
          <h3 className="mb-3 flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}><Shield size={20} className="text-gradient" /> System Security</h3>
          <p className="text-muted mb-4">Manage access controls and hardware connectivity states.</p>
          
          <div className="flex-between mb-4 glass-panel" style={{ padding: '16px', border: '1px solid var(--border-glass)' }}>
            <div>
              <p style={{ fontWeight: 500 }}>System Active State</p>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Enable or disable bionic responses.</p>
            </div>
            <button 
              className={settings.is_active ? 'btn-primary' : 'btn-secondary'} 
              style={{ width: 'auto', padding: '10px 20px' }}
              onClick={() => setSettings({...settings, is_active: !settings.is_active})}
            >
              {settings.is_active ? 'Online' : 'Sleep'}
            </button>
          </div>

          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '16px', gap: '8px' }}
            onClick={handleRotateKeys}
            disabled={keysRotating}
          >
            <RotateCcw size={16} />
            {keysRotating ? 'Rotating Keys...' : 'Rotate Encryption Keys'}
          </button>

          <div className="mt-4" style={{ padding: '16px', background: 'rgba(0,240,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>🔌 Hardware Connection</p>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              Get your Device Token to connect your Arduino/ESP32 prosthetic hardware.
            </p>
            <a href="/hardware" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Go to Hardware Control Panel →
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
