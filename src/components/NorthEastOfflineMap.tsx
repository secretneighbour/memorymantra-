import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Compass, 
  MapPin, 
  Home, 
  Stethoscope, 
  Cross, 
  Users, 
  Pill, 
  Trees, 
  HeartHandshake,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ImportantPlace, ImportantPlaceCategory } from '../types';
import { 
  NER_BOUNDS, 
  northEastStatesData, 
  northEastWaterways, 
  northEastHighways, 
  northEastAnchorCities,
  northEastDatasetMetadata,
  calculateOfflineDataSize
} from '../data/northEastMapData';
import { useAccessibility } from '../context/AccessibilityContext';

interface NorthEastOfflineMapProps {
  places: ImportantPlace[];
  selectedPlace: ImportantPlace | null;
  onSelectPlace: (place: ImportantPlace) => void;
  userLocation: { lat: number; lng: number } | null;
  onMapClickCoordinates?: (coords: { lat: number; lng: number }) => void;
  isSimpleMode?: boolean;
}

export const NorthEastOfflineMap: React.FC<NorthEastOfflineMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  onMapClickCoordinates,
  isSimpleMode = false,
}) => {
  const { t, theme } = useAccessibility();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 420 });

  // Pan and Zoom transform state
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredPlace, setHoveredPlace] = useState<ImportantPlace | null>(null);

  // Resize listener
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 320),
          height: Math.max(rect.height, 350)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Projection math: Lat/Lng -> Canvas X/Y within NER_BOUNDS
  const projectCoords = useCallback((lat: number, lng: number): { x: number; y: number } => {
    const { minLat, maxLat, minLng, maxLng } = NER_BOUNDS;
    
    // Normalize to 0..1
    const normX = (lng - minLng) / (maxLng - minLng);
    const normY = 1 - (lat - minLat) / (maxLat - minLat); // Invert Y for canvas coordinate system

    const baseWidth = dimensions.width;
    const baseHeight = dimensions.height;

    // Apply zoom and pan with center pivot
    const centerX = baseWidth / 2;
    const centerY = baseHeight / 2;

    const x = centerX + (normX * baseWidth - centerX) * zoom + pan.x;
    const y = centerY + (normY * baseHeight - centerY) * zoom + pan.y;

    return { x, y };
  }, [dimensions, zoom, pan]);

  // Inverse projection: Canvas X/Y -> Lat/Lng
  const unprojectCoords = useCallback((screenX: number, screenY: number): { lat: number; lng: number } => {
    const { minLat, maxLat, minLng, maxLng } = NER_BOUNDS;
    const baseWidth = dimensions.width;
    const baseHeight = dimensions.height;

    const centerX = baseWidth / 2;
    const centerY = baseHeight / 2;

    const normX = ((screenX - pan.x - centerX) / zoom + centerX) / baseWidth;
    const normY = ((screenY - pan.y - centerY) / zoom + centerY) / baseHeight;

    const lng = minLng + normX * (maxLng - minLng);
    const lat = minLat + (1 - normY) * (maxLat - minLat);

    return {
      lat: Number(Math.max(minLat, Math.min(maxLat, lat)).toFixed(4)),
      lng: Number(Math.max(minLng, Math.min(maxLng, lng)).toFixed(4))
    };
  }, [dimensions, zoom, pan]);

  // Center on place when selected externally
  useEffect(() => {
    if (selectedPlace?.coordinates) {
      const { lat, lng } = selectedPlace.coordinates;
      const { minLat, maxLat, minLng, maxLng } = NER_BOUNDS;
      const normX = (lng - minLng) / (maxLng - minLng);
      const normY = 1 - (lat - minLat) / (maxLat - minLat);
      const baseWidth = dimensions.width;
      const baseHeight = dimensions.height;
      
      const targetPanX = (baseWidth / 2 - normX * baseWidth) * zoom;
      const targetPanY = (baseHeight / 2 - normY * baseHeight) * zoom;

      setPan({ x: targetPanX, y: targetPanY });
    }
  }, [selectedPlace?.id, dimensions.width, dimensions.height]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom(prev => Math.min(Math.max(prev + zoomDelta, 0.8), 4.5));
  };

  // Canvas click for adding custom place
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const clickedCoords = unprojectCoords(screenX, screenY);

    if (onMapClickCoordinates) {
      onMapClickCoordinates(clickedCoords);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.3, 4.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.3, 0.8));
  const handleResetView = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  // Center on Guwahati / Silpukhuri
  const handleCenterHome = () => {
    const homePlace = places.find(p => p.category === 'home' || p.isPrimary) || places[0];
    if (homePlace?.coordinates) {
      onSelectPlace(homePlace);
      setZoom(2.2);
    }
  };

  const getCategoryIcon = (category: ImportantPlaceCategory) => {
    switch (category) {
      case 'home': return <Home className="w-4 h-4 text-ner-terracotta" />;
      case 'doctor': return <Stethoscope className="w-4 h-4 text-ner-sage" />;
      case 'hospital': return <Cross className="w-4 h-4 text-red-600" />;
      case 'family': return <Users className="w-4 h-4 text-ner-calmBlue" />;
      case 'caregiver': return <HeartHandshake className="w-4 h-4 text-purple-600" />;
      case 'pharmacy': return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'park': return <Trees className="w-4 h-4 text-teal-600" />;
      default: return <MapPin className="w-4 h-4 text-ner-black" />;
    }
  };

  const dataSize = useMemo(() => calculateOfflineDataSize(), []);

  return (
    <div className="relative w-full rounded-3xl border-2 border-ner-black bg-[#f4f6f8] overflow-hidden shadow-lg select-none">
      {/* Offline Status Header Banner */}
      <div className="bg-ner-black text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-ner-black">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            {t.offlineMap} • {t.usingSavedOfflineMapData}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-white/70">
          <span>{dataSize.formatted}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">8 States Bundled</span>
        </div>
      </div>

      {/* Offline Search Disabled Notice */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="line-clamp-1">{t.offlineSearchUnavailable}</span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/60 text-amber-800 shrink-0">
          Offline Mode
        </span>
      </div>

      {/* Main Interactive Map Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className={`relative w-full h-[380px] sm:h-[460px] overflow-hidden cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ touchAction: 'none' }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={dimensions.width}
          height={dimensions.height}
        >
          {/* Subtle Coordinate Grid */}
          <defs>
            <pattern id="offline-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#272730' : '#e2e8f0'} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={isDark ? '#141418' : '#fafafa'} />
          <rect width="100%" height="100%" fill="url(#offline-grid)" />

          {/* 1. State Boundaries Polygons */}
          {northEastStatesData.map((state) => {
            const pathData = state.polygon
              .map((pt, i) => {
                const { x, y } = projectCoords(pt.lat, pt.lng);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ') + ' Z';

            const centerPt = projectCoords(state.center.lat, state.center.lng);

            return (
              <g key={state.code}>
                <path
                  d={pathData}
                  fill={isDark ? '#1A1A22' : state.color}
                  stroke={isDark ? '#33333E' : state.strokeColor}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  className="transition-colors"
                />
                {/* State Name Label */}
                {zoom >= 1.0 && (
                  <text
                    x={centerPt.x}
                    y={centerPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-[11px] font-mono font-bold uppercase tracking-widest pointer-events-none ${
                      isDark ? 'fill-zinc-400' : 'fill-slate-500/80'
                    }`}
                  >
                    {state.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* 2. Major Waterways (Brahmaputra, Barak, Lakes) */}
          {northEastWaterways.map((waterway, idx) => {
            if (waterway.type === 'river') {
              const riverPath = waterway.path
                .map((pt, i) => {
                  const { x, y } = projectCoords(pt.lat, pt.lng);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ');

              return (
                <g key={`river-${idx}`}>
                  <path
                    d={riverPath}
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth={Math.max(3 * zoom, 2)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.85}
                  />
                  {/* Brahmaputra river label */}
                  {waterway.path.length > 5 && (
                    <text
                      x={projectCoords(waterway.path[6].lat, waterway.path[6].lng).x}
                      y={projectCoords(waterway.path[6].lat, waterway.path[6].lng).y - 8}
                      className="text-[9px] font-mono font-bold fill-blue-600/70 pointer-events-none"
                    >
                      ~ Brahmaputra ~
                    </text>
                  )}
                </g>
              );
            } else {
              // Lake Polygon
              const lakePath = waterway.path
                .map((pt, i) => {
                  const { x, y } = projectCoords(pt.lat, pt.lng);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ') + ' Z';

              return (
                <path
                  key={`lake-${idx}`}
                  d={lakePath}
                  fill="#bfdbfe"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  opacity={0.9}
                />
              );
            }
          })}

          {/* 3. National Highways Artery Network */}
          {zoom >= 1.2 && northEastHighways.map((hwy, idx) => {
            const hwyPath = hwy.path
              .map((pt, i) => {
                const { x, y } = projectCoords(pt.lat, pt.lng);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');

            return (
              <path
                key={`hwy-${idx}`}
                d={hwyPath}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={1.8}
                strokeDasharray="4 2"
                opacity={0.9}
              />
            );
          })}

          {/* 4. Anchor Cities & Capital Labels */}
          {northEastAnchorCities.map((city) => {
            const { x, y } = projectCoords(city.coordinates.lat, city.coordinates.lng);
            return (
              <g key={city.id} className="pointer-events-none">
                <circle
                  cx={x}
                  cy={y}
                  r={city.isCapital ? 4.5 : 3}
                  fill={city.isCapital ? '#0f172a' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
                {zoom >= 1.2 && (
                  <text
                    x={x + 7}
                    y={y + 3}
                    className={`text-[10px] font-mono ${
                      city.isCapital ? 'font-bold fill-ner-black text-[11px]' : 'fill-slate-600 font-medium'
                    }`}
                  >
                    {city.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* 5. User Current Location Pin (If permitted) */}
          {userLocation && (
            (() => {
              const { x, y } = projectCoords(userLocation.lat, userLocation.lng);
              return (
                <g key="user-location-pin">
                  {/* Pulsing radar circle */}
                  <circle cx={x} cy={y} r={16} fill="#3b82f6" opacity={0.25}>
                    <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r={6} fill="#2563eb" stroke="#ffffff" strokeWidth={2} />
                  <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-mono font-bold fill-blue-700">
                    You Are Here
                  </text>
                </g>
              );
            })()
          )}
        </svg>

        {/* 6. Smriti Care Important Places Interactive Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {places.map((place) => {
            if (!place.coordinates) return null;
            const { x, y } = projectCoords(place.coordinates.lat, place.coordinates.lng);
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;

            return (
              <button
                key={place.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlace(place);
                }}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -100%)`,
                  transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className={`absolute pointer-events-auto group z-20 focus:outline-none ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                aria-label={`Select ${place.name}`}
              >
                {/* Pin Card */}
                <div className={`px-2 py-1 rounded-xl shadow-md border-2 flex items-center gap-1.5 transition-all ${
                  isSelected 
                    ? 'bg-ner-black text-white border-ner-terracotta shadow-xl ring-2 ring-ner-terracotta/30'
                    : 'bg-white text-ner-black border-ner-border hover:border-ner-black'
                }`}>
                  <div className="shrink-0">
                    {getCategoryIcon(place.category)}
                  </div>
                  <span className="text-[11px] font-bold whitespace-nowrap font-mono max-w-[120px] truncate">
                    {place.name.split('(')[0].trim()}
                  </span>
                </div>
                {/* Pin Bottom Triangle */}
                <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${
                  isSelected ? 'bg-ner-black border-ner-terracotta' : 'bg-white border-ner-border'
                }`} />

                {/* Hover / Active Detail Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 rounded-xl bg-ner-black text-white text-[11px] font-mono whitespace-nowrap shadow-2xl z-40 border border-white/20">
                    <p className="font-bold text-white">{place.name}</p>
                    <p className="text-white/70 text-[10px]">{place.address}</p>
                    {place.landmark && (
                      <p className="text-amber-300 text-[10px] mt-0.5">📍 {place.landmark}</p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Tactile Accessible On-Map Controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            aria-label="Zoom In"
            className="w-10 h-10 rounded-xl bg-white border-2 border-ner-black text-ner-black flex items-center justify-center shadow-md hover:bg-ner-offwhite active:scale-95 transition-all font-bold"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            aria-label="Zoom Out"
            className="w-10 h-10 rounded-xl bg-white border-2 border-ner-black text-ner-black flex items-center justify-center shadow-md hover:bg-ner-offwhite active:scale-95 transition-all font-bold"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetView();
            }}
            aria-label="Reset Map View"
            title="Reset to North-East Region"
            className="w-10 h-10 rounded-xl bg-white border-2 border-ner-black text-ner-black flex items-center justify-center shadow-md hover:bg-ner-offwhite active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCenterHome();
            }}
            aria-label="Center on Home"
            title="Center on Primary Residence"
            className="w-10 h-10 rounded-xl bg-ner-terracotta text-white border-2 border-ner-black flex items-center justify-center shadow-md hover:bg-ner-terracotta/90 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Center Compass Rose Indicator */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-ner-border rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm text-ner-black z-20">
          <Compass className="w-4 h-4 text-ner-terracotta animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            North-East India
          </span>
        </div>
      </div>

      {/* Mandatory Offline Attribution Footer */}
      <div className="px-4 py-2 bg-ner-offwhite border-t border-ner-border flex flex-wrap items-center justify-between text-[11px] font-mono text-ner-black/60 gap-2">
        <span>{northEastDatasetMetadata.attribution}</span>
        <span className="text-ner-terracotta font-bold">100% Offline-Safe Vector Layer</span>
      </div>
    </div>
  );
};
