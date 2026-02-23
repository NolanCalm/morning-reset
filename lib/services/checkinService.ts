/**
 * Check-in Service
 * Handles daily check-in operations
 */

import { supabase, type CheckIn } from '@/lib/supabase/client';

export const checkinService = {
  /**
   * Create a new check-in record
   */
  async create(
    userId: string,
    wakeTime: string,
    date: string,
    resetDuration: number = 30
  ): Promise<CheckIn> {
    const { data, error } = await (supabase as any)
      .from('checkins')
      .insert({
        user_id: userId,
        wake_time: wakeTime,
        date,
        reset_duration: resetDuration,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create check-in: ${error.message}`);
    }

    return data!;
  },

  /**
   * Get today's check-in for a user
   */
  async getTodayCheckIn(userId: string, date: string): Promise<CheckIn | null> {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error) {
      throw new Error(`Failed to fetch today's check-in: ${error.message}`);
    }

    return data || null;
  },

  /**
   * Get check-ins for a date range
   */
  async getByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<CheckIn[]> {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch check-ins by date range: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Update check-in reset duration
   */
  async updateResetDuration(
    checkInId: string,
    resetDuration: number
  ): Promise<CheckIn> {
    const { data, error } = await (supabase as any)
      .from('checkins')
      .update({ reset_duration: resetDuration })
      .eq('id', checkInId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update check-in duration: ${error.message}`);
    }

    return data!;
  },
};
