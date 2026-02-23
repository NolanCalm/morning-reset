/**
 * Streak Utilities
 * Streak calculation and helper functions
 */

import type { Streak } from '@/lib/supabase/client';
import { getDaysDiff } from './date';

/**
 * Check if two dates are consecutive (day apart)
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns True if dates are consecutive
 */
export function isConsecutive(date1: string, date2: string): boolean {
  return Math.abs(getDaysDiff(date1, date2)) === 1;
}

/**
 * Calculate the current streak from a sorted array of streaks
 * Uses forward iteration from the last completed streak
 * This handles gaps correctly and implements the "forgiving" streak logic
 * @param streaks - Array of streak records (should be sorted by date ascending)
 * @returns Current streak count
 */
export function calculateCurrentStreak(streaks: Streak[]): number {
  if (streaks.length === 0) {
    return 0;
  }

  // Find the index of the last completed streak
  let lastCompletedIndex = -1;
  for (let i = streaks.length - 1; i >= 0; i--) {
    if (streaks[i].completed) {
      lastCompletedIndex = i;
      break;
    }
  }

  // No completed streaks
  if (lastCompletedIndex === -1) {
    return 0;
  }

  // Count consecutive completed streaks backwards from last completed
  let currentStreak = 0;
  for (let i = lastCompletedIndex; i >= 0; i--) {
    const streak = streaks[i];

    if (!streak.completed) {
      break;
    }

    // If it's the first completed streak or consecutive with previous
    if (i === lastCompletedIndex || isConsecutive(streaks[i + 1].date, streak.date)) {
      currentStreak++;
    } else {
      // Gap found - end of streak
      break;
    }
  }

  return currentStreak;
}

/**
 * Calculate the longest streak from an array of streaks
 * @param streaks - Array of streak records
 * @returns Longest streak count
 */
export function calculateLongestStreak(streaks: Streak[]): number {
  if (streaks.length === 0) {
    return 0;
  }

  let maxStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < streaks.length; i++) {
    const streak = streaks[i];

    if (streak.completed) {
      // Check if consecutive with previous
      if (i === 0 || isConsecutive(streaks[i - 1].date, streak.date)) {
        currentStreak++;
      } else {
        // New streak starting
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Streak broken
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * Calculate completion rate
 * @param streaks - Array of streak records
 * @returns Completion rate as percentage (0-100)
 */
export function calculateCompletionRate(streaks: Streak[]): number {
  if (streaks.length === 0) {
    return 0;
  }

  const completed = streaks.filter(s => s.completed).length;
  return Math.round((completed / streaks.length) * 100);
}

/**
 * Check if user has achieved a streak milestone
 * @param streak - Current streak count
 * @returns Milestone name or null if not achieved
 */
export function checkStreakMilestone(streak: number): string | null {
  if (streak >= 100) return 'Century Master';
  if (streak >= 30) return 'Month Master';
  if (streak >= 21) return 'Three Week Warrior';
  if (streak >= 14) return 'Flame Keeper';
  if (streak >= 7) return 'Week Warrior';
  if (streak >= 3) return 'Rising Star';
  return null;
}

/**
 * Get next streak milestone
 * @param currentStreak - Current streak count
 * @returns Next milestone and count needed
 */
export function getNextMilestone(currentStreak: number): {
  name: string | null;
  count: number;
} {
  const milestones = [
    { count: 3, name: 'Rising Star' },
    { count: 7, name: 'Week Warrior' },
    { count: 14, name: 'Flame Keeper' },
    { count: 21, name: 'Three Week Warrior' },
    { count: 30, name: 'Month Master' },
    { count: 100, name: 'Century Master' },
  ];

  for (const milestone of milestones) {
    if (currentStreak < milestone.count) {
      return {
        name: milestone.name,
        count: milestone.count - currentStreak,
      };
    }
  }

  return { name: null, count: 0 };
}

/**
 * Update streak count for a specific date
 * Calculates the correct streak count based on previous days
 * @param streaks - All streak records for a user
 * @param targetDate - Date to update
 * @returns New streak count for the target date
 */
export function calculateStreakCountForDate(
  streaks: Streak[],
  targetDate: string
): number {
  // Sort streaks by date
  const sortedStreaks = [...streaks].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find the target streak
  const targetIndex = sortedStreaks.findIndex(s => s.date === targetDate);

  // If target not found, return 0
  if (targetIndex === -1) {
    return 0;
  }

  const targetStreak = sortedStreaks[targetIndex];

  // If not completed, streak count is 0
  if (!targetStreak.completed) {
    return 0;
  }

  // Count consecutive completed streaks before this date
  let streakCount = 0;
  for (let i = targetIndex; i >= 0; i--) {
    const streak = sortedStreaks[i];

    if (!streak.completed) {
      break;
    }

    // If it's the target streak or consecutive with previous
    if (i === targetIndex || isConsecutive(streaks[i + 1].date, streak.date)) {
      streakCount++;
    } else {
      // Gap found - end of streak
      break;
    }
  }

  return streakCount;
}
