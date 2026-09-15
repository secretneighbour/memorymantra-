import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  /** Distance in pixels for the translateY/translateX animation (default: 32) */
  translateY?: number;
  /** Direction from which the element transitions in */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Animation duration in seconds (default: 0.7) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** IntersectionObserver threshold from 0 to 1 (default: 0.15) */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin (default: '0px 0px -40px 0px') */
  rootMargin?: string;
  /** Whether animation should trigger only once or re-trigger on exit/enter (default: true) */
  triggerOnce?: boolean;
  once?: boolean;
  /** Optional scale starting value (true defaults to 0.97, or custom number) */
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
 */
export function useScrollRevealTrigger(options: {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  onReveal?: () => void;
}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    onReveal,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Fallback if IntersectionObserver is not supported in the environment
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      onReveal?.();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, onReveal]);

  return { ref: elementRef, isVisible };
}

/**
 * Reusable ScrollReveal Component
 * Uses native IntersectionObserver to trigger smooth opacity and translateY
 * transitions as sections enter the viewport with hardware-accelerated transforms.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  id,
  as: Component = 'div',
  translateY = 32,
  direction = 'up',
  duration = 0.7,
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
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
  const domRef = useRef<HTMLElement | null>(null);

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

  // Calculate starting transform offsets based on direction
  const getInitialTransform = () => {
    const scaleFactor = typeof scale === 'number' ? scale : scale ? 0.97 : 1;
    const scaleStr = scale ? `scale(${scaleFactor})` : '';

    switch (direction) {
      case 'up':
        return `translate3d(0, ${translateY}px, 0) ${scaleStr}`.trim();
      case 'down':
        return `translate3d(0, -${translateY}px, 0) ${scaleStr}`.trim();
      case 'left':
        return `translate3d(${translateY}px, 0, 0) ${scaleStr}`.trim();
      case 'right':
        return `translate3d(-${translateY}px, 0, 0) ${scaleStr}`.trim();
      case 'none':
      default:
        return scale ? `scale(${scaleFactor})` : 'none';
    }
  };

  const initialTransform = getInitialTransform();
  const activeTransform = 'translate3d(0, 0, 0) scale(1)';

  const transitionProperties = [
    `opacity ${duration}s ${easing} ${delay}s`,
    `transform ${duration}s ${easing} ${delay}s`,
    blur ? `filter ${duration}s ${easing} ${delay}s` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const dynamicStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? activeTransform : initialTransform,
    filter: blur ? (isVisible ? 'blur(0px)' : 'blur(8px)') : undefined,
    transition: transitionProperties,
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
