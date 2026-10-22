import type { Difficulty, IRecipe } from '../types/recipe';

type Range = [min: number, max: number];

const recipe = (
  id: string,
  name: string,
  difficulty: Difficulty,
  [tMin, tMax]: Range,
  [dMin, dMax]: Range,
  [mMin, mMax]: Range
): IRecipe => ({
  id,
  name,
  difficulty,
  temperature: { min: tMin, max: tMax },
  density: { min: dMin, max: dMax },
  magicPower: { min: mMin, max: mMax }
});

// Fixed recipe pool from the README (20 rows).
export const RECIPES: readonly IRecipe[] = [
  recipe('moon-mist', 'Moon Mist', 'easy', [32, 42], [12, 22], [17, 27]),
  recipe('root-bloom', 'Root Bloom', 'easy', [2, 12], [24, 34], [15, 25]),
  recipe('frost-steam', 'Frost Steam', 'easy', [2, 12], [7, 17], [19, 29]),
  recipe('quiet-swirl', 'Quiet Swirl', 'easy', [-28, -18], [19, 29], [17, 27]),
  recipe('bright-dew', 'Bright Dew', 'easy', [27, 37], [32, 42], [25, 35]),
  recipe('snow-dust', 'Snow Dust', 'easy', [-16, -6], [28, 38], [29, 39]),
  recipe('acid-spark', 'Acid Spark', 'medium', [17, 27], [18, 28], [29, 39]),
  recipe('void-ember', 'Void Ember', 'medium', [0, 10], [0, 10], [45, 55]),
  recipe('heavy-acid', 'Heavy Acid', 'medium', [0, 10], [29, 39], [25, 35]),
  recipe('frost-acid', 'Frost Acid', 'medium', [-13, -3], [13, 23], [31, 41]),
  recipe('dusty-void', 'Dusty Void', 'medium', [-13, -3], [0, 10], [47, 57]),
  recipe('dragon-void', 'Dragon Void', 'medium', [25, 35], [1, 11], [55, 65]),
  recipe('rooted-night', 'Rooted Night', 'medium', [-18, -8], [14, 24], [55, 65]),
  recipe('phoenix-pulse', 'Phoenix Pulse', 'hard', [57, 67], [0, 10], [37, 47]),
  recipe('slime-crown', 'Slime Crown', 'hard', [-5, 5], [45, 55], [3, 13]),
  recipe('void-flame', 'Void Flame', 'hard', [25, 35], [0, 10], [60, 70]),
  recipe('acid-bog', 'Acid Bog', 'hard', [10, 20], [39, 49], [17, 27]),
  recipe('frozen-ash', 'Frozen Ash', 'hard', [27, 37], [0, 10], [39, 49]),
  recipe('triple-eclipse', 'Triple Eclipse', 'hard', [-20, -10], [19, 29], [60, 70]),
  recipe('ember-soup', 'Ember Soup', 'hard', [62, 72], [24, 34], [37, 47])
];

export function getRecipesByDifficulty(difficulty: Difficulty): IRecipe[] {
  return RECIPES.filter((item) => item.difficulty === difficulty);
}
