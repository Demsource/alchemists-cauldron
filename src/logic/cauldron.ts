import { INGREDIENTS } from '../data/ingredients';
import type { IDifficultySettings, IGameState } from '../types/game';
import type { IIngredient, IngredientId } from '../types/ingredient';
import { hasStock, takeFromStock } from './stock';

export function isCauldronFull(
  ingredients: readonly IIngredient[],
  settings: IDifficultySettings
): boolean {
  return ingredients.length >= settings.maxCauldronIngredients;
}

export function canAddIngredient(
  state: IGameState,
  id: IngredientId,
  settings: IDifficultySettings
): boolean {
  return (
    state.status === 'playing' &&
    !isCauldronFull(state.cauldronIngredients, settings) &&
    hasStock(state.shelfStock, id)
  );
}

export const POUR_OUT_PENALTY = 10; // seconds

// Empties the cauldron only. Used ingredients stay spent: the stock is never refilled.
export function clearCauldron(state: IGameState): IGameState {
  return { ...state, cauldronIngredients: [] };
}

export function canPourOut(state: IGameState): boolean {
  return state.status === 'playing' && state.cauldronIngredients.length > 0;
}

// Clears a wrong mixture without losing a life; costs time. Same state object when ignored.
export function pourOut(state: IGameState, penalty: number = POUR_OUT_PENALTY): IGameState {
  // The empty check comes first, so an empty cauldron never costs time.
  if (!canPourOut(state)) {
    return state;
  }

  return { ...clearCauldron(state), timeLeft: Math.max(0, state.timeLeft - penalty) };
}

// Returns the same state object when the action must be ignored.
export function addIngredient(
  state: IGameState,
  id: IngredientId,
  settings: IDifficultySettings
): IGameState {
  const ingredient = INGREDIENTS.find((item) => item.id === id);

  if (!ingredient || !canAddIngredient(state, id, settings)) {
    return state;
  }

  return {
    ...state,
    cauldronIngredients: [...state.cauldronIngredients, ingredient],
    shelfStock: takeFromStock(state.shelfStock, id)
  };
}
