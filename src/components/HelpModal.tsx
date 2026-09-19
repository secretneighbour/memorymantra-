import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Phone, AlertTriangle, ShieldCheck, HeartHandshake, X } from 'lucide-react';

export const HelpModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, activePatient, sendHelpAlert } = useRole();
  const { t } = useAccessibility();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isHelpModalOpen) return null;

  const handleCallCaregiver = () => {
    sendHelpAlert(`Patient tapped "${t.callCaregiverBtn}". Calling ${activePatient.primaryCaregiver.name} (${activePatient.primaryCaregiver.phone}).`);
    setFeedbackMessage(`${t.callCaregiverBtn}: ${activePatient.primaryCaregiver.name}...`);
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsHelpModalOpen(false);
    }, 3500);
  };

  const handleSendAlert = () => {
    sendHelpAlert(`Urgent assistance requested by ${activePatient.name}. Please check in immediately.`);
    setFeedbackMessage(`${t.sendAlertBtn} → Care Circle notified!`);
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsHelpModalOpen(false);
    }, 3500);
  };

  const handleCallEmergency = () => {
    sendHelpAlert(`Emergency contact triggered for ${activePatient.emergencyContact.name} (${activePatient.emergencyContact.phone}).`);
    setFeedbackMessage(`${t.callEmergencyBtn}: ${activePatient.emergencyContact.name}...`);
    setTimeout(() => {
      setFeedbackMessage(null);
      setIsHelpModalOpen(false);
    }, 3500);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-wrapper border-2 border-ner-black">
        {/* Modal Header */}
        <div className="modal-header flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ner-terracotta/20 text-ner-terracotta flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                {t.helpModalTag}
              </span>
              <h3 className="text-2xl font-bold text-ner-black">
                {t.helpModalTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              setFeedbackMessage(null);
              setIsHelpModalOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black transition-colors shrink-0"
            aria-label="Close Help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p className="text-xs sm:text-sm text-ner-black/70 mb-4 leading-relaxed">
            {t.helpModalDesc}
          </p>

          {feedbackMessage ? (
            <div className="p-5 rounded-2xl bg-emerald-100 border border-ner-sage text-ner-sage flex items-center gap-3 animate-fade-in my-4">
              <ShieldCheck className="w-7 h-7 shrink-0 text-ner-sage" />
              <span className="text-sm font-bold font-mono">{feedbackMessage}</span>
            </div>
          ) : (
            <div className="space-y-3.5 my-2">
              {/* 1. CALL CAREGIVER */}
              <button
                onClick={handleCallCaregiver}
                className="w-full p-4 sm:p-5 rounded-2xl bg-ner-black text-white hover:bg-ner-black/90 flex items-center justify-between gap-4 transition-all shadow-md group active:scale-98 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-ner-sage" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold uppercase tracking-wider block">
                      {t.callCaregiverBtn}
                    </span>
                    <span className="text-xs text-white/60">
                      {activePatient.primaryCaregiver.name} ({t.callCaregiverSub}) • {activePatient.primaryCaregiver.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-ner-sage uppercase shrink-0">
                  {t.callNowText}
                </span>
              </button>

              {/* 2. SEND ALERT */}
              <button
                onClick={handleSendAlert}
                className="w-full p-4 sm:p-5 rounded-2xl bg-ner-terracotta text-white hover:bg-ner-terracottaDark flex items-center justify-between gap-4 transition-all shadow-md group active:scale-98 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold uppercase tracking-wider block">
                      {t.sendAlertBtn}
                    </span>
                    <span className="text-xs text-white/80">
                      {t.sendAlertSub}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase shrink-0">
                  {t.sendAlertNowText}
                </span>
              </button>

              {/* 3. CALL EMERGENCY CONTACT */}
              <button
                onClick={handleCallEmergency}
                className="w-full p-4 sm:p-5 rounded-2xl bg-white text-ner-black border-2 border-ner-border hover:border-ner-black flex items-center justify-between gap-4 transition-all shadow-sm group active:scale-98 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-ner-offwhite flex items-center justify-center border border-ner-border">
                    <Phone className="w-5 h-5 text-ner-terracotta" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-bold uppercase tracking-wider block">
                      {t.callEmergencyBtn}
                    </span>
                    <span className="text-xs text-ner-black/60">
                      {activePatient.emergencyContact.name} ({t.callEmergencySub}) • {activePatient.emergencyContact.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-ner-terracotta uppercase shrink-0">
                  {t.callEmergencyNowText}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer text-center">
          <span className="text-[11px] font-mono text-ner-black/40">
            [ {t.simulationActive} ]
          </span>
        </div>
      </div>
    </div>
  );
};
