import React, { useEffect, useRef, useState } from 'react';
import { 
  getSavedLocation, 
  saveLocation, 
  getCachedMedicalData, 
  cacheMedicalData, 
  fetchOverpassMedicalFacilities, 
  MedicalFacility, 
  Coordinates,
  DEFAULT_COORDINATES
} from '../services/medicalLocatorService';
import { 
  Hospital, 
  Pill, 
  PlusSquare, 
  Phone, 
  Navigation, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  MapPin
} from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

export const MedicalServicesLocator: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<MedicalFacility | null>(null);
  const [status, setStatus] = useState<'live' | 'offline' | 'loading'>('loading');
  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(false);

  // 1. Dynamically load Leaflet assets if not present
  useEffect(() => {
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const scriptId = 'leaflet-cdn-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    } else {
      const existing = document.getElementById(scriptId) as HTMLScriptElement;
      existing.addEventListener('load', () => setIsLeafletReady(true));
    }
  }, []);

  // Helper to render markers onto the Leaflet layer group
  const renderMarkers = (items: MedicalFacility[]) => {
    if (!window.L || !markersLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();

    items.forEach((item) => {
      const isHospital = item.type === 'hospital';
      const markerColor = isHospital ? '#DC2626' : '#059669';
      const iconSymbol = isHospital ? '🏥' : '💊';

      const customIcon = window.L.divIcon({
        className: 'custom-medical-pin',
        html: `
          <div style="
            background: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.25);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">${iconSymbol}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = window.L.marker([item.lat, item.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 160px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #111;">${item.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: ${markerColor}; font-weight: 600;">
            ${item.type.toUpperCase()}
          </p>
          ${item.address ? `<p style="margin: 0 0 6px 0; font-size: 11px; color: #666;">${item.address}</p>` : ''}
          ${item.phone ? `<a href="tel:${item.phone}" style="display: inline-block; font-size: 11px; color: #fff; background: #111; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-weight: bold;">Call: ${item.phone}</a>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => setSelectedFacility(item));
      markersLayerGroupRef.current.addLayer(marker);
    });
  };

  // Helper to place/update user location pin
  const updateUserPin = (coords: Coordinates) => {
    if (!window.L || !mapInstanceRef.current) return;

    const userIcon = window.L.divIcon({
      className: 'user-location-pin',
      html: `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="position: absolute; width: 100%; height: 100%; background: #2563EB; border-radius: 50%; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #2563EB; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
    } else {
      userMarkerRef.current = window.L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
    }
  };

  // 2. Map Initialization with "Sticking" Coordinates & Silent Offline Cache
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    // A. Read saved location from localStorage immediately (sticks to last known area)
    const initialCoords = getSavedLocation();

    // B. Initialize Leaflet map immediately at the saved coordinates
    const map = window.L.map(mapContainerRef.current, {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: 14,
      zoomControl: false
    });
    mapInstanceRef.current = map;

    // Reposition zoom controls to bottom-right to keep top-right clean for subtle status pill
    window.L.control.zoom({ position: 'bottomright' }).addTo(map);

    // C. OpenStreetMap Tile Layer - SW automatically intercepts and caches these tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // D. Layer group for markers
    markersLayerGroupRef.current = window.L.layerGroup().addTo(map);

    // E. Load cached markers from localStorage immediately (Zero blank screen)
    const cachedData = getCachedMedicalData();
    if (cachedData && Array.isArray(cachedData.facilities) && cachedData.facilities.length > 0) {
      setFacilities(cachedData.facilities);
      renderMarkers(cachedData.facilities);
      setStatus(navigator.onLine ? 'live' : 'offline');
    }

    // Place initial user indicator pin at saved location
    updateUserPin(initialCoords);

    // F. Fetch fresh Overpass data with graceful error handling
    const fetchFreshData = async (targetCoords: Coordinates) => {
      setStatus('loading');
      try {
        const freshFacilities = await fetchOverpassMedicalFacilities(targetCoords);
        if (freshFacilities && freshFacilities.length > 0) {
          setFacilities(freshFacilities);
          renderMarkers(freshFacilities);
          // Automatically save data and coordinates silently to localStorage
          cacheMedicalData(targetCoords, freshFacilities);
        }
        setStatus(navigator.onLine ? 'live' : 'offline');
      } catch (networkError) {
        console.warn('[MEMORY MANTRA] Network/Overpass fetch failed. Falling back to cached data:', networkError);
        // Do NOT clear map. Fallback to localStorage data
        const fallbackData = getCachedMedicalData();
        if (fallbackData?.facilities) {
          setFacilities(fallbackData.facilities);
          renderMarkers(fallbackData.facilities);
        }
        // Graceful subtle indicator
        setStatus('offline');
      }
    };

    // G. Request live GPS with silent fallback to saved coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const liveCoords: Coordinates = {
            lat: Number(position.coords.latitude.toFixed(5)),
            lng: Number(position.coords.longitude.toFixed(5))
          };

          // Update map and user pin smoothly
          map.panTo([liveCoords.lat, liveCoords.lng]);
          updateUserPin(liveCoords);

          // Persist coordinates
          saveLocation(liveCoords);

          // Fetch fresh Overpass data for new location
          fetchFreshData(liveCoords);
        },
        (geoError) => {
          // Silent fallback: Do NOT show alert or error dialog!
          console.info('[MEMORY MANTRA] Geolocation unavailable or timed out. Sticking to saved coordinates.', geoError.message);
          // Map remains stuck at initialCoords
          fetchFreshData(initialCoords);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      fetchFreshData(initialCoords);
    }

    // H. Online / Offline window listeners to toggle subtle pill reactively
    const handleOnline = () => {
      setStatus('live');
      const latestCoords = getSavedLocation();
      fetchFreshData(latestCoords);
    };

    const handleOffline = () => {
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLeafletReady]);

  // Manual silent re-sync trigger
  const handleSilentRefresh = async () => {
    setStatus('loading');
    const coords = getSavedLocation();
    try {
      const fresh = await fetchOverpassMedicalFacilities(coords);
      if (fresh?.length) {
        setFacilities(fresh);
        renderMarkers(fresh);
        cacheMedicalData(coords, fresh);
      }
      setStatus('live');
    } catch {
      setStatus('offline');
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-ner-black shadow-xl bg-ner-offwhite">
      {/* 4. Subtle UI Feedback: Non-intrusive status pill in top-right */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        <div 
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md border transition-all duration-300 ${
            status === 'live'
              ? 'bg-emerald-500/90 text-white border-emerald-400'
              : status === 'offline'
              ? 'bg-amber-500/90 text-white border-amber-400'
              : 'bg-ner-black/80 text-white border-ner-black'
          }`}
        >
          {status === 'live' && (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <Wifi className="w-3.5 h-3.5" />
              <span>Live</span>
            </>
          )}

          {status === 'offline' && (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline — Showing Cached Data</span>
            </>
          )}

          {status === 'loading' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </>
          )}
        </div>

        {/* Silent refresh button (No manual download) */}
        <button
          type="button"
          onClick={handleSilentRefresh}
          title="Refresh nearby medical data"
          className="p-2 rounded-full bg-white/90 hover:bg-white text-ner-black border border-ner-border shadow-md backdrop-blur-xs transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        id="memory-mantra-medical-map" 
        className="w-full h-[520px] z-0"
      />

      {/* Footer Details: Nearest Facilities Overview */}
      <div className="p-4 bg-white border-t-2 border-ner-black flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-ner-black">
              {facilities.length} Nearby Medical Facilities Available
            </h4>
            <p className="text-xs text-ner-black/60">
              {status === 'offline' 
                ? 'Persisted in local memory for instant emergency reference.'
                : 'Silently cached in background for offline emergency availability.'}
            </p>
          </div>
        </div>

        {selectedFacility && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ner-terracotta">
              Selected: {selectedFacility.name}
            </span>
            {selectedFacility.phone && (
              <a
                href={`tel:${selectedFacility.phone}`}
                className="px-3 py-1.5 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
