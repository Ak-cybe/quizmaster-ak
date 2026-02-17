// Quiz Types & Interfaces

export interface QuizOption {
  id: string; // A, B, C, D
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string; // A, B, C, or D
  explanation: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Gradient class
  questions: QuizQuestion[];
  timePerQuestion: number; // seconds
}

export interface QuizAttempt {
  categoryId: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // seconds
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number; // seconds for this question
}

export interface QuizProgress {
  attempts: QuizAttempt[];
  bestScores: Record<string, number>; // categoryId -> best score percentage
  totalQuizzesCompleted: number;
  currentStreak: number;
  lastQuizDate: string | null;
}

export interface QuizState {
  currentCategory: QuizCategory | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isQuizActive: boolean;
  isQuizComplete: boolean;
  selectedAnswer: string | null;
  showExplanation: boolean;
  timeRemaining: number;
  totalTimeTaken: number;
}
