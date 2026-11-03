import type { IngredientId } from '../types/ingredient';
import type { IReaction, ReactionId } from '../types/reaction';
import type { RecipeId } from '../types/recipe';
import en from './locales/en.json';
import { t } from '.';

// Display text for game data, looked up by id so it always follows the current language
// (and a restored save never shows the language it was saved in).

type TriggerId = keyof typeof en.reactionTriggers;

const hasTrigger = (id: ReactionId): id is ReactionId & TriggerId => id in en.reactionTriggers;

export const getIngredientName = (id: IngredientId): string => t(`ingredients.${id}.name`);

export const getIngredientDescription = (id: IngredientId): string =>
  t(`ingredients.${id}.description`);

export const getReactionName = (id: ReactionId): string => t(`reactions.${id}.name`);

export const getReactionDescription = (id: ReactionId): string => t(`reactions.${id}.description`);

// Ingredient triggers reuse the translated ingredient names; stat triggers have their own text.
export function getReactionTrigger({ id, triggerIngredients }: IReaction): string {
  if (triggerIngredients) {
    return triggerIngredients.map(getIngredientName).join(' + ');
  }
  return hasTrigger(id) ? t(`reactionTriggers.${id}`) : '';
}

export const getRecipeName = (id: RecipeId): string => t(`recipes.${id}`);
