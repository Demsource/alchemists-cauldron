import { isLocale, type Locale } from '../i18n';
import { isDifficulty } from '../logic/difficulty';
import type { Difficulty } from '../types/recipe';

const DIFFICULTY_KEY = 'alchemists-cauldron:difficulty';
const LOCALE_KEY = 'alchemists-cauldron:locale';

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

// Missing, unknown or blocked storage falls back to the given locale.
export function loadLocale(fallback: Locale): Locale {
  try {
    const value = localStorage.getItem(LOCALE_KEY);
    return isLocale(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocale(locale: Locale): boolean {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}
