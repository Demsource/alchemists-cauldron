import { REACTIONS } from '../data/reactions';
import type { IIngredient, IParameters } from '../types/ingredient';
import type { IReaction } from '../types/reaction';
import type { Difficulty } from '../types/recipe';
import { calculateCauldron } from './calculate-cauldron';

// Easy has none; Medium and Hard use their own fixed set, in table order.
export function getReactionsFor(difficulty: Difficulty): IReaction[] {
  return REACTIONS.filter((reaction) => reaction.difficulty === difficulty);
}

export function getActiveReactions(
  ingredients: IIngredient[],
  reactions: readonly IReaction[]
): IReaction[] {
  return reactions.filter((reaction) => reaction.isActive(ingredients));
}

// Value effects chain in table order and apply as long as each reaction stays active.
export function applyReactions(values: IParameters, active: readonly IReaction[]): IParameters {
  return active.reduce((current, reaction) => reaction.apply(current), values);
}

// Only a change from "not active" to "active" fires (one-time effects and the message).
export function getFiredReactions(
  before: IIngredient[],
  after: IIngredient[],
  reactions: readonly IReaction[]
): IReaction[] {
  return reactions.filter((reaction) => !reaction.isActive(before) && reaction.isActive(after));
}

// Always recalculated from the ingredient list: plain sums first, then the active reactions.
export function getCauldronValues(ingredients: IIngredient[], difficulty: Difficulty): IParameters {
  const active = getActiveReactions(ingredients, getReactionsFor(difficulty));
  return applyReactions(calculateCauldron(ingredients), active);
}
