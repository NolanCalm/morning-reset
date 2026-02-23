import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LandingHero() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call - replace with actual submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setMessage({ type: 'success', text: "You're on the list! Check your inbox soon." });
    setEmail('');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with sunrise gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50" />

      {/* Morning mist overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          {/* Animated sunrise icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 rounded-full">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
            Beat Morning Paralysis
          </h1>

          <h2 className="text-xl md:text-2xl text-amber-700 mb-6 max-w-2xl mx-auto">
            A simple 30-minute reset to start your day with clarity and purpose.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              📱 Phone-Free Reset
            </h3>
            <p className="text-gray-600 text-sm">
              Put down your phone and reconnect with yourself before the digital world takes over.
            </p>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              🔥 Build Habits
            </h3>
            <p className="text-gray-600 text-sm">
              Daily streaks and gentle reminders help you build a morning routine that sticks.
            </p>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              ⚡ Quick & Effective
            </h3>
            <p className="text-gray-600 text-sm">
              Just 30 minutes of intentional activity can transform your entire day.
            </p>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              🎯 Focus First
            </h3>
            <p className="text-gray-600 text-sm">
              Start your day aligned with your goals, not your notifications.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-6 px-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-bold text-lg py-6 px-8 rounded-2xl shadow-lg shadow-orange-300 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
            >
              {isSubmitting ? "Signing up..." : "Get Early Access (Free)"}
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4">
            No credit card required. Join thousands building better mornings.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-12">
          <p className="text-md text-gray-600">
            {`Join 1,200+ users who've already started their Morning Reset`}
          </p>
        </div>
      </div>
    </section>
  );
}
