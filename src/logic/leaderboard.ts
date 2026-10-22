import type { ILeaderboardEntry } from '../types/leaderboard';

export const LEADERBOARD_SIZE = 10;
export const PLAYER_NAME_MIN = 2;
export const PLAYER_NAME_MAX = 15;

// Letters (any alphabet), digits, space, "_" and "-".
const PLAYER_NAME_PATTERN = /^[\p{L}\d _-]+$/u;

export interface INameValidation {
  isValid: boolean;
  name: string; // trimmed name to save
  error: string | null;
}

export function validatePlayerName(rawName: string): INameValidation {
  const name = rawName.trim();
  const invalid = (error: string): INameValidation => ({ isValid: false, name, error });

  if (name.length < PLAYER_NAME_MIN || name.length > PLAYER_NAME_MAX) {
    return invalid(`Use ${PLAYER_NAME_MIN}–${PLAYER_NAME_MAX} characters.`);
  }

  if (!PLAYER_NAME_PATTERN.test(name)) {
    return invalid('Only letters, digits, space, _ and - are allowed.');
  }

  return { isValid: true, name, error: null };
}

// Higher score first; on equal scores the earlier result stays higher.
export function sortEntries(entries: readonly ILeaderboardEntry[]): ILeaderboardEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
}

export function addEntry(
  entries: readonly ILeaderboardEntry[],
  entry: ILeaderboardEntry
): ILeaderboardEntry[] {
  return sortEntries([...entries, entry]).slice(0, LEADERBOARD_SIZE);
}

// A new result is always the latest, so on a tie it ranks below the existing entry:
// with a full list it must beat the 10th score.
export function isTopResult(entries: readonly ILeaderboardEntry[], score: number): boolean {
  const top = sortEntries(entries).slice(0, LEADERBOARD_SIZE);
  const last = top[LEADERBOARD_SIZE - 1];

  return last === undefined || score > last.score;
}
