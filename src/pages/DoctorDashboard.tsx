import React, { useState } from 'react';
import { mockPatients } from '../data/patients';
import { Patient } from '../types';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  X, 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export const DoctorDashboard: React.FC = () => {
  const [patientsList, setPatientsList] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);

  const filtered = patientsList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-calmBlue/10 text-ner-calmBlue font-bold">
              Clinician Roster
            </span>
            <span className="text-xs text-ner-black/40 font-mono">NER Tele-Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Clinician Cognitive Dashboard
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-2xl font-normal">
            Dr. Debabrata Roy • Dispur Polyclinic & Regional Geriatric Tele-Care
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-ner-border text-xs font-mono text-ner-black/60 max-w-xs">
          <div className="flex items-center gap-1.5 text-ner-terracotta font-bold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Prototype Evaluation</span>
          </div>
          Adherence and cognitive engagement monitor. Not an automated diagnostic instrument.
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Enrolled Patients
          </span>
          <span className="text-3xl font-extrabold text-ner-black font-mono">
            {mockPatients.length}
          </span>
          <span className="text-[11px] text-ner-black/50 block mt-1">
            Across Assam, Manipur, Meghalaya, Mizoram
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Active Today
          </span>
          <span className="text-3xl font-extrabold text-ner-sage font-mono">
            4 / 4
          </span>
          <span className="text-[11px] text-ner-sage font-semibold block mt-1">
            100% adherence rate
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Cohort Weekly Accuracy
          </span>
          <span className="text-3xl font-extrabold text-ner-terracotta font-mono">
            82.2%
          </span>
          <span className="text-[11px] text-ner-black/50 block mt-1">
            Weighted across 4 exercises
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Clinical Tele-Alerts
          </span>
          <span className="text-3xl font-extrabold text-ner-black font-mono">
            0 Active
          </span>
          <span className="text-[11px] text-ner-sage font-semibold block mt-1">
            All regimens normal
          </span>
        </div>
      </div>

      {/* Patient Table with Search */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-ner-black">
            North Eastern Region Patient Cohort
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ner-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, state..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-ner-border text-xs focus:outline-none focus:border-ner-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ner-border font-mono text-xs uppercase tracking-wider text-ner-black/50">
                <th className="pb-3 pl-2">Patient</th>
                <th className="pb-3">Age / State</th>
                <th className="pb-3">Support Stage</th>
                <th className="pb-3 text-center">Streak</th>
                <th className="pb-3 text-center">Score</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ner-border/60">
              {filtered.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => setSelectedPatientModal(patient)}
                  className="hover:bg-white/80 transition-colors cursor-pointer group"
                >
                  <td className="py-4 pl-2 font-bold text-ner-black flex items-center gap-3">
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="w-9 h-9 rounded-full object-cover border border-ner-border"
                    />
                    <div>
                      <span>{patient.name}</span>
                      <span className="block text-[11px] font-normal text-ner-black/50">
                        Caregiver: {patient.primaryCaregiver.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-ner-black/70">
                    {patient.age} yrs • {patient.location}, {patient.state}
                  </td>
                  <td className="py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-ner-offwhite border border-ner-border font-semibold text-ner-black">
                      {patient.stage}
                    </span>
                  </td>
                  <td className="py-4 text-center font-mono font-bold text-ner-black">
                    🔥 {patient.stats.streakDays}d
                  </td>
                  <td className="py-4 text-center font-mono font-bold text-ner-terracotta">
                    {patient.stats.weeklyScore}%
                  </td>
                  <td className="py-4 text-ner-black/60 text-xs">
                    {patient.stats.lastActive}
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatientModal(patient);
                      }}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-ner-black text-white hover:bg-ner-black/85"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-ner-border">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatientModal.avatarUrl}
                  alt={selectedPatientModal.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-ner-black"
                />
                <div>
                  <h3 className="text-2xl font-bold text-ner-black">
                    {selectedPatientModal.name}
                  </h3>
                  <p className="text-xs text-ner-black/60">
                    Age {selectedPatientModal.age} • {selectedPatientModal.location}, {selectedPatientModal.state}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatientModal(null)}
                className="p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-6 h-6 text-ner-black/60" />
              </button>
            </div>

            {/* Domains Radar */}
            <div className="bg-white p-5 rounded-2xl border border-ner-border mb-6">
              <h4 className="font-bold text-sm text-ner-black mb-1">
                Cognitive Domain Radar
              </h4>
              <p className="text-xs text-ner-black/50 mb-4">
                Domain scores across 5 monitored pathways
              </p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={[
                      { subject: 'Memory', score: selectedPatientModal.cognitiveDomains.memory },
                      { subject: 'Attention', score: selectedPatientModal.cognitiveDomains.attention },
                      { subject: 'Recognition', score: selectedPatientModal.cognitiveDomains.recognition },
                      { subject: 'Sequence', score: selectedPatientModal.cognitiveDomains.sequence },
                      { subject: 'Engagement', score: selectedPatientModal.cognitiveDomains.engagement },
                    ]}
                  >
                    <PolarGrid stroke="#E2E2DC" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#111111', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar dataKey="score" stroke="#DE4A30" fill="#DE4A30" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Contacts & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-4 rounded-2xl bg-white border border-ner-border">
                <span className="font-mono text-ner-black/40 uppercase block mb-1">
                  Primary Guardian
                </span>
                <p className="font-bold text-sm text-ner-black">
                  {selectedPatientModal.primaryCaregiver.name} ({selectedPatientModal.primaryCaregiver.relation})
                </p>
                <p className="text-ner-black/60 mt-0.5">{selectedPatientModal.primaryCaregiver.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-ner-border">
                <span className="font-mono text-ner-black/40 uppercase block mb-1">
                  Emergency Hospital Contact
                </span>
                <p className="font-bold text-sm text-ner-black">
                  {selectedPatientModal.emergencyContact.name}
                </p>
                <p className="text-ner-black/60 mt-0.5">{selectedPatientModal.emergencyContact.phone}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatientModal(null)}
              className="w-full py-3.5 rounded-xl bg-ner-black text-white font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85"
            >
              Close Patient Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
