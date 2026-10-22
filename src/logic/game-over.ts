import type { GameOverReason, IGameState } from '../types/game';
import { isShelfEmpty } from './stock';

// README "Out of ingredients": every shelf stock is 0 and the cauldron is empty.
export function isOutOfIngredients(state: IGameState): boolean {
  return isShelfEmpty(state.shelfStock) && state.cauldronIngredients.length === 0;
}

export function getGameOverReason(state: IGameState): GameOverReason | null {
  if (state.status !== 'playing') {
    return null;
  }

  if (state.timeLeft <= 0) {
    return 'time';
  }

  if (state.lives <= 0) {
    return 'lives';
  }

  if (isOutOfIngredients(state)) {
    return 'ingredients';
  }

  return null;
}

export function endGame(state: IGameState, reason: GameOverReason): IGameState {
  return { ...state, status: 'game-over', gameOverReason: reason };
}
