import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Phone, 
  AlertTriangle, 
  HeartHandshake, 
  X, 
  Send, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { EmergencyContact } from '../types';

export const EmergencyHelpModal: React.FC = () => {
  const { 
    isHelpModalOpen, 
    setIsHelpModalOpen, 
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    activePatient, 
    emergencyContacts, 
    sendEmergencySMS 
  } = useRole();
  const { t } = useAccessibility();

  const isOpen = isHelpModalOpen || isEmergencyModalOpen;

  const [mode, setMode] = useState<'select' | 'confirm' | 'status'>('select');
  const [selectedUrgency, setSelectedUrgency] = useState<'gentle' | 'critical'>('gentle');
  const [targetContact, setTargetContact] = useState<EmergencyContact | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsHelpModalOpen(false);
    setIsEmergencyModalOpen(false);
    setMode('select');
    setTargetContact(null);
    setStatusMessage(null);
  };

  const handleSelectContactForSMS = (contact: EmergencyContact, urgency: 'gentle' | 'critical') => {
    setSelectedUrgency(urgency);
    setTargetContact(contact);
    setMode('confirm');
  };

  const handleConfirmAndSend = async () => {
    if (!targetContact) return;
    setIsSending(true);

    const message = selectedUrgency === 'critical'
      ? `[URGENT] Smriti Care SOS Alert: ${activePatient.name} requires immediate medical/care assistance. Please call back immediately.`
      : `Smriti Care Alert: ${activePatient.name} requested gentle assistance/check-in. Please contact them when free.`;

    try {
      const log = await sendEmergencySMS(targetContact.id, message);
      setIsSending(false);
      setLastSentTime(log.timestamp);
      setStatusMessage(`${t.smsStatusSent} (${t.smsStatusSimulated})`);
      setMode('status');
    } catch {
      setIsSending(false);
      setStatusMessage('Error dispatching message.');
      setMode('status');
    }
  };

  const currentSmsBody = targetContact 
    ? encodeURIComponent(
        selectedUrgency === 'critical'
          ? `[URGENT] Smriti Care SOS Alert: ${activePatient.name} requires immediate assistance.`
          : `Smriti Care Alert: ${activePatient.name} requested gentle check-in assistance.`
      )
    : '';

  return (
    <div 
      className="modal-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="modal-wrapper border-2 border-ner-black relative">
        {/* Modal Header */}
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              selectedUrgency === 'critical' && mode !== 'select'
                ? 'bg-red-100 text-red-600 border-red-300'
                : 'bg-ner-terracotta/15 text-ner-terracotta border-ner-terracotta/30'
            }`}>
              {selectedUrgency === 'critical' && mode !== 'select' ? (
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              ) : (
                <HeartHandshake className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                {t.emergencySMS}
              </span>
              <h2 id="emergency-modal-title" className="text-xl sm:text-2xl font-bold text-ner-black tracking-tight">
                {mode === 'confirm' 
                  ? t.confirmEmergencySMSTitle 
                  : mode === 'status' 
                    ? t.emergencySMS 
                    : t.emergencyNeedHelp}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black transition-colors shrink-0"
            aria-label="Close Help Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
        {/* VIEW 1: SELECT URGENCY & CONTACT */}
        {mode === 'select' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-ner-black/70 leading-relaxed">
              {t.emergencySMSDesc}
            </p>

            {/* Urgency selection toggle */}
            <div className="grid grid-cols-2 gap-2.5 p-1 bg-white border border-ner-border rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedUrgency('gentle')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedUrgency === 'gentle'
                    ? 'bg-ner-black text-white shadow-sm'
                    : 'text-ner-black/60 hover:text-ner-black'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{t.emergencyNeedHelp}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUrgency('critical')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedUrgency === 'critical'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-red-600/80 hover:text-red-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{t.emergencyCritical}</span>
              </button>
            </div>

            {/* Trusted Contacts List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-ner-black/60 block">
                {t.emergencyTrustedContacts}
              </span>

              {emergencyContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className="p-4 rounded-2xl bg-white border border-ner-border hover:border-ner-black transition-all flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-ner-black truncate">
                        {contact.name}
                      </span>
                      {contact.isPrimary && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ner-sage/15 text-ner-sage font-bold uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-ner-black/60 block truncate">
                      {contact.relation} • {contact.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Direct phone call button */}
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-10 h-10 rounded-xl bg-ner-offwhite border border-ner-border flex items-center justify-center text-ner-black hover:bg-ner-black hover:text-white transition-all active:scale-95"
                      title={`Call ${contact.name}`}
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {/* Send SMS Alert Trigger */}
                    <button
                      onClick={() => handleSelectContactForSMS(contact, selectedUrgency)}
                      className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-sm text-white ${
                        selectedUrgency === 'critical'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-ner-terracotta hover:bg-ner-terracottaDark'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.sendEmergencySMS}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: EXPLICIT CONFIRMATION BEFORE SENDING */}
        {mode === 'confirm' && targetContact && (
          <div className="space-y-4 my-2">
            <div className={`p-4 rounded-2xl border ${
              selectedUrgency === 'critical' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-ner-black/60 block mb-1">
                Recipient
              </span>
              <p className="text-base font-bold text-ner-black">
                {targetContact.name} ({targetContact.relation})
              </p>
              <p className="text-xs font-mono text-ner-black/70">
                {targetContact.phone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-ner-border">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-ner-black/60 block mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Pre-Composed Message Preview
              </span>
              <p className="text-xs sm:text-sm text-ner-black/85 italic bg-ner-offwhite p-3 rounded-xl border border-ner-border/60">
                "{selectedUrgency === 'critical'
                  ? `[URGENT] Smriti Care SOS Alert: ${activePatient.name} requires immediate medical/care assistance. Please call back immediately.`
                  : `Smriti Care Alert: ${activePatient.name} requested gentle assistance/check-in. Please contact them when free.`}"
              </p>
            </div>

            <p className="text-xs text-ner-black/60">
              {t.confirmEmergencySMSDesc}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 py-3.5 px-4 rounded-2xl border border-ner-border bg-white text-ner-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-ner-offwhite transition-all active:scale-95"
              >
                {t.cancelSendBtn}
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleConfirmAndSend}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                  selectedUrgency === 'critical'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-ner-terracotta hover:bg-ner-terracottaDark'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? t.smsStatusSending : t.confirmSendBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: DISPATCH STATUS & MOBILE SMS PROTOCOL FALLBACK */}
        {mode === 'status' && targetContact && (
          <div className="space-y-4 my-2 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-ner-sage border border-ner-sage/40 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-ner-black">
                {statusMessage}
              </h3>
              <p className="text-xs text-ner-black/60 mt-1">
                Dispatched to {targetContact.name} ({targetContact.phone}) at {lastSentTime}
              </p>
            </div>

            {/* Native SMS protocol fallback for mobile devices */}
            <div className="p-4 rounded-2xl bg-white border border-ner-border text-left space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-ner-black/60 block">
                Direct Device Dispatch Option
              </span>
              <p className="text-xs text-ner-black/70">
                You can also open your device's native messaging application with this message pre-filled:
              </p>
              <a
                href={`sms:${targetContact.phone}?body=${currentSmsBody}`}
                className="w-full py-3 px-4 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-ner-black/90 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t.smsNativeTrigger}</span>
              </a>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl bg-ner-offwhite border border-ner-border font-mono text-xs font-bold uppercase tracking-wider text-ner-black hover:bg-white transition-all"
            >
              Done & Close
            </button>
          </div>
        )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer text-center">
          <span className="text-[10px] font-mono text-ner-black/45 tracking-wide">
            [ {t.simulationActive} • Safe Emergency Testing Layer ]
          </span>
        </div>
      </div>
    </div>
  );
};
