import { DEFAULT_DIFFICULTY, getShelfIngredients } from '../data/difficulty';
import type { IDifficultySettings, IGameState } from '../types/game';
import type { IIngredient, IngredientId, IParameters } from '../types/ingredient';
import type { IRecipe } from '../types/recipe';
import { expandRange } from './brew-check';
import { isInRange } from './calculate-cauldron';
import { POUR_OUT_PENALTY } from './cauldron';
import { getCauldronValues, getFiredReactions, getReactionsFor } from './reactions-logic';
import { getStock } from './stock';

/**
 * A hint is a plan that always wins: follow it and the brew check passes. Plans inside the
 * exact recipe ranges come first; some recipes are only reachable within the brew tolerance.
 * `add: []` without Pour Out means "brew now".
 */
export type Hint =
  | { found: true; pourOutFirst: boolean; add: IngredientId[]; values: IParameters }
  | { found: false };

type Candidate = { ingredient: IIngredient; stock: number };

const PARAMETERS: (keyof IParameters)[] = ['temperature', 'density', 'magicPower'];

const fitsRecipe = (values: IParameters, recipe: IRecipe, slack: number): boolean =>
  PARAMETERS.every((key) => isInRange(values[key], expandRange(recipe[key], slack)));

// How far the values are from the middle of the target ranges (0 = dead centre).
const distanceFromCentre = (values: IParameters, recipe: IRecipe): number =>
  PARAMETERS.reduce((total, key) => {
    const { min, max } = recipe[key];
    return total + Math.abs(values[key] - (min + max) / 2) / Math.max(1, max - min);
  }, 0);

// Every multiset of `size` candidates (non-decreasing indices), within each one's stock.
function* combinations(candidates: Candidate[], size: number, from = 0): Generator<IIngredient[]> {
  if (size === 0) {
    yield [];
    return;
  }

  for (let index = from; index < candidates.length; index += 1) {
    for (const rest of combinations(candidates, size - 1, index)) {
      const candidate = candidates[index];
      if (!candidate) {
        continue;
      }
      const picked = [candidate.ingredient, ...rest];
      const count = picked.filter((item) => item.id === candidate.ingredient.id).length;
      if (count <= candidate.stock) {
        yield picked;
      }
    }
  }
}

/**
 * Adds the ingredients one by one, as the player would, and rejects the plan when a reaction
 * fired on the way costs a life or empties the cauldron, or when the time penalties
 * (Pour Out plus reactions) would use up the time left.
 */
function isSafePlan(
  base: IIngredient[],
  add: IIngredient[],
  state: IGameState,
  timePenalty: number
): boolean {
  const reactions = getReactionsFor(state.difficulty ?? DEFAULT_DIFFICULTY);
  let current = base;
  let timeCost = timePenalty;

  for (const ingredient of add) {
    const next = [...current, ingredient];
    const fired = getFiredReactions(current, next, reactions);
    if (fired.some((reaction) => reaction.effects?.loseLife || reaction.effects?.clearCauldron)) {
      return false;
    }
    timeCost += fired.reduce((total, reaction) => total + (reaction.effects?.timePenalty ?? 0), 0);
    current = next;
  }

  return timeCost < state.timeLeft;
}

// The safe plan closest to the centre of the targets; on a tie, fewer ingredients
// (sizes are tried in ascending order) and then shelf order.
function findAddition(
  base: IIngredient[],
  state: IGameState,
  settings: IDifficultySettings,
  slack: number,
  timePenalty: number
): IIngredient[] | null {
  const recipe = state.activeRecipe;
  if (!recipe) {
    return null;
  }

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const candidates = getShelfIngredients(settings)
    .map((ingredient) => ({ ingredient, stock: getStock(state.shelfStock, ingredient.id) }))
    .filter((candidate) => candidate.stock > 0);
  const freeSlots = settings.maxCauldronIngredients - base.length;
  let best: { add: IIngredient[]; distance: number } | null = null;

  // An empty cauldron cannot be brewed, so it needs at least one ingredient.
  for (let size = base.length === 0 ? 1 : 0; size <= freeSlots; size += 1) {
    for (const add of combinations(candidates, size)) {
      const values = getCauldronValues([...base, ...add], difficulty);
      const distance = distanceFromCentre(values, recipe);
      if (
        fitsRecipe(values, recipe, slack) &&
        (!best || distance < best.distance) &&
        isSafePlan(base, add, state, timePenalty)
      ) {
        best = { add, distance };
      }
    }
  }

  return best ? best.add : null;
}

/**
 * Prefers building on what is already in the cauldron (it costs no time): first inside the
 * exact ranges, then within the tolerance. Only then plans from an empty cauldron after
 * Pour Out (poured ingredients stay spent, so the stock is the same).
 */
export function getHint(state: IGameState, settings: IDifficultySettings): Hint {
  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const current = state.cauldronIngredients;
  const attempts = [
    { base: current, slack: 0, pourOutFirst: false },
    { base: current, slack: settings.tolerance, pourOutFirst: false },
    { base: [], slack: 0, pourOutFirst: true },
    { base: [], slack: settings.tolerance, pourOutFirst: true }
  ].filter((attempt) => !attempt.pourOutFirst || current.length > 0);

  for (const { base, slack, pourOutFirst } of attempts) {
    const penalty = pourOutFirst ? POUR_OUT_PENALTY : 0;
    const add = findAddition(base, state, settings, slack, penalty);
    if (add) {
      return {
        found: true,
        pourOutFirst,
        add: add.map((item) => item.id),
        values: getCauldronValues([...base, ...add], difficulty)
      };
    }
  }

  return { found: false };
}
