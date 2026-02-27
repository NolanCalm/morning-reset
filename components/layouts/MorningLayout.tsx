import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MorningLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MorningLayout({ children, className = "" }: MorningLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 ${className}`}>
      {/* Navigation */}
      <nav className="p-4 bg-white/30 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 rounded-full" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Morning Reset
            </h1>
          </Link>

          <div className="flex space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-amber-700 hover:text-amber-800">
                Dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="text-amber-700 hover:text-amber-800">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 text-sm">
        <p>2026 Morning Reset</p>
      </footer>
    </div>
  );
}
