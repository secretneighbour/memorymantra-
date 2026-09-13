import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const OfflineBanner: React.FC = () => {
  const { t } = useAccessibility();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showSynced, setShowSynced] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSynced(true);
      const timer = setTimeout(() => setShowSynced(false), 5000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showSynced) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-mono border animate-slide-up ${
      !isOnline 
        ? 'bg-amber-100 border-amber-300 text-amber-900' 
        : 'bg-emerald-100 border-emerald-300 text-emerald-900'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>{t.offlineActiveMsg}</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-emerald-700" />
          <span>{t.onlineSyncedMsg}</span>
        </>
      )}
    </div>
  );
};
