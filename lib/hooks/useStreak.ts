/**
 * useStreak Hook
 * Streak state management
 */

'use client';

import { useState, useEffect } from 'react';
import { streakService } from '@/lib/services/streakService';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  loading: boolean;
  error: Error | null;
}

export function useStreak(userId: string) {
  const [state, setState] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadStreak() {
      try {
        const summary = await streakService.getSummary(userId);
        setState({
          currentStreak: summary.currentStreak,
          longestStreak: summary.longestStreak,
          completionRate: summary.completionRate,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          currentStreak: 0,
          longestStreak: 0,
          completionRate: 0,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to load streak'),
        });
      }
    }

    loadStreak();
  }, [userId]);

  const completeToday = async (date: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await streakService.upsert(userId, date, true);
      const summary = await streakService.getSummary(userId);
      setState({
        currentStreak: summary.currentStreak,
        longestStreak: summary.longestStreak,
        completionRate: summary.completionRate,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        ...state,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to complete today'),
      });
    }
  };

  return {
    ...state,
    completeToday,
  };
}
