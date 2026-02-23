/**
 * Format Utilities
 * Text and number formatting helpers
 */

/**
 * Format a number with commas for thousands
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a percentage
 * @param value - Value between 0 and 1
 * @returns Percentage string (e.g., "75%")
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Format duration in minutes to human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "30 min", "1h 30m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format streak count with appropriate suffix
 * @param count - Streak count
 * @returns Formatted streak string (e.g., "5 days", "1 day")
 */
export function formatStreakCount(count: number): string {
  return count === 1 ? '1 day' : `${count} days`;
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default: "...")
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Format a relative time string
 * @param date - Date string
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  }

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return past.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a list of items as a sentence
 * @param items - Array of items to format
 * @param maxItems - Maximum items to display
 * @returns Formatted string (e.g., "a, b, and c")
 */
export function formatList(items: string[], maxItems: number = 3): string {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return items.join(' and ');
  }

  const displayedItems = items.slice(0, maxItems);
  const remaining = items.length - maxItems;

  if (remaining > 0) {
    return `${displayedItems.join(', ')}, and ${remaining} more`;
  }

  const last = displayedItems.pop();
  return `${displayedItems.join(', ')}, and ${last}`;
}
