import { useEffect, useState } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * Handles SSR safety and JSON serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

/**
 * Hook for managing quiz progress (resume interrupted quizzes)
 */
export interface QuizProgress {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: { questionIndex: number; selectedAnswer: string; isCorrect: boolean }[];
  score: number;
  timestamp: number;
}

export function useQuizProgress() {
  const [progress, setProgress] = useLocalStorage<QuizProgress | null>(
    'quiz-progress',
    null
  );

  const saveProgress = (data: Omit<QuizProgress, 'timestamp'>) => {
    setProgress({ ...data, timestamp: Date.now() });
  };

  const clearProgress = () => {
    setProgress(null);
  };

  const hasRecentProgress = () => {
    if (!progress) return false;
    // Consider progress valid for 24 hours
    const oneDayMs = 24 * 60 * 60 * 1000;
    return Date.now() - progress.timestamp < oneDayMs;
  };

  return { progress, saveProgress, clearProgress, hasRecentProgress };
}

/**
 * Hook for managing user stats (XP, best scores, streaks)
 */
export interface UserStats {
  xp: number;
  bestScores: Record<string, number>; // topicId -> best percentage
  streakDays: number;
  lastActiveDate: string; // ISO date string
  totalQuizzes: number;
}

const defaultStats: UserStats = {
  xp: 0,
  bestScores: {},
  streakDays: 0,
  lastActiveDate: '',
  totalQuizzes: 0,
};

export function useUserStats() {
  const [stats, setStats] = useLocalStorage<UserStats>('user-stats', defaultStats);

  const addXp = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const updateBestScore = (topicId: string, percentage: number) => {
    setStats(prev => {
      const currentBest = prev.bestScores[topicId] || 0;
      if (percentage > currentBest) {
        return {
          ...prev,
          bestScores: { ...prev.bestScores, [topicId]: percentage },
        };
      }
      return prev;
    });
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const lastDate = prev.lastActiveDate;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (lastDate === today) {
        // Already logged today
        return prev;
      } else if (lastDate === yesterday) {
        // Continuing streak
        return { ...prev, streakDays: prev.streakDays + 1, lastActiveDate: today };
      } else {
        // Streak broken, start fresh
        return { ...prev, streakDays: 1, lastActiveDate: today };
      }
    });
  };

  const incrementQuizzes = () => {
    setStats(prev => ({ ...prev, totalQuizzes: prev.totalQuizzes + 1 }));
  };

  const getBestScore = (topicId: string) => stats.bestScores[topicId] || 0;

  return {
    stats,
    addXp,
    updateBestScore,
    updateStreak,
    incrementQuizzes,
    getBestScore,
  };
}
