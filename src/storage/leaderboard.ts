import { LEADERBOARD_SIZE, sortEntries, validatePlayerName } from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../types/leaderboard';
import type { Difficulty } from '../types/recipe';

const KEY_PREFIX = 'alchemists-cauldron:leaderboard';
// Level 1 kept one list without a difficulty; Level 1 always played Medium.
const LEGACY_KEY = KEY_PREFIX;
const LEGACY_DIFFICULTY: Difficulty = 'medium';

const getKey = (difficulty: Difficulty): string => `${KEY_PREFIX}:${difficulty}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Every entry of a list belongs to that list's difficulty, whatever the stored value says.
function toEntry(value: unknown, difficulty: Difficulty): ILeaderboardEntry | null {
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

  return { name: name.trim(), score, timestamp, difficulty };
}

function readList(key: string, difficulty: Difficulty): ILeaderboardEntry[] | null {
  const raw = localStorage.getItem(key);

  if (raw === null) {
    return null;
  }

  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    return [];
  }

  const entries = parsed
    .map((item) => toEntry(item, difficulty))
    .filter((entry): entry is ILeaderboardEntry => entry !== null);

  return sortEntries(entries).slice(0, LEADERBOARD_SIZE);
}

// Moves the old single Level 1 list into the Medium list once.
function migrateLegacyList(): ILeaderboardEntry[] | null {
  const legacy = readList(LEGACY_KEY, LEGACY_DIFFICULTY);

  if (legacy === null) {
    return null;
  }

  localStorage.setItem(getKey(LEGACY_DIFFICULTY), JSON.stringify(legacy));
  localStorage.removeItem(LEGACY_KEY);
  return legacy;
}

// Broken JSON, wrong shapes or a blocked localStorage never crash the game: they read as [].
export function loadLeaderboard(difficulty: Difficulty): ILeaderboardEntry[] {
  try {
    const entries = readList(getKey(difficulty), difficulty);

    if (entries === null && difficulty === LEGACY_DIFFICULTY) {
      return migrateLegacyList() ?? [];
    }

    return entries ?? [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(
  difficulty: Difficulty,
  entries: readonly ILeaderboardEntry[]
): boolean {
  try {
    localStorage.setItem(getKey(difficulty), JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function clearLeaderboard(difficulty: Difficulty): boolean {
  try {
    localStorage.removeItem(getKey(difficulty));
    if (difficulty === LEGACY_DIFFICULTY) {
      localStorage.removeItem(LEGACY_KEY);
    }
    return true;
  } catch {
    return false;
  }
}
