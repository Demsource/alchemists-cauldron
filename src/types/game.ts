import type { IIngredient, IngredientId } from './ingredient';
import type { Difficulty, IRecipe } from './recipe';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

export interface IDifficultySettings {
  shelfSize: number;
  maxCauldronIngredients: number;
  startTime: number; // seconds
  tolerance: number;
  lives: number;
  scorePerBrew: number;
  timeBonus: number; // seconds
  reactionCount: number;
}

export interface IGameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | null; // null on the start screen
  cauldronIngredients: IIngredient[];
  shelfStock: Partial<Record<IngredientId, number>>; // ingredient id -> portions left
  difficulty?: Difficulty; // Level 2+
  lastReactionId?: string | null; // Level 3+
}
