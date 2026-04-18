import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Brain, Shield, Save, RefreshCcw, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

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
      showToast('System configuration updated successfully.');
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKeys = async () => {
    setKeysRotating(true);
    try {
      await api.post('security/rotate-keys/');
      showToast('Security keys rotated successfully.');
    } catch (err) {
      console.error('Error rotating keys:', err);
      showToast('Failed to rotate security keys.');
    } finally {
      setKeysRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <SettingsIcon className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading system settings...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background particles */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.4))`,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 0
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 5, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}
      >
        <motion.h1 
          style={{ fontSize: '2.5rem', marginBottom: '8px' }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-gradient-alt">System Settings</span>
        </motion.h1>
        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Configure your prosthetic limb control parameters and preferences
        </motion.p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Performance Settings */}
        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Brain size={24} style={{ color: 'var(--accent-primary)' }} />
            </motion.div>
            <span className="text-gradient">Performance Settings</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontWeight: '600' }}>
                Sensitivity: <span style={{ color: 'var(--accent-primary)' }}>{settings.sensitivity}%</span>
              </label>
              <motion.input
                type="range"
                min="0"
                max="100"
                value={settings.sensitivity}
                onChange={(e) => setSettings({...settings, sensitivity: parseInt(e.target.value)})}
                style={{ 
                  width: '100%', 
                  marginBottom: '24px',
                  background: 'var(--accent-gradient)',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none'
                }}
                whileHover={{ scale: 1.02 }}
              />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Adjust the sensitivity of EMG signal detection. Higher values make the system more responsive to muscle signals.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontWeight: '600' }}>
                Speed: <span style={{ color: 'var(--accent-secondary)' }}>{settings.speed}%</span>
              </label>
              <motion.input
                type="range"
                min="0"
                max="100"
                value={settings.speed}
                onChange={(e) => setSettings({...settings, speed: parseInt(e.target.value)})}
                style={{ 
                  width: '100%', 
                  marginBottom: '24px',
                  background: 'var(--accent-gradient-alt)',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none'
                }}
                whileHover={{ scale: 1.02 }}
              />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Control the movement speed of the prosthetic limb. Higher values result in faster movements.
              </p>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontWeight: '600' }}>
              Actuator Limit: <span style={{ color: 'var(--accent-tertiary)' }}>{settings.actuator_limit}%</span>
            </label>
            <motion.input
              type="range"
              min="0"
              max="100"
              value={settings.actuator_limit}
              onChange={(e) => setSettings({...settings, actuator_limit: parseInt(e.target.value)})}
              style={{ 
                width: '100%', 
                marginBottom: '16px',
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))',
                height: '6px',
                borderRadius: '3px',
                outline: 'none'
              }}
              whileHover={{ scale: 1.02 }}
            />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Set the maximum force output for the actuators. This provides a safety limit for limb movements.
            </p>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'var(--accent-gradient-alt)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield size={24} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
            <span className="text-gradient-alt">System Status</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>System Active</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {settings.is_active ? 'System is operational and ready for use' : 'System is in standby mode'}
              </div>
            </div>
            <motion.div
              style={{
                width: '60px',
                height: '30px',
                background: settings.is_active ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderRadius: '15px',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setSettings({...settings, is_active: !settings.is_active})}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                style={{
                  width: '26px',
                  height: '26px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: settings.is_active ? '32px' : '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                layout
              />
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '16px', textAlign: 'center' }}
              whileHover={{ scale: 1.05 }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                {settings.sensitivity}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sensitivity</div>
            </motion.div>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '16px', textAlign: 'center' }}
              whileHover={{ scale: 1.05 }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '4px' }}>
                {settings.speed}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Speed</div>
            </motion.div>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '16px', textAlign: 'center' }}
              whileHover={{ scale: 1.05 }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-tertiary)', marginBottom: '4px' }}>
                {settings.actuator_limit}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Force Limit</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={staggerItem} className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '4px',
              background: 'linear-gradient(90deg, var(--status-success), var(--accent-primary))'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              animate={{ rotate: [0, 180, -180, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RotateCcw size={24} style={{ color: 'var(--status-success)' }} />
            </motion.div>
            <span className="text-gradient">Security Settings</span>
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Rotate your encryption keys for enhanced security. This action will invalidate all existing sessions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRotateKeys}
              disabled={keysRotating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--status-success)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--status-success)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: keysRotating ? 'not-allowed' : 'pointer',
                opacity: keysRotating ? 0.6 : 1
              }}
            >
              {keysRotating ? 'Rotating...' : 'Rotate Security Keys'}
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSettings}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCcw size={18} />
            Reset Changes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
              padding: '14px 22px', background: 'var(--bg-panel)',
              border: '1px solid var(--border-glass)', borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)', color: 'var(--text-main)',
              fontSize: '0.95rem'
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
