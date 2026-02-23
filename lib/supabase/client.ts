/**
 * Supabase Client Configuration
 * Browser-side Supabase client with proper TypeScript types
 */

import { createClient } from '@supabase/supabase-js';
import { PostgrestClient } from '@supabase/postgrest-js';

// Simplified table types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
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
          user_id: string;
          date: string;
          completed?: boolean;
          streak_count?: number;
        };
        Update: {
          user_id?: string;
          date?: string;
          completed?: boolean;
          streak_count?: number;
          updated_at?: string;
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
          user_id: string;
          wake_time: string;
          date: string;
          reset_duration?: number;
        };
        Update: {
          user_id?: string;
          wake_time?: string;
          date?: string;
          reset_duration?: number;
          updated_at?: string;
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
        Insert: {
          user_id: string;
          wake_goal_time?: string | null;
          reset_duration?: number;
          timezone?: string;
        };
        Update: {
          user_id?: string;
          wake_goal_time?: string | null;
          reset_duration?: number;
          timezone?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Re-export common types for convenience
export type Streak = Database['public']['Tables']['streaks']['Row'];
export type CheckIn = Database['public']['Tables']['checkins']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
