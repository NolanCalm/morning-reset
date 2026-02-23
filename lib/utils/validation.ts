/**
 * Validation Utilities
 * Form validation and input sanitization helpers
 */

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password string to validate
 * @returns Object with validity status and error message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters',
    };
  }

  if (password.length > 72) {
    return {
      isValid: false,
      error: 'Password must be less than 72 characters',
    };
  }

  return { isValid: true };
}

/**
 * Validate wake time format (HH:MM)
 * @param time - Time string to validate
 * @returns True if time is valid
 */
export function validateWakeTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validate timezone string
 * @param timezone - Timezone string to validate
 * @returns True if timezone is valid
 */
export function validateTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate reset duration (in minutes)
 * @param duration - Duration in minutes
 * @returns Object with validity status and error message
 */
export function validateResetDuration(duration: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(duration)) {
    return {
      isValid: false,
      error: 'Duration must be a number',
    };
  }

  if (duration < 5) {
    return {
      isValid: false,
      error: 'Reset duration must be at least 5 minutes',
    };
  }

  if (duration > 180) {
    return {
      isValid: false,
      error: 'Reset duration must be less than 180 minutes',
    };
  }

  return { isValid: true };
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns True if date is valid
 */
export function validateDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize email
 * @param email - Email string to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return validateEmail(trimmed) ? trimmed : null;
}

/**
 * Validate user profile data
 * @param data - User profile data object
 * @returns Object with validity status and error message
 */
export function validateUserProfile(data: {
  wake_goal_time?: string | null;
  reset_duration?: number;
  timezone?: string;
}): {
  isValid: boolean;
  error?: string;
} {
  if (data.wake_goal_time !== undefined && data.wake_goal_time !== null) {
    if (!validateWakeTime(data.wake_goal_time)) {
      return {
        isValid: false,
        error: 'Invalid wake time format. Use HH:MM format.',
      };
    }
  }

  if (data.reset_duration !== undefined) {
    const durationValidation = validateResetDuration(data.reset_duration);
    if (!durationValidation.isValid) {
      return durationValidation;
    }
  }

  if (data.timezone !== undefined && !validateTimezone(data.timezone)) {
    return {
      isValid: false,
      error: 'Invalid timezone',
    };
  }

  return { isValid: true };
}
