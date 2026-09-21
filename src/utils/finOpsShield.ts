/**
 * MEMORY MANTRA - FinOps Shield & Free-Tier Optimization Utilities
 * 
 * Provides:
 * 1. 24-hour LocalStorage cache for AI responses (keyed by prompt + context hash).
 * 2. 5km spatial radius cache for Geolocation / Places data.
 * 3. 800ms debounce for chat input / search.
 * 4. Cooldown throttling for "Listen Aloud" and "Download" buttons.
 * 5. Graceful quota exhaustion fallback messages for elderly users.
 */

// ============================================================================
// 1. DETERMINISTIC HASHING & AI RESPONSE CACHING (24-Hour TTL)
// ============================================================================

const AI_CACHE_PREFIX = 'memory_mantra_finops_ai_';
const LEGACY_AI_CACHE_PREFIX = 'smriti_finops_ai_';
const AI_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedAIResponse<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  promptHash: string;
}

/**
 * Creates a fast 32-bit FNV-1a style hash of a string
 */
export function hashPromptContext(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Builds a deterministic cache key from prompt text and optional parameters
 */
export function buildAICacheKey(
  prompt: string,
  mode = 'general',
  lang = 'en',
  userId = 'guest'
): string {
  const normalizedPrompt = prompt.trim().toLowerCase();
  const normalizedMode = mode.toLowerCase();
  const normalizedLang = lang.toLowerCase();
  const normalizedUser = userId.toLowerCase();
  const composite = `${normalizedUser}|${normalizedMode}|${normalizedLang}|${normalizedPrompt}`;
  return `${AI_CACHE_PREFIX}${hashPromptContext(composite)}`;
}

export function generateAICompositeKey(
  prompt: string,
  context?: { patientName?: string; mode?: string; language?: string }
): string {
  return buildAICacheKey(
    prompt,
    context?.mode || 'general',
    context?.language || 'en',
    context?.patientName || 'guest'
  );
}

export class FinOpsAICache {
  /**
   * Retrieves cached AI response if valid within 24-hour TTL
   */
  public static get<T = any>(cacheKey: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const legacyKey = cacheKey.replace(AI_CACHE_PREFIX, LEGACY_AI_CACHE_PREFIX);
      const raw = localStorage.getItem(cacheKey) || localStorage.getItem(legacyKey);
      if (!raw) return null;

      const entry: CachedAIResponse<T> = JSON.parse(raw);
      const now = Date.now();

      if (now < entry.expiresAt) {
        return entry.data;
      }

      // Expired: prune item silently
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(legacyKey);
    } catch (err) {
      console.warn('[FinOps] Cache retrieval error:', err);
    }
    return null;
  }

  /**
   * Caches an AI response with 24-hour TTL in localStorage
   */
  public static set<T = any>(cacheKey: string, data: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const now = Date.now();
      const entry: CachedAIResponse<T> = {
        data,
        timestamp: now,
        expiresAt: now + AI_CACHE_TTL_MS,
        promptHash: cacheKey,
      };

      localStorage.setItem(cacheKey, JSON.stringify(entry));
      const legacyKey = cacheKey.replace(AI_CACHE_PREFIX, LEGACY_AI_CACHE_PREFIX);
      localStorage.setItem(legacyKey, JSON.stringify(entry));
      this.pruneOldEntries();
    } catch (err) {
      console.warn('[FinOps] Cache storage error (quota exceeded):', err);
    }
  }

  /**
   * Cleanup oldest entries if localStorage grows large
   */
  private static pruneOldEntries(): void {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(AI_CACHE_PREFIX) || k.startsWith(LEGACY_AI_CACHE_PREFIX));
      if (keys.length > 80) {
        // Remove oldest 20 entries
        keys
          .map((k) => {
            try {
              const item = JSON.parse(localStorage.getItem(k) || '{}');
              return { key: k, expiresAt: item.expiresAt || 0 };
            } catch {
              return { key: k, expiresAt: 0 };
            }
          })
          .sort((a, b) => a.expiresAt - b.expiresAt)
          .slice(0, 20)
          .forEach((item) => localStorage.removeItem(item.key));
      }
    } catch {
      // Ignore prune errors
    }
  }
}

// ============================================================================
// 2. SPATIAL RADIUS CACHE FOR PLACES / MEDICAL API (5km Radius)
// ============================================================================

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PLACES_CACHE_KEY = 'memory_mantra_places_spatial_cache';
const LEGACY_PLACES_CACHE_KEY = 'smriti_places_spatial_cache';

export interface SpatialPlacesCache<T = any> {
  lat: number;
  lng: number;
  data: T;
  timestamp: number;
}

export class FinOpsPlacesCache {
  /**
   * Check if current coordinates fall within 5km of already cached medical/places data
   */
  public static getWithinRadius<T = any>(
    currentLat: number,
    currentLng: number,
    maxRadiusKm = 5.0
  ): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const raw = localStorage.getItem(PLACES_CACHE_KEY) || localStorage.getItem(LEGACY_PLACES_CACHE_KEY);
      if (!raw) return null;

      const parsed: SpatialPlacesCache<T> = JSON.parse(raw);
      const distance = calculateDistanceKm(currentLat, currentLng, parsed.lat, parsed.lng);

      if (distance <= maxRadiusKm) {
        return parsed.data;
      }
    } catch (e) {
      console.warn('[FinOps] Places cache check failed:', e);
    }
    return null;
  }

  /**
   * Store places data with current center point
   */
  public static set<T = any>(lat: number, lng: number, data: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const payload: SpatialPlacesCache<T> = {
        lat,
        lng,
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(PLACES_CACHE_KEY, JSON.stringify(payload));
      localStorage.setItem(LEGACY_PLACES_CACHE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('[FinOps] Saving places cache failed:', e);
    }
  }
}

// ============================================================================
// 3. REQUEST DEBOUNCING & THROTTLING (800ms Input Debounce & Button Cooldown)
// ============================================================================

/**
 * Debounce utility: delays execution until after delayMs of inactivity
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs = 800
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: any = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}

/**
 * Button Cooldown / Rapid-Tap Guard:
 * Prevents multiple clicks on "Listen Aloud" or "Download" buttons from firing concurrent requests.
 */
export class ButtonCooldownGuard {
  private static cooldowns = new Set<string>();

  /**
   * Attempts to execute the action; if button is in cooldown, silently ignores.
   */
  public static runWithCooldown(
    buttonId: string,
    action: () => void | Promise<void>,
    cooldownMs = 2500
  ): boolean {
    if (this.cooldowns.has(buttonId)) {
      return false; // Action rejected due to active cooldown
    }

    this.cooldowns.add(buttonId);
    try {
      const res = action();
      if (res instanceof Promise) {
        res.catch((err) => console.warn(`[FinOps] Action '${buttonId}' failed:`, err));
      }
    } finally {
      setTimeout(() => {
        this.cooldowns.delete(buttonId);
      }, cooldownMs);
    }
    return true;
  }

  public static isCoolingDown(buttonId: string): boolean {
    return this.cooldowns.has(buttonId);
  }
}

// ============================================================================
// 4. GRACEFUL DEGRADATION: ELDERLY-FRIENDLY FALLBACKS
// ============================================================================

export const ELDERLY_QUOTA_FALLBACK = {
  reply: 'Memory Mantra is taking a short rest. Please try again in a few minutes.',
  language: 'English',
  actionRoute: '/memory',
  actionLabel: "View Today's Timeline",
  suggestedReplies: ["What is my next reminder?", "Show today's date", "Play calming music"],
};
