import React from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { User, Users, Stethoscope, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const RoleSwitcherModal: React.FC = () => {
  const { role, setRole, isRoleModalOpen, setIsRoleModalOpen } = useRole();
  const { t } = useAccessibility();
  const navigate = useNavigate();

  if (!isRoleModalOpen) return null;

  const rolesConfig: {
    id: UserRole;
    title: string;
    persona: string;
    tagline: string;
    icon: React.ReactNode;
    badge: string;
    path: string;
    benefits: string[];
  }[] = [
    {
      id: 'patient',
      title: t.rolePatientTitle,
      persona: t.rolePatientPersona,
      tagline: t.rolePatientTagline,
      icon: <User className="w-6 h-6 text-ner-terracotta" />,
      badge: t.rolePatientBadge,
      path: '/patient',
      benefits: [
        t.rolePatientBenefit1,
        t.rolePatientBenefit2,
        t.rolePatientBenefit3
      ]
    },
    {
      id: 'caregiver',
      title: t.roleCaregiverTitle,
      persona: t.roleCaregiverPersona,
      tagline: t.roleCaregiverTagline,
      icon: <Users className="w-6 h-6 text-ner-sage" />,
      badge: t.roleCaregiverBadge,
      path: '/caregiver',
      benefits: [
        t.roleCaregiverBenefit1,
        t.roleCaregiverBenefit2,
        t.roleCaregiverBenefit3
      ]
    },
    {
      id: 'doctor',
      title: t.doctorRoleTitle,
      persona: t.doctorRolePersona,
      tagline: t.doctorRoleTagline,
      icon: <Stethoscope className="w-6 h-6 text-ner-calmBlue" />,
      badge: t.doctorRoleBadge,
      path: '/doctor',
      benefits: [
        t.doctorRoleBenefit1,
        t.doctorRoleBenefit2,
        t.doctorRoleBenefit3
      ]
    }
  ];

  const handleSelectRole = (newRole: UserRole, path: string) => {
    setRole(newRole);
    setIsRoleModalOpen(false);
    navigate(path);
  };

  return (
    <div className="modal-overlay-backdrop animate-fade-in">
      <div className="modal-contained-card animate-scale-up">
        {/* Sticky Header: "Choose Your Experience Mode" */}
        <div className="modal-sticky-header">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ner-terracotta/10 text-ner-terracotta border border-ner-terracotta/20">
                  <Sparkles className="w-3 h-3" /> {t.roleModalTag}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-ner-black">
                {t.roleSwitcherTitle}
              </h2>
              <p className="text-ner-black/60 text-xs sm:text-sm mt-1">
                {t.roleSwitcherDesc}
              </p>
            </div>
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="p-2 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body: Experience Mode Cards */}
        <div className="modal-scrollable-body">
          <div className="space-y-3.5">
            {rolesConfig.map((item) => {
              const isSelected = role === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectRole(item.id, item.path)}
                  className={`group cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-white border-ner-black shadow-md ring-2 ring-ner-black/10'
                      : 'bg-white/70 hover:bg-white border-ner-border hover:border-ner-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-ner-offwhite border border-ner-border group-hover:scale-105 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-ner-black">{item.title}</h3>
                          <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-md bg-ner-black/5 text-ner-black/70 font-medium">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-ner-terracotta mt-0.5">
                          {item.persona}
                        </p>
                        <p className="text-xs sm:text-sm text-ner-black/70 mt-1 leading-relaxed">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="w-7 h-7 rounded-full bg-ner-black text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full border border-ner-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-ner-black text-xs">
                          →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer: "Prototype Simulation Mode Active" */}
        <div className="modal-sticky-footer">
          <div className="flex items-center justify-between text-xs text-ner-black/50">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-ner-terracotta" />
              {t.simulationActive}
            </span>
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="font-semibold text-ner-black hover:underline px-1.5 py-0.5 rounded hover:bg-ner-black/5 transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
