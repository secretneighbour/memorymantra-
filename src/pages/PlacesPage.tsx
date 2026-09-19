import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ImportantPlacesMap } from '../components/ImportantPlacesMap';
import { MapPin } from 'lucide-react';

export const PlacesPage: React.FC = () => {
  const { t } = useAccessibility();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-ner-terracotta/15 text-ner-terracotta flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold">
            Orientation & Familiar Anchors
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ner-black tracking-tight">
          {t.placesTitle}
        </h1>
        <p className="text-sm sm:text-base text-ner-black/70 mt-1.5 max-w-3xl leading-relaxed">
          {t.placesSubtitle}
        </p>
      </div>

      {/* Interactive Map & Places Directory */}
      <ImportantPlacesMap />
    </div>
  );
};
