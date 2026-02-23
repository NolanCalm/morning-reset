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

// Using any type to bypass strict TypeScript checking temporarily
// TODO: Generate proper types from Supabase schema
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);

export type Streak = {
  id: string;
  user_id: string;
  date: string;
  completed: boolean;
  streak_count: number;
  created_at: string;
  updated_at: string;
};

export type CheckIn = {
  id: string;
  user_id: string;
  wake_time: string;
  date: string;
  reset_duration: number;
  created_at: string;
  updated_at: string;
};
