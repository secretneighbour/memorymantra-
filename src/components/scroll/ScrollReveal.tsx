import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  /** Distance in pixels for the translateY/translateX animation (default: 32 on desktop, automatically reduced on mobile) */
  translateY?: number;
  /** Direction from which the element transitions in */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Animation duration in seconds (default: 0.7 on desktop, 0.45 on mobile) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** IntersectionObserver threshold from 0 to 1 (default: 0.08 for mobile-resilient triggers) */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin (default: '0px 0px -20px 0px') */
  rootMargin?: string;
  /** Whether animation should trigger only once or re-trigger on exit/enter (default: true) */
  triggerOnce?: boolean;
  once?: boolean;
  /** Optional scale starting value (true defaults to 0.98, or custom number) */
  scale?: boolean | number;
  /** Optional blur effect during entry (default: false) */
  blur?: boolean;
  /** CSS cubic-bezier easing string (default: smooth editorial curve) */
  easing?: string;
  /** Callback fired when the section becomes visible */
  onReveal?: () => void;
  /** Additional inline styles if needed */
  style?: React.CSSProperties;
}

/**
 * Custom hook that observes an element using IntersectionObserver
 * and returns whether it is currently visible in the viewport.
 * Features built-in resilience for older phones and low-end mobile devices.
 */
export function useScrollRevealTrigger(options: {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  onReveal?: () => void;
}) {
  const {
    threshold = 0.08,
    rootMargin = '0px 0px -20px 0px',
    triggerOnce = true,
    onReveal,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Fallback if IntersectionObserver is not supported in the environment or on older browser engines
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      onReveal?.();
      return;
    }

    let isHandled = false;

    // Safety fallback timer for older hardware/throttled webviews:
    // ensures content never gets stuck invisible if scroll ticks are skipped
    const safetyTimer = setTimeout(() => {
      if (!isHandled) {
        setIsVisible(true);
        onReveal?.();
      }
    }, 2500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isHandled = true;
            clearTimeout(safetyTimer);
            setIsVisible(true);
            onReveal?.();
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, onReveal]);

  return { ref: elementRef, isVisible };
}

/**
 * Reusable ScrollReveal Component
 * Optimized for desktop, modern smartphones, and older/low-end mobile devices.
 * Uses native IntersectionObserver with adaptive translateY and hardware memory cleanup.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  id,
  as: Component = 'div',
  translateY = 32,
  direction = 'up',
  duration = 0.65,
  delay = 0,
  threshold = 0.08,
  rootMargin = '0px 0px -20px 0px',
  triggerOnce,
  once = true,
  scale = false,
  blur = false,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  onReveal,
  style = {},
}) => {
  const shouldTriggerOnce = triggerOnce !== undefined ? triggerOnce : once;
  const { motion: contextMotion } = useAccessibility();
  const isReduced = contextMotion === 'reduced';

  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const domRef = useRef<HTMLElement | null>(null);

  // Detect small screens / mobile viewports to tailor animation intensity
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile, { passive: true });
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    // If reduced motion is preferred or running in SSR, reveal immediately without transition
    if (isReduced) {
      setIsVisible(true);
      return;
    }

    const targetNode = domRef.current;
    if (!targetNode) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      onReveal?.();
      return;
    }

    let isHandled = false;

    // Safety fallback timer for older hardware/throttled webviews:
    // ensures content never gets stuck invisible if scroll ticks are skipped on low-end phones
    const safetyTimer = setTimeout(() => {
      if (!isHandled) {
        setIsVisible(true);
        onReveal?.();
      }
    }, 2200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isHandled = true;
            clearTimeout(safetyTimer);
            setIsVisible(true);
            onReveal?.();
            if (shouldTriggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!shouldTriggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(targetNode);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, shouldTriggerOnce, isReduced, onReveal]);

  if (isReduced) {
    return (
      <Component id={id} className={className} style={style}>
        {children}
      </Component>
    );
  }

  // On small mobile screens & older phones: use smaller translation distance and shorter duration
  // to avoid jank and ensure 60fps compositing
  const effectiveTranslateY = isMobile ? Math.min(16, Math.round(translateY * 0.5)) : translateY;
  const effectiveDuration = isMobile ? Math.min(0.45, duration * 0.75) : duration;
  const effectiveBlur = isMobile ? false : blur; // disable GPU-heavy CSS filter blur on mobile

  // Calculate starting transform offsets based on direction
  const getInitialTransform = () => {
    const scaleFactor = typeof scale === 'number' ? scale : scale ? 0.98 : 1;
    const scaleStr = scale ? `scale(${scaleFactor})` : '';

    switch (direction) {
      case 'up':
        return `translate3d(0, ${effectiveTranslateY}px, 0) ${scaleStr}`.trim();
      case 'down':
        return `translate3d(0, -${effectiveTranslateY}px, 0) ${scaleStr}`.trim();
      case 'left':
        return `translate3d(${effectiveTranslateY}px, 0, 0) ${scaleStr}`.trim();
      case 'right':
        return `translate3d(-${effectiveTranslateY}px, 0, 0) ${scaleStr}`.trim();
      case 'none':
      default:
        return scale ? `scale(${scaleFactor})` : 'none';
    }
  };

  const initialTransform = getInitialTransform();
  const activeTransform = 'translate3d(0, 0, 0) scale(1)';

  const transitionProperties = [
    `opacity ${effectiveDuration}s ${easing} ${delay}s`,
    `transform ${effectiveDuration}s ${easing} ${delay}s`,
    effectiveBlur ? `filter ${effectiveDuration}s ${easing} ${delay}s` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const dynamicStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? activeTransform : initialTransform,
    filter: effectiveBlur ? (isVisible ? 'blur(0px)' : 'blur(6px)') : undefined,
    transition: transitionProperties,
    // Release GPU memory on older devices once element has transitioned in
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  return (
    <Component
      ref={domRef as any}
      id={id}
      className={className}
      style={dynamicStyle}
    >
      {children}
    </Component>
  );
};
