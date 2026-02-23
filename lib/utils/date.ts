/**
 * Date Utilities
 * Date formatting and manipulation functions
 */

/**
 * Format a date string to a localized format
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "Feb 24")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to include year
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "Feb 24, 2026")
 */
export function formatDateWithYear(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @param timezone - User's timezone (e.g., "Asia/Taipei")
 * @returns Today's date in user's timezone
 */
export function getTodayDate(timezone: string = 'UTC'): string {
  const now = new Date();
  return getUserLocalDate(now, timezone);
}

/**
 * Get the local date for a given Date object in a specific timezone
 * @param date - Date object
 * @param timezone - User's timezone (e.g., "Asia/Taipei")
 * @returns Date string in YYYY-MM-DD format
 */
export function getUserLocalDate(date: Date, timezone: string = 'UTC'): string {
  return date.toLocaleDateString('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Get dates for the last N days
 * @param days - Number of days to go back
 * @param timezone - User's timezone (e.g., "Asia/Taipei")
 * @returns Array of date strings in YYYY-MM-DD format
 */
export function getPastDates(days: number, timezone: string = 'UTC'): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(getUserLocalDate(date, timezone));
  }

  return dates;
}

/**
 * Get dates for the last 7 days (week)
 * @param timezone - User's timezone
 * @returns Array of 7 date strings
 */
export function getWeekDates(timezone: string = 'UTC'): string[] {
  return getPastDates(7, timezone);
}

/**
 * Get dates for the current month
 * @param timezone - User's timezone
 * @returns Array of date strings for the month
 */
export function getMonthDates(timezone: string = 'UTC'): string[] {
  const dates: string[] = [];
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    dates.push(getUserLocalDate(date, timezone));
  }

  return dates;
}

/**
 * Check if two dates are the same day (in the same timezone)
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns True if dates are the same day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Check if a date is today (in user's timezone)
 * @param date - Date string to check
 * @param timezone - User's timezone
 * @returns True if the date is today
 */
export function isToday(date: string, timezone: string = 'UTC'): boolean {
  return isSameDay(date, getTodayDate(timezone));
}

/**
 * Get the weekday name for a date
 * @param date - Date string
 * @param timezone - User's timezone
 * @returns Weekday name (e.g., "Mon", "Tue")
 */
export function getWeekdayName(date: string, timezone: string = 'UTC'): string {
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
  });
}

/**
 * Calculate the difference in days between two dates
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns Number of days difference (positive if date2 is later)
 */
export function getDaysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
