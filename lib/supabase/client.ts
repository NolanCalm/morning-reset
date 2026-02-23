/**
 * Supabase Client Configuration
 * Browser-side Supabase client
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export type Database = {
  users: {
    Row: {
      id: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      Row: {
        email: string;
      };
    };
    Update: {
      Row: {
        email: string;
      };
    };
  };
  user_profiles: {
    Row: {
      id: string;
      user_id: string;
      wake_goal_time: string | null;
      reset_duration: number;
      timezone: string;
      created_at: string;
      updated_at: string;
    };
    Update: {
      Row: {
        wake_goal_time: string | null;
        reset_duration: number;
        timezone: string;
      };
    };
  };
  streaks: {
    Row: {
      id: string;
      user_id: string;
      date: string;
      completed: boolean;
      streak_count: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      Row: {
        user_id: string;
        date: string;
        completed: boolean;
        streak_count: number;
      };
    };
    Update: {
      Row: {
        completed: boolean;
        streak_count: number;
      };
    };
  };
  checkins: {
    Row: {
      id: string;
      user_id: string;
      wake_time: string;
      date: string;
      reset_duration: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      Row: {
        user_id: string;
        wake_time: string;
        date: string;
        reset_duration: number;
      };
    };
  };
};
