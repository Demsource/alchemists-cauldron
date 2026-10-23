import type { IDifficultySettings, IGameState } from '../types/game';
import { checkBrew, type IBrewCheck } from './brew-check';
import { clearCauldron } from './cauldron';
import { getCauldronValues } from './reactions-logic';
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

  const difficulty = state.difficulty ?? state.activeRecipe.difficulty;
  // The same values the bars show: sums with the active reactions applied.
  const values = getCauldronValues(state.cauldronIngredients, difficulty);
  const check = checkBrew(values, state.activeRecipe, settings.tolerance);

  const emptied = clearCauldron(state);
  const nextState: IGameState = check.isSuccess
    ? {
        ...emptied,
        score: state.score + settings.scorePerBrew,
        timeLeft: addTimeBonus(state.timeLeft, settings),
        activeRecipe: pickRecipe(difficulty, random)
      }
    : {
        ...emptied,
        lives: Math.max(0, state.lives - 1)
      };

  return { state: nextState, check };
}
