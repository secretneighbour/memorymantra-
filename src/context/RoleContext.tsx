import React, { createContext, useContext, useState } from 'react';
import { UserRole, Patient, ReminderItem } from '../types';
import { mockPatients } from '../data/patients';
import { initialReminders } from '../data/reminders';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePatient: Patient;
  setActivePatient: (patient: Patient) => void;
  patients: Patient[];
  reminders: ReminderItem[];
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isAICompanionOpen: boolean;
  setIsAICompanionOpen: (open: boolean) => void;
  recordGameCompletion: (gameTitle: string, score: number) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('neuro_role') as UserRole) || 'patient';
  });
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [activePatient, setActivePatient] = useState<Patient>(mockPatients[0]);
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isAICompanionOpen, setIsAICompanionOpen] = useState<boolean>(false);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('neuro_role', newRole);
  };

  const addReminder = (newRem: Omit<ReminderItem, 'id' | 'completed'>) => {
    const item: ReminderItem = {
      ...newRem,
      id: `rem-${Date.now()}`,
      completed: false,
    };
    setReminders(prev => [item, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(rem => (rem.id === id ? { ...rem, completed: !rem.completed } : rem))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(rem => rem.id !== id));
  };

  const recordGameCompletion = (gameTitle: string, score: number) => {
    setActivePatient(prev => {
      const updatedCompletedToday = Math.min(prev.stats.totalToday, prev.stats.completedToday + 1);
      const newScore = Math.round((prev.stats.weeklyScore * 3 + score) / 4);
      return {
        ...prev,
        stats: {
          ...prev.stats,
          completedToday: updatedCompletedToday,
          weeklyScore: newScore,
          lastActive: 'Just now',
        },
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            title: gameTitle,
            gameType: 'memory',
            completedAt: 'Just now',
            score,
            durationMinutes: 4,
          },
          ...prev.recentActivities.slice(0, 4)
        ]
      };
    });
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
        deleteReminder,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isAICompanionOpen,
        setIsAICompanionOpen,
        recordGameCompletion,
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
