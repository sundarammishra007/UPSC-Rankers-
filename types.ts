
export enum Subject {
  History = 'History',
  Geography = 'Geography',
  Polity = 'Polity',
  Economy = 'Economy',
  Environment = 'Environment',
  ScienceTech = 'Science & Tech',
  CurrentAffairs = 'Current Affairs'
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  subject: Subject;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  journeyVideoUrl?: string; // URL to the recorded 5-second journey video
  mobile?: string;
  isGuest?: boolean;
  xp: number;
  level: number;
  streak: number; // Daily login/activity streak
  rank?: number; // Global rank on leaderboard
  earnedBadges: string[]; // Badge IDs
  completedSubjects: Subject[];
}

export interface Question {
  id: string;
  type: 'Prelims' | 'Mains';
  text: string;
  options?: string[]; // Only for Prelims
  correctAnswer?: string; // Only for Prelims
  guidance?: string;
}

export interface Topic {
  id: string;
  subject: Subject;
  title: string;
  content: string; // Bite-sized text content
  questions: Question[];
  xpReward: number;
  module?: string; // Optional grouping
}

export interface CircleMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
}

export interface StudyCircle {
  subject: Subject;
  description: string;
  memberCount: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  type: 'achievement' | 'recording' | 'submission';
  noteImageUrl?: string; // Optional image of handwritten notes
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  photoUrl: string;
  xp: number;
  level: number;
  rank: number;
}
