import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Patient, 
  ReminderItem, 
  ReminderStatus,
  CaregiverAlert, 
  WellbeingCheckIn, 
  ActivityResult, 
  MemoryItem, 
  FamilyMember,
  ImportantPlace,
  EmergencyContact,
  EmergencySmsLog
} from '../types';
import { mockPatients } from '../data/patients';
import { initialReminders } from '../data/reminders';
import { mockMemories, mockFamilyMembers } from '../data/memories';
import { initialImportantPlaces, initialEmergencyContacts } from '../data/places';
import { AdaptiveCognitiveEngine } from '../services/ai/adaptiveEngine';
import { evaluateConsecutiveNegativeResponses, WellbeingResponse, isNegativeMood } from '../utils/wellbeingUtils';

export interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePatient: Patient;
  setActivePatient: (patient: Patient) => void;
  patients: Patient[];
  reminders: ReminderItem[];
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  setReminderStatus: (id: string, status: ReminderStatus) => void;
  deleteReminder: (id: string) => void;
  alerts: CaregiverAlert[];
  sendHelpAlert: (customMessage?: string) => void;
  markAlertReviewed: (id: string) => void;
  wellbeingCheckIns: WellbeingCheckIn[];
  recordCheckIn: (mood: WellbeingCheckIn['mood'], note?: string) => void;
  memories: MemoryItem[];
  addMemoryItem: (item: Omit<MemoryItem, 'id'>) => void;
  familyMembers: FamilyMember[];
  importantPlaces: ImportantPlace[];
  addImportantPlace: (place: Omit<ImportantPlace, 'id'>) => void;
  updateImportantPlace: (id: string, updates: Partial<ImportantPlace>) => void;
  deleteImportantPlace: (id: string) => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  deleteEmergencyContact: (id: string) => void;
  emergencySmsLogs: EmergencySmsLog[];
  sendEmergencySMS: (contactId: string, customText?: string) => Promise<EmergencySmsLog>;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isAICompanionOpen: boolean;
  setIsAICompanionOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isWalkthroughOpen: boolean;
  setIsWalkthroughOpen: (open: boolean) => void;
  recordGameCompletion: (gameTitle: string, score: number) => void;
  recordActivityResult: (result: Omit<ActivityResult, 'id' | 'completedAt'>) => void;
  exportAllDataJSON: () => string;
  clearAllLocalData: () => void;
}

const initialAlertsList: CaregiverAlert[] = [
  {
    id: 'alt-1',
    type: 'missed_medication',
    title: 'Medication Check',
    message: 'Morning blood pressure medication was confirmed taken at 8:12 AM.',
    severity: 'info',
    createdAt: 'Today, 8:15 AM',
    reviewed: true,
    actionLabel: 'View Medication Log'
  },
  {
    id: 'alt-2',
    type: 'activity_pattern',
    title: 'Observed Performance Trend',
    message: 'Ananya showed high consistency (88%+) across morning memory and word exercises.',
    severity: 'info',
    createdAt: 'Today, 11:30 AM',
    reviewed: false,
    actionLabel: 'View Telemetry'
  }
];

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('neuro_role') as UserRole) || 'patient';
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('neuro_patients');
    return saved ? JSON.parse(saved) : mockPatients;
  });

  const [activePatient, setActivePatient] = useState<Patient>(() => {
    const saved = localStorage.getItem('neuro_active_patient');
    return saved ? JSON.parse(saved) : mockPatients[0];
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('neuro_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [alerts, setAlerts] = useState<CaregiverAlert[]>(() => {
    const saved = localStorage.getItem('neuro_alerts');
    return saved ? JSON.parse(saved) : initialAlertsList;
  });

  const [wellbeingCheckIns, setWellbeingCheckIns] = useState<WellbeingCheckIn[]>(() => {
    const saved = localStorage.getItem('neuro_wellbeing');
    return saved ? JSON.parse(saved) : [
      { id: 'wb-1', mood: 'good', note: 'Feeling rested and bright', timestamp: 'Today, 8:30 AM' }
    ];
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem('neuro_memories');
    return saved ? JSON.parse(saved) : mockMemories;
  });

  const [familyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isAICompanionOpen, setIsAICompanionOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(() => {
    return localStorage.getItem('smriti_walkthrough_completed') !== 'true';
  });

  const [importantPlaces, setImportantPlaces] = useState<ImportantPlace[]>(() => {
    const saved = localStorage.getItem('neuro_places');
    return saved ? JSON.parse(saved) : initialImportantPlaces;
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('neuro_emergency_contacts');
    return saved ? JSON.parse(saved) : initialEmergencyContacts;
  });

  const [emergencySmsLogs, setEmergencySmsLogs] = useState<EmergencySmsLog[]>(() => {
    const saved = localStorage.getItem('neuro_sms_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage for offline resilience
  useEffect(() => {
    localStorage.setItem('neuro_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('neuro_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('neuro_wellbeing', JSON.stringify(wellbeingCheckIns));
  }, [wellbeingCheckIns]);

  useEffect(() => {
    localStorage.setItem('neuro_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('neuro_active_patient', JSON.stringify(activePatient));
  }, [activePatient]);

  useEffect(() => {
    localStorage.setItem('neuro_places', JSON.stringify(importantPlaces));
  }, [importantPlaces]);

  useEffect(() => {
    localStorage.setItem('neuro_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    localStorage.setItem('neuro_sms_logs', JSON.stringify(emergencySmsLogs));
  }, [emergencySmsLogs]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('neuro_role', newRole);
  };

  const addReminder = (newRem: Omit<ReminderItem, 'id' | 'completed'>) => {
    const item: ReminderItem = {
      ...newRem,
      id: `rem-${Date.now()}`,
      completed: false,
      status: 'pending'
    };
    setReminders(prev => [item, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(rem => {
        if (rem.id === id) {
          const nextCompleted = !rem.completed;
          return {
            ...rem,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'pending'
          };
        }
        return rem;
      })
    );
  };

  const setReminderStatus = (id: string, status: ReminderStatus) => {
    setReminders(prev =>
      prev.map(rem => {
        if (rem.id === id) {
          const isDone = status === 'completed';
          return {
            ...rem,
            completed: isDone,
            status
          };
        }
        return rem;
      })
    );

    // If status is help_requested, automatically create high-priority alert for caregiver
    if (status === 'help_requested') {
      const rem = reminders.find(r => r.id === id);
      const title = rem ? rem.title : 'Reminder';
      const alert: CaregiverAlert = {
        id: `alt-${Date.now()}`,
        type: 'help_request',
        title: 'Assistance Requested by Patient',
        message: `${activePatient.name} tapped "I NEED HELP" on task: "${title}".`,
        severity: 'urgent',
        createdAt: 'Just now',
        reviewed: false,
        actionLabel: 'Contact Ananya'
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(rem => rem.id !== id));
  };

  const sendHelpAlert = (customMessage?: string) => {
    const newAlert: CaregiverAlert = {
      id: `alt-${Date.now()}`,
      type: 'help_request',
      title: '🚨 Patient Urgent Assistance Triggered',
      message: customMessage || `${activePatient.name} tapped the Help button. Primary caregiver Rohan notified.`,
      severity: 'urgent',
      createdAt: 'Just now',
      reviewed: false,
      actionLabel: 'Call Rohan Sharma'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertReviewed = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, reviewed: true } : a)));
  };

  const recordCheckIn = (mood: WellbeingCheckIn['mood'], note?: string) => {
    const newCheckIn: WellbeingCheckIn = {
      id: `wb-${Date.now()}`,
      mood,
      note,
      timestamp: 'Just now'
    };
    const updatedList = [newCheckIn, ...wellbeingCheckIns];
    setWellbeingCheckIns(updatedList);

    // Format for evaluation
    const formattedForEval: WellbeingResponse[] = updatedList.map((item, idx) => ({
      id: item.id,
      mood: item.mood,
      sentiment: isNegativeMood(item.mood) ? 'negative' : item.mood === 'good' ? 'positive' : 'neutral',
      label: item.mood,
      note: item.note,
      timestamp: item.timestamp,
      createdAt: Date.now() - idx * 1000
    }));

    const consecutiveEval = evaluateConsecutiveNegativeResponses(formattedForEval, 2, activePatient.name);

    if (consecutiveEval.isFlagged && consecutiveEval.alert) {
      setAlerts(prev => [consecutiveEval.alert!, ...prev]);
    } else if (isNegativeMood(mood)) {
      const moodLabel = mood === 'sad' ? 'Sad / Quiet' : mood === 'worried' ? 'Worried / Apprehensive' : 'Tired / Low Energy';
      const moodAlert: CaregiverAlert = {
        id: `alt-${Date.now()}`,
        type: 'mood_concern',
        title: 'Well-being Check-In Notice',
        message: `${activePatient.name} reported feeling "${moodLabel}" during today's check-in. A warm family call is recommended.`,
        severity: 'warning',
        createdAt: 'Just now',
        reviewed: false,
        actionLabel: 'Call Patient'
      };
      setAlerts(prev => [moodAlert, ...prev]);
    }
  };

  const addMemoryItem = (item: Omit<MemoryItem, 'id'>) => {
    const newItem: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`
    };
    setMemories(prev => [newItem, ...prev]);
  };

  const recordActivityResult = (res: Omit<ActivityResult, 'id' | 'completedAt'>) => {
    const fullResult: ActivityResult = {
      ...res,
      id: `act-${Date.now()}`,
      completedAt: 'Just now'
    };

    setActivePatient(prev => {
      const updatedCompletedToday = Math.min(prev.stats.totalToday, prev.stats.completedToday + 1);
      const newScore = Math.round((prev.stats.weeklyScore * 3 + res.score) / 4);
      const newRecent = [fullResult, ...(prev.recentActivities || []).slice(0, 5)];

      // Compute adaptation
      const adaptation = AdaptiveCognitiveEngine.computeAdaptation(prev, fullResult);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          completedToday: updatedCompletedToday,
          weeklyScore: newScore,
          lastActive: 'Just now'
        },
        cognitiveDomains: {
          ...prev.cognitiveDomains,
          [res.gameType === 'memory' ? 'memory' : res.gameType === 'sequence' ? 'sequence' : 'attention']: Math.min(
            100,
            Math.max(40, res.score)
          )
        },
        recentActivities: newRecent
      };
    });
  };

  const recordGameCompletion = (gameTitle: string, score: number) => {
    recordActivityResult({
      title: gameTitle,
      gameType: 'memory',
      score,
      accuracy: score,
      durationMinutes: 4,
      responseTimeSeconds: 2.2,
      attempts: 1,
      mistakes: score < 80 ? 2 : 0
    });
  };

  const exportAllDataJSON = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      patient: activePatient,
      reminders,
      alerts,
      wellbeingCheckIns,
      memories,
      version: 'SmritiCare-NEURO-NER-v2.0'
    };
    return JSON.stringify(payload, null, 2);
  };

  const addImportantPlace = (place: Omit<ImportantPlace, 'id'>) => {
    const newPlace: ImportantPlace = {
      ...place,
      id: `plc-${Date.now()}`
    };
    setImportantPlaces(prev => [newPlace, ...prev]);
  };

  const updateImportantPlace = (id: string, updates: Partial<ImportantPlace>) => {
    setImportantPlaces(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteImportantPlace = (id: string) => {
    setImportantPlaces(prev => prev.filter(p => p.id !== id));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `ec-${Date.now()}`
    };
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const sendEmergencySMS = async (contactId: string, customText?: string): Promise<EmergencySmsLog> => {
    const contact = emergencyContacts.find(c => c.id === contactId) || emergencyContacts[0];
    const message = customText || `Smriti Care alert: ${activePatient.name} may need assistance. Please check in on them.`;

    const newLog: EmergencySmsLog = {
      id: `sms-${Date.now()}`,
      contactId: contact ? contact.id : 'unknown',
      contactName: contact ? contact.name : 'Emergency Contact',
      phoneNumber: contact ? contact.phone : '+91 98640 12345',
      message,
      status: 'delivered',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confirmedByUser: true
    };

    const newAlert: CaregiverAlert = {
      id: `alt-${Date.now()}`,
      type: 'help_request',
      title: '🚨 Emergency SMS Triggered',
      message: `SMS dispatched to ${newLog.contactName} (${newLog.phoneNumber}): "${message}"`,
      severity: 'urgent',
      createdAt: 'Just now',
      reviewed: false,
      actionLabel: `Call ${newLog.contactName}`
    };

    setAlerts(prev => [newAlert, ...prev]);
    setEmergencySmsLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const clearAllLocalData = () => {
    localStorage.removeItem('neuro_reminders');
    localStorage.removeItem('neuro_alerts');
    localStorage.removeItem('neuro_wellbeing');
    localStorage.removeItem('neuro_memories');
    localStorage.removeItem('neuro_active_patient');
    localStorage.removeItem('neuro_places');
    localStorage.removeItem('neuro_emergency_contacts');
    localStorage.removeItem('neuro_sms_logs');
    setReminders(initialReminders);
    setAlerts(initialAlertsList);
    setMemories(mockMemories);
    setActivePatient(mockPatients[0]);
    setImportantPlaces(initialImportantPlaces);
    setEmergencyContacts(initialEmergencyContacts);
    setEmergencySmsLogs([]);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        activePatient,
        setActivePatient,
        patients,
        reminders,
        addReminder,
        toggleReminder,
        setReminderStatus,
        deleteReminder,
        alerts,
        sendHelpAlert,
        markAlertReviewed,
        wellbeingCheckIns,
        recordCheckIn,
        memories,
        addMemoryItem,
        familyMembers,
        importantPlaces,
        addImportantPlace,
        updateImportantPlace,
        deleteImportantPlace,
        emergencyContacts,
        addEmergencyContact,
        deleteEmergencyContact,
        emergencySmsLogs,
        sendEmergencySMS,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isAICompanionOpen,
        setIsAICompanionOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isWalkthroughOpen,
        setIsWalkthroughOpen,
        recordGameCompletion,
        recordActivityResult,
        exportAllDataJSON,
        clearAllLocalData
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

