import type { IIngredient, IngredientId, IParameters } from './ingredient';
import type { Difficulty } from './recipe';

// One-time effects that happen only when a reaction fires (changes from inactive to active).
export interface IReactionEffects {
  timePenalty?: number; // seconds removed
  loseLife?: boolean;
  clearCauldron?: boolean;
}

export type ReactionId =
  | 'bubbling'
  | 'volatile-mix'
  | 'solar-frost'
  | 'rooted-steam'
  | 'ashen-bloom'
  | 'annihilation'
  | 'pressure-spike'
  | 'magma-flux'
  | 'deep-freeze'
  | 'arcane-saturation'
  | 'steam-burst'
  | 'black-ice'
  | 'heavy-spark'
  | 'burning-root'
  | 'void-resonance';

// Name, effect text and trigger text live in the locale files (reactions.<id>, reactionTriggers.<id>).
export interface IReaction {
  id: ReactionId;
  triggerIngredients?: IngredientId[]; // shown in Help as "A + B" for enabled reactions
  difficulty: Exclude<Difficulty, 'easy'> | null; // null: in the catalogue, not enabled
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: IParameters) => IParameters; // value effect, applied while active
  effects?: IReactionEffects;
}
