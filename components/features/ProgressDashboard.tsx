'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ProgressDashboardProps {
  weeklyView: Array<{ day: string; date: string; completed: boolean; streakCount: number }>;
  monthlyView: Array<{ day: string; date: string; completed: boolean; streakCount: number }>;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export function ProgressDashboard({
  weeklyView,
  monthlyView,
  currentStreak,
  longestStreak,
  completionRate,
}: ProgressDashboardProps) {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const daysToShow = view === 'weekly' ? weeklyView : monthlyView;
  const hasData = daysToShow.length > 0;

  const getStreakColor = (streakCount: number): string => {
    if (streakCount >= 30) return 'text-purple-600';
    if (streakCount >= 14) return 'text-orange-600';
    if (streakCount >= 7) return 'text-amber-600';
    return 'text-gray-400';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-8 text-gray-600">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No progress data yet. Start your first check-in!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* View Toggle */}
            <div className="flex justify-center space-x-2 mb-6">
              <Button
                variant={view === 'weekly' ? 'default' : 'outline'}
                onClick={() => setView('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={view === 'monthly' ? 'default' : 'outline'}
                onClick={() => setView('monthly')}
              >
                Monthly
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className={`text-3xl font-bold ${getStreakColor(currentStreak)}`}>
                  {currentStreak}
                </p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {longestStreak}
                </p>
                <p className="text-sm text-gray-600">Longest Streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {completionRate}%
                </p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {view === 'weekly' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">This Week</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {daysToShow.map((day) => (
                      <div key={day.date} className="text-center">
                        <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            day.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {day.completed ? <Calendar className="h-6 w-6" /> : day.streakCount || '-'}
                        </div>
                        {day.streakCount >= 7 && (
                          <div className="mt-1">
                            <Award className="h-4 w-4 mx-auto text-amber-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">This Month</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {daysToShow.map((day) => (
                      <div key={day.date} className="text-center">
                        <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            day.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {day.completed ? <Calendar className="h-6 w-6" /> : day.streakCount || '-'}
                        </div>
                        {day.streakCount >= 7 && (
                          <div className="mt-1">
                            <Award className="h-4 w-4 mx-auto text-amber-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
