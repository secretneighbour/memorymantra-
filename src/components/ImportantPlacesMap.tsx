import React, { useState, useEffect, useMemo } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  MapPin, 
  Home, 
  Stethoscope, 
  Cross, 
  Users, 
  Pill, 
  Trees, 
  Phone, 
  Navigation, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3,
  X,
  Compass,
  Wifi,
  WifiOff,
  Settings,
  AlertTriangle,
  Locate,
  Info,
  HeartHandshake,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ImportantPlace, ImportantPlaceCategory, MapMode, LocationPermissionState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from './motion/MotionPrimitives';
import { GoogleMapOnline } from './GoogleMapOnline';
import { NorthEastOfflineMap } from './NorthEastOfflineMap';
import { EmergencyHelpModal } from './EmergencyHelpModal';
import { calculateOfflineDataSize, northEastDatasetMetadata } from '../data/northEastMapData';

export const ImportantPlacesMap: React.FC = () => {
  const { 
    importantPlaces, 
    addImportantPlace, 
    updateImportantPlace, 
    deleteImportantPlace, 
    role,
    setIsHelpModalOpen 
  } = useRole();
  const { t, simpleUIMode } = useAccessibility();

  // Network Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Map Mode State (Auto, Force Online, Force Offline)
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    return (localStorage.getItem('smriti_map_mode') as MapMode) || 'auto';
  });

  // Location Permission and Coordinates
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationPermissionState>('prompt');
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Active Category Filter & Selection
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<ImportantPlace | null>(() => importantPlaces[0] || null);

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isEmergencyDrawerOpen, setIsEmergencyDrawerOpen] = useState<boolean>(false);

  // Form State
  const [placeName, setPlaceName] = useState('');
  const [placeCategory, setPlaceCategory] = useState<ImportantPlaceCategory>('home');
  const [placeAddress, setPlaceAddress] = useState('');
  const [placePhone, setPlacePhone] = useState('');
  const [placeLandmark, setPlaceLandmark] = useState('');
  const [placeCoords, setPlaceCoords] = useState<{ lat: number; lng: number }>({ lat: 26.1856, lng: 91.7644 });
  const [placeIsPrimary, setPlaceIsPrimary] = useState(false);

  // Sync network state with window events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync map mode preference
  const handleSetMapMode = (mode: MapMode) => {
    setMapMode(mode);
    localStorage.setItem('smriti_map_mode', mode);
  };

  // Determine whether to show Online Google Maps or Offline North-East Map
  const hasGoogleKey = Boolean((import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim());
  const activeRenderingMode: 'online' | 'offline' = useMemo(() => {
    if (mapMode === 'offline') return 'offline';
    if (mapMode === 'online') return isOnline ? 'online' : 'offline';
    // Auto mode
    return isOnline && hasGoogleKey ? 'online' : 'offline';
  }, [mapMode, isOnline, hasGoogleKey]);

  // Request Current User Geolocation with explicit user permission
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationErrorMsg(t.locationUnavailable);
      return;
    }

    setIsLocating(true);
    setLocationErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5))
        };
        setUserLocation(coords);
        setLocationStatus('granted');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setLocationErrorMsg(t.locationPermissionDeniedDesc);
        } else {
          setLocationStatus('unavailable');
          setLocationErrorMsg(t.locationUnavailable);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Role-Based Filtering
  // Doctor only sees necessary care and clinical places (Hospital, Clinic, Primary Home)
  const roleFilteredPlaces = useMemo(() => {
    if (role === 'doctor') {
      return importantPlaces.filter(p => 
        p.category === 'hospital' || 
        p.category === 'doctor' || 
        p.isPrimary
      );
    }
    return importantPlaces;
  }, [importantPlaces, role]);

  const displayedPlaces = useMemo(() => {
    if (activeCategory === 'all') return roleFilteredPlaces;
    return roleFilteredPlaces.filter(p => p.category === activeCategory);
  }, [roleFilteredPlaces, activeCategory]);

  const categories = [
    { id: 'all', label: 'All Places', icon: <Compass className="w-4 h-4" /> },
    { id: 'home', label: t.placeCategoryHome, icon: <Home className="w-4 h-4" /> },
    { id: 'doctor', label: t.placeCategoryDoctor, icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'hospital', label: t.placeCategoryHospital, icon: <Cross className="w-4 h-4" /> },
    { id: 'family', label: t.placeCategoryFamily, icon: <Users className="w-4 h-4" /> },
    { id: 'caregiver', label: t.placeCategoryCaregiver, icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'pharmacy', label: t.placeCategoryPharmacy, icon: <Pill className="w-4 h-4" /> },
    { id: 'park', label: t.placeCategoryPark, icon: <Trees className="w-4 h-4" /> },
  ];

  const getCategoryIcon = (category: ImportantPlaceCategory) => {
    switch (category) {
      case 'home': return <Home className="w-5 h-5 text-ner-terracotta" />;
      case 'doctor': return <Stethoscope className="w-5 h-5 text-ner-sage" />;
      case 'hospital': return <Cross className="w-5 h-5 text-red-600" />;
      case 'family': return <Users className="w-5 h-5 text-ner-calmBlue" />;
      case 'caregiver': return <HeartHandshake className="w-5 h-5 text-purple-600" />;
      case 'pharmacy': return <Pill className="w-5 h-5 text-emerald-600" />;
      case 'park': return <Trees className="w-5 h-5 text-teal-600" />;
      default: return <MapPin className="w-5 h-5 text-ner-black" />;
    }
  };

  // Open modal for new place
  const handleOpenAddModal = (initialCoords?: { lat: number; lng: number }) => {
    setEditingPlaceId(null);
    setPlaceName('');
    setPlaceCategory('home');
    setPlaceAddress('');
    setPlacePhone('');
    setPlaceLandmark('');
    setPlaceIsPrimary(false);
    setPlaceCoords(initialCoords || { lat: 26.1856, lng: 91.7644 });
    setIsAddEditModalOpen(true);
  };

  // Open modal for editing existing place
  const handleOpenEditModal = (place: ImportantPlace) => {
    setEditingPlaceId(place.id);
    setPlaceName(place.name);
    setPlaceCategory(place.category);
    setPlaceAddress(place.address);
    setPlacePhone(place.phone || '');
    setPlaceLandmark(place.landmark || '');
    setPlaceIsPrimary(Boolean(place.isPrimary));
    setPlaceCoords(place.coordinates || { lat: 26.1856, lng: 91.7644 });
    setIsAddEditModalOpen(true);
  };

  // Save place submit handler
  const handleSavePlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim() || !placeAddress.trim()) return;

    if (editingPlaceId) {
      updateImportantPlace(editingPlaceId, {
        name: placeName.trim(),
        category: placeCategory,
        address: placeAddress.trim(),
        phone: placePhone.trim() || undefined,
        landmark: placeLandmark.trim() || undefined,
        coordinates: placeCoords,
        isPrimary: placeIsPrimary
      });
    } else {
      addImportantPlace({
        name: placeName.trim(),
        category: placeCategory,
        address: placeAddress.trim(),
        phone: placePhone.trim() || undefined,
        landmark: placeLandmark.trim() || undefined,
        coordinates: placeCoords,
        isPrimary: placeIsPrimary,
        createdByRole: role
      });
    }

    setIsAddEditModalOpen(false);
  };

  // Google Places direct save handler
  const handleAddPlaceFromGoogle = (place: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    placeId?: string;
  }) => {
    // Guess category from name
    let cat: ImportantPlaceCategory = 'other';
    const lower = place.name.toLowerCase();
    if (lower.includes('hospital') || lower.includes('medical') || lower.includes('gmch')) cat = 'hospital';
    else if (lower.includes('pharmacy') || lower.includes('chemist') || lower.includes('dawai')) cat = 'pharmacy';
    else if (lower.includes('clinic') || lower.includes('doctor') || lower.includes('dr.')) cat = 'doctor';
    else if (lower.includes('park') || lower.includes('lake') || lower.includes('garden')) cat = 'park';

    addImportantPlace({
      name: place.name,
      category: cat,
      address: place.address,
      coordinates: place.coordinates,
      googlePlaceId: place.placeId,
      createdByRole: role
    });
  };

  const offlineDataSize = useMemo(() => calculateOfflineDataSize(), []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Connection Indicator Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border-2 border-ner-black shadow-sm">
        <div className="flex items-center gap-3">
          {activeRenderingMode === 'online' ? (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-600" />
                {t.onlineMap} • Google Maps Platform
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-amber-600" />
                {!isOnline ? t.connectionUnavailableShowingOffline : t.offlineMap}
              </span>
            </div>
          )}

          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-ner-offwhite border border-ner-border text-ner-black/60 hidden sm:inline">
            Mode: {mapMode === 'auto' ? 'Auto' : mapMode === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* My Current Location Trigger */}
          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={isLocating}
            title={t.currentLocation}
            className={`px-3.5 py-2 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              locationStatus === 'granted'
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-white border-ner-border text-ner-black hover:border-ner-black'
            }`}
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">{t.currentLocation}</span>
          </button>

          {/* Emergency Nearby Care Trigger */}
          <button
            type="button"
            onClick={() => setIsEmergencyDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Cross className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">I Need Help</span>
          </button>

          {/* Map & Offline Settings */}
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            title={t.mapSettingsTitle}
            className="p-2 rounded-xl bg-white border border-ner-border hover:border-ner-black text-ner-black transition-all shadow-sm active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Permission Denied Friendly Explanation */}
      {locationErrorMsg && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5 animate-fade-in">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{t.locationPermissionDenied}</p>
            <p className="text-blue-800/80 mt-0.5">{locationErrorMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => setLocationErrorMsg(null)}
            className="text-blue-600 hover:text-blue-900 font-bold p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Simple UI Mode Layout Adaptation */}
      {simpleUIMode ? (
        /* SIMPLE UI MODE: High-contrast large tactile cards, zero clutter */
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900">
              Simple UI Mode Active • Large Touch Cards
            </span>
            <span className="text-xs font-mono text-amber-700">Elderly Friendly</span>
          </div>

          {/* Large Interactive Map Canvas */}
          <div className="rounded-3xl overflow-hidden border-2 border-ner-black shadow-xl">
            {activeRenderingMode === 'online' ? (
              <GoogleMapOnline
                places={displayedPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={setSelectedPlace}
                onAddPlaceFromGoogle={handleAddPlaceFromGoogle}
                userLocation={userLocation}
                onSwitchToOffline={() => handleSetMapMode('offline')}
              />
            ) : (
              <NorthEastOfflineMap
                places={displayedPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={setSelectedPlace}
                userLocation={userLocation}
                onMapClickCoordinates={(coords) => handleOpenAddModal(coords)}
                isSimpleMode={true}
              />
            )}
          </div>

          {/* Simple UI 4 Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Where Am I? */}
            <button
              type="button"
              onClick={handleRequestLocation}
              className="p-5 rounded-3xl bg-white border-2 border-ner-black hover:bg-ner-offwhite shadow-md flex items-center gap-4 text-left transition-all active:scale-98 min-h-[80px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Locate className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-ner-black">{t.currentLocation}</h4>
                <p className="text-xs text-ner-black/60">Tap to see where you are on the map</p>
              </div>
            </button>

            {/* 2. Emergency Help / SOS */}
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="p-5 rounded-3xl bg-ner-terracotta text-white border-2 border-ner-black shadow-md flex items-center gap-4 text-left transition-all active:scale-98 min-h-[80px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
                <Cross className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Emergency Help & Call</h4>
                <p className="text-xs text-white/80">1-tap caregiver assistance & nearby hospital</p>
              </div>
            </button>
          </div>

          {/* Simple UI Large Place Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-ner-black px-1">My Important Places</h3>
            {displayedPlaces.map(place => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`p-5 rounded-3xl border-2 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                  selectedPlace?.id === place.id
                    ? 'bg-white border-ner-black ring-2 ring-ner-black/10'
                    : 'bg-white border-ner-border hover:border-ner-black'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-ner-offwhite border border-ner-border flex items-center justify-center shrink-0">
                    {getCategoryIcon(place.category)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-bold text-ner-black truncate">{place.name}</h4>
                    <p className="text-sm text-ner-black/70 truncate">{place.address}</p>
                    {place.landmark && (
                      <p className="text-xs text-ner-terracotta font-medium mt-0.5">📍 {place.landmark}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-ner-black text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-md active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t.placeCallBtn}</span>
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white border border-ner-border text-ner-black font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 hover:bg-ner-offwhite active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{t.placeDirectionsBtn}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD UI MODE */
        <>
          {/* Category Filter Pills & Add Place Button */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-ner-black text-white shadow-md'
                    : 'bg-white border border-ner-border text-ner-black/70 hover:text-ner-black hover:border-ner-black/40'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}

            {/* Caregiver & Patient Permitted Add Place */}
            {(role === 'caregiver' || role === 'patient') && (
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="px-4 py-2.5 rounded-xl bg-ner-sage text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:bg-ner-sage/90 transition-all shadow-sm active:scale-95 ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addPlaceBtn}</span>
              </button>
            )}
          </div>

          {/* Main Grid: Interactive Map View + Places Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Map Canvas */}
            <div className="lg:col-span-7 space-y-4">
              {activeRenderingMode === 'online' ? (
                <GoogleMapOnline
                  places={displayedPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={setSelectedPlace}
                  onAddPlaceFromGoogle={handleAddPlaceFromGoogle}
                  userLocation={userLocation}
                  onSwitchToOffline={() => handleSetMapMode('offline')}
                />
              ) : (
                <NorthEastOfflineMap
                  places={displayedPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={setSelectedPlace}
                  userLocation={userLocation}
                  onMapClickCoordinates={(coords) => handleOpenAddModal(coords)}
                />
              )}

              {/* Active Selected Place Preview Card */}
              {selectedPlace && (
                <div className="p-4 rounded-3xl bg-white border-2 border-ner-black shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-ner-terracotta tracking-wider">
                        Selected Familiar Anchor
                      </span>
                      {selectedPlace.isPrimary && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-ner-sage/20 text-ner-sage font-bold uppercase">
                          Primary Home
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-ner-black truncate">
                      {selectedPlace.name}
                    </h4>
                    <p className="text-xs text-ner-black/70 truncate">
                      {selectedPlace.address}
                    </p>
                    {selectedPlace.landmark && (
                      <p className="text-xs text-ner-terracotta font-medium mt-0.5">
                        📍 Landmark: {selectedPlace.landmark}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    {selectedPlace.phone && (
                      <a
                        href={`tel:${selectedPlace.phone}`}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-ner-black/90 transition-all active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t.placeCallBtn}</span>
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-ner-border text-ner-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-ner-offwhite transition-all active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{t.placeDirectionsBtn}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Places List Directory */}
            <div className="lg:col-span-5 space-y-3">
              {displayedPlaces.length === 0 ? (
                <div className="p-8 rounded-3xl border-2 border-ner-border bg-white text-center space-y-3">
                  <MapPin className="w-8 h-8 text-ner-black/40 mx-auto" />
                  <p className="text-sm font-bold text-ner-black">{t.noSavedPlaces}</p>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal()}
                    className="px-4 py-2 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase tactile-btn"
                  >
                    {t.addPlaceBtn}
                  </button>
                </div>
              ) : (
                <StaggerContainer staggerDelay={0.05} className="space-y-3">
                  {displayedPlaces.map(place => {
                    const isSelected = selectedPlace?.id === place.id;
                    return (
                      <StaggerItem key={place.id}>
                        <div
                          onClick={() => setSelectedPlace(place)}
                          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-sm relative tactile-card ${
                            isSelected
                              ? 'bg-white border-ner-black ring-2 ring-ner-black/5'
                              : 'bg-white border-ner-border hover:border-ner-black/50'
                          }`}
                        >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-ner-offwhite border border-ner-border flex items-center justify-center shrink-0">
                            {getCategoryIcon(place.category)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-ner-black">
                                {place.name}
                              </h4>
                              {place.isPrimary && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-ner-sage/20 text-ner-sage font-bold uppercase">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ner-black/70 mt-0.5 line-clamp-2">
                              {place.address}
                            </p>
                            {place.landmark && (
                              <p className="text-xs text-ner-terracotta font-medium mt-1">
                                📍 Landmark: {place.landmark}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons (Caregiver can edit/delete; Patient can edit permitted) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {role === 'caregiver' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(place);
                              }}
                              className="text-ner-black/40 hover:text-ner-black p-1.5 rounded-lg transition-colors"
                              title="Edit place"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {role === 'caregiver' && !place.isPrimary && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteImportantPlace(place.id);
                              }}
                              className="text-ner-black/40 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                              title="Delete place"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Direct Call & Route Strip */}
                      <div className="mt-3 pt-2.5 border-t border-ner-border/60 flex items-center justify-between gap-2">
                        {place.contactName ? (
                          <span className="text-[11px] font-mono text-ner-black/60 truncate">
                            {place.contactName}
                          </span>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                          {place.phone && (
                            <a
                              href={`tel:${place.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 rounded-xl bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{t.placeCallBtn}</span>
                            </a>
                          )}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-ner-black/90 transition-all active:scale-95"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Route</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-ner-offwhite border border-ner-border flex items-start gap-3 text-xs text-ner-black/70">
            <ShieldCheck className="w-5 h-5 text-ner-sage shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold text-ner-black">Privacy-First Guarantee: </strong>
              {t.placesPrivacyNotice} {t.privacyLocationNotice}
            </p>
          </div>
        </>
      )}

      {/* MODAL 1: Add or Edit Important Place */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsAddEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-ner-offwhite border-2 border-ner-black rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-ner-border flex items-center justify-between bg-white">
                <h3 className="text-xl font-bold text-ner-black">
                  {editingPlaceId ? t.editPlaceBtn : t.addPlaceBtn}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black shadow-xs tactile-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePlaceSubmit} className="flex flex-col flex-grow overflow-hidden">
                <div className="p-5 space-y-3.5 overflow-y-auto">
                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                      Place Name
                    </label>
                    <input
                      type="text"
                      required
                      value={placeName}
                      onChange={e => setPlaceName(e.target.value)}
                      placeholder="e.g. Minoti Devi Residence / Dispur Clinic"
                      className="w-full p-3 rounded-xl border border-ner-border bg-white text-ner-black text-sm focus:border-ner-black outline-none input-smooth"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                      Category
                    </label>
                    <select
                      value={placeCategory}
                      onChange={e => setPlaceCategory(e.target.value as any)}
                      className="w-full p-3 rounded-xl border border-ner-border bg-white text-ner-black text-sm focus:border-ner-black outline-none"
                    >
                      <option value="home">{t.placeCategoryHome}</option>
                      <option value="doctor">{t.placeCategoryDoctor}</option>
                      <option value="hospital">{t.placeCategoryHospital}</option>
                      <option value="family">{t.placeCategoryFamily}</option>
                      <option value="caregiver">{t.placeCategoryCaregiver}</option>
                      <option value="pharmacy">{t.placeCategoryPharmacy}</option>
                      <option value="park">{t.placeCategoryPark}</option>
                      <option value="other">{t.placeCategoryOther}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={placeAddress}
                      onChange={e => setPlaceAddress(e.target.value)}
                      placeholder="e.g. Silpukhuri East, Guwahati, Assam"
                      className="w-full p-3 rounded-xl border border-ner-border bg-white text-ner-black text-sm focus:border-ner-black outline-none input-smooth"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                      Landmark Cue (Familiar memory anchor)
                    </label>
                    <input
                      type="text"
                      value={placeLandmark}
                      onChange={e => setPlaceLandmark(e.target.value)}
                      placeholder="e.g. Near Silpukhuri Water Tank & Namghar"
                      className="w-full p-3 rounded-xl border border-ner-border bg-white text-ner-black text-sm focus:border-ner-black outline-none input-smooth"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={placePhone}
                      onChange={e => setPlacePhone(e.target.value)}
                      placeholder="+91 98640 12345"
                      className="w-full p-3 rounded-xl border border-ner-border bg-white text-ner-black text-sm focus:border-ner-black outline-none input-smooth"
                    />
                  </div>

                  {role === 'caregiver' && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isPrimaryCheckbox"
                        checked={placeIsPrimary}
                        onChange={e => setPlaceIsPrimary(e.target.checked)}
                        className="w-4 h-4 rounded border-ner-border text-ner-black focus:ring-0"
                      />
                      <label htmlFor="isPrimaryCheckbox" className="text-xs text-ner-black font-medium cursor-pointer">
                        Mark as Primary Home Residence
                      </label>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-ner-border bg-white flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-ner-border bg-white text-ner-black font-mono text-xs font-bold uppercase hover:bg-ner-offwhite tactile-btn"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase hover:bg-ner-black/90 shadow-md tactile-btn"
                  >
                    {t.saveBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Map & Offline Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-ner-offwhite border-2 border-ner-black rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-ner-border flex items-start justify-between gap-4 bg-white">
                <div>
                  <h3 className="text-xl font-bold text-ner-black mb-1">
                    {t.mapSettingsTitle}
                  </h3>
                  <p className="text-xs text-ner-black/60">
                    Configure online Google Maps vs offline open map datasets and data controls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black shrink-0 shadow-xs tactile-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto">
                {/* Map Mode Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-2">
                    Rendering Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetMapMode('auto')}
                      className={`py-2.5 px-3 rounded-xl border-2 font-mono text-xs font-bold uppercase transition-all tactile-btn ${
                        mapMode === 'auto'
                          ? 'bg-ner-black text-white border-ner-black shadow-sm'
                          : 'bg-white border-ner-border text-ner-black hover:border-ner-black'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMapMode('online')}
                      className={`py-2.5 px-3 rounded-xl border-2 font-mono text-xs font-bold uppercase transition-all tactile-btn ${
                        mapMode === 'online'
                          ? 'bg-ner-black text-white border-ner-black shadow-sm'
                          : 'bg-white border-ner-border text-ner-black hover:border-ner-black'
                      }`}
                    >
                      Online
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMapMode('offline')}
                      className={`py-2.5 px-3 rounded-xl border-2 font-mono text-xs font-bold uppercase transition-all tactile-btn ${
                        mapMode === 'offline'
                          ? 'bg-ner-black text-white border-ner-black shadow-sm'
                          : 'bg-white border-ner-border text-ner-black hover:border-ner-black'
                      }`}
                    >
                      Offline
                    </button>
                  </div>
                </div>

                {/* Offline Dataset Card */}
                <div className="p-4 rounded-2xl bg-white border border-ner-border space-y-2 tactile-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-ner-black">
                      {t.offlineDataRegion}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-ner-black/70 leading-relaxed">
                    <strong>Coverage: </strong>{t.offlineDataCoverage}
                  </p>
                  <div className="flex items-center justify-between text-xs text-ner-black/60 font-mono pt-1">
                    <span>Actual Dataset Size:</span>
                    <span className="font-bold text-ner-black">{offlineDataSize.formatted}</span>
                  </div>
                  <div className="text-[10px] text-ner-black/50 font-mono pt-1 border-t border-ner-border/60">
                    {northEastDatasetMetadata.attribution}
                  </div>
                </div>

                {/* Location Permission Status */}
                <div className="p-4 rounded-2xl bg-white border border-ner-border flex items-center justify-between tactile-card">
                  <div>
                    <h5 className="text-xs font-mono uppercase font-bold text-ner-black">
                      {t.locationPermission}
                    </h5>
                    <p className="text-xs text-ner-black/60">
                      Status: <strong className="capitalize">{locationStatus}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    className="px-3 py-1.5 rounded-xl bg-ner-offwhite border border-ner-border font-mono text-xs font-bold uppercase text-ner-black hover:bg-ner-black hover:text-white transition-all tactile-btn"
                  >
                    Test Location
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-ner-border bg-white flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase shadow-sm hover:bg-ner-black/90 transition-all tactile-btn"
                >
                  Close Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Emergency Care Nearby Drawer */}
      <AnimatePresence>
        {isEmergencyDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsEmergencyDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-ner-offwhite border-2 border-ner-black rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-ner-border flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <Cross className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ner-black">
                      {t.helpAndCareLocations}
                    </h3>
                    <p className="text-xs text-ner-black/70">
                      Nearest emergency hospitals, clinics, and family assistance anchors.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmergencyDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black shadow-xs shrink-0 tactile-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3 overflow-y-auto">
                {importantPlaces.filter(p => p.category === 'hospital' || p.category === 'doctor').map(place => (
                  <div key={place.id} className="p-3.5 rounded-2xl bg-white border border-ner-border flex items-center justify-between gap-3 tactile-card">
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-ner-black truncate">{place.name}</h5>
                      <p className="text-xs text-ner-black/60 truncate">{place.address}</p>
                    </div>
                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="px-3 py-2 rounded-xl bg-red-600 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 tactile-btn"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-ner-border bg-white flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEmergencyDrawerOpen(false);
                    setIsHelpModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-ner-terracotta text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-ner-terracotta/90 tactile-btn"
                >
                  <Cross className="w-4 h-4" />
                  <span>Open Emergency SOS & SMS</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
