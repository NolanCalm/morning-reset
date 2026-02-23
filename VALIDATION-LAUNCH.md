# Morning Reset - Validation Launch Plan

**Status:** 🟢 READY TO LAUNCH
**Date:** 2026-02-23
**Est. Time to Deploy:** 30 minutes

---

## Quick Start: 5-Step Launch Process

### Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Configure:
   - **Name:** `morning-reset`
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to Taiwan (e.g., Singapore)
4. Wait for project to initialize (1-2 minutes)
5. Copy these credentials:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon public key:** From Project Settings → API

### Step 2: Run Database Migration (2 minutes)

1. In Supabase Dashboard, open **SQL Editor**
2. Click **"New Query"**
3. Open this file locally: `supabase/migrations/001_initial_schema.sql`
4. Copy the SQL and paste into the SQL Editor
5. Click **"Run"**
6. Verify tables created:
   - `users`
   - `user_profiles`
   - `streaks`
   - `checkins`

### Step 3: Configure Environment Variables (2 minutes)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Test locally:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and verify it loads.

### Step 4: Deploy to Vercel (5 minutes)

1. Push code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "feat: morning reset validation release v1.0"
   git push
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `workspace/morning-reset`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → (paste your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → (paste your anon key)
6. Click **"Deploy"**
7. Wait for deployment (~2 minutes)
8. Test the live URL (e.g., `https://morning-reset.vercel.app`)

### Step 5: Announce to Reddit (10 minutes)

1. Go to r/productivity and/or r/getdisciplined
2. Post title:
   ```
   [Feedback Needed] I built a tool to stop morning paralysis - try it out?
   ```

3. Post body:
   ```markdown
   TL;DR: I built a free tool to help with morning paralysis.
   Sign up here: https://morning-reset.vercel.app

   ## The Problem
   30% of posts in productivity communities are about morning paralysis:
   - "I keep telling myself 'just 15 more minutes' but I never do"
   - "My brain can not tell the difference between work and rest"

   ## My Solution
   Morning Reset helps you build a consistent wake-up routine with:
   - Daily check-ins (track your wake time)
   - Forgiving streak system (doesn't reset on missed days!)
   - Weekly/monthly progress views
   - Simple, no-nonsense design

   ## How It Works
   1. Sign up (email + password)
   2. Check in daily (enter your wake time)
   3. See your progress over time

   **Key feature:** Streaks don't reset to 0 if you miss a day. They continue as long as you're checking in within the current streak's timeframe. This reduces anxiety and keeps you motivated.

   ## Looking for Feedback
   Does this help with your morning paralysis? Any features you'd add?

   Goal: 30 beta testers in 7 days. Sign up and let me know what you think!

   Note: Free to use, no credit card required. Data is encrypted and private.
   ```

4. Monitor comments and respond to feedback

---

## Validation Dashboard (What to Track)

### Daily Metrics (Check every morning)

1. **Signups:** Total new users
   - Check Supabase Dashboard → Authentication → Users
   - Count: `Total Users`

2. **Active Users:** Users who checked in yesterday
   - Query in SQL Editor:
     ```sql
     SELECT COUNT(DISTINCT user_id) FROM checkins WHERE date >= CURRENT_DATE - INTERVAL '1 day';
     ```

3. **Retention:** Users who checked in yesterday AND today
   - Query in SQL Editor:
     ```sql
     WITH yesterday AS (
       SELECT DISTINCT user_id FROM checkins WHERE date >= CURRENT_DATE - INTERVAL '1 day'
     ),
     today AS (
       SELECT DISTINCT user_id FROM checkins WHERE date >= CURRENT_DATE
     )
     SELECT COUNT(*) FROM yesterday y JOIN today t ON y.user_id = t.user_id;
     ```

4. **Completion Rate:** % of users who checked in today
   - Query in SQL Editor:
     ```sql
     WITH total_users AS (
       SELECT COUNT(DISTINCT user_id) AS count FROM checkins
     ),
     today_users AS (
       SELECT COUNT(DISTINCT user_id) AS count FROM checkins WHERE date >= CURRENT_DATE
     )
     SELECT ROUND((today_users.count * 100.0 / total_users.count)::numeric, 2) AS completion_rate
     FROM total_users, today_users;
     ```

5. **Reddit Engagement:** Upvotes and comments on your post

### Success Criteria (Day 7 Review)

**GO Signals (Continue to v1.1):**
- ✅ 30+ signups
- ✅ 2+ positive testimonials
- ✅ Reddit post ≥15 upvotes
- ✅ User feedback: "This helped me get out of bed"

**STOP Signals (Kill Project):**
- ❌ <15 signups
- ❌ Reddit post <5 upvotes
- ❌ User feedback: "I don't use my phone in morning anyway"
- ❌ Negative feedback: "Too complicated"

---

## Day-by-Day Plan

### Day 0: Launch Day
- [x] Create Supabase project
- [x] Run database migration
- [x] Configure environment variables
- [x] Deploy to Vercel
- [x] Post to Reddit
- [x] Respond to initial comments

### Day 1: Monitor and Iterate
- [x] Check morning metrics
- [x] Respond to Reddit comments
- [x] Fix any critical bugs
- [ ] Share with friends/communities

### Day 2-3: Observe
- [x] Check daily metrics
- [x] Respond to user feedback
- [ ] Send reminder to users (if low check-in rate)

### Day 4-5: Iterate
- [x] Check daily metrics
- [ ] Release hotfixes (if needed)
- [ ] Request testimonials from active users

### Day 6: Final Push
- [x] Check daily metrics
- [ ] Post follow-up on Reddit ("Update: Week 1 results")
- [ ] Share with additional communities

### Day 7: Retrospective
- [x] Compile final metrics
- [x] Gather testimonials
- [x] Make GO or STOP decision

---

## Common Issues & Fixes

### Issue: Sign-up fails with "Invalid email"
**Fix:** Check email format in user input validation

### Issue: Streak not updating
**Fix:** Check timezone in user_profiles table (should match user's timezone)

### Issue: Page is blank after deployment
**Fix:** Check Vercel environment variables are set correctly

### Issue: Database connection fails
**Fix:** Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

---

## Team Coordination (When Gateway Fixed)

Once the gateway bug is fixed, I'll spawn these agents:

| Agent | Role | Daily Tasks |
|-------|------|-------------|
| **Handler** | Orchestrator | Track metrics, alert on GO/STOP signals |
| **Ghost** | Discovery | Analyze user behavior patterns |
| **Blade** | Build | Fix bugs, monitor performance |
| **Quill** | Content | Draft follow-up posts, gather testimonials |
| **Oracle** | Research Ops | Consolidate findings, retrospective report |

**Current Status:** Manual tracking until gateway is fixed

---

## Emergency Contacts

If something goes wrong:
1. **Supabase Support:** support@supabase.com
2. **Vercel Support:** vercel.com/support
3. **Rollback:** Re-deploy previous commit on Vercel

---

## Ready to Launch?

**Prerequisites Checklist:**
- [ ] GitHub repository created and pushed
- [ ] Supabase account created (free tier)
- [ ] Vercel account created (free tier)
- [ ] Reddit account (r/productivity, r/getdisciplined)

**Estimated Time:** 30 minutes
**Risk Level:** Low (free tiers, rollback available)

---

**Let's validate Morning Reset!** 🚀

*Last updated: 2026-02-23*
