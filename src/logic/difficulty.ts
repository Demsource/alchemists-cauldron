import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { t } from '../i18n';
import type { IDifficultySettings, IGameState } from '../types/game';
import type { Difficulty } from '../types/recipe';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

// A function, not a constant, so the label follows the current language.
export function getDifficultyLabel(difficulty: Difficulty): string {
  return t(`difficulty.${difficulty}`);
}

export function getDifficulty(state: IGameState): Difficulty {
  return state.difficulty ?? DEFAULT_DIFFICULTY;
}

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}

// The difficulty is chosen outside a run only: on the start screen or after Game Over.
export function canChangeDifficulty(state: IGameState): boolean {
  return state.status === 'menu' || state.status === 'game-over';
}

// Returns the same state object when the change is not allowed or nothing changes.
export function setDifficulty(state: IGameState, difficulty: Difficulty): IGameState {
  if (!canChangeDifficulty(state) || state.difficulty === difficulty) {
    return state;
  }

  return { ...state, difficulty };
}

// Short button text, built from the same settings the game uses.
export function getDifficultySummary(settings: IDifficultySettings): string {
  return [
    t('difficulty.ingredients', { count: settings.shelfSize }),
    t('difficulty.seconds', { count: settings.startTime }),
    `±${settings.tolerance}`,
    t('difficulty.lives', { count: settings.lives })
  ].join(' · ');
}

export function getDifficultySettings(difficulty: Difficulty): IDifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty];
}
