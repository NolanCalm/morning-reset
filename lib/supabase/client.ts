/**
 * Supabase Browser Client
 * Browser-side Supabase client using @supabase/ssr pattern
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database, Streak, CheckIn, UserProfile } from './types';

// Re-export types for convenience
export type { Database, Streak, CheckIn, UserProfile };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Create a browser Supabase client
 * This client manages cookies for auth state persistence
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

// Create a singleton instance
export const supabase = createClient();
