const MS_PER_SECOND = 1000;

// Time always comes from timestamps, never from counting ticks.
export function getEndTime(timeLeft: number, now: number = Date.now()): number {
  return now + timeLeft * MS_PER_SECOND;
}

export function getTimeLeft(endTime: number, now: number = Date.now()): number {
  return Math.max(0, (endTime - now) / MS_PER_SECOND);
}

// The whole second shown on the clock (MM:SS rounds up, so 0.4 s still shows 00:01).
export function getDisplaySecond(timeLeft: number): number {
  return Math.ceil(timeLeft);
}
