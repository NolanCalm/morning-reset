'use client';

import { useState, useEffect } from 'react';
import { MorningLayout } from '@/components/layouts/MorningLayout';
import { DailyCheckIn } from '@/components/features/DailyCheckIn';
import { ProgressDashboard } from '@/components/features/ProgressDashboard';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStreak } from '@/lib/hooks/useStreak';
import { useCheckIn } from '@/lib/hooks/useCheckIn';
import { useProgress } from '@/lib/hooks/useProgress';

export default function DashboardPage() {
  const auth = useAuth();
  const { user } = auth;

  const today = new Date().toISOString().split('T')[0];
  const streak = useStreak(user?.id || '');
  const checkIn = useCheckIn(user?.id || '', today);
  const progressWeekly = useProgress(user?.id || '', 'weekly');
  const progressMonthly = useProgress(user?.id || '', 'monthly');

  const isLoading = auth.loading || streak.loading || checkIn.loading || progressWeekly.loading;

  return (
    <MorningLayout>
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-200 border-t-transparent" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-gray-600 mt-2">Loading your morning reset...</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-8">
                Morning Reset Dashboard
              </h1>

              <div className="mb-12">
                <DailyCheckIn
                  streak={streak.currentStreak}
                  longestStreak={streak.longestStreak}
                  todayCheckIn={checkIn.todayCheckIn}
                  onCheckIn={checkIn.createCheckIn}
                />
              </div>

              <div>
                <ProgressDashboard
                  weeklyView={progressWeekly.weeklyView}
                  monthlyView={progressMonthly.monthlyView}
                  currentStreak={progressWeekly.currentStreak}
                  longestStreak={progressWeekly.longestStreak}
                  completionRate={progressWeekly.completionRate}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </MorningLayout>
  );
}
