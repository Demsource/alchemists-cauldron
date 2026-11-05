export type Difficulty = 'easy' | 'medium' | 'hard'; // Level 2+

export interface IRecipeRange {
  min: number;
  max: number;
}

export type RecipeId =
  | 'moon-mist'
  | 'root-bloom'
  | 'frost-steam'
  | 'quiet-swirl'
  | 'bright-dew'
  | 'snow-dust'
  | 'acid-spark'
  | 'void-ember'
  | 'heavy-acid'
  | 'frost-acid'
  | 'dusty-void'
  | 'dragon-void'
  | 'rooted-night'
  | 'phoenix-pulse'
  | 'slime-crown'
  | 'void-flame'
  | 'acid-bog'
  | 'frozen-ash'
  | 'triple-eclipse'
  | 'ember-soup';

// The name lives in the locale files (recipes.<id>).
export interface IRecipe {
  id: RecipeId;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}
