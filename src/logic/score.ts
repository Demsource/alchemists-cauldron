import type { IDifficultySettings, IGameState } from '../types/game';
import { checkBrew, type IBrewCheck } from './brew-check';
import { calculateCauldron } from './calculate-cauldron';
import { pickRecipe } from './recipe-generator';

export interface IBrewOutcome {
  state: IGameState;
  check: IBrewCheck | null; // null when the brew action was ignored
}

export function canBrew(state: IGameState): boolean {
  return (
    state.status === 'playing' &&
    state.activeRecipe !== null &&
    state.cauldronIngredients.length > 0
  );
}

export function addTimeBonus(timeLeft: number, settings: IDifficultySettings): number {
  return Math.min(settings.startTime, timeLeft + settings.timeBonus);
}

// Used ingredients are spent either way: the stock is never touched here.
export function brew(
  state: IGameState,
  settings: IDifficultySettings,
  random: () => number = Math.random
): IBrewOutcome {
  if (!canBrew(state) || state.activeRecipe === null) {
    return { state, check: null };
  }

  const values = calculateCauldron(state.cauldronIngredients);
  const check = checkBrew(values, state.activeRecipe, settings.tolerance);
  const difficulty = state.difficulty ?? state.activeRecipe.difficulty;

  const nextState: IGameState = check.isSuccess
    ? {
        ...state,
        score: state.score + settings.scorePerBrew,
        timeLeft: addTimeBonus(state.timeLeft, settings),
        cauldronIngredients: [],
        activeRecipe: pickRecipe(difficulty, random)
      }
    : {
        ...state,
        lives: Math.max(0, state.lives - 1),
        cauldronIngredients: []
      };

  return { state: nextState, check };
}
