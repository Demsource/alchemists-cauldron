import type { IIngredient, IParameters } from './ingredient';
import type { Difficulty } from './recipe';

export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: IParameters) => IParameters;
}
