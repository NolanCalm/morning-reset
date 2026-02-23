# API Reference - Service Layer

**Last Updated:** 2026-02-23

Complete API documentation for all service layer methods in Morning Reset.

---

## Table of Contents

1. [Authentication Service](#authentication-service-authservicets)
2. [Streak Service](#streak-service-streakservicets)
3. [Check-in Service](#check-in-service-checkinservicets)
4. [Progress Service](#progress-service-progressservicets)
5. [Error Handling](#error-handling)
6. [Type Definitions](#type-definitions)

---

## Authentication Service (`authService.ts`)

Manages user authentication and profile settings.

### `signUp(email: string, password: string)`

Create a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password (min 6 characters)

**Returns:** `Promise<{ user: User | null; error: AuthError | null }>`

**Example:**
```typescript
import { authService } from '@/lib/services/authService';

const { user, error } = await authService.signUp('user@example.com', 'password123');

if (error) {
  console.error('Sign up failed:', error.message);
} else {
  console.log('User created:', user);
}
```

**Possible Errors:**
- `USER_ALREADY_EXISTS`: Email already registered
- `WEAK_PASSWORD`: Password too short
- `INVALID_EMAIL`: Email format is invalid

---

### `signIn(email: string, password: string)`

Authenticate an existing user.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:** `Promise<{ user: User | null; error: AuthError | null }>`

**Example:**
```typescript
const { user, error } = await authService.signIn('user@example.com', 'password123');

if (error) {
  console.error('Sign in failed:', error.message);
} else {
  console.log('Signed in as:', user.email);
}
```

**Possible Errors:**
- `INVALID_CREDENTIALS`: Email or password is incorrect
- `EMAIL_NOT_VERIFIED`: Email hasn't been verified yet
- `INVALID_EMAIL`: Email format is invalid

---

### `signOut()`

Sign out the current user.

**Parameters:** None

**Returns:** `Promise<{ error: AuthError | null }>`

**Example:**
```typescript
const { error } = await authService.signOut();

if (error) {
  console.error('Sign out failed:', error.message);
} else {
  console.log('Signed out successfully');
  // Redirect to login page
}
```

**Possible Errors:**
- `SESSION_NOT_FOUND`: No active session to sign out
- `NETWORK_ERROR`: Failed to reach Supabase

---

### `getCurrentUser()`

Get the currently authenticated user.

**Parameters:** None

**Returns:** `Promise<User | null>`

**Example:**
```typescript
const user = await authService.getCurrentUser();

if (user) {
  console.log('Current user:', user.email);
} else {
  console.log('No user logged in');
}
```

**Returns `null` if:**
- No active session
- Session expired
- Network error

---

### `updateProfile(userId: string, updates: object)`

Update a user's profile settings.

**Parameters:**
- `userId` (string): User's UUID
- `updates` (object): Profile fields to update:
  - `wake_goal_time` (string, optional): HH:MM format (e.g., "07:00")
  - `reset_duration` (number, optional): Minutes (15, 30, or 45)
  - `timezone` (string, optional): IANA timezone (e.g., "Asia/Taipei")

**Returns:** `Promise<{ error: AuthError | null }>`

**Example:**
```typescript
const { error } = await authService.updateProfile(user.id, {
  wake_goal_time: '07:00',
  reset_duration: 30,
  timezone: 'Asia/Taipei'
});

if (error) {
  console.error('Profile update failed:', error.message);
} else {
  console.log('Profile updated');
}
```

**Possible Errors:**
- `INVALID_USER_ID`: User doesn't exist
- `INVALID_TIME_FORMAT`: wake_goal_time not in HH:MM format
- `INVALID_TIMEZONE`: timezone is not a valid IANA timezone

---

## Streak Service (`streakService.ts`)

Manages streak records and calculates streak metrics.

### `upsert(userId: string, date: string, completed: boolean)`

Create or update a streak record.

**Parameters:**
- `userId` (string): User's UUID
- `date` (string): ISO date format (e.g., "2026-02-23")
- `completed` (boolean): Whether the day was completed

**Returns:** `Promise<Streak>`

**Example:**
```typescript
import { streakService } from '@/lib/services/streakService';

const streak = await streakService.upsert(user.id, '2026-02-23', true);
console.log('Streak updated:', streak);
```

**Behavior:**
- Creates new streak if record doesn't exist
- Updates existing record if it exists
- Automatically recalculates streak count

---

### `getByDate(userId: string, date: string)`

Get a streak record for a specific date.

**Parameters:**
- `userId` (string): User's UUID
- `date` (string): ISO date format (e.g., "2026-02-23")

**Returns:** `Promise<Streak | null>`

**Example:**
```typescript
const streak = await streakService.getByDate(user.id, '2026-02-23');

if (streak) {
  console.log('Streak for 2026-02-23:', streak);
} else {
  console.log('No streak record for this date');
}
```

---

### `getByDateRange(userId: string, startDate: string, endDate: string)`

Get streak records for a date range.

**Parameters:**
- `userId` (string): User's UUID
- `startDate` (string): ISO date format (e.g., "2026-02-01")
- `endDate` (string): ISO date format (e.g., "2026-02-28")

**Returns:** `Promise<Streak[]>`

**Example:**
```typescript
const streaks = await streakService.getByDateRange(
  user.id,
  '2026-02-01',
  '2026-02-28'
);

console.log('February streaks:', streaks);
```

**Returns:** Array of streak records, sorted by date (ascending)

---

### `getSummary(userId: string)`

Get streak summary metrics.

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `Promise<StreakSummary>`

**StreakSummary Interface:**
```typescript
interface StreakSummary {
  currentStreak: number;      // Current streak count
  longestStreak: number;       // Longest streak in history
  completionRate: number;      // Percentage (0-100)
}
```

**Example:**
```typescript
const summary = await streakService.getSummary(user.id);

console.log('Current streak:', summary.currentStreak);
console.log('Longest streak:', summary.longestStreak);
console.log('Completion rate:', summary.completionRate + '%');
```

**Calculation Logic:**
- **currentStreak**: Counts consecutive completed days (forgiving streak)
- **longestStreak**: All-time highest streak
- **completionRate**: (completed days / total days) × 100

---

## Check-in Service (`checkinService.ts`)

Manages daily check-ins and wake time tracking.

### `create(userId: string, wakeTime: string, date: string, resetDuration?: number)`

Create a new check-in record.

**Parameters:**
- `userId` (string): User's UUID
- `wakeTime` (string): HH:MM format (e.g., "07:30")
- `date` (string): ISO date format (e.g., "2026-02-23")
- `resetDuration` (number, optional): Reset duration in minutes (default: 30)

**Returns:** `Promise<CheckIn>`

**Example:**
```typescript
import { checkinService } from '@/lib/services/checkinService';

const checkIn = await checkinService.create(
  user.id,
  '07:30',
  '2026-02-23',
  30  // Optional, defaults to 30
);

console.log('Check-in created:', checkIn);
```

**Behavior:**
- Automatically creates streak record with `completed: true`
- Uses user's default `reset_duration` if not provided
- Validates that check-in doesn't already exist for this date

**Possible Errors:**
- `CHECKIN_EXISTS`: Already checked in for this date
- `INVALID_TIME_FORMAT`: wakeTime not in HH:MM format

---

### `getTodayCheckIn(userId: string, date: string)`

Get today's check-in (if any).

**Parameters:**
- `userId` (string): User's UUID
- `date` (string): ISO date format (e.g., "2026-02-23")

**Returns:** `Promise<CheckIn | null>`

**Example:**
```typescript
const today = new Date().toISOString().split('T')[0]; // "2026-02-23"
const checkIn = await checkinService.getTodayCheckIn(user.id, today);

if (checkIn) {
  console.log('Already checked in at:', checkIn.wake_time);
} else {
  console.log('No check-in for today yet');
}
```

---

### `getByDateRange(userId: string, startDate: string, endDate: string)`

Get check-ins for a date range.

**Parameters:**
- `userId` (string): User's UUID
- `startDate` (string): ISO date format (e.g., "2026-02-01")
- `endDate` (string): ISO date format (e.g., "2026-02-28")

**Returns:** `Promise<CheckIn[]>`

**Example:**
```typescript
const checkIns = await checkinService.getByDateRange(
  user.id,
  '2026-02-01',
  '2026-02-28'
);

console.log('February check-ins:', checkIns);
```

**Returns:** Array of check-in records, sorted by date (ascending)

---

## Progress Service (`progressService.ts`)

Aggregates progress data for dashboard views.

### `getWeeklyView(userId: string)`

Get progress data for the current week (last 7 days).

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `Promise<WeeklyView>`

**WeeklyView Interface:**
```typescript
interface WeeklyView {
  day: string;        // Day name ("Mon", "Tue", etc.)
  date: string;       // ISO date ("2026-02-23")
  completed: boolean;  // Whether completed
  streakCount: number; // Streak count on that day
}
```

**Example:**
```typescript
import { progressService } from '@/lib/services/progressService';

const weeklyView = await progressService.getWeeklyView(user.id);

weeklyView.forEach(day => {
  console.log(`${day.day} (${day.date}): ${day.completed ? '✅' : '❌'}`);
});
```

**Returns:** 7 days of data, ending today or yesterday

---

### `getMonthlyView(userId: string)`

Get progress data for the current month (last 30 days).

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `Promise<MonthlyView>`

**MonthlyView Interface:**
```typescript
interface MonthlyView {
  day: string;        // Day name ("Mon", "Tue", etc.)
  date: string;       // ISO date ("2026-02-23")
  completed: boolean;  // Whether completed
  streakCount: number; // Streak count on that day
}
```

**Example:**
```typescript
const monthlyView = await progressService.getMonthlyView(user.id);

console.log('Monthly progress:', monthlyView);
```

**Returns:** 30 days of data, ending today or yesterday

---

### `getSummary(userId: string)`

Get progress summary metrics (same as `streakService.getSummary`).

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `Promise<StreakSummary>`

**Example:**
```typescript
const summary = await progressService.getSummary(user.id);

console.log('Summary:', summary);
```

**Note:** This is a convenience method that calls `streakService.getSummary()` internally.

---

## Error Handling

All services return errors in a consistent format.

### Auth Error Format

```typescript
interface AuthError {
  code: string;    // Error code (e.g., "INVALID_CREDENTIALS")
  message: string;  // Human-readable error message
}
```

### Common Error Codes

| Code | Description |
|-------|-------------|
| `INVALID_CREDENTIALS` | Email or password is incorrect |
| `USER_ALREADY_EXISTS` | Email already registered |
| `WEAK_PASSWORD` | Password is too short |
| `INVALID_EMAIL` | Email format is invalid |
| `EMAIL_NOT_VERIFIED` | Email hasn't been verified yet |
| `SESSION_NOT_FOUND` | No active session |
| `NETWORK_ERROR` | Failed to reach Supabase |
| `CHECKIN_EXISTS` | Already checked in for this date |
| `INVALID_TIME_FORMAT` | Time not in HH:MM format |
| `INVALID_TIMEZONE` | Timezone is not valid |

### Error Handling Pattern

```typescript
const { user, error } = await authService.signIn(email, password);

if (error) {
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      alert('Incorrect email or password');
      break;
    case 'EMAIL_NOT_VERIFIED':
      alert('Please verify your email first');
      break;
    default:
      alert('Sign in failed: ' + error.message);
  }
} else {
  // Success: redirect to dashboard
}
```

---

## Type Definitions

### User

```typescript
interface User {
  id: string;              // UUID
  email: string;           // User's email
  email_confirmed_at?: string | null;  // ISO timestamp
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

### Streak

```typescript
interface Streak {
  id: string;              // UUID
  user_id: string;        // User's UUID
  date: string;           // ISO date ("2026-02-23")
  completed: boolean;     // Whether completed
  streak_count: number;   // Streak count on this date
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

### CheckIn

```typescript
interface CheckIn {
  id: string;              // UUID
  user_id: string;        // User's UUID
  wake_time: string;      // HH:MM format
  date: string;           // ISO date ("2026-02-23")
  reset_duration: number;  // Minutes (15, 30, or 45)
  created_at: string;      // ISO timestamp
}
```

### UserProfile

```typescript
interface UserProfile {
  id: string;              // UUID
  user_id: string;        // User's UUID
  wake_goal_time?: string; // HH:MM format
  reset_duration?: number;  // Minutes (15, 30, or 45)
  timezone?: string;       // IANA timezone
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

---

## Usage Patterns

### Typical Check-in Flow

```typescript
// 1. Check if already checked in today
const today = new Date().toISOString().split('T')[0];
const existingCheckIn = await checkinService.getTodayCheckIn(user.id, today);

if (existingCheckIn) {
  alert('You already checked in today!');
  return;
}

// 2. Create new check-in
const checkIn = await checkinService.create(user.id, '07:30', today, 30);

// 3. Update streak
const streak = await streakService.upsert(user.id, today, true);

// 4. Show success message
alert(`Checked in! Streak: ${streak.streak_count} days 🎉`);
```

### Loading Progress Data

```typescript
// 1. Load weekly view
const weeklyView = await progressService.getWeeklyView(user.id);

// 2. Load streak summary
const summary = await progressService.getSummary(user.id);

// 3. Display in dashboard
console.log('Weekly progress:', weeklyView);
console.log('Summary:', summary);
```

---

**Last Updated:** 2026-02-23

For questions or issues, consult the code in `lib/services/` or submit an issue on GitHub.
