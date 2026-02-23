/**
 * useProgress Hook
 * Progress data state management
 */

'use client';

import { useState, useEffect } from 'react';
import { progressService } from '@/lib/services/progressService';

export interface ProgressState {
  weeklyView: Array<{ day: string; date: string; completed: boolean; streakCount: number }>;
  monthlyView: Array<{ day: string; date: string; completed: boolean; streakCount: number }>;
  loading: boolean;
  error: Error | null;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export function useProgress(userId: string, view: 'weekly' | 'monthly' = 'weekly') {
  const [state, setState] = useState<ProgressState>({
    weeklyView: [],
    monthlyView: [],
    loading: true,
    error: null,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    async function loadProgress() {
      try {
        if (view === 'weekly') {
          const weeklyView = await progressService.getWeeklyView(userId);
          setState({
            weeklyView,
            monthlyView: [],
            loading: false,
            error: null,
            completionRate: 0,
            currentStreak: 0,
            longestStreak: 0,
          });
        } else if (view === 'monthly') {
          const monthlyView = await progressService.getMonthlyView(userId);
          const summary = await progressService.getSummary(userId);
          setState({
            weeklyView: [],
            monthlyView,
            loading: false,
            error: null,
            completionRate: summary.completionRate,
            currentStreak: summary.currentStreak,
            longestStreak: summary.longestStreak,
          });
        }
      } catch (err) {
        setState({
          ...state,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to load progress'),
        });
      }
    }

    loadProgress();
  }, [userId, view]);

  return {
    ...state,
    loading: state.loading,
    error: state.error,
  };
}
