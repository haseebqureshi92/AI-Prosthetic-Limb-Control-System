import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Cpu, Heart, Activity } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to welcome screen after 3.5 seconds for enhanced viewing
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Enhanced animated background particles */}
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.6))`,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Neural network animation lines */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${20 + i * 15}%`}
            y1={`${10 + i * 12}%`}
            x2={`${40 + i * 10}%`}
            y2={`${30 + i * 8}%`}
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            animate={{
              opacity: [0.1, 0.6, 0.1],
              strokeWidth: [1, 3, 1]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </svg>

      <motion.div
        initial={{ scale: 0.1, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 8, mass: 2, duration: 2 }}
        style={{
          display: 'inline-flex',
          padding: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(219, 234, 254, 0.95))',
          border: '4px solid transparent',
          backgroundClip: 'padding-box',
          boxShadow: '0 0 80px rgba(59, 130, 246, 0.6), inset 0 0 40px rgba(147, 51, 234, 0.3)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated gradient border */}
        <motion.div
          style={{
            position: 'absolute',
            top: -4, left: -4, right: -4, bottom: -4,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)',
            backgroundSize: '400% 400%',
            zIndex: -1
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.15, 1],
            filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BrainCircuit size={120} className="text-gradient" style={{ 
            filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.7))',
            background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }} />
        </motion.div>

        {/* Pulsing rings */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            border: '2px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '250px',
            height: '250px',
            border: '1px solid rgba(2, 132, 199, 0.2)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.h2
          style={{
            fontSize: '3rem',
            marginBottom: '8px',
            letterSpacing: '3px',
            color: 'var(--text-main)',
            textShadow: '0 0 20px rgba(2, 132, 199, 0.3)'
          }}
          animate={{
            textShadow: [
              '0 0 20px rgba(2, 132, 199, 0.3)',
              '0 0 30px rgba(2, 132, 199, 0.6)',
              '0 0 20px rgba(2, 132, 199, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          AI Prosthetic Limb
        </motion.h2>
        <motion.h3
          className="text-gradient"
          style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            letterSpacing: '5px',
            fontWeight: '300'
          }}
          animate={{
            color: ['#0284C7', '#0EA5E9', '#0284C7']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Control System
        </motion.h3>
        <motion.div
          style={{ textAlign: 'center' }}
        >
          <motion.p
            className="text-muted"
            style={{
              letterSpacing: '2px',
              fontWeight: 600,
              fontSize: '1.2rem',
              marginBottom: '15px'
            }}
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Initializing Neural Interface...
          </motion.p>
          
          {/* Real-time signal indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`signal-${i}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#3B82F6'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
          
          <motion.p
            style={{
              fontSize: '0.9rem',
              color: '#64748B',
              letterSpacing: '1px'
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Connecting to Bionic Network...
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '300px' }}
        transition={{ delay: 1.5, duration: 1.5, ease: 'easeInOut' }}
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
          marginTop: '50px',
          borderRadius: '2px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          }}
          animate={{ left: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.div>

      {/* Floating icons */}
      <motion.div
        style={{ position: 'absolute', bottom: '20%', left: '20%' }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Activity size={24} style={{ color: 'rgba(2, 132, 199, 0.4)' }} />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', top: '25%', right: '25%' }}
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Zap size={20} style={{ color: 'rgba(2, 132, 199, 0.3)' }} />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', bottom: '30%', right: '15%' }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <Cpu size={18} style={{ color: 'rgba(2, 132, 199, 0.3)' }} />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', top: '35%', left: '15%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <Heart size={22} style={{ color: 'rgba(2, 132, 199, 0.4)' }} />
      </motion.div>
    </motion.div>
  );
};

export default Splash;
