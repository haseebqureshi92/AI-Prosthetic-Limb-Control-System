import { motion } from 'framer-motion';
import { Activity, Wifi, Cpu, Zap } from 'lucide-react';

const RealTimeSignals = ({ position = 'bottom-right' }) => {
  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.2)'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Signal Strength Indicator */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`signal-${i}`}
            style={{
              width: '3px',
              height: `${8 + i * 4}px`,
              background: i < 3 ? '#10B981' : '#E5E7EB',
              borderRadius: '1px'
            }}
            animate={{
              opacity: i < 3 ? [0.5, 1, 0.5] : [0.3, 0.5, 0.3],
              height: i < 3 ? [`${8 + i * 4}px`, `${12 + i * 4}px`, `${8 + i * 4}px`] : `${8 + i * 4}px`
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      {/* Connection Status */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Wifi size={16} style={{ color: '#3B82F6' }} />
        </motion.div>
        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
          Connected
        </span>
      </motion.div>

      {/* Real-time Data Pulse */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Activity size={14} style={{ color: '#10B981' }} />
        </motion.div>
        <motion.span
          style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: '600' }}
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          LIVE
        </motion.span>
      </motion.div>

      {/* Processing Indicator */}
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Cpu size={14} style={{ color: '#8B5CF6' }} />
      </motion.div>
    </motion.div>
  );
};

export default RealTimeSignals;
