import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Plus, 
  AlertCircle, 
  Loader2, 
  Compass, 
  Navigation,
  ShieldCheck,
  Home,
  Stethoscope,
  Cross,
  Users,
  Pill,
  Trees,
  HeartHandshake
} from 'lucide-react';
import { ImportantPlace, ImportantPlaceCategory } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

interface GoogleMapOnlineProps {
  places: ImportantPlace[];
  selectedPlace: ImportantPlace | null;
  onSelectPlace: (place: ImportantPlace) => void;
  onAddPlaceFromGoogle?: (place: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    placeId?: string;
  }) => void;
  userLocation: { lat: number; lng: number } | null;
  onSwitchToOffline: () => void;
}

export const GoogleMapOnline: React.FC<GoogleMapOnlineProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onAddPlaceFromGoogle,
  userLocation,
  onSwitchToOffline,
}) => {
  const { t } = useAccessibility();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    placeId?: string;
  } | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersMapRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const searchMarkerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

  // 1. Dynamic script loader for Google Maps Platform JavaScript API
  useEffect(() => {
    if (!apiKey) {
      setApiKeyMissing(true);
      setIsLoading(false);
      return;
    }

    if (window.google?.maps) {
      setIsLoading(false);
      return;
    }

    // Capture global auth failure callback from Google Maps API
    (window as any).gm_authFailure = () => {
      setLoadError('Google Maps authentication failed. Please verify your VITE_GOOGLE_MAPS_API_KEY in .env.');
      setIsLoading(false);
    };

    const scriptId = 'google-maps-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = () => {
        setLoadError('Failed to load Google Maps script. Check your internet connection or API key.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setIsLoading(false));
      script.addEventListener('error', () => {
        setLoadError('Failed to load Google Maps script.');
        setIsLoading(false);
      });
    }
  }, [apiKey]);

  // Color mapper for categories
  const getCategoryColor = (category: ImportantPlaceCategory): string => {
    switch (category) {
      case 'home': return '#D71921'; // Nothing terracotta / red
      case 'doctor': return '#4B6B56'; // Sage
      case 'hospital': return '#DC2626'; // Red
      case 'family': return '#2563EB'; // Calm Blue
      case 'caregiver': return '#9333EA'; // Purple
      case 'pharmacy': return '#059669'; // Emerald
      case 'park': return '#0D9488'; // Teal
      default: return '#121212';
    }
  };

  // 2. Initialize Google Map instance
  useEffect(() => {
    if (isLoading || loadError || apiKeyMissing || !mapContainerRef.current || !window.google?.maps) {
      return;
    }

    const defaultCenter = selectedPlace?.coordinates || 
      places.find(p => p.isPrimary)?.coordinates || 
      { lat: 26.1856, lng: 91.7644 }; // Silpukhuri, Guwahati default

    const mapOptions: google.maps.MapOptions = {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    };

    const map = new google.maps.Map(mapContainerRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 3. Initialize Google Places Autocomplete
    if (searchInputRef.current && window.google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(21.6, 88.0),
          new google.maps.LatLng(29.5, 97.4)
        ),
        strictBounds: false
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const coords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        map.setCenter(coords);
        map.setZoom(15);

        // Drop temporary search marker
        if (searchMarkerRef.current) {
          searchMarkerRef.current.setMap(null);
        }

        const newSearchMarker = new google.maps.Marker({
          position: coords,
          map,
          title: place.name || 'Searched Place',
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#D71921',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });
        searchMarkerRef.current = newSearchMarker;

        setSearchResult({
          name: place.name || 'Selected Place',
          address: place.formatted_address || '',
          coordinates: coords,
          placeId: place.place_id // Storing placeId as permitted by Google terms
        });
      });
    }

    return () => {
      // Cleanup markers
      markersMapRef.current.forEach(m => m.setMap(null));
      markersMapRef.current.clear();
      if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  }, [isLoading, loadError, apiKeyMissing]);

  // 4. Update markers when places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    // Remove obsolete markers
    markersMapRef.current.forEach((marker, id) => {
      if (!places.some(p => p.id === id)) {
        marker.setMap(null);
        markersMapRef.current.delete(id);
      }
    });

    // Add or update markers
    places.forEach(place => {
      if (!place.coordinates) return;

      const isSelected = selectedPlace?.id === place.id;
      const existing = markersMapRef.current.get(place.id);
      const color = getCategoryColor(place.category);

      const markerIcon: google.maps.Symbol = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: isSelected ? '#121212' : color,
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: isSelected ? 1.8 : 1.4,
        anchor: new google.maps.Point(12, 22)
      };

      if (existing) {
        existing.setIcon(markerIcon);
        existing.setZIndex(isSelected ? 999 : 10);
      } else {
        const marker = new google.maps.Marker({
          position: place.coordinates,
          map,
          title: place.name,
          icon: markerIcon,
          zIndex: isSelected ? 999 : 10
        });

        marker.addListener('click', () => {
          onSelectPlace(place);
        });

        markersMapRef.current.set(place.id, marker);
      }
    });
  }, [places, selectedPlace?.id, onSelectPlace]);

  // 5. Pan map when selectedPlace changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace?.coordinates) return;

    map.panTo(selectedPlace.coordinates);
    map.setZoom(15);
  }, [selectedPlace?.id]);

  // 6. User Current Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          map,
          title: 'Your Current Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: '#FFFFFF'
          },
          zIndex: 1000
        });
      } else {
        userMarkerRef.current.setPosition(userLocation);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Fallback State: API Key Missing
  if (apiKeyMissing) {
    return (
      <div className="rounded-3xl border-2 border-ner-black bg-white p-6 sm:p-8 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-ner-black">
          {t.mapApiConfigMissing}
        </h3>
        <p className="text-sm text-ner-black/70 max-w-md mx-auto leading-relaxed">
          Google Maps Platform requires an API Key. Add <code className="bg-ner-offwhite px-2 py-0.5 rounded font-mono font-bold text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-ner-offwhite px-2 py-0.5 rounded font-mono font-bold text-xs">.env</code> file.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSwitchToOffline}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-ner-black/90 shadow-sm transition-all"
          >
            {t.offlineMap} (OpenStreetMap / Natural Earth)
          </button>
        </div>
      </div>
    );
  }

  // Fallback State: Loading
  if (isLoading) {
    return (
      <div className="rounded-3xl border-2 border-ner-border bg-white p-12 text-center space-y-3 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 text-ner-terracotta animate-spin" />
        <p className="text-sm font-mono text-ner-black/70 font-bold">
          {t.googleMapsLoading}
        </p>
      </div>
    );
  }

  // Fallback State: Load Error
  if (loadError) {
    return (
      <div className="rounded-3xl border-2 border-red-500 bg-red-50 p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900">
          {t.googleMapsUnavailable}
        </h3>
        <p className="text-xs sm:text-sm text-red-800/80 max-w-md mx-auto">
          {loadError}
        </p>
        <button
          type="button"
          onClick={onSwitchToOffline}
          className="px-4 py-2 rounded-xl bg-red-800 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-900 transition-all"
        >
          Switch to Offline Map
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Google Places Search Box with Attribution */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-ner-black/50 absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search hospitals, pharmacies, clinics, or addresses via Google Places..."
            className="w-full pl-10 pr-24 py-3 rounded-2xl border-2 border-ner-black bg-white text-sm text-ner-black placeholder:text-ner-black/40 focus:outline-none focus:ring-2 focus:ring-ner-black/10 shadow-sm"
          />
          <span className="absolute right-3.5 text-[10px] font-mono text-ner-black/40 uppercase font-bold pointer-events-none">
            Google Places
          </span>
        </div>

        {/* Selected Search Result Banner — Allow user to save as Important Place */}
        {searchResult && (
          <div className="mt-2 p-3.5 rounded-2xl bg-white border-2 border-ner-black shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase font-bold text-ner-terracotta tracking-wider block">
                Found Place
              </span>
              <h4 className="text-sm font-bold text-ner-black truncate">
                {searchResult.name}
              </h4>
              <p className="text-xs text-ner-black/70 truncate">
                {searchResult.address}
              </p>
            </div>
            {onAddPlaceFromGoogle && (
              <button
                type="button"
                onClick={() => {
                  onAddPlaceFromGoogle(searchResult);
                  setSearchResult(null);
                }}
                className="px-4 py-2 rounded-xl bg-ner-sage text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-ner-sage/90 shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.saveToImportantPlaces}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Google Map Container with Native Google Logo & Attribution Untouched */}
      <div className="relative rounded-3xl border-2 border-ner-black overflow-hidden shadow-lg">
        {/* Connection Status Header */}
        <div className="bg-ner-black text-white px-4 py-2 flex items-center justify-between gap-2 border-b border-ner-black">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              {t.onlineMap} • Google Maps Platform
            </span>
          </div>
          <button
            type="button"
            onClick={onSwitchToOffline}
            className="text-[11px] font-mono font-bold text-amber-300 hover:text-amber-200 underline uppercase"
          >
            Force Offline Mode
          </button>
        </div>

        {/* The Native Google Map DOM Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-[380px] sm:h-[460px] bg-slate-100"
        />
      </div>

      {/* Google Maps Compliance & Attribution Footer */}
      <div className="px-3 py-1.5 text-[10px] font-mono text-ner-black/60 flex items-center justify-between">
        <span>Google Maps Platform Active • Google Logo & Attributions Preserved</span>
        <span className="text-emerald-700 font-bold">Online Dynamic Rendering</span>
      </div>
    </div>
  );
};
