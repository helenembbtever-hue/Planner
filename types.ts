
export enum TaskType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  type: TaskType;
  date: string; // ISO string
}

export interface Habit {
  id: string;
  name: string;
  history: string[]; // Array of ISO date strings (YYYY-MM-DD)
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  category: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

export interface VisionItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export type View = 'dashboard' | 'daily' | 'weekly' | 'monthly' | 'calendar' | 'habits' | 'goals' | 'vision' | 'journal';
