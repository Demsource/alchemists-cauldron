import type { IGameState } from './game';
import type { IIngredient } from './ingredient';
import type { Difficulty, IRecipe } from './recipe';

export const SAVE_VERSION = 1;

// Exactly the fields US 2.2 asks for, plus a format version.
export interface ISavedGame {
  version: typeof SAVE_VERSION;
  difficulty: Difficulty;
  score: number;
  timeLeft: number; // seconds left, never a timer id
  lives: number;
  activeRecipe: IRecipe;
  cauldronIngredients: IIngredient[];
  shelfStock: IGameState['shelfStock'];
  status: 'playing' | 'paused';
}
