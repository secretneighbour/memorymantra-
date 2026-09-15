import React from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { HeartHandshake } from 'lucide-react';

export const HelpButton: React.FC = () => {
  const { setIsHelpModalOpen } = useRole();
  const { t } = useAccessibility();

  // Show persistent help button especially in patient mode, positioned cleanly above mobile nav
  return (
    <button
      onClick={() => setIsHelpModalOpen(true)}
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 px-4 sm:px-5 py-3 rounded-2xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white shadow-2xl border-2 border-white/20 flex items-center gap-2 font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 group touch-manipulation"
      aria-label="Request immediate assistance or call caregiver"
      id="patient-persistent-help-button"
    >
      <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
      <span>{t.helpBtnText}</span>
    </button>
  );
};

