/**
 * Streak Service
 * Manages streak calculation and data
 */

import { supabase, type Streak } from '@/lib/supabase/client';

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

/**
 * Calculate streak count for a given date
 * Forgiving streak: doesn't reset to 0 on missed days, maintains current count
 */
function calculateStreakCount(
  streaks: Streak[],
  targetDate: string
): number {
  // Sort streaks by date
  const sortedStreaks = [...streaks].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentStreak = 0;
  let found = false;

  for (let i = sortedStreaks.length - 1; i >= 0; i--) {
    const streak = sortedStreaks[i];
    const streakDate = new Date(streak.date);
    const targetDateObj = new Date(targetDate);

    // Calculate days difference
    const daysDiff = Math.floor(
      (targetDateObj.getTime() - streakDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If streak was completed and is from yesterday or today, count it
    if (streak.completed && daysDiff <= 1) {
      currentStreak = streak.streak_count;
      found = true;
      break;
    }

    // If we found a completed streak from an earlier date, stop
    if (found && daysDiff > 1) {
      break;
    }
  }

  return currentStreak;
}

export const streakService = {
  /**
   * Get all streaks for a user
   */
  async getByUserId(userId: string): Promise<Streak[]> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch streaks: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Upsert a streak record (create or update)
   */
  async upsert(
    userId: string,
    date: string,
    completed: boolean
  ): Promise<Streak> {
    // Get existing streak
    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    // Calculate streak count
    const allStreaks = await this.getByUserId(userId);
    const streakCount = calculateStreakCount(allStreaks, date);

    if (existing) {
      // Update existing record
      const { data, error } = await (supabase as any)
        .from('streaks')
        .update({
          completed,
          streak_count: streakCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (existing as any).id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update streak: ${error.message}`);
      }

      return { ...(existing as any), ...data! };
    } else {
      // Create new record
      const { data, error } = await (supabase as any)
        .from('streaks')
        .insert({
          user_id: userId,
          date,
          completed,
          streak_count: streakCount,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create streak: ${error.message}`);
      }

      return data!;
    }
  },

  /**
   * Get streak summary (current, longest, completion rate)
   */
  async getSummary(userId: string): Promise<StreakSummary> {
    const streaks = await this.getByUserId(userId);

    if (streaks.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      };
    }

    const completedStreaks = streaks.filter((s) => s.completed);
    const longestStreak = Math.max(
      ...streaks.map((s) => s.streak_count),
      0
    );
    const completionRate = Math.round(
      (completedStreaks.length / streaks.length) * 100
    );
    const currentStreak = streaks[0]?.streak_count || 0;

    return {
      currentStreak,
      longestStreak,
      completionRate,
    };
  },

  /**
   * Get streaks for a date range (e.g., last 7 days)
   */
  async getByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Streak[]> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch streaks by date range: ${error.message}`);
    }

    return data || [];
  },
};
