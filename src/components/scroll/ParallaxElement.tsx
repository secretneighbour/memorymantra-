import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative moves faster in opposite direction, positive moves with scroll
  direction?: 'y' | 'x';
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  className = '',
  speed = 0.2,
  direction = 'y',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = 100 * speed;
  const transformValue = useTransform(scrollYProgress, [0, 1], [-range, range]);

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        [direction]: transformValue,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};
