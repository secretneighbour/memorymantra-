import React from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Sliders,
  Settings
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { activePatient } = useRole();
  const { language, textSize, contrast, motion } = useAccessibility();

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={activePatient.avatarUrl}
              alt={activePatient.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-ner-black shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
                  Enrolled Patient
                </span>
                <span className="text-xs font-mono text-ner-black/50">ID: {activePatient.id}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ner-black">
                {activePatient.name}
              </h1>
              <p className="text-sm text-ner-black/60 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-ner-terracotta" />
                {activePatient.location}, {activePatient.state} • Age {activePatient.age}
              </p>
            </div>
          </div>

          <Link
            to="/settings"
            className="frost-card px-5 py-2.5 rounded-full inline-flex items-center gap-2 text-xs font-bold text-ner-black hover:border-ner-black/50"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Preferences</span>
          </Link>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Primary Caregiver */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-ner-black flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-ner-terracotta" />
            Primary Guardian
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Name & Relation</span>
              <span className="font-bold text-ner-black">
                {activePatient.primaryCaregiver.name} ({activePatient.primaryCaregiver.relation})
              </span>
            </div>
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Contact Phone</span>
              <span className="font-mono text-ner-black font-semibold">
                {activePatient.primaryCaregiver.phone}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Notification Preferences</span>
              <span className="text-ner-black/70">Daily summary at 08:30 PM via SMS & WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Card 2: Emergency Contact */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-ner-black flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-ner-sage" />
            Emergency Healthcare Contact
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Consultant Clinic</span>
              <span className="font-bold text-ner-black">
                {activePatient.emergencyContact.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Direct Line</span>
              <span className="font-mono text-ner-black font-semibold">
                {activePatient.emergencyContact.phone}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Support Stage</span>
              <span className="text-ner-terracotta font-semibold">{activePatient.stage}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Preferred Language & Culture */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-ner-black flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-ner-calmBlue" />
            Linguistic & Regional Settings
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Active Language</span>
              <span className="font-bold text-ner-black uppercase">{language}</span>
            </div>
            <div>
              <span className="text-xs font-mono text-ner-black/40 uppercase block">Cultural Context</span>
              <span className="text-ner-black/70">North Eastern India Folk & Nature motifs</span>
            </div>
          </div>
        </div>

        {/* Card 4: Accessibility Summary */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-ner-black flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-ner-warmAmber" />
            Accessibility Profile
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-ner-border">
              <span className="text-ner-black/60">Text Size:</span>
              <span className="font-bold uppercase text-ner-black">{textSize}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-ner-border">
              <span className="text-ner-black/60">Contrast:</span>
              <span className="font-bold uppercase text-ner-black">{contrast}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-ner-border">
              <span className="text-ner-black/60">Motion Preference:</span>
              <span className="font-bold uppercase text-ner-black">{motion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
