import { useNavigate } from 'react-router-dom';
import { Rocket, BrainCircuit, Activity, Globe, Zap, Cpu, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageWrapper, staggerContainer, staggerItem, glowButtonParams, floatingAnimation, pulseAnimation } from '../utils/animations';

const Welcome = () => {
  const navigate = useNavigate();

  console.log('[Welcome] Component rendered, navigate function available:', typeof navigate);

  return (
    <PageWrapper className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Enhanced Floating Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          opacity: 0.15,
          zIndex: 0
        }}
        animate={{
          y: ['-40px', '40px'],
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <BrainCircuit size={140} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '12%',
          opacity: 0.12,
          zIndex: 0
        }}
        animate={{
          y: ['40px', '-40px'],
          scale: [1, 1.3, 1],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <Zap size={120} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '15%',
          opacity: 0.1,
          zIndex: 0
        }}
        animate={{
          x: ['-30px', '30px'],
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <Cpu size={100} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          opacity: 0.13,
          zIndex: 0
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.13, 0.2, 0.13],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Heart size={110} />
      </motion.div>

      {/* Enhanced floating particles with real-time signals */}
      {[...Array(10)].map((_, i) => (
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
            zIndex: 0,
            boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
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
            delay: Math.random() * 1.5,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Real-time signal waves */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`wave-${i}`}
            cx={`${20 + i * 10}%`}
            cy={`${30 + i * 8}%`}
            r="3"
            fill="rgba(59, 130, 246, 0.6)"
            animate={{
              r: [3, 8, 3],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </svg>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}
      >
        <motion.div 
          variants={staggerItem}
          {...floatingAnimation}
          style={{
            display: 'inline-flex',
            padding: '35px',
            borderRadius: '35px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(219, 234, 254, 0.95))',
            border: '4px solid transparent',
            backgroundClip: 'padding-box',
            boxShadow: '0 35px 80px rgba(59, 130, 246, 0.5), inset 0 0 40px rgba(139, 92, 246, 0.2)',
            marginBottom: '50px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated gradient border */}
          <motion.div
            style={{
              position: 'absolute',
              top: -4, left: -4, right: -4, bottom: -4,
              borderRadius: '35px',
              background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)',
              backgroundSize: '400% 400%',
              zIndex: -1
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          {/* Glow effect */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            whileHover={{ scale: 1.3, rotate: 45 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <BrainCircuit size={85} className="text-gradient" style={{ 
              filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))',
              background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} />
          </motion.div>
        </motion.div>

        <motion.h1 
          variants={staggerItem} 
          style={{ fontSize: '4.5rem', marginBottom: '25px', lineHeight: '1.1' }}
          animate={{
            textShadow: [
              '0 0 0px rgba(59, 130, 246, 0)',
              '0 0 35px rgba(59, 130, 246, 0.8)',
              '0 0 0px rgba(59, 130, 246, 0)'
            ],
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Future of <span className="text-gradient-alt">AI Prosthetic Limb</span>
        </motion.h1>
        
        <motion.div variants={staggerItem} style={{ marginBottom: '60px' }}>
          <motion.p 
            className="text-muted" 
            style={{ fontSize: '1.4rem', marginBottom: '20px', lineHeight: '1.7' }}
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Experience the next generation of prosthetic limb control. 
            Driven by Artificial Intelligence, monitored in real-time, 
            and designed for human connection.
          </motion.p>
          
          {/* Real-time status indicator */}
          <motion.div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
            animate={{
              borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span style={{ fontSize: '0.9rem', color: '#3B82F6', fontWeight: '500' }}>
              System Online - Real-time Active
            </span>
          </motion.div>
        </motion.div>

        <motion.div variants={staggerItem} className="flex-center" style={{ gap: '30px', marginBottom: '70px', position: 'relative', zIndex: 10 }}>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[Welcome] GET STARTED CLICKED!');
              console.log('[Welcome] Navigating to /login...');
              // Use window.location for direct navigation
              window.location.href = '/login';
            }}
            className="btn-primary"
            style={{
              padding: '20px 50px',
              fontSize: '1.3rem',
              cursor: 'pointer',
              zIndex: 9999,
              position: 'relative',
              background: 'var(--accent-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              pointerEvents: 'auto',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)'
            }}
            whileHover={{ 
              scale: 1.08, 
              boxShadow: '0 15px 40px rgba(59, 130, 246, 0.7)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
            <Rocket size={24} />
          </motion.button>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid-cols-3" style={{ marginTop: '80px', gap: '30px' }}>
          {[
            { icon: Activity, title: 'Real-time Monitoring', desc: 'Instant EMG signal visualization and actuator status.', color: '#10B981' },
            { icon: BrainCircuit, title: 'AI-Driven Intent', desc: 'Smart movement prediction based on muscle patterns.', color: '#0284C7' },
            { icon: Globe, title: 'Remote Access', desc: 'Connect from anywhere to calibrate and update your limb.', color: '#F59E0B' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={staggerItem}
              whileHover={{ 
                scale: 1.08, 
                y: -15, 
                boxShadow: '0 20px 50px rgba(0, 240, 255, 0.25)',
                rotateY: 5
              }}
              className="glass-panel" 
              style={{ padding: '30px', cursor: 'pointer' }}
              {...pulseAnimation}
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(2, 132, 199, 0.1)',
                  `0 4px 20px ${item.color}20`,
                  '0 4px 20px rgba(2, 132, 199, 0.1)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: idx * 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.8 }}
              >
                <item.icon className="text-gradient" style={{ marginBottom: '18px', color: item.color }} size={36} />
              </motion.div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>{item.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
              <motion.div
                style={{
                  width: '100%',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                  marginTop: '15px',
                  borderRadius: '1px'
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action arrow */}
        <motion.div
          style={{ marginTop: '40px' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowRight size={24} style={{ color: 'var(--accent-primary)', transform: 'rotate(90deg)' }} />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

export default Welcome;
