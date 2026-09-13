import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  User, 
  Users, 
  Stethoscope, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Heart,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, setRole, activePatient } = useRole();
  const { t } = useAccessibility();

  const handleSelect = (selectedRole: UserRole, targetRoute: string) => {
    setRole(selectedRole);
    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse"></span>
          <span>SMART INDIA HACKATHON 2026 • PROTOTYPE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ner-black">
          Choose Your Perspective
        </h1>
        <p className="text-base sm:text-xl text-ner-black/70 mt-3 font-light leading-relaxed">
          NEURO NER adapts its entire interface, information density, and telemetry to match each person in the care circle.
        </p>

        <div className="mt-4 flex justify-center">
          <TTSButton
            text="Please select your role: Patient for a friendly, simple memory experience; Caregiver for family monitoring and alerts; or Healthcare Professional for clinical cognitive analytics."
            label={t.listenAloud}
          />
        </div>
      </div>

      {/* The 3 Distinct Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {/* 1. ELDERLY / PATIENT */}
        <div 
          onClick={() => handleSelect('patient', '/patient')}
          className={`frost-white-intense rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all cursor-pointer group hover:-translate-y-1.5 shadow-lg relative overflow-hidden ${
            role === 'patient' ? 'border-ner-black ring-2 ring-ner-black/20' : 'border-ner-border hover:border-ner-black/60'
          }`}
        >
          {role === 'patient' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-ner-black text-white text-[10px] font-mono uppercase font-bold">
              Current
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-terracotta transition-colors">
              <User className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-1">
              Role 01 • Calm & Tactile
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              Elderly Patient
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              Designed specifically for senior citizens. Features extra-large text, high contrast, zero cognitive clutter, voice prompts, and culturally familiar games.
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Extremely simple 1-tap navigation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Large buttons & read-aloud voice guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Low information density & friendly praise</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('patient', '/patient');
              }}
              className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md group-hover:bg-ner-terracotta transition-colors"
            >
              <span>Enter as Patient</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. CAREGIVER / FAMILY */}
        <div 
          onClick={() => handleSelect('caregiver', '/caregiver')}
          className={`frost-white-intense rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all cursor-pointer group hover:-translate-y-1.5 shadow-lg relative overflow-hidden ${
            role === 'caregiver' ? 'border-ner-black ring-2 ring-ner-black/20' : 'border-ner-border hover:border-ner-black/60'
          }`}
        >
          {role === 'caregiver' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-ner-black text-white text-[10px] font-mono uppercase font-bold">
              Current
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-sage transition-colors">
              <Users className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
              Role 02 • Care Circle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              Family Caregiver
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              Built for daughters, sons, and home companions. Provides daily activity summaries, missed medication alerts, mood histories, and direct contact tools.
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Daily cognitive activity overview</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Medication, hydration & wellbeing alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Upload family photos & personal memories</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('caregiver', '/caregiver');
              }}
              className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md group-hover:bg-ner-sage transition-colors"
            >
              <span>Enter as Caregiver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. HEALTHCARE PROFESSIONAL */}
        <div 
          onClick={() => handleSelect('doctor', '/doctor')}
          className={`frost-white-intense rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all cursor-pointer group hover:-translate-y-1.5 shadow-lg relative overflow-hidden ${
            role === 'doctor' ? 'border-ner-black ring-2 ring-ner-black/20' : 'border-ner-border hover:border-ner-black/60'
          }`}
        >
          {role === 'doctor' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-ner-black text-white text-[10px] font-mono uppercase font-bold">
              Current
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-calmBlue transition-colors">
              <Stethoscope className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-calmBlue font-bold block mb-1">
              Role 03 • Clinical Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              Healthcare Professional
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              For geriatricians, neurologists, and tele-health counselors. Multi-patient overview, longitudinal response latency trends, domain radar profiles, and report exports.
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>Longitudinal telemetry & 7d/30d/90d trends</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>Multi-domain cognitive radar visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>Exportable clinical review summaries</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('doctor', '/doctor');
              }}
              className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md group-hover:bg-ner-calmBlue transition-colors"
            >
              <span>Enter as Clinician</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom SIH Notice */}
      <div className="frost-white-intense rounded-2xl p-4 sm:p-5 border border-ner-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-ner-black/60">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-ner-sage" />
          <span>Active Patient Record: <strong>{activePatient.name}</strong> ({activePatient.location}, {activePatient.state})</span>
        </div>
        <span>You can switch roles at any point from the top navigation bar.</span>
      </div>
    </div>
  );
};
