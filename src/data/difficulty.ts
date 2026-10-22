import type { IDifficultySettings } from '../types/game';
import type { IIngredient } from '../types/ingredient';
import type { Difficulty } from '../types/recipe';
import { INGREDIENTS } from './ingredients';

// Single source of numbers: the README difficulty table.
export const DIFFICULTY_SETTINGS: Readonly<Record<Difficulty, IDifficultySettings>> = {
  easy: {
    shelfSize: 4,
    maxCauldronIngredients: 4,
    startTime: 180,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonus: 15,
    reactionCount: 0
  },
  medium: {
    shelfSize: 6,
    maxCauldronIngredients: 4,
    startTime: 150,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonus: 10,
    reactionCount: 2
  },
  hard: {
    shelfSize: 8,
    maxCauldronIngredients: 5,
    startTime: 150,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonus: 5,
    reactionCount: 3
  }
};

// Level 1 always plays with the Medium rules.
export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export function getShelfIngredients(settings: IDifficultySettings): IIngredient[] {
  return INGREDIENTS.slice(0, settings.shelfSize);
}
