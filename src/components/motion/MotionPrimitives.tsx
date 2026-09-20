import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { 
  useMotionSafe, 
  DURATION, 
  EASE,
  fadeInVariants, 
  slideUpVariants, 
  scaleInVariants, 
  pageTransitionVariants,
  createStaggerContainer,
  staggerItemVariants,
  cardHoverVariants,
  buttonPressVariants
} from '../../utils/motion';

/**
 * PageTransition: Smooth cross-fade and slight 8px lift for page routes
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isReduced } = useMotionSafe();

  return (
    <motion.div
      initial={isReduced ? { opacity: 1 } : 'hidden'}
      animate="visible"
      exit={isReduced ? { opacity: 1 } : 'exit'}
      variants={isReduced ? undefined : pageTransitionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeIn: Gentle opacity reveal
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration, className = '' }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: duration || DURATION.normal, 
        delay, 
        ease: EASE.out 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideUp: Subtle vertical entry
 */
export const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  offset?: number;
  className?: string;
}> = ({ children, delay = 0, offset = 12, className = '' }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, delay, ease: EASE.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleIn: Modal and card soft pop
 */
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
  className?: string;
}> = ({ children, delay = 0, from = 0.97, className = '' }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.normal, delay, ease: EASE.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer & StaggerItem: Orchestrated sequential children entrances
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.06, delayChildren = 0.04, className = '' }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={createStaggerContainer(staggerDelay, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * HoverLift: Tactile -2.5px elevation on hover, subtle scale on press
 */
export const HoverLift: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced) {
    return (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="press"
      variants={cardHoverVariants}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * PressFeedback: Subtle 0.98 scale compression
 */
export const PressFeedback: React.FC<{
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', disabled = false, onClick }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced || disabled) {
    return (
      <div onClick={disabled ? undefined : onClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * SuccessCheckmark: Calm SVG path drawing animation
 * Replaces loud fireworks/confetti with an encouraging, dignified moment
 */
export const SuccessCheckmark: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 48, color = '#10B981', className = '' }) => {
  const { isReduced } = useMotionSafe();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background */}
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          stroke={color}
          strokeWidth="2.5"
          initial={isReduced ? { pathLength: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: isReduced ? 0.001 : 0.45, ease: EASE.out }}
        />
        {/* Check stroke */}
        <motion.path
          d="M16 26.5L23 33.5L36 19.5"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: isReduced ? 0.001 : 0.35, 
            delay: isReduced ? 0 : 0.25, 
            ease: EASE.out 
          }}
        />
      </svg>
    </div>
  );
};

/**
 * PulseIndicator: Restrained state dot for active, telemetry, or voice status
 */
export const PulseIndicator: React.FC<{
  color?: string;
  size?: number;
  pulse?: boolean;
}> = ({ color = '#10B981', size = 8, pulse = true }) => {
  const { isReduced } = useMotionSafe();

  if (isReduced || !pulse) {
    return (
      <span
        className="inline-block rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    );
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      <motion.span
        className="absolute rounded-full opacity-60"
        style={{
          width: size * 2,
          height: size * 2,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span
        className="relative inline-block rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    </span>
  );
};

/**
 * SkeletonLoader: Content-aware soft shimmer
 */
export const SkeletonLoader: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}> = ({ width = '100%', height = '1rem', borderRadius = '0.75rem', className = '' }) => {
  const { isReduced } = useMotionSafe();

  return (
    <div
      className={`overflow-hidden bg-ner-border/40 relative ${className}`}
      style={{ width, height, borderRadius }}
    >
      {!isReduced && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
};
