
import { Subject, Topic, Post, Badge, LeaderboardEntry } from './types';

export const SUBJECTS_CONFIG = [
  { id: Subject.History, icon: 'fa-landmark', color: 'bg-amber-100 text-amber-700' },
  { id: Subject.Geography, icon: 'fa-earth-asia', color: 'bg-emerald-100 text-emerald-700' },
  { id: Subject.Polity, icon: 'fa-gavel', color: 'bg-blue-100 text-blue-700' },
  { id: Subject.Economy, icon: 'fa-chart-line', color: 'bg-indigo-100 text-indigo-700' },
  { id: Subject.Environment, icon: 'fa-leaf', color: 'bg-green-100 text-green-700' },
  { id: Subject.ScienceTech, icon: 'fa-microscope', color: 'bg-purple-100 text-purple-700' },
  { id: Subject.CurrentAffairs, icon: 'fa-newspaper', color: 'bg-rose-100 text-rose-700' },
];

export const BADGES_CONFIG: Badge[] = [
  { id: 'b-polity', name: 'Constitutional Master', icon: 'fa-gavel', color: 'bg-blue-500', subject: Subject.Polity },
  { id: 'b-history', name: 'Time Traveler', icon: 'fa-landmark', color: 'bg-amber-500', subject: Subject.History },
  { id: 'b-geography', name: 'Global Explorer', icon: 'fa-earth-asia', color: 'bg-emerald-500', subject: Subject.Geography },
  { id: 'b-economy', name: 'Market Maestro', icon: 'fa-chart-line', color: 'bg-indigo-500', subject: Subject.Economy },
];

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'p-1',
    subject: Subject.Polity,
    module: 'Constitutional Framework',
    xpReward: 100,
    title: 'Doctrine of Basic Structure',
    content: 'The Basic Structure Doctrine (Kesavananda Bharati v. State of Kerala, 1973) dictates that while Parliament can amend the Constitution, it cannot alter its essential features like democracy, secularism, or federalism.',
    questions: [
      { id: 'pq-1', type: 'Prelims', text: 'Which case established the "Basic Structure" doctrine?', options: ['Golaknath', 'Kesavananda Bharati', 'Minerva Mills', 'S.R. Bommai'], correctAnswer: 'Kesavananda Bharati' },
      { id: 'pq-2', type: 'Mains', text: 'Critically examine the evolution of the basic structure doctrine in Indian constitutional history.', guidance: 'Discuss key cases from 1951 to 1973.' }
    ]
  },
  {
    id: 'h-1',
    subject: Subject.History,
    module: 'Ancient India',
    xpReward: 120,
    title: 'Indus Valley Urbanization',
    content: 'Harappan civilization was known for its sophisticated town planning, drainage systems, and grid-iron street layouts. Major sites include Harappa, Mohenjodaro, and Dholavira.',
    questions: [
      { id: 'hq-1', type: 'Prelims', text: 'Which Harappan site is famous for its water management system?', options: ['Lothal', 'Dholavira', 'Kalibangan', 'Banawali'], correctAnswer: 'Dholavira' }
    ]
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'bot-1',
    userName: 'Abhishek (AIR 14)',
    userAvatar: 'https://i.pravatar.cc/150?u=abhishek',
    content: "Just shared a recording on 'Basic Structure'. Remember, focus on the Kesavananda case timeline. Keep grinding! 🚀",
    timestamp: new Date(),
    likes: 42,
    type: 'recording'
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: '1', name: 'Sneha Rao', photoUrl: 'https://i.pravatar.cc/150?u=sneha', xp: 12450, level: 13, rank: 1 },
  { userId: '2', name: 'Rahul V.', photoUrl: 'https://i.pravatar.cc/150?u=rahul', xp: 11200, level: 12, rank: 2 },
  { userId: '3', name: 'Priya S.', photoUrl: 'https://i.pravatar.cc/150?u=priya', xp: 10800, level: 11, rank: 3 },
  { userId: '4', name: 'Ankit Sharma', photoUrl: 'https://i.pravatar.cc/150?u=ankit', xp: 9500, level: 10, rank: 4 },
  { userId: '5', name: 'Vikram Singh', photoUrl: 'https://i.pravatar.cc/150?u=vikram', xp: 8700, level: 9, rank: 5 },
];
