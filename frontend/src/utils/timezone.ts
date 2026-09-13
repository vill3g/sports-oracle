/**
 * Timezone Utility for Oracle Sports
 * Configured Timezone: America/New_York (Eastern Time / ET)
 */

export const APP_TIMEZONE = 'America/New_York';
export const TIMEZONE_LABEL = 'ET';

export function formatToEasternTime(
  dateInput: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
): string {
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return String(dateInput);
    }
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: APP_TIMEZONE,
      ...options
    }).format(d);
    return `${formatted} ${TIMEZONE_LABEL}`;
  } catch {
    return String(dateInput);
  }
}

export function formatGameTime(timeString: string): string {
  if (!timeString) return '';
  if (timeString.includes('ET') || timeString.includes('EDT') || timeString.includes('EST')) {
    return timeString;
  }
  if (timeString.startsWith('LIVE')) {
    return timeString;
  }
  return `${timeString} ET`;
}