import { Variants, Transition } from 'framer-motion';
import { useAccessibility } from '../context/AccessibilityContext';
import { useReducedMotion } from 'framer-motion';

/**
 * SMRITI CARE MOTION DESIGN TOKENS
 * "Every movement should communicate something."
 *
 * Timings:
 * - FAST:   150-200ms for immediate feedback (buttons, toggles, icon flips)
 * - NORMAL: 250-320ms for contextual elements (cards, dropdowns, modal scales)
 * - SLOW:   380-450ms for major transitions (page fades, section reveals)
 */
export const DURATION = {
  instant: 0.001,
  fast: 0.18,
  normal: 0.28,
  slow: 0.42,
} as const;

export const EASE = {
  // Smooth human deceleration curve (Apple / Nothing inspired)
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Symmetrical curve for dual state changes
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  // Subtle tactile spring
  spring: {
    type: 'spring',
    stiffness: 380,
    damping: 28,
    mass: 0.8,
  } as const,
  // Gentle damp spring for larger surfaces
  gentleSpring: {
    type: 'spring',
    stiffness: 240,
    damping: 24,
  } as const,
};

/**
 * Standard Transitions
 */
export const TRANSITIONS: Record<string, Transition> = {
  fast: { duration: DURATION.fast, ease: EASE.out },
  normal: { duration: DURATION.normal, ease: EASE.out },
  slow: { duration: DURATION.slow, ease: EASE.out },
  spring: EASE.spring,
};

/**
 * Reusable Motion Variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: DURATION.normal, ease: EASE.out } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATION.normal, ease: EASE.out } 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: DURATION.normal, ease: EASE.out } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATION.slow, ease: EASE.out } 
  },
  exit: { 
    opacity: 0, 
    y: -6, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const createStaggerContainer = (staggerDelay = 0.06, delayChildren = 0.04): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.out },
  },
};

export const cardHoverVariants: Variants = {
  rest: { y: 0, scale: 1, transition: { duration: DURATION.fast, ease: EASE.out } },
  hover: { y: -2.5, scale: 1.005, transition: { duration: DURATION.fast, ease: EASE.out } },
  press: { scale: 0.985, transition: { duration: 0.1, ease: EASE.out } },
};

export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: DURATION.fast } },
  press: { scale: 0.975, transition: { duration: 0.08 } },
};

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: DURATION.normal, ease: EASE.out } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.97, 
    y: 6, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const drawerRightVariants: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: DURATION.normal, ease: EASE.out } 
  },
  exit: { 
    x: '100%', 
    opacity: 0.8, 
    transition: { duration: DURATION.fast, ease: EASE.out } 
  },
};

export const gentleShakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -4, 4, -3, 3, 0],
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

/**
 * useMotionSafe Hook
 * Automatically handles reduced motion preferences:
 * - Checks OS level `prefers-reduced-motion`
 * - Checks Smriti Care AccessibilityContext `motion === 'reduced'`
 * - Checks `simpleUIMode`
 *
 * When motion is disabled, returns instantaneous transitions (0.001ms)
 * to respect cognitive and vestibular needs.
 */
export function useMotionSafe() {
  const { motion: contextMotion, simpleUIMode } = useAccessibility();
  const systemReduced = useReducedMotion();

  const isReduced = contextMotion === 'reduced' || systemReduced || simpleUIMode;

  return {
    isReduced,
    duration: isReduced ? DURATION.instant : DURATION.normal,
    fastDuration: isReduced ? DURATION.instant : DURATION.fast,
    slowDuration: isReduced ? DURATION.instant : DURATION.slow,
    // Safe transition object
    transition: isReduced
      ? { duration: DURATION.instant }
      : { duration: DURATION.normal, ease: EASE.out },
    // Safe page transition
    pageTransition: isReduced
      ? { duration: DURATION.instant }
      : { duration: DURATION.slow, ease: EASE.out },
    // Safe variants generator
    getSafeVariants: (activeVariants: Variants): Variants => {
      if (!isReduced) return activeVariants;
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: DURATION.instant } },
        exit: { opacity: 0, transition: { duration: DURATION.instant } },
      };
    },
  };
}
