import { getShelfIngredients } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { IGameState } from '../types/game';
import type { IIngredient } from '../types/ingredient';
import type { IRecipe } from '../types/recipe';
import { SAVE_VERSION, type ISavedGame } from '../types/save';
import { getDifficulty, getDifficultySettings, isDifficulty } from './difficulty';
import { isOutOfIngredients } from './game-over';
import { MAX_STOCK } from './stock';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isWholeNumber = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;

// Only a running or paused game is worth saving.
export function canSave(state: IGameState): boolean {
  return (state.status === 'playing' || state.status === 'paused') && state.activeRecipe !== null;
}

export function toSavedGame(state: IGameState): ISavedGame | null {
  if (!canSave(state) || state.activeRecipe === null) {
    return null;
  }

  return {
    version: SAVE_VERSION,
    difficulty: getDifficulty(state),
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: state.shelfStock,
    status: state.status === 'paused' ? 'paused' : 'playing'
  };
}

// Stored objects are only used to find the real recipe / ingredients by id,
// so an edited save cannot inject made-up values.
function findRecipe(value: unknown, difficulty: string): IRecipe | null {
  if (!isRecord(value)) {
    return null;
  }

  return (
    RECIPES.find((recipe) => recipe.id === value.id && recipe.difficulty === difficulty) ?? null
  );
}

function findIngredients(value: unknown, allowedIds: Set<string>): IIngredient[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const ingredients: IIngredient[] = [];

  for (const item of value) {
    const id: unknown = isRecord(item) ? item.id : undefined;
    const ingredient = INGREDIENTS.find((entry) => entry.id === id);

    if (!ingredient || !allowedIds.has(ingredient.id)) {
      return null;
    }
    ingredients.push(ingredient);
  }

  return ingredients;
}

function parseStock(
  value: unknown,
  shelf: readonly IIngredient[]
): IGameState['shelfStock'] | null {
  if (!isRecord(value)) {
    return null;
  }

  const stock: IGameState['shelfStock'] = {};
  const shelfIds = new Set<string>(shelf.map((ingredient) => ingredient.id));

  // No unknown or off-shelf keys.
  if (Object.keys(value).some((key) => !shelfIds.has(key))) {
    return null;
  }

  for (const ingredient of shelf) {
    const count = value[ingredient.id];

    if (!isWholeNumber(count, 0, MAX_STOCK)) {
      return null;
    }
    stock[ingredient.id] = count;
  }

  return stock;
}

/**
 * Validates unknown loaded data and rebuilds the game state from it.
 * Returns null for anything broken, finished or inconsistent. The restored game is always paused.
 */
export function restoreGame(data: unknown): IGameState | null {
  if (!isRecord(data) || data.version !== SAVE_VERSION || !isDifficulty(data.difficulty)) {
    return null;
  }

  const difficulty = data.difficulty;
  const settings = getDifficultySettings(difficulty);
  const shelf = getShelfIngredients(settings);
  const { score, timeLeft, lives, status } = data;

  if (
    (status !== 'playing' && status !== 'paused') ||
    !isWholeNumber(score, 0, Number.MAX_SAFE_INTEGER) ||
    typeof timeLeft !== 'number' ||
    !Number.isFinite(timeLeft) ||
    timeLeft <= 0 ||
    timeLeft > settings.startTime ||
    !isWholeNumber(lives, 1, settings.lives)
  ) {
    return null;
  }

  const activeRecipe = findRecipe(data.activeRecipe, difficulty);
  const cauldronIngredients = findIngredients(
    data.cauldronIngredients,
    new Set<string>(shelf.map((ingredient) => ingredient.id))
  );
  const shelfStock = parseStock(data.shelfStock, shelf);

  if (
    !activeRecipe ||
    !cauldronIngredients ||
    !shelfStock ||
    cauldronIngredients.length > settings.maxCauldronIngredients
  ) {
    return null;
  }

  const state: IGameState = {
    status: 'paused',
    score,
    timeLeft,
    lives,
    activeRecipe,
    cauldronIngredients,
    shelfStock,
    difficulty,
    gameOverReason: null
  };

  // A run that has already run out of ingredients is finished, not continuable.
  return isOutOfIngredients(state) ? null : state;
}

export function isValidSave(data: unknown): boolean {
  return restoreGame(data) !== null;
}
