/**
 * MEMORY MANTRA - Medical Services Locator Offline Service
 * 
 * Provides:
 * 1. Automatic data caching to LocalStorage for Overpass API geospatial results.
 * 2. "Sticking" offline fallback coordinates logic.
 * 3. Graceful network error handling and offline marker recovery.
 */

export interface MedicalFacility {
  id: number | string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic' | 'emergency';
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
}

export interface CachedMedicalPayload {
  timestamp: number;
  lat: number;
  lng: number;
  facilities: MedicalFacility[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Default fallback anchor (Guwahati, NER / Assam region)
export const DEFAULT_COORDINATES: Coordinates = {
  lat: 26.1445,
  lng: 91.7362
};

const STORAGE_KEYS = {
  LATEST_LOCATION: 'memory_mantra_latest_location',
  LEGACY_LATEST_LOCATION: 'smriticare_latest_location',
  LATEST_MEDICAL_DATA: 'memory_mantra_latest_medical_data',
  LEGACY_LATEST_MEDICAL_DATA: 'smriticare_latest_medical_data',
  MAP_PREFIX: 'memory_mantra_medical_data_',
  LEGACY_MAP_PREFIX: 'smriticare_medical_data_'
};

/**
 * Register Service Worker for automatic tile caching
 */
export function registerMapServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.debug('[MEMORY MANTRA PWA] Map Tile Caching SW active with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[MEMORY MANTRA PWA] SW registration failed:', err);
        });
    });
  }
}

/**
 * 1. Read last known location from localStorage
 */
export function getSavedLocation(): Coordinates {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LATEST_LOCATION) || localStorage.getItem(STORAGE_KEYS.LEGACY_LATEST_LOCATION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[MEMORY MANTRA] Error reading saved coordinates:', err);
  }
  return DEFAULT_COORDINATES;
}

/**
 * 2. Save current user location to localStorage
 */
export function saveLocation(coords: Coordinates): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LATEST_LOCATION, JSON.stringify(coords));
    localStorage.setItem(STORAGE_KEYS.LEGACY_LATEST_LOCATION, JSON.stringify(coords));
  } catch (err) {
    console.warn('[MEMORY MANTRA] Error persisting location:', err);
  }
}

/**
 * 3. Read cached medical facilities from localStorage
 */
export function getCachedMedicalData(): CachedMedicalPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LATEST_MEDICAL_DATA) || localStorage.getItem(STORAGE_KEYS.LEGACY_LATEST_MEDICAL_DATA);
    if (raw) {
      return JSON.parse(raw) as CachedMedicalPayload;
    }
  } catch (err) {
    console.warn('[MEMORY MANTRA] Error reading cached medical data:', err);
  }
  return null;
}

/**
 * 4. Save fresh medical facilities to localStorage
 */
export function cacheMedicalData(coords: Coordinates, facilities: MedicalFacility[]): void {
  try {
    const payload: CachedMedicalPayload = {
      timestamp: Date.now(),
      lat: coords.lat,
      lng: coords.lng,
      facilities
    };

    // Save as latest snapshot
    localStorage.setItem(STORAGE_KEYS.LATEST_MEDICAL_DATA, JSON.stringify(payload));
    localStorage.setItem(STORAGE_KEYS.LEGACY_LATEST_MEDICAL_DATA, JSON.stringify(payload));

    // Also store spatial key for regional lookup
    const spatialKey = `${STORAGE_KEYS.MAP_PREFIX}${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;
    localStorage.setItem(spatialKey, JSON.stringify(payload));
    const legacySpatialKey = `${STORAGE_KEYS.LEGACY_MAP_PREFIX}${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;
    localStorage.setItem(legacySpatialKey, JSON.stringify(payload));
  } catch (err) {
    console.warn('[MEMORY MANTRA] Error caching medical facilities:', err);
  }
}

/**
 * 5. Fetch nearby medical facilities from Overpass API (Hospitals, Pharmacies, Clinics)
 */
export async function fetchOverpassMedicalFacilities(
  coords: Coordinates,
  radiusMeters = 5000,
  timeoutMs = 9000
): Promise<MedicalFacility[]> {
  const overpassQuery = `
    [out:json][timeout:10];
    (
      node["amenity"="hospital"](around:${radiusMeters},${coords.lat},${coords.lng});
      node["amenity"="pharmacy"](around:${radiusMeters},${coords.lat},${coords.lng});
      node["amenity"="clinic"](around:${radiusMeters},${coords.lat},${coords.lng});
      way["amenity"="hospital"](around:${radiusMeters},${coords.lat},${coords.lng});
      way["amenity"="pharmacy"](around:${radiusMeters},${coords.lat},${coords.lng});
      way["amenity"="clinic"](around:${radiusMeters},${coords.lat},${coords.lng});
    );
    out center;
  `.trim();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass API HTTP ${response.status}`);
    }

    const data = await response.json();
    const facilities: MedicalFacility[] = [];

    if (Array.isArray(data.elements)) {
      for (const el of data.elements) {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        if (typeof lat !== 'number' || typeof lng !== 'number') continue;

        const amenity = el.tags?.amenity;
        let type: MedicalFacility['type'] = 'clinic';
        if (amenity === 'hospital') type = 'hospital';
        else if (amenity === 'pharmacy') type = 'pharmacy';

        const name = el.tags?.name || (type === 'hospital' ? 'Unnamed Hospital' : type === 'pharmacy' ? 'Unnamed Pharmacy' : 'Medical Clinic');
        const phone = el.tags?.['phone'] || el.tags?.['contact:phone'];
        const address = [el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(', ');

        facilities.push({
          id: el.id,
          name,
          type,
          lat,
          lng,
          phone,
          address: address || undefined
        });
      }
    }

    return facilities;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
