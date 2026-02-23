'use client';

import { useState } from 'react';
import { Calendar, Clock, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface DailyCheckInProps {
  streak: number;
  longestStreak: number;
  todayCheckIn: { id: string; wake_time: string; date: string } | null;
  onCheckIn: (wakeTime: string) => Promise<void>;
}

export function DailyCheckIn({
  streak,
  longestStreak,
  todayCheckIn,
  onCheckIn,
}: DailyCheckInProps) {
  const [wakeTime, setWakeTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasCheckedInToday = todayCheckIn !== null;

  const handleCheckIn = async () => {
    if (!wakeTime.trim()) {
      alert('Please enter your wake time');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCheckIn(wakeTime);
      setWakeTime('');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Check-in failed:', err);
      setIsSubmitting(false);
      alert(err instanceof Error ? err.message : 'Failed to check in');
    }
  };

  const getStreakColor = (streakCount: number): string => {
    if (streakCount >= 30) return 'text-purple-600';
    if (streakCount >= 14) return 'text-orange-600';
    if (streakCount >= 7) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Today&apos;s Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          {/* Streak Counter */}
          <div className="mb-6">
            <div className="text-6xl font-bold {getStreakColor(streak)}">
              {streak}
            </div>
            <p className="text-sm text-gray-600">
              {streak > 0 ? (
                <span className="text-green-600">day streak! 🎉</span>
              ) : (
                <span className="text-gray-500">Start your streak today</span>
              )}
            </p>
            {streak >= 7 && (
              <div className="mt-2 text-sm text-amber-600 font-medium">
                {streak >= 14 ? 'Month Master! 🏆' : 'Week Warrior! ⚔️'}
              </div>
            )}
          </div>

          {/* Wake Time Input */}
          {!hasCheckedInToday ? (
            <div className="space-y-4">
              <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-2">
                What time did you wake up today?
              </label>
              <input
                type="time"
                id="wakeTime"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-lg"
                placeholder="07:00"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleCheckIn}
                disabled={isSubmitting || !wakeTime.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600"
              >
                {isSubmitting ? 'Checking in...' : 'Complete Today&apos;s Reset'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-y-2 text-green-600">
                <Clock className="h-8 w-8" />
                <div>
                  <p className="text-lg font-medium">Checked in at {todayCheckIn?.wake_time}</p>
                  <p className="text-sm text-gray-600">
                    {hasCheckedInToday && "You're on fire! Keep it up! 🔥"}
                  </p>
                </div>
              </div>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Longest streak: <span className="font-bold text-orange-600">{longestStreak} days</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
