/**
 * Progress Service
 * Aggregates data from streaks and check-ins for dashboard
 */

import { streakService } from './streakService';
import { checkinService } from './checkinService';
import type { Streak } from '@/lib/supabase/client';

export interface WeekDay {
  day: string;
  date: string;
  completed: boolean;
  streakCount: number;
}

export interface ProgressData {
  streaks: Streak[];
  checkins: Array<{ id: string; wake_time: string; date: string }>;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export const progressService = {
  /**
   * Get weekly progress data (last 7 days)
   */
  async getWeeklyProgress(userId: string): Promise<ProgressData> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    const [streaks, checkins] = await Promise.all([
      streakService.getByDateRange(userId, startDateStr, endDateStr),
      checkinService.getByDateRange(userId, startDateStr, endDateStr),
    ]);

    const summary = await streakService.getSummary(userId);

    return {
      streaks,
      checkins,
      completionRate: summary.completionRate,
      currentStreak: summary.currentStreak,
      longestStreak: summary.longestStreak,
    };
  },

  /**
   * Get weekly view formatted for UI
   */
  async getWeeklyView(userId: string): Promise<WeekDay[]> {
    const progress = await this.getWeeklyProgress(userId);
    const streakMap = new Map(
      progress.streaks.map((s) => [s.date, s])
    );

    // Generate 7 days
    const days: WeekDay[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const streak = streakMap.get(dateStr);

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        completed: streak?.completed || false,
        streakCount: streak?.streak_count || 0,
      });
    }

    // Reverse to show most recent first
    return days.reverse();
  },

  /**
   * Get monthly progress data
   */
  async getMonthlyProgress(userId: string): Promise<ProgressData> {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 0, 0, 0);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const [streaks, checkins] = await Promise.all([
      streakService.getByDateRange(userId, startDateStr, endDateStr),
      checkinService.getByDateRange(userId, startDateStr, endDateStr),
    ]);

    const summary = await streakService.getSummary(userId);

    return {
      streaks,
      checkins,
      completionRate: summary.completionRate,
      currentStreak: summary.currentStreak,
      longestStreak: summary.longestStreak,
    };
  },

  /**
   * Get monthly view formatted for UI
   */
  async getMonthlyView(userId: string): Promise<WeekDay[]> {
    const progress = await this.getMonthlyProgress(userId);
    const streakMap = new Map(
      progress.streaks.map((s) => [s.date, s])
    );

    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const days: WeekDay[] = [];
    for (let i = daysInMonth - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
      const dateStr = date.toISOString().split('T')[0];
      const streak = streakMap.get(dateStr);

      days.push({
        day: date.getDate().toString(),
        date: dateStr,
        completed: streak?.completed || false,
        streakCount: streak?.streak_count || 0,
      });
    }

    // Reverse to show most recent first
    return days.reverse();
  },

  /**
   * Calculate completion rate for a streak array
   */
  calculateCompletionRate(streaks: Streak[]): number {
    if (streaks.length === 0) return 0;
    const completed = streaks.filter((s) => s.completed).length;
    return Math.round((completed / streaks.length) * 100);
  },
};
