# Admin Guide - Morning Reset

**Last Updated:** 2026-02-23

This guide is for developers and administrators managing Morning Reset in production.

---

## Table of Contents

1. [Supabase Dashboard Access](#supabase-dashboard-access)
2. [Running Migrations](#running-migrations)
3. [Managing Users](#managing-users)
4. [Monitoring Usage](#monitoring-usage)
5. [Debugging Common Issues](#debugging-common-issues)
6. [Backup and Recovery](#backup-and-recovery)
7. [Scaling Considerations](#scaling-considerations)
8. [Security Best Practices](#security-best-practices)

---

## Supabase Dashboard Access

### Accessing the Dashboard

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your Supabase account
3. Select your project (e.g., "morning-reset")

### Key Dashboard Sections

#### Table Editor

View and edit database tables:
- **Users**: Managed by Supabase Auth (read-only)
- **User Profiles**: User settings (wake goal, reset duration, timezone)
- **Streaks**: Daily streak records
- **Checkins**: Daily check-in records

#### SQL Editor

Run custom SQL queries:
- Useful for ad-hoc data analysis
- Can be used for manual data fixes (use carefully!)
- See `supabase/migrations/001_initial_schema.sql` for table structure

#### Authentication

Manage user authentication:
- View all users
- Reset user passwords (via email reset link)
- Disable user accounts
- View authentication logs

#### Storage (Not Currently Used)

Future for:
- User avatar uploads
- Profile images
- Exported data files

---

## Running Migrations

### Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Manual Migration via Dashboard

1. Open the **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

### Creating New Migrations

When modifying the database schema:

```bash
# Create a new migration
supabase migration new migration_description

# Edit the migration file
nano supabase/migrations/002_new_feature.sql

# Push the migration
supabase db push
```

### Migration Best Practices

- **Always test locally first** (use Supabase local development)
- **Write descriptive migration names** (e.g., `002_add_avatar_column.sql`)
- **Include rollback script** (in comments)
- **Never modify existing migrations** (create new ones instead)

---

## Managing Users

### Viewing Users

1. Go to **Authentication → Users** in Supabase Dashboard
2. Filter by email, created date, or last sign-in

### Resetting User Password

Supabase doesn't store passwords, so you can't reset them directly. Instead:

1. Trigger a password reset email via API:
   ```typescript
   const { error } = await supabase.auth.resetPasswordForEmail(userEmail);
   ```

2. User receives an email with a reset link
3. User sets a new password

### Disabling a User

If a user requests account deletion or violates terms:

1. Go to **Authentication → Users**
2. Find the user
3. Click the "Delete" button
4. **Important:** Also delete their data in `user_profiles`, `streaks`, `checkins` tables (RLS won't delete these automatically)

```sql
-- Delete user data (run in SQL Editor)
DELETE FROM checkins WHERE user_id = 'user-uuid';
DELETE FROM streaks WHERE user_id = 'user-uuid';
DELETE FROM user_profiles WHERE user_id = 'user-uuid';
```

### User Data Privacy

Users can request their data under GDPR. Steps:

1. Export their data:
   ```sql
   SELECT * FROM user_profiles WHERE user_id = 'user-uuid';
   SELECT * FROM streaks WHERE user_id = 'user-uuid' ORDER BY date DESC;
   SELECT * FROM checkins WHERE user_id = 'user-uuid' ORDER BY date DESC;
   ```

2. Send the export to the user
3. Delete their account (see "Disabling a User" above)

---

## Monitoring Usage

### Supabase Metrics

Go to **Dashboard → Metrics** in Supabase Dashboard:

**Key Metrics to Watch:**

- **Database Size**: Free tier limit is 500MB
- **API Requests**: Free tier limit is 50,000/month
- **Active Users**: Real-time user count
- **Request Latency**: Average API response time (should be <200ms)

### Vercel Analytics

If deployed on Vercel:

1. Go to **vercel.com/dashboard**
2. Select your project
3. Click **Analytics**

**Key Metrics:**

- **Page Views**: Unique and total views
- **Unique Visitors**: User count
- **Top Pages**: Which pages are most visited
- **Bounce Rate**: % of users who leave immediately
- **Geographic Distribution**: Where users are located

### Custom Queries for Insights

Run these in the **SQL Editor** to track user behavior:

#### Daily Check-in Counts

```sql
SELECT
  DATE(date) as check_in_date,
  COUNT(*) as check_in_count
FROM checkins
GROUP BY DATE(date)
ORDER BY check_in_date DESC
LIMIT 30;
```

#### User Retention (Week over Week)

```sql
WITH weeks AS (
  SELECT
    user_id,
    DATE_TRUNC('week', date) as week,
    COUNT(*) as check_ins
  FROM checkins
  GROUP BY user_id, week
)
SELECT
  week,
  COUNT(DISTINCT user_id) as users,
  AVG(check_ins) as avg_check_ins_per_user
FROM weeks
GROUP BY week
ORDER BY week DESC
LIMIT 12;
```

#### Most Common Wake Times

```sql
SELECT
  wake_time,
  COUNT(*) as user_count
FROM checkins
WHERE wake_time IS NOT NULL
GROUP BY wake_time
ORDER BY user_count DESC
LIMIT 10;
```

---

## Debugging Common Issues

### Issue: User Can't Sign In

**Symptoms:**
- "Invalid login credentials" error
- User knows password is correct

**Causes:**
1. User hasn't verified email
2. Account disabled by admin
3. Database connection issue

**Solutions:**

1. Check if email is verified:
   ```sql
   SELECT email, email_confirmed_at FROM auth.users WHERE email = 'user@example.com';
   ```

2. If not verified, send verification email:
   ```typescript
   const { error } = await supabase.auth.resend({ type: 'signup', email: userEmail });
   ```

3. Check Supabase status: [status.supabase.com](https://status.supabase.com)

---

### Issue: Streak Not Updating

**Symptoms:**
- User checks in, but streak count doesn't increment
- Streak shows 0 despite multiple check-ins

**Causes:**
1. `streakService` calculation bug
2. Timezone mismatch
3. Data not saved to database

**Solutions:**

1. Verify check-in was saved:
   ```sql
   SELECT * FROM checkins WHERE user_id = 'user-uuid' AND date = '2026-02-23';
   ```

2. Check streak calculation logic in `streakService.ts`
3. Verify timezone settings in `user_profiles`

---

### Issue: Data Not Persisting

**Symptoms:**
- User checks in, reloads page, data is gone
- Settings don't save

**Causes:**
1. Client-side state only (not saved to database)
2. API call failing silently
3. RLS policies blocking writes

**Solutions:**

1. Check browser console for errors
2. Verify API calls complete:
   ```typescript
   // Add error logging
   const { data, error } = await supabase.from('checkins').insert(...);
   if (error) console.error('Check-in failed:', error);
   ```
3. Review RLS policies in `supabase/migrations/001_initial_schema.sql`

---

### Issue: Slow Performance

**Symptoms:**
- Dashboard takes >3 seconds to load
- API latency >500ms

**Causes:**
1. Missing database indexes
2. Too many queries (N+1 problem)
3. Large result sets

**Solutions:**

1. Check indexes:
   ```sql
   SELECT indexname, tablename FROM pg_indexes WHERE tablename IN ('streaks', 'checkins');
   ```

2. Add indexes if missing (should exist in migration):
   ```sql
   CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON streaks(user_id, date);
   CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date);
   ```

3. Optimize queries (use `select()` with specific columns, not `select('*')`)

---

## Backup and Recovery

### Supabase Automated Backups

Supabase automatically backs up your database:
- **Free tier**: 7 days retention
- **Pro tier**: 30 days retention

View backups in **Dashboard → Database → Backups**.

### Manual Backups

For additional safety:

```bash
# Export database schema
pg_dump -h db.project-ref.supabase.co -U postgres -d postgres > backup.sql

# Export data
pg_dump -h db.project-ref.supabase.co -U postgres -d postgres --data-only > data-backup.sql
```

### Recovery from Backup

1. Go to **Dashboard → Database → Backups**
2. Select the backup to restore
3. Click "Restore"
4. **Warning:** This overwrites current data!

### Disaster Recovery Plan

If Supabase goes down entirely:

1. **User notification**: Post status update on website/Twitter
2. **Failover**: Switch to read-only mode (disable check-ins)
3. **Monitor**: Watch Supabase status page
4. **Recover**: Restore from latest backup when Supabase is back

---

## Scaling Considerations

### Free Tier Limits (Current)

- **Database**: 500MB
- **API Requests**: 50,000/month
- **Auth Users**: 50,000
- **Bandwidth**: 1GB

### When to Upgrade

Upgrade to Supabase Pro when:

- **Users > 1000**: Free tier may hit API limits
- **Database > 400MB**: Near storage limit
- **Performance issues**: Free tier has limited resources

### Cost Estimates (Supabase Pro)

- **$25/month**: 1GB database, 100k API requests
- **$50/month**: 8GB database, 500k API requests
- **$100/month**: 20GB database, 1M API requests

### Caching Strategy (Future)

For high-traffic scenarios:

1. **React Query**: Client-side caching (5-minute stale time)
2. **Redis**: Server-side caching (for aggregate queries)
3. **CDN**: Static asset caching (Vercel provides this)

---

## Security Best Practices

### Environment Variables

Never commit secrets to git:
- `.env.local` is in `.gitignore`
- Use different keys for dev/staging/production

### RLS Policies

Our migration includes RLS policies to ensure:
- Users can only read their own data
- Users can only write their own data
- Admins can read all data (for debugging)

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Rate Limiting

Supabase doesn't provide rate limiting by default. Implement:

1. **Client-side**: Debounce check-in attempts
2. **API layer**: Use Supabase Edge Functions for custom rate limiting
3. **Vercel**: Enable rate limiting (Vercel provides this)

### Input Validation

Always validate user input:

```typescript
// Bad: Directly pass user input
const { data } = await supabase.from('checkins').insert({
  wake_time: userInput  // Could be malicious!
});

// Good: Validate first
const validatedTime = validateWakeTime(userInput);
const { data } = await supabase.from('checkins').insert({
  wake_time: validatedTime
});
```

---

## Support and Escalation

### Supabase Support

- **Email**: support@supabase.com
- **Discord**: discord.supabase.com
- **Twitter**: [@supabase](https://twitter.com/supabase)

### Emergency Contacts

If you're locked out of the Supabase dashboard:
- Contact Supabase support immediately
- Have your project reference ready

### On-Call Rotation (Future)

For production deployments, set up:
- PagerDuty or similar tool
- Weekly on-call rotation
- Escalation path for critical issues

---

**Last Updated:** 2026-02-23

For questions or issues, contact the development team or submit an issue on GitHub.
