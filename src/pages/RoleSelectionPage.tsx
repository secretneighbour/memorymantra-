import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCurrentUser } from '../context/AuthContext';
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
  const { displayName } = useCurrentUser();

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
          <span>{t.roleModalTag}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ner-black">
          {t.roleSwitcherTitle}
        </h1>
        <p className="text-base sm:text-xl text-ner-black/70 mt-3 font-light leading-relaxed">
          {t.roleSwitcherDesc}
        </p>

        <div className="mt-4 flex justify-center">
          <TTSButton
            text={`${t.roleSwitcherTitle}. ${t.roleSwitcherDesc}`}
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
              {t.active}
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-terracotta transition-colors">
              <User className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-1">
              {t.rolePatientBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              {t.rolePatientTitle}
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              {displayName} (Patient)
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.rolePatientBenefit1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.rolePatientBenefit2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.rolePatientBenefit3}</span>
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
              <span>{t.start}</span>
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
              {t.active}
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-sage transition-colors">
              <Users className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
              {t.roleCaregiverBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              {t.roleCaregiverTitle}
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              {displayName} (Caregiver)
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.roleCaregiverBenefit1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.roleCaregiverBenefit2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
                <span>{t.roleCaregiverBenefit3}</span>
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
              <span>{t.start}</span>
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
              {t.active}
            </div>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-ner-black text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-ner-calmBlue transition-colors">
              <Stethoscope className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-calmBlue font-bold block mb-1">
              {t.doctorRoleBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black mb-2">
              {t.doctorRoleTitle}
            </h2>
            <p className="text-sm text-ner-black/70 leading-relaxed mb-6 font-normal">
              {displayName} (Doctor)
            </p>

            <div className="space-y-2 pt-4 border-t border-ner-border/60 text-xs text-ner-black/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>{t.doctorRoleBenefit1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>{t.doctorRoleBenefit2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ner-calmBlue shrink-0" />
                <span>{t.doctorRoleBenefit3}</span>
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
              <span>{t.start}</span>
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
