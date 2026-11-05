import type { Difficulty, IRecipe, RecipeId } from '../types/recipe';

type Range = [min: number, max: number];

const recipe = (
  id: RecipeId,
  difficulty: Difficulty,
  [tMin, tMax]: Range,
  [dMin, dMax]: Range,
  [mMin, mMax]: Range
): IRecipe => ({
  id,
  difficulty,
  temperature: { min: tMin, max: tMax },
  density: { min: dMin, max: dMax },
  magicPower: { min: mMin, max: mMax }
});

// Fixed recipe pool from the README (20 rows).
export const RECIPES: readonly IRecipe[] = [
  recipe('moon-mist', 'easy', [32, 42], [12, 22], [17, 27]),
  recipe('root-bloom', 'easy', [2, 12], [24, 34], [15, 25]),
  recipe('frost-steam', 'easy', [2, 12], [7, 17], [19, 29]),
  recipe('quiet-swirl', 'easy', [-28, -18], [19, 29], [17, 27]),
  recipe('bright-dew', 'easy', [27, 37], [32, 42], [25, 35]),
  recipe('snow-dust', 'easy', [-16, -6], [28, 38], [29, 39]),
  recipe('acid-spark', 'medium', [17, 27], [18, 28], [29, 39]),
  recipe('void-ember', 'medium', [0, 10], [0, 10], [45, 55]),
  recipe('heavy-acid', 'medium', [0, 10], [29, 39], [25, 35]),
  recipe('frost-acid', 'medium', [-13, -3], [13, 23], [31, 41]),
  recipe('dusty-void', 'medium', [-13, -3], [0, 10], [47, 57]),
  recipe('dragon-void', 'medium', [25, 35], [1, 11], [55, 65]),
  recipe('rooted-night', 'medium', [-18, -8], [14, 24], [55, 65]),
  recipe('phoenix-pulse', 'hard', [57, 67], [0, 10], [37, 47]),
  recipe('slime-crown', 'hard', [-5, 5], [45, 55], [3, 13]),
  recipe('void-flame', 'hard', [25, 35], [0, 10], [60, 70]),
  recipe('acid-bog', 'hard', [10, 20], [39, 49], [17, 27]),
  recipe('frozen-ash', 'hard', [27, 37], [0, 10], [39, 49]),
  recipe('triple-eclipse', 'hard', [-20, -10], [19, 29], [60, 70]),
  recipe('ember-soup', 'hard', [62, 72], [24, 34], [37, 47])
];

export function getRecipesByDifficulty(difficulty: Difficulty): IRecipe[] {
  return RECIPES.filter((item) => item.difficulty === difficulty);
}
