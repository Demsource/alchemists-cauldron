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
