import type { IIngredient, IParameters } from './ingredient';
import type { Difficulty } from './recipe';

// One-time effects that happen only when a reaction fires (changes from inactive to active).
export interface IReactionEffects {
  timePenalty?: number; // seconds removed
  loseLife?: boolean;
  clearCauldron?: boolean;
}

export interface IReaction {
  id: string;
  name: string;
  description: string; // short player-facing effect text
  difficulty: Exclude<Difficulty, 'easy'> | null; // null: in the catalogue, not enabled
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: IParameters) => IParameters; // value effect, applied while active
  effects?: IReactionEffects;
}
