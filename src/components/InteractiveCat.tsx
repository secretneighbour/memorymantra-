import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../context/AccessibilityContext';
import confetti from 'canvas-confetti';

// ---------------------------------------------------------------------------
// STATE PRIORITY HIERARCHY
// ---------------------------------------------------------------------------
export enum StatePriority {
  AUTONOMOUS = 1,      // Idle, sitting, stretching, sleeping, looking around, yawning, walking
  ATTENTION = 2,       // Email field focus, cursor immediate proximity
  REACTIVE = 3,        // Single clicks (surprised/playful), startled escapes
  DIRECT_USER = 4,     // Physical dragging, active petting
  AUTH_FEEDBACK = 5    // Login success, login error, password hiding/peeking, loading
}

export type CatBehaviorState = 
  | 'sleeping'
  | 'waking'
  | 'stretching'
  | 'idle'
  | 'sitting'
  | 'looking_around'
  | 'yawning'
  | 'scratching'
  | 'walking'
  | 'alert'
  | 'curious_cursor'
  | 'surprised'
  | 'playful'
  | 'startled'
  | 'petting'
  | 'dragging'
  | 'hiding_eyes'
  | 'peeking'
  | 'thinking'
  | 'celebrating'
  | 'concerned';

export type WalkSpeed = 'sleepy' | 'casual' | 'normal' | 'brisk';

export interface InteractiveCatProps {
  isEmailFocused?: boolean;
  isPasswordFocused?: boolean;
  passwordLength?: number;
  showPassword?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export const InteractiveCat: React.FC<InteractiveCatProps> = ({
  isEmailFocused = false,
  isPasswordFocused = false,
  passwordLength = 0,
  showPassword = false,
  isLoading = false,
  isSuccess = false,
  isError = false
}) => {
  const { motion: motionPref } = useAccessibility();
  const prefersReduced = motionPref === 'reduced';

  // ---------------------------------------------------------------------------
  // 1. BEHAVIOR STATE, PRIORITY & ORIENTATION
  // ---------------------------------------------------------------------------
  const [behavior, setBehavior] = useState<CatBehaviorState>('sleeping');
  const currentPriorityRef = useRef<StatePriority>(StatePriority.AUTONOMOUS);
  const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('right');
  const [isTurning, setIsTurning] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Position physics for dragging and autonomous walking
  const catX = useMotionValue(0);
  const catY = useMotionValue(0);
  const springX = useSpring(catX, { stiffness: 320, damping: 30 });
  const springY = useSpring(catY, { stiffness: 360, damping: 28 });

  // Autonomous Walk cycle phase for articulated legs and body bob
  const [walkPhase, setWalkPhase] = useState(0);
  const [isWalkingActive, setIsWalkingActive] = useState(false);
  const walkAnimFrameRef = useRef<number | null>(null);

  // Container & Cursor Proximity
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNearCursor, setIsNearCursor] = useState(false);

  // Interaction Refs & Timers
  const dragStartRef = useRef<{ x: number; y: number; startCatX: number; startCatY: number; startTime: number } | null>(null);
  const petDistanceRef = useRef<number>(0);
  const lastPetPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const autonomousTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkAbortRef = useRef<boolean>(false);

  // Autonomous Living Micro-Expressions
  const [isBlinking, setIsBlinking] = useState(false);
  const [earTwitchLeft, setEarTwitchLeft] = useState(false);
  const [earTwitchRight, setEarTwitchRight] = useState(false);
  const [tailFlick, setTailFlick] = useState(false);
  const [isPurring, setIsPurring] = useState(false);
  const [sleepPosture, setSleepPosture] = useState<0 | 1 | 2>(0);
  const [lookDirection, setLookDirection] = useState<'center' | 'left' | 'right'>('center');

  // Track user interaction active status to prevent autonomous interruptions
  const isUserInteractingRef = useRef<boolean>(false);

  // Responsive safe walking boundary computation
  const getWalkBounds = useCallback(() => {
    if (typeof window === 'undefined') return { min: -90, max: 90 };
    const width = window.innerWidth;
    if (width < 480) return { min: -48, max: 48 };
    if (width < 768) return { min: -80, max: 80 };
    return { min: -115, max: 115 };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. PRIORITY-BASED STATE TRANSITION CONTROLLER
  // ---------------------------------------------------------------------------
  // Safely transitions state only if requested priority meets or exceeds current priority
  const setPrioritizedState = useCallback((
    newState: CatBehaviorState,
    priority: StatePriority,
    forceOverride = false
  ): boolean => {
    if (!forceOverride && priority < currentPriorityRef.current) {
      // Subordinate request rejected because higher priority interaction is active
      return false;
    }

    // Cancel any running autonomous timer if stepping up priority
    if (priority > StatePriority.AUTONOMOUS) {
      if (autonomousTimerRef.current) {
        clearTimeout(autonomousTimerRef.current);
        autonomousTimerRef.current = null;
      }
      walkAbortRef.current = true;
      setIsWalkingActive(false);
    }

    currentPriorityRef.current = priority;
    setBehavior(newState);
    return true;
  }, []);

  // Release higher priority back to autonomous state after interaction completes
  const releaseToAutonomous = useCallback((settleDelayMs = 2000, fallbackState: CatBehaviorState = 'idle') => {
    if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);
    
    recoveryTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
      currentPriorityRef.current = StatePriority.AUTONOMOUS;
      setBehavior(fallbackState);
    }, settleDelayMs);
  }, []);

  // ---------------------------------------------------------------------------
  // 3. AUTHENTICATION & FORM REACTIVITY (Priority 5 - Highest Override)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Auth feedback & security overrides take highest priority over everything
    if (isSuccess) {
      setPrioritizedState('celebrating', StatePriority.AUTH_FEEDBACK, true);
      try {
        confetti({
          particleCount: 28,
          spread: 52,
          origin: { y: 0.35 },
          colors: ['#DE4A30', '#6B8E78', '#18181B', '#E5A99B'],
          disableForReducedMotion: true,
          ticks: 90,
          scalar: 0.8
        });
      } catch {}
      return;
    }

    if (isError) {
      setPrioritizedState('concerned', StatePriority.AUTH_FEEDBACK, true);
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = setTimeout(() => {
        releaseToAutonomous(0, 'idle');
      }, 2600);
      return;
    }

    if (isLoading) {
      setPrioritizedState('thinking', StatePriority.AUTH_FEEDBACK, true);
      return;
    }

    if (isPasswordFocused) {
      setPrioritizedState(showPassword ? 'peeking' : 'hiding_eyes', StatePriority.AUTH_FEEDBACK, true);
      return;
    }

    if (isEmailFocused) {
      setPrioritizedState('alert', StatePriority.ATTENTION, true);
      return;
    }

    // When form focus or feedback completes, return to autonomous priority
    if (currentPriorityRef.current === StatePriority.AUTH_FEEDBACK || currentPriorityRef.current === StatePriority.ATTENTION) {
      releaseToAutonomous(1200, 'idle');
    }
  }, [
    isEmailFocused,
    isPasswordFocused,
    passwordLength,
    showPassword,
    isLoading,
    isSuccess,
    isError,
    setPrioritizedState,
    releaseToAutonomous
  ]);

  // ---------------------------------------------------------------------------
  // 4. LIVING MICRO-EXPRESSIONS (Blinking, Ear Twitches, Tail Flicks)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (prefersReduced) return;

    // Blinking timer
    const blinkInterval = setInterval(() => {
      if (behavior !== 'sleeping' && behavior !== 'hiding_eyes' && behavior !== 'yawning') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 120 + Math.random() * 60);
      }
    }, 3000 + Math.random() * 2500);

    // Random ear twitches
    const twitchInterval = setInterval(() => {
      if (Math.random() > 0.5) setEarTwitchLeft(true);
      else setEarTwitchRight(true);

      setTimeout(() => {
        setEarTwitchLeft(false);
        setEarTwitchRight(false);
      }, 180);
    }, 4200 + Math.random() * 3000);

    // Tail flicking
    const tailInterval = setInterval(() => {
      if (behavior !== 'walking') {
        setTailFlick(true);
        setTimeout(() => setTailFlick(false), 650);
      }
    }, 4500 + Math.random() * 3200);

    // Sleeping posture shift
    const postureInterval = setInterval(() => {
      if (behavior === 'sleeping') {
        setSleepPosture((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
      }
    }, 7500 + Math.random() * 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(twitchInterval);
      clearInterval(tailInterval);
      clearInterval(postureInterval);
    };
  }, [behavior, prefersReduced]);

  // ---------------------------------------------------------------------------
  // 5. ARTICULATED QUADRUPED WALKING ENGINE
  // ---------------------------------------------------------------------------
  const executeWalkTo = useCallback((
    targetX: number, 
    speedMode: WalkSpeed = 'casual',
    onComplete?: () => void
  ) => {
    if (prefersReduced) {
      catX.set(targetX);
      if (onComplete) onComplete();
      return;
    }

    const startX = catX.get();
    const distance = targetX - startX;
    if (Math.abs(distance) < 6) {
      if (onComplete) onComplete();
      return;
    }

    // Set facing direction with smooth pivot
    const newDir: 'left' | 'right' = distance > 0 ? 'right' : 'left';
    if (newDir !== facingDirection) {
      setIsTurning(true);
      setFacingDirection(newDir);
      setTimeout(() => setIsTurning(false), 240);
    }

    // Speed constants in px/second and walk cycle frequency
    let pxPerSec = 36;
    let cycleSpeed = 7.2;
    if (speedMode === 'sleepy') {
      pxPerSec = 20;
      cycleSpeed = 4.5;
    } else if (speedMode === 'normal') {
      pxPerSec = 52;
      cycleSpeed = 9.5;
    } else if (speedMode === 'brisk') {
      pxPerSec = 95;
      cycleSpeed = 14.0;
    }

    const durationMs = (Math.abs(distance) / pxPerSec) * 1000;
    const startTime = performance.now();

    walkAbortRef.current = false;
    setBehavior('walking');
    setIsWalkingActive(true);

    const step = (currentTime: number) => {
      if (walkAbortRef.current) {
        setIsWalkingActive(false);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth easeInOutQuad acceleration & deceleration
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentPosX = startX + distance * eased;
      catX.set(currentPosX);

      // Advance leg step phase
      setWalkPhase(elapsed * 0.001 * cycleSpeed * Math.PI * 2);

      if (progress < 1) {
        walkAnimFrameRef.current = requestAnimationFrame(step);
      } else {
        // Walk concluded
        setIsWalkingActive(false);
        setWalkPhase(0);
        if (onComplete && !walkAbortRef.current) {
          onComplete();
        }
      }
    };

    if (walkAnimFrameRef.current) cancelAnimationFrame(walkAnimFrameRef.current);
    walkAnimFrameRef.current = requestAnimationFrame(step);
  }, [catX, facingDirection, prefersReduced]);

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (walkAnimFrameRef.current) cancelAnimationFrame(walkAnimFrameRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 6. AUTONOMOUS DECISION SYSTEM (Idle Transitions: Sitting, Stretching, Sleeping, Looking Around)
  // ---------------------------------------------------------------------------
  const runAutonomousRoutine = useCallback(() => {
    // Strict priority guard: If any user interaction or form priority is active, do not run
    if (
      (typeof document !== 'undefined' && document.visibilityState === 'hidden') ||
      prefersReduced ||
      currentPriorityRef.current > StatePriority.AUTONOMOUS ||
      isUserInteractingRef.current ||
      isPasswordFocused ||
      isEmailFocused ||
      isLoading ||
      isSuccess ||
      isError
    ) {
      return;
    }

    const bounds = getWalkBounds();
    const roll = Math.random();

    // TRANSITION GRAPH:
    // A. From SLEEPING -> Chance to wake up, stretch, and start exploring
    if (behavior === 'sleeping') {
      if (roll < 0.40) {
        setBehavior('waking');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          const wakeRoll = Math.random();
          if (wakeRoll < 0.70) {
            // Wake -> Stretch
            setBehavior('stretching');
            setTimeout(() => {
              if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
              setBehavior('idle');
            }, 2200 + Math.random() * 800);
          } else if (wakeRoll < 0.90) {
            // Wake -> Yawn
            setBehavior('yawning');
            setTimeout(() => {
              if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
              setBehavior('sitting');
            }, 2000);
          } else {
            // Wake -> Sit
            setBehavior('sitting');
          }
        }, 1400);
      }
      return;
    }

    // B. From WAKING / STRETCHING -> Settle to Idle or Sitting
    if (behavior === 'waking' || behavior === 'stretching') {
      setBehavior(roll < 0.6 ? 'idle' : 'sitting');
      return;
    }

    // C. From SITTING -> Transition to looking around, stretching, walking, or sleeping
    if (behavior === 'sitting') {
      if (roll < 0.35) {
        // Look around exploring
        setBehavior('looking_around');
        setLookDirection('left');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setLookDirection('right');
          setTimeout(() => {
            if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
            setLookDirection('center');
            setBehavior('sitting');
          }, 900 + Math.random() * 500);
        }, 900 + Math.random() * 500);
      } else if (roll < 0.65) {
        // Walk from sitting
        const currentX = catX.get();
        let targetX = bounds.min + Math.random() * (bounds.max - bounds.min);
        if (Math.abs(targetX - currentX) < 25) {
          targetX = currentX > 0 ? currentX - 45 : currentX + 45;
          targetX = Math.max(bounds.min, Math.min(bounds.max, targetX));
        }
        executeWalkTo(targetX, 'casual', () => {
          setBehavior(Math.random() < 0.5 ? 'idle' : 'sitting');
        });
      } else if (roll < 0.80) {
        // Stretch
        setBehavior('stretching');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setBehavior('idle');
        }, 2200);
      } else if (roll < 0.90) {
        // Scratch ear
        setBehavior('scratching');
        setEarTwitchRight(true);
        setTimeout(() => {
          setEarTwitchRight(false);
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setBehavior('sitting');
        }, 1800);
      } else {
        // Lie down and sleep
        setBehavior('sleeping');
      }
      return;
    }

    // D. From LOOKING_AROUND -> Settle to idle, sitting, or walking
    if (behavior === 'looking_around') {
      if (roll < 0.45) setBehavior('idle');
      else if (roll < 0.75) setBehavior('sitting');
      else {
        const currentX = catX.get();
        const targetX = currentX > 0 ? bounds.min + 20 : bounds.max - 20;
        executeWalkTo(targetX, 'casual', () => setBehavior('idle'));
      }
      return;
    }

    // E. From IDLE / STANDING
    if (behavior === 'idle' || behavior === 'alert') {
      if (roll < 0.36) {
        // 1. WALK TO A RANDOM LEDGE SPOT
        const currentX = catX.get();
        let targetX = bounds.min + Math.random() * (bounds.max - bounds.min);
        if (Math.abs(targetX - currentX) < 25) {
          targetX = currentX > 0 ? currentX - 45 : currentX + 45;
          targetX = Math.max(bounds.min, Math.min(bounds.max, targetX));
        }

        const speed: WalkSpeed = Math.random() < 0.25 ? 'sleepy' : Math.random() < 0.75 ? 'casual' : 'normal';

        executeWalkTo(targetX, speed, () => {
          // Post-walk randomized decision
          const postRoll = Math.random();
          if (postRoll < 0.35) {
            // Look around
            setBehavior('looking_around');
            setLookDirection('left');
            setTimeout(() => {
              if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
              setLookDirection('right');
              setTimeout(() => {
                if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
                setLookDirection('center');
                setBehavior('idle');
              }, 900);
            }, 900);
          } else if (postRoll < 0.65) {
            // Sit down and relax
            setBehavior('sitting');
          } else if (postRoll < 0.85) {
            // Yawn
            setBehavior('yawning');
            setTimeout(() => {
              if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
              setBehavior('sleeping');
            }, 2000);
          } else {
            setBehavior('idle');
          }
        });
      } else if (roll < 0.52) {
        // 2. SIT DOWN
        setBehavior('sitting');
      } else if (roll < 0.68) {
        // 3. LOOK AROUND
        setBehavior('looking_around');
        setLookDirection(Math.random() > 0.5 ? 'left' : 'right');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setLookDirection(Math.random() > 0.5 ? 'right' : 'left');
          setTimeout(() => {
            if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
            setLookDirection('center');
            setBehavior('idle');
          }, 900);
        }, 900);
      } else if (roll < 0.80) {
        // 4. STRETCH
        setBehavior('stretching');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setBehavior('idle');
        }, 2200);
      } else if (roll < 0.90) {
        // 5. YAWN
        setBehavior('yawning');
        setTimeout(() => {
          if (currentPriorityRef.current > StatePriority.AUTONOMOUS) return;
          setBehavior(Math.random() < 0.5 ? 'sleeping' : 'sitting');
        }, 1900);
      } else {
        // 6. LIE DOWN & SLEEP
        setBehavior('sleeping');
      }
    }
  }, [
    behavior, 
    catX, 
    executeWalkTo, 
    getWalkBounds, 
    isEmailFocused, 
    isError, 
    isLoading, 
    isPasswordFocused, 
    isSuccess, 
    prefersReduced
  ]);

  // Main autonomous scheduler loop with randomized unpredictable delays
  useEffect(() => {
    if (prefersReduced) return;

    const scheduleNextAction = () => {
      // Delay varies based on current state to mimic realistic pacing
      const delay = behavior === 'sleeping' 
        ? 9000 + Math.random() * 8000 
        : behavior === 'sitting'
        ? 4500 + Math.random() * 5000
        : behavior === 'walking' 
        ? 2200 
        : 3800 + Math.random() * 4500;

      autonomousTimerRef.current = setTimeout(() => {
        runAutonomousRoutine();
        scheduleNextAction();
      }, delay);
    };

    scheduleNextAction();

    return () => {
      if (autonomousTimerRef.current) clearTimeout(autonomousTimerRef.current);
    };
  }, [behavior, runAutonomousRoutine, prefersReduced]);

  // ---------------------------------------------------------------------------
  // 7. CURSOR PROXIMITY DETECTION, VELOCITY TRACKING & STARTLED BEHAVIOR
  // ---------------------------------------------------------------------------
  const lastStartleTimeRef = useRef<number>(0);
  const lastMouseMoveRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const triggerStartledSequence = useCallback((sourceX?: number) => {
    const now = Date.now();
    // Cooldown of 3.2s so continuous rapid movement doesn't glitch-restart the animation
    if (now - lastStartleTimeRef.current < 3200) return;
    
    // Check priority: Do not interrupt direct dragging or form authentication feedback
    if (currentPriorityRef.current > StatePriority.REACTIVE) return;

    lastStartleTimeRef.current = now;
    setPrioritizedState('startled', StatePriority.REACTIVE, true);
    setEarTwitchLeft(true);
    setEarTwitchRight(true);
    setTailFlick(true);

    if (prefersReduced) {
      setTimeout(() => {
        setEarTwitchLeft(false);
        setEarTwitchRight(false);
        releaseToAutonomous(0, 'idle');
      }, 1500);
      return;
    }

    // Playful startled hop flinch
    const curY = catY.get();
    catY.set(curY - 8);
    setTimeout(() => catY.set(0), 170);

    // Compute escape trot destination away from the disturbance source
    const bounds = getWalkBounds();
    const currentX = catX.get();

    let trotDir = 1;
    if (sourceX !== undefined) {
      trotDir = sourceX < currentX ? 1 : -1;
    } else {
      trotDir = currentX > 0 ? -1 : 1;
    }

    // Ensure we don't trot off the safe boundary
    if (currentX + trotDir * 45 > bounds.max) trotDir = -1;
    if (currentX + trotDir * 45 < bounds.min) trotDir = 1;

    const trotDistance = 45 + Math.random() * 25;
    const targetX = Math.max(bounds.min, Math.min(bounds.max, currentX + trotDir * trotDistance));

    // After a brief startled pause, turn and trot to the new spot
    setTimeout(() => {
      executeWalkTo(targetX, 'brisk', () => {
        // Step 3: Stop, look back curiously at previous spot
        setBehavior('looking_around');
        setLookDirection(trotDir > 0 ? 'left' : 'right');
        setTailFlick(true);

        setTimeout(() => {
          setEarTwitchLeft(false);
          setEarTwitchRight(false);
          setLookDirection('center');
          releaseToAutonomous(0, 'idle');
        }, 1500);
      });
    }, 220);
  }, [catX, catY, executeWalkTo, getWalkBounds, prefersReduced, releaseToAutonomous, setPrioritizedState]);

  useEffect(() => {
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2 + catX.get();
      const catCenterY = rect.top + rect.height / 2 + catY.get();

      const dx = e.clientX - catCenterX;
      const dy = e.clientY - catCenterY;
      const dist = Math.hypot(dx, dy);

      const now = performance.now();
      if (lastMouseMoveRef.current) {
        const dt = now - lastMouseMoveRef.current.time;
        if (dt > 10 && dt < 160) {
          const distMoved = Math.hypot(e.clientX - lastMouseMoveRef.current.x, e.clientY - lastMouseMoveRef.current.y);
          const velocity = distMoved / dt; // px per ms

          // If cursor is near cat (< 180px) and moving rapidly (velocity > 1.5 px/ms = 1500px/s)
          if (dist < 180 && velocity > 1.5) {
            triggerStartledSequence(dx > 0 ? catCenterX + 10 : catCenterX - 10);
          }
        }
      }
      lastMouseMoveRef.current = { x: e.clientX, y: e.clientY, time: now };

      // Within 220px: notice cursor proximity
      if (dist < 220) {
        setIsNearCursor(true);
        const normX = Math.max(-4, Math.min(4, (dx / 180) * 4));
        const normY = Math.max(-3, Math.min(3, (dy / 180) * 3));
        setMousePos({ x: normX, y: normY });

        // If sleeping and cursor gets very close (< 45px), realistic chance to wake up
        if (behavior === 'sleeping' && dist < 45 && Math.random() < 0.35) {
          setPrioritizedState('alert', StatePriority.ATTENTION);
          releaseToAutonomous(2400, 'idle');
        }
      } else {
        setIsNearCursor(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [behavior, catX, catY, prefersReduced, releaseToAutonomous, setPrioritizedState, triggerStartledSequence]);

  // ---------------------------------------------------------------------------
  // 8. POINTER GESTURES: PHYSICAL DRAGGING, PETTING & STARTLED/CLICK REACTIONS (Priority 4)
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Immediately claim Direct User priority over any autonomous action
    isUserInteractingRef.current = true;
    setPrioritizedState(behavior, StatePriority.DIRECT_USER, true);

    // Capture pointer
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startCatX: catX.get(),
      startCatY: catY.get(),
      startTime: Date.now()
    };
    petDistanceRef.current = 0;
    lastPetPointRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;

    const deltaTotalX = e.clientX - dragStartRef.current.x;
    const deltaTotalY = e.clientY - dragStartRef.current.y;
    const totalDistance = Math.hypot(deltaTotalX, deltaTotalY);

    // Track petting speed and stroke length
    if (lastPetPointRef.current) {
      const segDist = Math.hypot(
        e.clientX - lastPetPointRef.current.x,
        e.clientY - lastPetPointRef.current.y
      );
      petDistanceRef.current += segDist;
      lastPetPointRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    }

    // A. Explicit Dragging (> 16px displacement)
    if (totalDistance > 16) {
      if (behavior !== 'dragging') {
        setPrioritizedState('dragging', StatePriority.DIRECT_USER, true);
        setIsPurring(false);
      }

      const bounds = getWalkBounds();
      const newX = Math.max(bounds.min - 10, Math.min(bounds.max + 10, dragStartRef.current.startCatX + deltaTotalX));
      const newY = Math.max(-22, Math.min(18, dragStartRef.current.startCatY + deltaTotalY));

      catX.set(newX);
      catY.set(newY);

      if (Math.abs(deltaTotalX) > 4) {
        setFacingDirection(deltaTotalX > 0 ? 'right' : 'left');
      }
    } 
    // B. Petting Gesture (continuous gentle stroke over body)
    else if (petDistanceRef.current > 20) {
      if (behavior !== 'petting') {
        setPrioritizedState('petting', StatePriority.DIRECT_USER, true);
        setIsPurring(true);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) {
      isUserInteractingRef.current = false;
      return;
    }

    const deltaTotalX = e.clientX - dragStartRef.current.x;
    const deltaTotalY = e.clientY - dragStartRef.current.y;
    const totalDistance = Math.hypot(deltaTotalX, deltaTotalY);
    const duration = Date.now() - dragStartRef.current.startTime;

    // 1. CLICK / TAP
    if (totalDistance < 10 && duration < 340) {
      handleClick();
    } 
    // 2. PETTING RELEASE
    else if (behavior === 'petting') {
      setTimeout(() => {
        setIsPurring(false);
        releaseToAutonomous(800, 'idle');
      }, 1000);
    } 
    // 3. DRAGGING RELEASE -> Physical landing settle bounce
    else if (behavior === 'dragging') {
      const curY = catY.get();
      catY.set(curY + 3);
      setTimeout(() => {
        catY.set(0);
        releaseToAutonomous(600, 'idle');
      }, 160);
    } else {
      releaseToAutonomous(400, 'idle');
    }

    dragStartRef.current = null;
    petDistanceRef.current = 0;
    lastPetPointRef.current = null;
  };

  const handleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => setClickCount(0), 2400);

    if (nextCount === 1) {
      // First click: wake up / curious surprise
      setPrioritizedState('surprised', StatePriority.REACTIVE, true);
      setTimeout(() => {
        releaseToAutonomous(0, 'idle');
      }, 1200);
    } else {
      // Repeated clicks (2+ clicks): Startled sequence!
      triggerStartledSequence(catX.get());
    }
  };

  // ---------------------------------------------------------------------------
  // 8. DYNAMIC GAIT, BODY TRANSFORMS & LIMB COORDINATES
  // ---------------------------------------------------------------------------

  // Quadruped leg offsets calculated dynamically during walk cycle
  const legOffsets = useMemo(() => {
    if (behavior !== 'walking' || prefersReduced) {
      return {
        frontLeft: { x: 0, y: 0 },
        frontRight: { x: 0, y: 0 },
        hindLeft: { x: 0, y: 0 },
        hindRight: { x: 0, y: 0 }
      };
    }

    const lift = 3.8;
    const stride = 6.0;

    return {
      frontLeft: {
        x: Math.sin(walkPhase) * stride,
        y: Math.max(0, -Math.cos(walkPhase)) * -lift
      },
      hindRight: {
        x: Math.sin(walkPhase + Math.PI * 0.5) * stride,
        y: Math.max(0, -Math.cos(walkPhase + Math.PI * 0.5)) * -lift
      },
      frontRight: {
        x: Math.sin(walkPhase + Math.PI) * stride,
        y: Math.max(0, -Math.cos(walkPhase + Math.PI)) * -lift
      },
      hindLeft: {
        x: Math.sin(walkPhase + Math.PI * 1.5) * stride,
        y: Math.max(0, -Math.cos(walkPhase + Math.PI * 1.5)) * -lift
      }
    };
  }, [behavior, walkPhase, prefersReduced]);

  // Body Vertical Bobbing & Subtle Pitch while walking
  const bodyBobY = useMemo(() => {
    if (behavior === 'walking' && !prefersReduced) {
      return Math.sin(walkPhase * 2) * 2.2;
    }
    return 0;
  }, [behavior, walkPhase, prefersReduced]);

  const bodyTilt = useMemo(() => {
    if (behavior === 'walking' && !prefersReduced) {
      return Math.cos(walkPhase) * 2.0;
    }
    if (behavior === 'stretching') return 6;
    return 0;
  }, [behavior, walkPhase, prefersReduced]);

  // Paw base coordinates according to posture
  const pawsY = useMemo(() => {
    if (behavior === 'hiding_eyes') return 53;
    if (behavior === 'peeking') return 65;
    if (behavior === 'thinking') return 94;
    if (behavior === 'dragging') return 114;
    if (behavior === 'stretching') return 108;
    if (behavior === 'sitting') return 102;
    return 104;
  }, [behavior]);

  const pawsX = useMemo(() => {
    if (behavior === 'hiding_eyes') return { left: 72, right: 88 };
    if (behavior === 'peeking') return { left: 70, right: 90 };
    if (behavior === 'thinking') return { left: 74, right: 86 };
    if (behavior === 'stretching') return { left: 52, right: 108 };
    if (behavior === 'sitting') return { left: 68, right: 92 };
    return { left: 60, right: 100 };
  }, [behavior]);

  const headTransform = useMemo(() => {
    if (prefersReduced) return { rotate: 0, y: 0, x: 0 };
    switch (behavior) {
      case 'sleeping':
        return sleepPosture === 1 
          ? { rotate: 6, y: 3, x: 2 } 
          : sleepPosture === 2 
          ? { rotate: 2, y: 2, x: -1 } 
          : { rotate: 4, y: 3, x: 0 };
      case 'petting':
        return { rotate: 6, y: -2, x: 2 };
      case 'dragging':
        return { rotate: 0, y: -5, x: 0 };
      case 'surprised':
        return { rotate: -4, y: -6, x: 0 };
      case 'startled':
        return { rotate: -6, y: -8, x: 0 };
      case 'playful':
        return { rotate: 5, y: -2, x: 0 };
      case 'stretching':
        return { rotate: -8, y: 2, x: -4 };
      case 'yawning':
        return { rotate: -4, y: -4, x: 0 };
      case 'scratching':
        return { rotate: 15, y: 4, x: 4 };
      case 'celebrating':
        return { rotate: 0, y: -6, x: 0 };
      case 'concerned':
        return { rotate: -7, y: 3, x: 0 };
      case 'thinking':
        return { rotate: -2, y: 1, x: 0 };
      case 'looking_around':
        return { rotate: lookDirection === 'left' ? -10 : lookDirection === 'right' ? 10 : 0, y: 0, x: lookDirection === 'left' ? -3 : lookDirection === 'right' ? 3 : 0 };
      case 'walking':
        return { rotate: Math.sin(walkPhase) * 1.8, y: Math.sin(walkPhase * 2) * 1.4, x: 0 };
      default:
        if (isNearCursor) {
          return { rotate: mousePos.x * 1.5, y: mousePos.y * 0.8, x: mousePos.x * 0.6 };
        }
        return { rotate: 0, y: 0, x: 0 };
    }
  }, [behavior, sleepPosture, prefersReduced, isNearCursor, mousePos, lookDirection, walkPhase]);

  const isEyeClosed = 
    behavior === 'sleeping' || 
    behavior === 'petting' || 
    behavior === 'yawning' ||
    behavior === 'celebrating';

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="img"
      aria-label="Interactive animated cat"
      title="Click, pet, or gently drag the cat"
    >
      {/* Spring Animated Frame */}
      <motion.div
        style={{
          x: springX,
          y: springY
        }}
        animate={{
          scaleX: isTurning ? (facingDirection === 'left' ? -0.2 : 0.2) : (facingDirection === 'left' ? -1 : 1),
          scaleY: behavior === 'dragging' && !prefersReduced 
            ? 1.08 
            : isPurring && !prefersReduced
            ? [1, 0.98, 1]
            : 1,
          y: isPurring && !prefersReduced ? [0, -1.2, 0] : 0
        }}
        transition={{
          scaleX: { duration: 0.22, ease: 'easeInOut' },
          scaleY: { duration: isPurring ? 0.12 : 0.25 },
          y: { duration: 0.12, repeat: isPurring ? Infinity : 0, ease: 'linear' }
        }}
        className="relative w-36 h-28 sm:w-44 sm:h-32 flex items-center justify-center select-none"
      >
        {/* Floating "Z" particles when sleeping */}
        <AnimatePresence>
          {behavior === 'sleeping' && !prefersReduced && (
            <div className="absolute -top-3 right-6 pointer-events-none" aria-hidden="true">
              <motion.span
                className="absolute text-xs font-mono font-bold text-ner-black/40 select-none"
                initial={{ opacity: 0, y: 6, x: 0, scale: 0.6 }}
                animate={{ 
                  opacity: [0, 0.75, 0], 
                  y: [-2, -24], 
                  x: [0, 12], 
                  scale: [0.6, 1.1] 
                }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
              >
                z
              </motion.span>
              <motion.span
                className="absolute text-sm font-mono font-bold text-ner-terracotta/60 select-none"
                initial={{ opacity: 0, y: 6, x: 0, scale: 0.7 }}
                animate={{ 
                  opacity: [0, 0.85, 0], 
                  y: [-6, -32], 
                  x: [5, 20], 
                  scale: [0.7, 1.25] 
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
              >
                Z
              </motion.span>
            </div>
          )}
        </AnimatePresence>

        {/* Scalable SVG Pet Anatomy with Layered Limbs */}
        <svg
          viewBox="0 0 160 130"
          className="w-full h-full drop-shadow-sm overflow-visible pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="catBodyGrad" x1="80" y1="40" x2="80" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2D2D33" />
              <stop offset="100%" stopColor="#1E1E22" />
            </linearGradient>
            <linearGradient id="catBellyGrad" x1="80" y1="85" x2="80" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3C3C44" />
              <stop offset="100%" stopColor="#28282D" />
            </linearGradient>
          </defs>

          {/* 1. HIND LEGS (Rendered behind body) */}
          <g id="cat-hind-legs">
            {/* Hind Left Leg & Paw */}
            <g transform={`translate(${48 + legOffsets.hindLeft.x}, ${96 + legOffsets.hindLeft.y})`}>
              <path d="M 0 0 L 2 12" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
              <ellipse cx="2" cy="13" rx="6.5" ry="5" fill="#202024" stroke="#18181B" strokeWidth="1.6" />
            </g>

            {/* Hind Right Leg & Paw */}
            <g transform={`translate(${62 + legOffsets.hindRight.x}, ${96 + legOffsets.hindRight.y})`}>
              <path d="M 0 0 L 2 12" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
              <ellipse cx="2" cy="13" rx="6.5" ry="5" fill="#202024" stroke="#18181B" strokeWidth="1.6" />
            </g>
          </g>

          {/* 2. TAIL */}
          <motion.path
            d="M 125 110 C 146 104 153 84 142 74 C 137 69 130 75 133 83 C 137 91 128 101 118 108"
            stroke="#1E1E22"
            strokeWidth="7"
            strokeLinecap="round"
            className="high-contrast:stroke-white"
            animate={
              prefersReduced 
                ? {}
                : behavior === 'walking'
                ? { rotate: [Math.sin(walkPhase) * 12, -Math.sin(walkPhase) * 12], originX: '120px', originY: '110px' }
                : tailFlick
                ? { rotate: [0, 16, -12, 16, 0], originX: '120px', originY: '110px' }
                : behavior === 'startled'
                ? { rotate: [0, 22, -18, 22, 0], originX: '120px', originY: '110px' }
                : behavior === 'celebrating'
                ? { rotate: [0, 14, -10, 14, 0], originX: '120px', originY: '110px' }
                : behavior === 'petting'
                ? { rotate: [0, 8, -4, 0], originX: '120px', originY: '110px' }
                : behavior === 'sleeping'
                ? { rotate: [0, 3, 0], originX: '120px', originY: '110px' }
                : { rotate: [0, 5, -3, 0], originX: '120px', originY: '110px' }
            }
            transition={{
              duration: behavior === 'walking' ? 0.3 : tailFlick ? 0.6 : behavior === 'sleeping' ? 3.6 : 2.5,
              repeat: behavior === 'walking' || tailFlick ? 1 : Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* 3. MAIN BODY & BELLY */}
          <g transform={`translate(0, ${bodyBobY}) rotate(${bodyTilt} 80 98)`}>
            <motion.ellipse
              cx="80"
              cy="98"
              rx={behavior === 'stretching' ? 44 : behavior === 'sitting' ? 34 : 38}
              ry={behavior === 'stretching' ? 22 : behavior === 'sitting' ? 29 : 26}
              fill="url(#catBodyGrad)"
              stroke="#18181B"
              strokeWidth="2.5"
              className="high-contrast:fill-black high-contrast:stroke-white"
              animate={
                prefersReduced 
                  ? {}
                  : behavior === 'sleeping'
                  ? { scaleY: [1, 1.04, 1], y: [0, -1, 0] }
                  : { scaleY: [1, 1.02, 1] }
              }
              transition={{ duration: behavior === 'sleeping' ? 3.2 : 2.0, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Soft belly patch */}
            <ellipse
              cx="80"
              cy="101"
              rx={behavior === 'sitting' ? 18 : 22}
              ry={behavior === 'sitting' ? 19 : 17}
              fill="url(#catBellyGrad)"
              opacity="0.85"
              className="high-contrast:fill-zinc-900"
            />

            {/* Terracotta Minimalist Collar & Pendant */}
            <g id="cat-collar">
              <path
                d="M 64 78 Q 80 84 96 78"
                stroke="#DE4A30"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="80" cy="84" r="4.2" fill="#FAF9F6" stroke="#18181B" strokeWidth="1.2" />
              <circle cx="80" cy="84" r="1.6" fill="#DE4A30" />
            </g>
          </g>

          {/* 4. HEAD & EARS */}
          <motion.g
            id="cat-head-group"
            animate={headTransform}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ originX: '80px', originY: '60px' }}
          >
            {/* Left Ear */}
            <motion.path
              d="M 52 46 L 42 18 C 41 15 44 14 47 17 L 65 34 Z"
              fill="#26262B"
              stroke="#18181B"
              strokeWidth="2"
              strokeLinejoin="round"
              className="high-contrast:fill-black high-contrast:stroke-white"
              animate={
                earTwitchLeft && !prefersReduced
                  ? { rotate: [-6, 8, -6], originX: '52px', originY: '46px' }
                  : behavior === 'alert' || behavior === 'startled'
                  ? { rotate: -5, originX: '52px', originY: '46px' }
                  : behavior === 'petting'
                  ? { rotate: 5, originX: '52px', originY: '46px' }
                  : {}
              }
              transition={{ duration: 0.18 }}
            />
            <path d="M 50 40 L 46 24 L 60 34 Z" fill="#DE4A30" opacity="0.45" />

            {/* Right Ear */}
            <motion.path
              d="M 108 46 L 118 18 C 119 15 116 14 113 17 L 95 34 Z"
              fill="#26262B"
              stroke="#18181B"
              strokeWidth="2"
              strokeLinejoin="round"
              className="high-contrast:fill-black high-contrast:stroke-white"
              animate={
                earTwitchRight && !prefersReduced
                  ? { rotate: [6, -8, 6], originX: '108px', originY: '46px' }
                  : behavior === 'alert' || behavior === 'startled'
                  ? { rotate: 5, originX: '108px', originY: '46px' }
                  : behavior === 'petting'
                  ? { rotate: -5, originX: '108px', originY: '46px' }
                  : {}
              }
              transition={{ duration: 0.18 }}
            />
            <path d="M 110 40 L 114 24 L 100 34 Z" fill="#DE4A30" opacity="0.45" />

            {/* Head Contour */}
            <circle
              cx="80"
              cy="54"
              r="29"
              fill="url(#catBodyGrad)"
              stroke="#18181B"
              strokeWidth="2.5"
              className="high-contrast:fill-black high-contrast:stroke-white"
            />

            {/* Cheek blush */}
            <circle cx="62" cy="62" r="4.5" fill="#DE4A30" opacity="0.18" />
            <circle cx="98" cy="62" r="4.5" fill="#DE4A30" opacity="0.18" />

            {/* Whiskers */}
            <path d="M 58 59 L 41 57" stroke="#FAF9F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            <path d="M 57 63 L 39 64" stroke="#FAF9F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            <path d="M 102 59 L 119 57" stroke="#FAF9F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            <path d="M 103 63 L 121 64" stroke="#FAF9F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />

            {/* Nose */}
            <polygon
              points="78,57 82,57 80,60"
              fill="#DE4A30"
              stroke="#DE4A30"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Mouth */}
            {behavior === 'yawning' ? (
              <ellipse cx="80" cy="63" rx="4" ry="5.5" fill="#DE4A30" stroke="#FAF9F6" strokeWidth="1" />
            ) : behavior === 'celebrating' || behavior === 'petting' ? (
              <path
                d="M 75 62 Q 80 67 85 62"
                stroke="#FAF9F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="#DE4A30"
                fillOpacity="0.4"
              />
            ) : behavior === 'concerned' ? (
              <path d="M 76 64 Q 80 61 84 64" stroke="#FAF9F6" strokeWidth="1.4" strokeLinecap="round" />
            ) : (
              <path
                d="M 75 61 Q 78 64 80 61 Q 82 64 85 61"
                stroke="#FAF9F6"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {/* Eyes */}
            {isEyeClosed ? (
              <g id="cat-eyes-closed">
                <path d="M 66 52 Q 72 58 78 52" stroke="#FAF9F6" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 82 52 Q 88 58 94 52" stroke="#FAF9F6" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            ) : isBlinking ? (
              <g id="cat-eyes-blinking">
                <path d="M 67 52 L 77 52" stroke="#FAF9F6" strokeWidth="2" strokeLinecap="round" />
                <path d="M 83 52 L 93 52" stroke="#FAF9F6" strokeWidth="2" strokeLinecap="round" />
              </g>
            ) : (
              <g id="cat-eyes-awake">
                {/* Left Eye */}
                <ellipse 
                  cx="72" 
                  cy="52" 
                  rx={behavior === 'surprised' || behavior === 'startled' || behavior === 'peeking' ? 5.5 : 4.5} 
                  ry={behavior === 'surprised' || behavior === 'startled' || behavior === 'peeking' ? 6 : 5} 
                  fill="#FAF9F6" 
                />
                <circle
                  cx={72 + (isNearCursor ? mousePos.x * 0.7 : lookDirection === 'left' ? -1.8 : lookDirection === 'right' ? 1.8 : 0)}
                  cy={52 + (isNearCursor ? mousePos.y * 0.7 : 0)}
                  r={behavior === 'surprised' || behavior === 'startled' ? 2.8 : 2.5}
                  fill="#18181B"
                />
                <circle 
                  cx={70.8 + (isNearCursor ? mousePos.x * 0.5 : lookDirection === 'left' ? -1.2 : lookDirection === 'right' ? 1.2 : 0)} 
                  cy="50.2" 
                  r="1.1" 
                  fill="#FFFFFF" 
                />

                {/* Right Eye */}
                <ellipse 
                  cx="88" 
                  cy="52" 
                  rx={behavior === 'surprised' || behavior === 'startled' || behavior === 'peeking' ? 5.5 : 4.5} 
                  ry={behavior === 'surprised' || behavior === 'startled' || behavior === 'peeking' ? 6 : 5} 
                  fill="#FAF9F6" 
                />
                <circle
                  cx={88 + (isNearCursor ? mousePos.x * 0.7 : lookDirection === 'left' ? -1.8 : lookDirection === 'right' ? 1.8 : 0)}
                  cy={52 + (isNearCursor ? mousePos.y * 0.7 : 0)}
                  r={behavior === 'surprised' || behavior === 'startled' ? 2.8 : 2.5}
                  fill="#18181B"
                />
                <circle 
                  cx={86.8 + (isNearCursor ? mousePos.x * 0.5 : lookDirection === 'left' ? -1.2 : lookDirection === 'right' ? 1.2 : 0)} 
                  cy="50.2" 
                  r="1.1" 
                  fill="#FFFFFF" 
                />
              </g>
            )}
          </motion.g>

          {/* 5. FRONT PAWS & LEGS */}
          {/* Front Left Paw */}
          <motion.g
            id="cat-front-left-paw"
            animate={{
              x: pawsX.left + legOffsets.frontLeft.x,
              y: pawsY + legOffsets.frontLeft.y,
              rotate: behavior === 'hiding_eyes' ? 12 : behavior === 'peeking' ? 8 : 0
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="9"
              ry="7.5"
              fill="#2A2A2F"
              stroke="#18181B"
              strokeWidth="2"
              className="high-contrast:fill-black high-contrast:stroke-white"
            />
            <path d="M -3 3 L -3 6" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 2 3 L 2 6" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
            {behavior === 'hiding_eyes' && (
              <ellipse cx="0" cy="-1" rx="3.5" ry="2.5" fill="#DE4A30" opacity="0.6" />
            )}
          </motion.g>

          {/* Front Right Paw */}
          <motion.g
            id="cat-front-right-paw"
            animate={{
              x: pawsX.right + legOffsets.frontRight.x,
              y: pawsY + legOffsets.frontRight.y,
              rotate: behavior === 'hiding_eyes' ? -12 : behavior === 'peeking' ? -8 : 0
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="9"
              ry="7.5"
              fill="#2A2A2F"
              stroke="#18181B"
              strokeWidth="2"
              className="high-contrast:fill-black high-contrast:stroke-white"
            />
            <path d="M -2 3 L -2 6" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 3 3 L 3 6" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
            {behavior === 'hiding_eyes' && (
              <ellipse cx="0" cy="-1" rx="3.5" ry="2.5" fill="#DE4A30" opacity="0.6" />
            )}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};

export const AnimatedCat = InteractiveCat;
