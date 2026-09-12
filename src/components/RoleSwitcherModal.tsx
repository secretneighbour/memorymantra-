import React from 'react';
import { useRole } from '../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { User, Users, Stethoscope, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const RoleSwitcherModal: React.FC = () => {
  const { role, setRole, isRoleModalOpen, setIsRoleModalOpen } = useRole();
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
      title: 'Elderly / Patient Mode',
      persona: 'Ananya Sharma, Age 72 (Guwahati, Assam)',
      tagline: 'High accessibility, gentle pacing, large buttons, encouraging feedback.',
      icon: <User className="w-6 h-6 text-ner-terracotta" />,
      badge: 'Gentle & Clear UI',
      path: '/patient',
      benefits: [
        'Extra large touch targets & 18px+ text',
        'Daily memory journey & 4 working cognitive games',
        'Direct speech-assisted companion & daily routine'
      ]
    },
    {
      id: 'caregiver',
      title: 'Caregiver / Family Circle',
      persona: 'Rohan Sharma (Son & Primary Guardian)',
      tagline: 'Activity telemetry, medication adherence, alert notifications, and mood check-in.',
      icon: <Users className="w-6 h-6 text-ner-sage" />,
      badge: 'Family Visibility',
      path: '/caregiver',
      benefits: [
        'Real-time daily game completion metrics',
        'Medication reminder tracking & adherence',
        'Encouraging note broadcasts & mood status'
      ]
    },
    {
      id: 'doctor',
      title: 'Healthcare Clinician',
      persona: 'Dr. Debabrata Roy (Consultant Geriatrician)',
      tagline: 'Multi-patient roster, cognitive domain analytics, longitudinal wellness trends.',
      icon: <Stethoscope className="w-6 h-6 text-ner-calmBlue" />,
      badge: 'Clinical Telemetry',
      path: '/doctor',
      benefits: [
        'Multi-patient roster across North East states',
        'Domain radar charts (Memory, Attention, Recognition)',
        'Patient drill-down modal & longitudinal engagement'
      ]
    }
  ];

  const handleSelectRole = (newRole: UserRole, path: string) => {
    setRole(newRole);
    setIsRoleModalOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-ner-offwhite border border-ner-black/20 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ner-terracotta/10 text-ner-terracotta border border-ner-terracotta/20">
                <Sparkles className="w-3 h-3" /> SIH 2026 Presentation Switcher
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black">
              Select Demonstration Role
            </h2>
            <p className="text-ner-black/60 text-sm mt-1">
              Experience the customized interface designed for each stakeholder in the care ecosystem.
            </p>
          </div>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="p-2 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Roles list */}
        <div className="space-y-3.5">
          {rolesConfig.map((item) => {
            const isSelected = role === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectRole(item.id, item.path)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-white border-ner-black shadow-md ring-2 ring-ner-black/10'
                    : 'bg-white/60 hover:bg-white border-ner-border hover:border-ner-black/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-ner-offwhite border border-ner-border group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-ner-black">{item.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-ner-black/5 text-ner-black/70 font-medium">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-ner-terracotta mt-0.5">
                        {item.persona}
                      </p>
                      <p className="text-sm text-ner-black/70 mt-1">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-ner-black text-white flex items-center justify-center">
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

        {/* Note */}
        <div className="mt-6 pt-4 border-t border-ner-border flex items-center justify-between text-xs text-ner-black/50">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-ner-terracotta" />
            Designed for SIH 2026 evaluation. Role states persist during session.
          </span>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="font-semibold text-ner-black hover:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
