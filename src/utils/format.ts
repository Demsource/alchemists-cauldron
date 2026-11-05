import { getIntlLocale } from '../i18n';

const pad = (value: number): string => String(value).padStart(2, '0');

export function formatSigned(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return value < 0 ? `−${Math.abs(value)}` : '0';
}

// Date order, separators and digit grouping follow the current language.
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(timestamp);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(getIntlLocale()).format(value);
}

export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}
