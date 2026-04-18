import { AnimatePresence, motion } from 'framer-motion';

export const pageTransitions = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20, mass: 1.2 }
  },
};

export const hoverEffect = {
  scale: 1.08,
  y: -8,
  rotate: [0, -2, 2, 0],
  boxShadow: "0px 15px 40px rgba(2, 132, 199, 0.3)",
  transition: { type: 'spring', stiffness: 400, damping: 12 }
};

export const glowButtonParams = {
  whileHover: { scale: 1.1, filter: 'brightness(1.3)', boxShadow: '0 0 25px rgba(2, 132, 199, 0.5)' },
  whileTap: { scale: 0.92 },
  transition: { type: 'spring', stiffness: 500, damping: 15 }
};

export const floatingAnimation = {
  animate: {
    y: ['-25px', '25px'],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.08, 1],
    boxShadow: [
      '0px 0px 0px rgba(2, 132, 199, 0)',
      '0px 0px 30px rgba(2, 132, 199, 0.4)',
      '0px 0px 0px rgba(2, 132, 199, 0)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const slideInFromLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const slideInFromRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

export const fadeInUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const rotateIn = {
  initial: { rotate: -180, opacity: 0, scale: 0.5 },
  animate: { rotate: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
};

export const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={{
      initial: { opacity: 0, scale: 0.98, y: 30 },
      animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25, mass: 0.8 } },
      exit: { opacity: 0, scale: 1.02, y: -30, transition: { duration: 0.4 } }
    }}
    className={className}
    style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
  >
    {children}
  </motion.div>
);
