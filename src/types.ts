export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Completed';
export type SessionStatus = 'Pending' | 'Completed';
export type TaskType = 'Assignment' | 'Lab Report' | 'Project' | 'Exam Prep' | 'Reading' | 'Other';

export interface User {
  id: string;
  fullName: string;
  email: string;
  course: string;
  college: string;
  semester?: string;
  joinDate: string;
}

export interface Topic {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string; // Tailwind color token or hex
  targetHours: number;
  completedHours: number;
  topics: Topic[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  durationMinutes: number;
  priority: Priority;
  status: SessionStatus;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  type: TaskType;
  description?: string;
}

export type ActiveTab = 'dashboard' | 'subjects' | 'planner' | 'tasks' | 'progress' | 'profile';
