/**
 * useCheckIn Hook
 * Check-in state management
 */

'use client';

import { useState, useEffect } from 'react';
import { checkinService } from '@/lib/services/checkinService';

export interface CheckInState {
  todayCheckIn: { id: string; wake_time: string; date: string } | null;
  loading: boolean;
  error: Error | null;
}

export function useCheckIn(userId: string, date: string) {
  const [state, setState] = useState<CheckInState>({
    todayCheckIn: null,
    loading: true,
    error: null,
  });

  // Load today's check-in on mount
  useEffect(() => {
    async function loadCheckIn() {
      try {
        const checkIn = await checkinService.getTodayCheckIn(userId, date);
        setState({
          todayCheckIn: checkIn,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          todayCheckIn: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to load check-in'),
        });
      }
    }

    loadCheckIn();
  }, [userId, date]);

  const createCheckIn = async (wakeTime: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Pass all required arguments (userId, wakeTime, date)
      // resetDuration is optional with default 30
      const checkIn = await checkinService.create(userId, wakeTime, date);
      setState({
        todayCheckIn: checkIn,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        todayCheckIn: null,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to create check-in'),
      });
    }
  };

  return {
    ...state,
    createCheckIn,
  };
}
