const pad = (value: number): string => String(value).padStart(2, '0');

export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}
