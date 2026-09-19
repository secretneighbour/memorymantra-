import { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'patient-01',
    name: 'Visitor',
    age: 72,
    gender: 'Female',
    location: 'Guwahati',
    state: 'Assam',
    stage: 'Mild Cognitive Impairment',
    preferredLanguage: 'as',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    primaryCaregiver: {
      name: 'Visitor (Caregiver)',
      relation: 'Caregiver',
      phone: '+91 98640 12345',
    },
    emergencyContact: {
      name: 'Visitor (Doctor)',
      relation: 'Consultant Specialist',
      phone: '+91 94350 98765',
    },
    stats: {
      streakDays: 5,
      weeklyScore: 86,
      completionRate: 88,
      completedToday: 3,
      totalToday: 5,
      lastActive: '12 mins ago',
    },
    cognitiveDomains: {
      memory: 84,
      attention: 88,
      recognition: 92,
      sequence: 78,
      engagement: 90,
    },
    recentActivities: [
      { id: 'act-1', title: 'Heritage Memory Match', gameType: 'memory', completedAt: 'Today, 10:45 AM', score: 88, durationMinutes: 6, accuracy: 88, responseTimeSeconds: 2.1, attempts: 1, mistakes: 1 },
      { id: 'act-2', title: 'Brahmaputra Word Connect', gameType: 'words', completedAt: 'Today, 02:15 PM', score: 92, durationMinutes: 5, accuracy: 92, responseTimeSeconds: 1.9, attempts: 1, mistakes: 0 },
      { id: 'act-3', title: 'Visual Pattern Recall', gameType: 'sequence', completedAt: 'Today, 04:30 PM', score: 80, durationMinutes: 7, accuracy: 80, responseTimeSeconds: 2.5, attempts: 2, mistakes: 2 },
    ]
  },
  {
    id: 'patient-02',
    name: 'Birjit Singh',
    age: 69,
    gender: 'Male',
    location: 'Imphal',
    state: 'Manipur',
    stage: 'Early Dementia',
    preferredLanguage: 'mni',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    primaryCaregiver: {
      name: 'Linthoingambi Singh',
      relation: 'Daughter',
      phone: '+91 98561 23456',
    },
    emergencyContact: {
      name: 'RIMS Geriatric Care',
      relation: 'Hospital Helpdesk',
      phone: '+91 94028 11223',
    },
    stats: {
      streakDays: 3,
      weeklyScore: 78,
      completionRate: 75,
      completedToday: 2,
      totalToday: 4,
      lastActive: '1 hour ago',
    },
    cognitiveDomains: {
      memory: 72,
      attention: 76,
      recognition: 85,
      sequence: 68,
      engagement: 82,
    },
    recentActivities: [
      { id: 'act-4', title: 'Loktak Picture Recognition', gameType: 'recognition', completedAt: 'Today, 09:30 AM', score: 85, durationMinutes: 5, accuracy: 85, responseTimeSeconds: 2.3, attempts: 1, mistakes: 1 },
      { id: 'act-5', title: 'Daily Word Associations', gameType: 'words', completedAt: 'Today, 11:15 AM', score: 78, durationMinutes: 6, accuracy: 78, responseTimeSeconds: 2.6, attempts: 1, mistakes: 2 },
    ]
  },
  {
    id: 'patient-03',
    name: 'Mary Nongrum',
    age: 74,
    gender: 'Female',
    location: 'Shillong',
    state: 'Meghalaya',
    stage: 'Mild Cognitive Impairment',
    preferredLanguage: 'kha',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    primaryCaregiver: {
      name: 'Daphisabet Nongrum',
      relation: 'Granddaughter',
      phone: '+91 98630 34567',
    },
    emergencyContact: {
      name: 'Nazareth Hospital Desk',
      relation: 'Clinic',
      phone: '+91 94361 77889',
    },
    stats: {
      streakDays: 7,
      weeklyScore: 91,
      completionRate: 94,
      completedToday: 4,
      totalToday: 5,
      lastActive: '30 mins ago',
    },
    cognitiveDomains: {
      memory: 89,
      attention: 92,
      recognition: 95,
      sequence: 86,
      engagement: 94,
    },
    recentActivities: [
      { id: 'act-6', title: 'Living Root Bridge Match', gameType: 'memory', completedAt: 'Today, 08:30 AM', score: 94, durationMinutes: 4, accuracy: 94, responseTimeSeconds: 1.8, attempts: 1, mistakes: 0 },
      { id: 'act-7', title: 'Music & Dhol Sequence', gameType: 'sequence', completedAt: 'Today, 11:00 AM', score: 88, durationMinutes: 6, accuracy: 88, responseTimeSeconds: 2.0, attempts: 1, mistakes: 1 },
    ]
  },
  {
    id: 'patient-04',
    name: 'Lalrinzuala Sailo',
    age: 76,
    gender: 'Male',
    location: 'Aizawl',
    state: 'Mizoram',
    stage: 'Moderate Support',
    preferredLanguage: 'lus',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    primaryCaregiver: {
      name: 'Lalmuanpuii Sailo',
      relation: 'Wife',
      phone: '+91 94361 45678',
    },
    emergencyContact: {
      name: 'Civil Hospital Aizawl',
      relation: 'Emergency Desk',
      phone: '+91 98623 99887',
    },
    stats: {
      streakDays: 4,
      weeklyScore: 74,
      completionRate: 70,
      completedToday: 2,
      totalToday: 4,
      lastActive: '2 hours ago',
    },
    cognitiveDomains: {
      memory: 68,
      attention: 74,
      recognition: 80,
      sequence: 66,
      engagement: 78,
    },
    recentActivities: [
      { id: 'act-8', title: 'Cheraw Rhythm Match', gameType: 'sequence', completedAt: 'Today, 10:15 AM', score: 76, durationMinutes: 5, accuracy: 76, responseTimeSeconds: 2.7, attempts: 1, mistakes: 2 },
    ]
  }
];

export const defaultPatient = mockPatients[0];
