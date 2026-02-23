/**
 * Timezone Utilities
 * Functions for handling timezone conversions and user-local dates
 */

/**
 * Get the user's current timezone
 * Uses the browser's timezone detection or defaults to UTC
 * @returns Timezone string (e.g., "Asia/Taipei")
 */
export function getUserTimezone(): string {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return 'UTC';
}

/**
 * Convert a UTC date to user's local timezone
 * @param utcDate - UTC date string or Date object
 * @param timezone - Target timezone (defaults to user's timezone)
 * @returns Date in target timezone
 */
export function convertToTimezone(
  utcDate: Date | string,
  timezone: string = getUserTimezone()
): Date {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;

  // Create a new date that represents the same moment in the target timezone
  const userDateStr = date.toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const [month, day, year, hour, minute, second] = userDateStr
    .match(/\d+/g)!
    .map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * Get the current date in user's timezone
 * @param timezone - User's timezone
 * @returns Date string in YYYY-MM-DD format
 */
export function getCurrentLocalDate(timezone: string = getUserTimezone()): string {
  const now = new Date();
  return now.toLocaleDateString('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Get the current time in user's timezone
 * @param timezone - User's timezone
 * @returns Time string in HH:MM format
 */
export function getCurrentLocalTime(timezone: string = getUserTimezone()): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Get common timezones for user selection
 * @returns Array of timezone options
 */
export function getCommonTimezones(): Array<{ value: string; label: string; offset: string }> {
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (US)', offset: 'GMT-5' },
    { value: 'America/Chicago', label: 'Central Time (US)', offset: 'GMT-6' },
    { value: 'America/Denver', label: 'Mountain Time (US)', offset: 'GMT-7' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)', offset: 'GMT-8' },
    { value: 'Europe/London', label: 'London', offset: 'GMT+0' },
    { value: 'Europe/Paris', label: 'Paris', offset: 'GMT+1' },
    { value: 'Europe/Berlin', label: 'Berlin', offset: 'GMT+1' },
    { value: 'Asia/Singapore', label: 'Singapore', offset: 'GMT+8' },
    { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'GMT+8' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'GMT+8' },
    { value: 'Asia/Taipei', label: 'Taipei', offset: 'GMT+8' },
    { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'GMT+9' },
    { value: 'Australia/Sydney', label: 'Sydney', offset: 'GMT+11' },
    { value: 'UTC', label: 'UTC', offset: 'GMT+0' },
  ];

  return timezones;
}

/**
 * Validate a timezone string
 * @param timezone - Timezone string to validate
 * @returns True if timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Format a wake time (HH:MM) for display
 * @param time - Time string in HH:MM format
 * @param timezone - User's timezone
 * @returns Formatted time string (e.g., "7:00 AM")
 */
export function formatWakeTime(time: string, timezone: string = getUserTimezone()): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
