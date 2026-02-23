/**
 * Authentication Service
 * Handles user authentication and profile management
 */

import { supabase } from '@/lib/supabase/client';

export interface AuthError {
  code: string;
  message: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw {
        code: error.name,
        message: error.message || 'Sign up failed',
      };
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          wake_goal_time: null,
          reset_duration: 30, // Default 30 minutes
          timezone: 'UTC',
        })
        .select()
        .single();

      if (profileError) {
        throw {
          code: profileError.code,
          message: 'Failed to create user profile',
        };
      }
    }

    return data;
  },

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw {
        code: error.name,
        message: error.message || 'Sign in failed',
      };
    }

    return data;
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw {
        code: error.name,
        message: error.message || 'Sign out failed',
      };
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw {
        code: error.code,
        message: error.message || 'Failed to get user profile',
      };
    }

    return data;
  },

  /**
   * Update user profile settings
   */
  async updateProfile(userId: string, updates: {
    wake_goal_time?: string;
    reset_duration?: number;
    timezone?: string;
  }) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw {
        code: error.code,
        message: error.message || 'Failed to update profile',
      };
    }

    return data;
  },
};
