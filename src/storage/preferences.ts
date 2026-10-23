import { isDifficulty } from '../logic/difficulty';
import type { Difficulty } from '../types/recipe';

const DIFFICULTY_KEY = 'alchemists-cauldron:difficulty';

// Missing, broken or blocked storage falls back to the given difficulty.
export function loadDifficulty(fallback: Difficulty): Difficulty {
  try {
    const value = localStorage.getItem(DIFFICULTY_KEY);
    return isDifficulty(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function saveDifficulty(difficulty: Difficulty): boolean {
  try {
    localStorage.setItem(DIFFICULTY_KEY, difficulty);
    return true;
  } catch {
    return false;
  }
}
