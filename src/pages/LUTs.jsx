import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, glowButtonParams } from '../utils/animations';
import { Table, Database, SlidersHorizontal, Save, Plus, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';

const initialLUT = [
  { id: 1, gesture: 'GRIP', target_angle: 120, sensitivity: 0.85, ai_threshold: 0.72 },
  { id: 2, gesture: 'OPEN', target_angle: 10, sensitivity: 0.65, ai_threshold: 0.55 },
  { id: 3, gesture: 'PINCH', target_angle: 95, sensitivity: 0.78, ai_threshold: 0.68 },
  { id: 4, gesture: 'ROTATE', target_angle: 40, sensitivity: 0.80, ai_threshold: 0.70 },
];

const LUTs = () => {
  const [lutData, setLutData] = useState(initialLUT);
  const [saved, setSaved] = useState(false);
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchLUTData = async () => {
    try {
      const response = await api.get('luts/');
      if (response.data && response.data.length > 0) {
        setLutData(response.data);
      }
      setHardwareConnected(true);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching LUT data:', err);
      setHardwareConnected(false);
      // Show default data but indicate offline status
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (id, field, value) => {
    setLutData((current) => current.map((row) => (
      row.id === id ? { ...row, [field]: field === 'gesture' ? value : Number(value) } : row
    )));
    setSaved(false);
  };

  const addRow = () => {
    setLutData((current) => ([
      ...current,
      { id: Date.now(), gesture: 'CUSTOM', target_angle: 80, sensitivity: 0.75, ai_threshold: 0.65 }
    ]));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await api.post('luts/', { luts: lutData });
      setSaved(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving LUTs:', err);
    }
  };

  useEffect(() => {
    fetchLUTData();
    // Optimized refresh rate - every 2 seconds for better performance
    intervalRef.current = setInterval(fetchLUTData, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
        >
          <Table className="text-gradient" size={40} />
        </motion.div>
        <motion.p 
          className="text-muted"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading lookup tables...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Hardware Connection Status */}
      <motion.div 
        variants={staggerItem}
        className="glass-panel mb-4" 
        style={{ 
          padding: '16px', 
          border: hardwareConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          background: hardwareConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {hardwareConnected ? 
              <Wifi size={24} style={{ color: 'var(--status-success)' }} /> : 
              <WifiOff size={24} style={{ color: 'var(--status-error)' }} />
            }
          </motion.div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
              LUT Status: <span style={{ color: hardwareConnected ? 'var(--status-success)' : 'var(--status-error)' }}>
                {hardwareConnected ? 'Active' : 'Offline'}
              </span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {hardwareConnected ? 'Real-time gesture mapping active' : 'Using default lookup tables'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last update:</span>
          <motion.span 
            style={{ 
              color: 'var(--accent-primary)', 
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            {new Date(lastUpdate).toLocaleTimeString()}
          </motion.span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div variants={staggerItem} className="flex-between mb-4">
        <div>
          <motion.h1 
            style={{ fontSize: '2rem', marginBottom: '8px' }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Lookup Tables <span className="text-gradient-alt">(LUTs)</span>
          </motion.h1>
          <p className="text-muted">Fine-tune gesture mapping, AI thresholds, and control response behavior.</p>
        </div>
        <div className="flex-center" style={{ gap: '10px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Save size={18} className="text-gradient" />
          </motion.div>
          <span className="text-muted">LUTs are bridge between sensor data, AI intent, and actuator commands.</span>
        </div>
      </motion.div>

      {saved && (
        <motion.div variants={staggerItem} className="glass-panel mb-4" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Lookup table saved successfully.</p>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Your control logic and AI mapping values are ready for next training cycle.</p>
        </motion.div>
      )}

      {/* Main LUT Table */}
      <motion.div variants={staggerItem} className="glass-panel mb-4">
        <div className="flex-between mb-4">
          <div>
            <h3 className="mb-1 flex-center" style={{ gap: '10px' }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Table size={18} className="text-gradient" />
              </motion.div>
              Gesture Mapping
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Edit target positions and sensor sensitivity for each prosthetic action.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addRow}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Add Gesture
          </motion.button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: 600 }}>Gesture</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: 600 }}>Target Angle (°)</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: 600 }}>Sensitivity</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: 600 }}>AI Threshold</th>
              </tr>
            </thead>
            <tbody>
              {lutData.map((row, index) => (
                <motion.tr 
                  key={row.id} 
                  variants={staggerItem} 
                  style={{ borderBottom: '1px solid var(--border-glass)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td style={{ padding: '14px' }}>
                    <input
                      value={row.gesture}
                      onChange={(e) => updateRow(row.id, 'gesture', e.target.value)}
                      className="input-glass"
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '14px' }}>
                    <input
                      type="number"
                      value={row.target_angle}
                      onChange={(e) => updateRow(row.id, 'target_angle', e.target.value)}
                      className="input-glass"
                      min="0"
                      max="180"
                    />
                  </td>
                  <td style={{ padding: '14px' }}>
                    <input
                      type="number"
                      step="0.01"
                      value={row.sensitivity}
                      onChange={(e) => updateRow(row.id, 'sensitivity', e.target.value)}
                      className="input-glass"
                      min="0"
                      max="1"
                    />
                  </td>
                  <td style={{ padding: '14px' }}>
                    <input
                      type="number"
                      step="0.01"
                      value={row.ai_threshold}
                      onChange={(e) => updateRow(row.id, 'ai_threshold', e.target.value)}
                      className="input-glass"
                      min="0"
                      max="1"
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Info Panels */}
      <motion.div variants={staggerContainer} className="grid-cols-2">
        <motion.div variants={staggerItem} className="glass-panel">
          <div className="flex-between mb-3">
            <div>
              <h3 className="mb-1 flex-center" style={{ gap: '10px' }}>
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Database size={18} className="text-gradient" />
                </motion.div>
                Data Lookup Notes
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>This table controls how incoming EMG patterns translate into prosthetic responses.</p>
            </div>
          </div>
          <ul style={{ listStyle: 'disc inside', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <li>Gesture LUTs define actuator goal positions at runtime.</li>
            <li>Sensitivity values scale raw EMG input for smoother control.</li>
            <li>AI thresholds determine when model commits to a predicted move.</li>
            <li>Real-time updates every 500ms for smooth operation.</li>
          </ul>
        </motion.div>

        <motion.div variants={staggerItem} className="glass-panel">
          <div className="flex-between mb-3">
            <div>
              <h3 className="mb-1 flex-center" style={{ gap: '10px' }}>
                <motion.div
                  animate={{ rotate: [0, 180, -180, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <SlidersHorizontal size={18} className="text-gradient" />
                </motion.div>
                Control Logic Preview
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Watch how AI and LUT values shape each prosthetic command.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {lutData.slice(0, 3).map((row, index) => (
              <motion.div 
                key={row.id} 
                style={{ 
                  padding: '14px', 
                  borderRadius: '14px', 
                  background: 'rgba(0, 240, 255, 0.06)', 
                  border: '1px solid rgba(0, 240, 255, 0.12)' 
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <p style={{ marginBottom: '8px', fontWeight: 600 }}>{row.gesture}</p>
                <div className="flex-between" style={{ gap: '12px', flexWrap: 'wrap' }}>
                  <span className="text-muted">Angle: {row.target_angle}°</span>
                  <span className="text-muted">Sensitivity: {row.sensitivity}</span>
                  <span className="text-muted">AI threshold: {row.ai_threshold}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={staggerItem} className="mt-4">
        <motion.button 
          {...glowButtonParams} 
          className="btn-primary" 
          onClick={handleSave} 
          style={{ padding: '16px 26px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={18} /> Save LUT Configuration
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LUTs;
