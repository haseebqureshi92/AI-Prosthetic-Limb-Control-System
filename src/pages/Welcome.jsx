import { useNavigate } from 'react-router-dom';
import { Rocket, BrainCircuit, Activity, Globe } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <div style={{
          display: 'inline-flex',
          padding: '16px',
          borderRadius: '24px',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid var(--border-glow)',
          marginBottom: '24px'
        }}>
          <BrainCircuit size={48} className="text-gradient" style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow))' }} />
        </div>

        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
          Future of <span className="text-gradient">Bionic Mobility</span>
        </h1>
        
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6' }}>
          Experience the next generation of prosthetic limb control. 
          Driven by Artificial Intelligence, monitored in real-time, 
          and designed for human connection.
        </p>

        <div className="flex-center" style={{ gap: '20px' }}>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Get Started
            <Rocket size={20} />
          </button>
          
          <button className="btn-secondary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Learn More
          </button>
        </div>

        <div className="grid-cols-3 mt-4" style={{ marginTop: '80px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <Activity className="text-gradient" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Real-time Monitoring</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Instant EMG signal visualization and actuator status.</p>
          </div>
          <div className="glass-panel">
            <BrainCircuit className="text-gradient" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>AI-Driven Intent</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Smart movement prediction based on muscle patterns.</p>
          </div>
          <div className="glass-panel">
            <Globe className="text-gradient" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Remote Access</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Connect from anywhere to calibrate and update your limb.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
