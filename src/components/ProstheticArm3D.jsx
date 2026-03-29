/**
 * ProstheticArm3D — Animated SVG Prosthetic Hand
 * SRS §2.2: "3D model of prosthetic limb showing estimated movement"
 * 
 * Updates finger positions in real-time based on AI gesture prediction.
 * Gestures: OPEN, GRIP (Power Grip), PINCH, ROTATE, IDLE
 */

const GESTURE_STYLES = {
  'Open Hand':      { thumb: 0,  index: 0,  middle: 0,  wrist: 0,  color: '#00f0ff' },
  'Power Grip':     { thumb: 85, index: 90, middle: 90, wrist: 0,  color: '#00ff88' },
  'Precision Pinch':{ thumb: 70, index: 75, middle: 0,  wrist: 0,  color: '#a78bfa' },
  'Wrist Rotation': { thumb: 30, index: 30, middle: 30, wrist: 35, color: '#fb923c' },
  'Idle / Resting': { thumb: 15, index: 15, middle: 15, wrist: 0,  color: '#64748b' },
};

const getStyle = (gesture) =>
  GESTURE_STYLES[gesture] || GESTURE_STYLES['Idle / Resting'];

// Maps 0–90 angle to finger curl SVG path
const fingerPath = (x, baseY, curl) => {
  const len1 = 28, len2 = 22, len3 = 18;
  const rad = (curl / 90) * (Math.PI / 2);
  const k1x = x + len1 * Math.sin(rad);
  const k1y = baseY - len1 * Math.cos(rad);
  const k2x = k1x + len2 * Math.sin(rad * 1.4);
  const k2y = k1y - len2 * Math.cos(rad * 1.4);
  const tipX = k2x + len3 * Math.sin(rad * 1.7);
  const tipY = k2y - len3 * Math.cos(rad * 1.7);
  return { k1x, k1y, k2x, k2y, tipX, tipY, baseX: x, baseY };
};

const Finger = ({ x, baseY, curl, color, label }) => {
  const p = fingerPath(x, baseY, curl);
  return (
    <g>
      <line x1={p.baseX} y1={p.baseY} x2={p.k1x} y2={p.k1y}
        stroke={color} strokeWidth={8} strokeLinecap="round" />
      <circle cx={p.k1x} cy={p.k1y} r={4} fill={color} opacity={0.6} />
      <line x1={p.k1x} y1={p.k1y} x2={p.k2x} y2={p.k2y}
        stroke={color} strokeWidth={7} strokeLinecap="round" />
      <circle cx={p.k2x} cy={p.k2y} r={3.5} fill={color} opacity={0.6} />
      <line x1={p.k2x} y1={p.k2y} x2={p.tipX} y2={p.tipY}
        stroke={color} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

const ProstheticArm3D = ({ gesture = 'Idle / Resting', motorAngles = {} }) => {
  const s = getStyle(gesture);

  // Use motor angles from backend if available, else fall back to gesture presets
  const thumbCurl  = motorAngles.thumb  ?? s.thumb;
  const indexCurl  = motorAngles.index  ?? s.index;
  const middleCurl = motorAngles.middle ?? s.middle;
  const wristRot   = motorAngles.wrist  ? motorAngles.wrist - 90 : s.wrist; // normalize to degrees from center

  const accentColor = s.color;

  return (
    <div className="glass-panel" style={{ padding: '16px' }}>
      <div className="flex-between mb-2">
        <h3 style={{ fontSize: '0.95rem' }}>3D Limb Visualization</h3>
        <span style={{
          fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px',
          background: `${accentColor}20`, color: accentColor, fontWeight: 600,
        }}>
          {gesture}
        </span>
      </div>

      <svg
        viewBox="0 0 200 200"
        style={{
          width: '100%',
          height: '160px',
          filter: `drop-shadow(0 0 12px ${accentColor}40)`,
          transition: 'filter 0.5s ease',
        }}
      >
        {/* Wrist/Arm body */}
        <g transform={`rotate(${wristRot}, 100, 155)`} style={{ transition: 'all 0.6s ease' }}>
          {/* Palm */}
          <rect x={68} y={110} width={64} height={55} rx={14}
            fill={`${accentColor}15`} stroke={accentColor} strokeWidth={1.5} />

          {/* Arm segment */}
          <rect x={80} y={155} width={40} height={40} rx={8}
            fill={`${accentColor}10`} stroke={`${accentColor}60`} strokeWidth={1} />

          {/* Knuckle base indicators */}
          {[83, 99, 115, 131].map((x, i) => (
            <circle key={i} cx={x} cy={113} r={4} fill={`${accentColor}40`} stroke={accentColor} strokeWidth={1} />
          ))}

          {/* Thumb (diagonal from left of palm) */}
          <g transform="rotate(-35, 75, 130)">
            <Finger x={75} baseY={130} curl={thumbCurl} color={accentColor} label="Thumb" />
          </g>

          {/* Index finger */}
          <Finger x={83}  baseY={113} curl={indexCurl}  color={accentColor} />
          {/* Middle finger */}
          <Finger x={99}  baseY={110} curl={middleCurl} color={accentColor} />
          {/* Ring finger (same as middle) */}
          <Finger x={115} baseY={111} curl={middleCurl} color={accentColor} />
          {/* Pinky (half curl of middle) */}
          <Finger x={131} baseY={115} curl={Math.round(middleCurl * 0.7)} color={accentColor} />

          {/* Palm circuit lines */}
          <line x1={83} y1={115} x2={83} y2={140} stroke={`${accentColor}25`} strokeWidth={1} strokeDasharray="4 4" />
          <line x1={99} y1={112} x2={99} y2={140} stroke={`${accentColor}25`} strokeWidth={1} strokeDasharray="4 4" />
          <line x1={115} y1={113} x2={115} y2={140} stroke={`${accentColor}25`} strokeWidth={1} strokeDasharray="4 4" />
          <line x1={131} y1={117} x2={131} y2={140} stroke={`${accentColor}25`} strokeWidth={1} strokeDasharray="4 4" />
        </g>

        {/* Wrist rotation label */}
        {Math.abs(wristRot) > 5 && (
          <text x={100} y={20} textAnchor="middle" fill={accentColor} fontSize={10} fontFamily="monospace">
            Wrist: {wristRot > 0 ? '+' : ''}{wristRot}°
          </text>
        )}

        {/* Motor angle mini-labels */}
        <text x={4} y={195} fill={`${accentColor}80`} fontSize={8} fontFamily="monospace">
          T:{thumbCurl}° I:{indexCurl}° M:{middleCurl}°
        </text>
      </svg>

      {/* Motor angle bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
        {[
          { label: 'Thumb',  value: thumbCurl },
          { label: 'Index',  value: indexCurl },
          { label: 'Middle', value: middleCurl },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="flex-between" style={{ fontSize: '0.72rem', marginBottom: '2px' }}>
              <span className="text-muted">{label}</span>
              <span style={{ color: accentColor }}>{value}°</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
              <div style={{
                width: `${(value / 90) * 100}%`,
                height: '100%', borderRadius: '2px',
                background: accentColor,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProstheticArm3D;
