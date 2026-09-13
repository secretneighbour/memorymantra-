import React from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { HeartHandshake } from 'lucide-react';

export const HelpButton: React.FC = () => {
  const { setIsHelpModalOpen } = useRole();
  const { t } = useAccessibility();

  // Show persistent help button especially in patient mode
  return (
    <button
      onClick={() => setIsHelpModalOpen(true)}
      className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-2xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white shadow-2xl border-2 border-white/20 flex items-center gap-2.5 font-mono font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 group"
      aria-label="Request immediate assistance or call caregiver"
      id="patient-persistent-help-button"
    >
      <HeartHandshake className="w-5 h-5 text-white animate-pulse" />
      <span>{t.helpBtnText}</span>
    </button>
  );
};
