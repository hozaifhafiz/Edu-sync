
export enum Board {
  NCERT = 'NCERT',
  JKBOSE = 'JKBOSE',
}

export enum Grade {
  CLASS_9 = 'Class 9',
  CLASS_10 = 'Class 10',
  CLASS_11 = 'Class 11',
  CLASS_12 = 'Class 12',
}

export enum Subject {
  MATH = 'Mathematics',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  HISTORY = 'History',
}

export type ViewMode = 'DASHBOARD' | 'NOTES' | 'QUIZ' | 'ASK_DOUBT' | 'SAVED_NOTES' | 'ABOUT' | 'AI_RESOURCES' | 'PREVIOUS_PAPERS';

export interface UserPreferences {
  board: Board;
  grade: Grade;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface NoteResponse {
  text: string;
}

export interface SavedNote {
  id: string;
  topic: string;
  subject: Subject;
  content: string;
  date: string;
  grade: Grade;
  board: Board;
}

export interface User {
  mobile: string;
  email?: string;
  name?: string; // Optional, can be derived or added later
  profilePic?: string; // Base64 string
  grade: Grade;
  password?: string;
  board: Board;
}

export type AuthState = 'LOGIN' | 'SIGNUP_INPUT' | 'SIGNUP_OTP' | 'SIGNUP_PROFILE';