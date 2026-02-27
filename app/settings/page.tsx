"use client";

import { MorningLayout } from '@/components/layouts/MorningLayout';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <MorningLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-700 mb-8">
          Settings
        </h1>

        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <p className="text-gray-600">
            Settings coming soon. For now, go back to the homepage to start your 30-minute morning reset.
          </p>
        </Card>

        <div className="mt-8">
          <a 
            href="/" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 h-10 px-4 py-2 text-amber-700 hover:text-amber-800"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </MorningLayout>
  );
}
