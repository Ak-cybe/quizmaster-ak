import { useLocalStorage } from "./useLocalStorage";
import { QuizProgress, QuizAttempt } from "@/types/quiz";
import { useCallback } from "react";

const initialProgress: QuizProgress = {
  attempts: [],
  bestScores: {},
  totalQuizzesCompleted: 0,
  currentStreak: 0,
  lastQuizDate: null,
};

export function useQuizProgress() {
  const [progress, setProgress] = useLocalStorage<QuizProgress>(
    "quiz-progress",
    initialProgress
  );

  const saveAttempt = useCallback(
    (attempt: QuizAttempt) => {
      setProgress((prev) => {
        const scorePercentage = Math.round(
          (attempt.score / attempt.totalQuestions) * 100
        );

        // Update best score
        const currentBest = prev.bestScores[attempt.categoryId] || 0;
        const newBestScores = {
          ...prev.bestScores,
          [attempt.categoryId]: Math.max(currentBest, scorePercentage),
        };

        // Calculate streak
        const today = new Date().toDateString();
        const lastDate = prev.lastQuizDate;
        let newStreak = prev.currentStreak;

        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          if (lastDate === today) {
            // Same day, keep streak
          } else if (lastDate === yesterdayStr) {
            // Consecutive day, increment streak
            newStreak += 1;
          } else {
            // Streak broken, reset to 1
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        return {
          attempts: [attempt, ...prev.attempts].slice(0, 50), // Keep last 50 attempts
          bestScores: newBestScores,
          totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
          currentStreak: newStreak,
          lastQuizDate: today,
        };
      });
    },
    [setProgress]
  );

  const getBestScore = useCallback(
    (categoryId: string): number => {
      return progress.bestScores[categoryId] || 0;
    },
    [progress.bestScores]
  );

  const getAttemptsForCategory = useCallback(
    (categoryId: string): QuizAttempt[] => {
      return progress.attempts.filter((a) => a.categoryId === categoryId);
    },
    [progress.attempts]
  );

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
  }, [setProgress]);

  return {
    progress,
    saveAttempt,
    getBestScore,
    getAttemptsForCategory,
    resetProgress,
  };
}
