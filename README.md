# Morning Reset

> Beat morning paralysis with a simple 30-minute reset routine.

**Morning Reset** is a habit-forming tool designed to help remote workers, students, and anyone struggling with morning paralysis build a consistent wake-up routine.

---

## The Problem

30% of Reddit posts in r/productivity and related communities express frustration with:

- "I keep telling myself 'just 15 more minutes' but I never do"
- "I reach for my phone because I like 30 minutes in bed before getting up"
- "My brain can not tell the difference between work and rest"
- "Things to do in morning other than brain rot"

**Morning paralysis** is real—and it kills productivity before the day even starts.

---

## The Solution

Morning Reset helps you:

1. **Check in daily** - Log your wake time to build consistency
2. **Track streaks** - Visual progress that doesn't punish missed days (forgiving streak system)
3. **View progress** - Weekly/monthly views of your morning routine
4. **Set goals** - Customize your wake goal, reset duration, and timezone

**Key Feature: Forgiving Streak Logic**

Unlike other habit trackers, Morning Reset doesn't reset your streak to 0 if you miss a day. Your current streak count is maintained as long as you complete streaks within the current streak's timeframe. This reduces anxiety and keeps you motivated.

---

## Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org) + [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Database & Auth:** [Supabase](https://supabase.com)
- **Hosting:** [Vercel](https://vercel.com)

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (free tier)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd morning-reset/workspace/morning-reset
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)
   - Copy your project URL and anon key
   - Run the migrations in `supabase/migrations/001_initial_schema.sql`

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** (automatic on git push)

### Deploy Supabase

1. **Create a Supabase project** (or use existing local project)
2. **Run migrations** via Supabase CLI:
   ```bash
   npx supabase db push
   ```
3. **Enable Row Level Security (RLS)** - defined in migration file

---

## Project Structure

```
morning-reset/
├── app/                          # Next.js app directory
│   ├── dashboard/                # Dashboard page
│   ├── login/                    # Login page (to be implemented)
│   ├── signup/                   # Signup page (to be implemented)
│   └── page.tsx                 # Landing page
├── components/
│   ├── features/                 # Feature components
│   │   ├── DailyCheckIn.tsx
│   │   └── ProgressDashboard.tsx
│   ├── layouts/                  # Layout components
│   │   └── MorningLayout.tsx
│   └── ui/                      # UI components (shadcn/ui)
├── lib/
│   ├── services/                 # Service layer
│   │   ├── authService.ts
│   │   ├── checkinService.ts
│   │   ├── progressService.ts
│   │   └── streakService.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCheckIn.ts
│   │   ├── useProgress.ts
│   │   └── useStreak.ts
│   └── supabase/                # Supabase client
│       └── client.ts
├── supabase/
│   └── migrations/               # Database migrations
│       └── 001_initial_schema.sql
└── docs/                        # Documentation
    ├── USER-GUIDE.md
    ├── ADMIN-GUIDE.md
    └── API-REFERENCE.md
```

---

## Documentation

- **[User Guide](./docs/USER-GUIDE.md)** - How to use the app
- **[Admin Guide](./docs/ADMIN-GUIDE.md)** - How to manage and maintain
- **[API Reference](./docs/API-REFERENCE.md)** - Service layer documentation
- **[Implementation Guide](./IMPLEMENTATION.md)** - Build instructions
- **[Architecture](./ARCHITECTURE.md)** - System design
- **[Design System](./DESIGN-SYSTEM.md)** - Component library
- **[UX Principles](./UX-PRINCIPLES.md)** - User psychology and guidelines

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the code style (TypeScript, Prettier)
   - Add tests if applicable
   - Update documentation
4. **Commit and push**
   ```bash
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```
5. **Open a pull request**

### Code Style

- Use TypeScript strict mode
- Follow Prettier formatting
- Write descriptive commit messages (Conventional Commits)
- Document new functions and components

---

## License

MIT License - see LICENSE file for details

---

## Roadmap

- [ ] Auth pages (login, signup, password reset)
- [ ] Email notifications (daily reminders)
- [ ] Reset prompts (stretch, water, light exposure)
- [ ] Achievement badges (7-day, 14-day, 30-day milestones)
- [ ] Dark mode
- [ ] Mobile app (iOS/Android)
- [ ] Chrome extension (native blocking capabilities)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** support@morningreset.app (to be set up)

---

## Credits

Built by [Polo](https://github.com/polo) with ❤️ for better mornings.

Inspired by real struggles in the productivity community. See the [research](../discovery-productivity-2026-02-18/) that informed this project.
