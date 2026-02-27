'use client';

import { MorningLayout } from '@/components/layouts/MorningLayout';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <MorningLayout>
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-8">
            Morning Reset Dashboard
          </h1>

          {/* Streak Card */}
          <div className="mb-8">
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="text-center">
                <p className="text-sm font-medium text-orange-700 mb-2">Current Streak</p>
                <p className="text-6xl font-extrabold font-display text-orange-600">7</p>
                <p className="text-sm text-orange-700 mt-2">days in a row</p>
              </div>
            </Card>
          </div>

          {/* Weekly View */}
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display text-orange-800 mb-4">This Week</h2>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div
                  key={day}
                  className={`p-4 rounded-lg text-center ${
                    index < 5
                      ? 'bg-orange-100 border-2 border-orange-300'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-2">{day}</p>
                  <div
                    className={`w-8 h-8 rounded-full mx-auto ${
                      index < 5 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Current Streak</h3>
              <p className="text-4xl font-bold font-display text-orange-600">7</p>
              <p className="text-sm text-gray-600 mt-2">days</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Longest Streak</h3>
              <p className="text-4xl font-bold font-display text-orange-600">12</p>
              <p className="text-sm text-gray-600 mt-2">days</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Total Days</h3>
              <p className="text-4xl font-bold font-display text-orange-600">42</p>
              <p className="text-sm text-gray-600 mt-2">completed</p>
            </Card>
          </div>

          {/* Monthly View */}
          <div>
            <h2 className="text-xl font-bold font-display text-orange-800 mb-4">This Month</h2>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`aspect-square rounded-md flex items-center justify-center text-sm ${
                      day % 7 < 5 && day < 28
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MorningLayout>
  );
}
