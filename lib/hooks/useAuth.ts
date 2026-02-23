/**
 * useAuth Hook
 * Authentication state management
 */

'use client';

import { useState, useEffect } from 'react';
import { authService, type AuthError } from '@/lib/services/authService';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await authService.getCurrentUser();
        setState({ user, loading: false, error: null });
      } catch (err) {
        setState({
          user: null,
          loading: false,
          error: {
            code: 'LOAD_ERROR',
            message: err instanceof Error ? err.message : 'Failed to load user',
          },
        });
      }
    }

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState({ user: null, loading: true, error: null });

    try {
      const data = await authService.signIn(email, password);
      setState({ user: data.user, loading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: {
          code: 'SIGN_IN_ERROR',
          message: err instanceof Error ? err.message : 'Sign in failed',
        },
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    setState({ user: null, loading: true, error: null });

    try {
      const data = await authService.signUp(email, password);
      setState({ user: data.user, loading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: {
          code: 'SIGN_UP_ERROR',
          message: err instanceof Error ? err.message : 'Sign up failed',
        },
      });
    }
  };

  const signOut = async () => {
    setState({ user: state.user, loading: true, error: null });

    try {
      await authService.signOut();
      setState({ user: null, loading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: {
          code: 'SIGN_OUT_ERROR',
          message: err instanceof Error ? err.message : 'Sign out failed',
        },
      });
    }
  };

  const updateProfile = async (updates: {
    wake_goal_time?: string;
    reset_duration?: number;
    timezone?: string;
  }) => {
    if (!state.user) return;

    setState({ user: state.user, loading: true, error: null });

    try {
      await authService.updateProfile(state.user.id, updates);
      setState({ user: state.user, loading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: {
          code: 'UPDATE_PROFILE_ERROR',
          message: err instanceof Error ? err.message : 'Failed to update profile',
        },
      });
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
