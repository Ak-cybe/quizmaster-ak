import { useState, useEffect, useCallback } from "react";

interface UseTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function useTimer({ initialTime, onTimeUp, isActive }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);

  const resetTimer = useCallback((newTime?: number) => {
    setTimeRemaining(newTime ?? initialTime);
  }, [initialTime]);

  const pauseTimer = useCallback(() => {
    // Timer is paused by setting isActive to false from parent
  }, []);

  const percentage = (timeRemaining / initialTime) * 100;
  const isWarning = timeRemaining <= 5;
  const isCritical = timeRemaining <= 3;

  return {
    timeRemaining,
    percentage,
    isWarning,
    isCritical,
    resetTimer,
    pauseTimer,
  };
}
