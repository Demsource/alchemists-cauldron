import { LEADERBOARD_SIZE, sortEntries, validatePlayerName } from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../types/leaderboard';

const STORAGE_KEY = 'alchemists-cauldron:leaderboard';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toEntry(value: unknown): ILeaderboardEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const { name, score, timestamp } = value;

  if (
    typeof name !== 'string' ||
    !validatePlayerName(name).isValid ||
    typeof score !== 'number' ||
    !Number.isFinite(score) ||
    score < 0 ||
    typeof timestamp !== 'number' ||
    !Number.isFinite(timestamp)
  ) {
    return null;
  }

  return { name: name.trim(), score, timestamp };
}

// Broken JSON, wrong shapes or a blocked localStorage never crash the game: they read as [].
export function loadLeaderboard(): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const entries = parsed
      .map(toEntry)
      .filter((entry): entry is ILeaderboardEntry => entry !== null);

    return sortEntries(entries).slice(0, LEADERBOARD_SIZE);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: readonly ILeaderboardEntry[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function clearLeaderboard(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
