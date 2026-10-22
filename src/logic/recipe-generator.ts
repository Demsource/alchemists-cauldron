import { getRecipesByDifficulty } from '../data/recipes';
import type { Difficulty, IRecipe } from '../types/recipe';

export function pickRandom<T>(items: readonly T[], random: () => number = Math.random): T {
  const item = items[Math.floor(random() * items.length)];

  if (item === undefined) {
    throw new Error('Cannot pick from an empty list');
  }

  return item;
}

export function pickRecipe(difficulty: Difficulty, random: () => number = Math.random): IRecipe {
  return pickRandom(getRecipesByDifficulty(difficulty), random);
}
