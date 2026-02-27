# Supabase Database Setup - ACTION REQUIRED

## ⚠️ Critical Blocker: App Cannot Function Without Database

### Current Status
- ✅ Supabase migrations created
- ❌ Cannot authenticate with Supabase CLI (non-interactive environment)
- ❌ No Supabase project created yet
- ❌ App shows "NOT_FOUND" due to missing backend

### Manual Setup Required

#### 1. Create Supabase Project
- Go to: https://supabase.com/dashboard
- Click "New Project"
- Name: `morning-reset`
- Org: `team_cAZIEIjYmnxvfEnJyrSn2Oma`
- Region: Choose closest to users (e.g., `us-east-1`)
- Password: Create secure password
- Wait for project to initialize (~2-3 minutes)

#### 2. Get Database Credentials
- Go to Project Settings → API
- Copy:
  - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
  - **anon key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service role key**: `SUPABASE_SERVICE_ROLE_KEY`

#### 3. Update Environment Variables
- Edit `.env.local` in `/Users/polo/.openclaw/workspace/projects/morning-reset/workspace/morning-reset/.env.local`
- Replace placeholder values with actual credentials

#### 4. Run Database Migrations
- Once project is created, run migrations:
  ```bash
  npx supabase db push
  ```

#### 5. Test App Functionality
- Once database is set up, test the app should work
- The "NOT_FOUND" errors should be resolved

### Alternative: Use Vercel Postgres
If Supabase setup proves difficult, we can use Vercel's built-in Postgres:
- Enable Vercel Postgres in dashboard
- Configure connection strings
- Update database schema accordingly

### Priority: 🚨 CRITICAL
This must be completed before the app can function properly or any validation can begin.

---

**Created:** 2026-02-24
**Status:** 🟡 PENDING MANUAL ACTION