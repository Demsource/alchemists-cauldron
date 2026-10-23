import { DEFAULT_DIFFICULTY } from '../data/difficulty';
import { REACTIONS } from '../data/reactions';
import type { IGameState } from '../types/game';
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

export interface IReactionOutcome {
  state: IGameState;
  fired: IReaction[];
}

/**
 * Compares the cauldron before and after an add and applies the one-time effects
 * of every reaction that just fired: lost seconds, a lost life, a cleared cauldron.
 * Cleared ingredients stay spent: the stock is not touched.
 */
export function resolveReactions(before: IGameState, after: IGameState): IReactionOutcome {
  const difficulty = after.difficulty ?? DEFAULT_DIFFICULTY;
  const fired = getFiredReactions(
    before.cauldronIngredients,
    after.cauldronIngredients,
    getReactionsFor(difficulty)
  );

  if (fired.length === 0) {
    return { state: after, fired };
  }

  const timePenalty = fired.reduce(
    (total, reaction) => total + (reaction.effects?.timePenalty ?? 0),
    0
  );
  const livesLost = fired.filter((reaction) => reaction.effects?.loseLife).length;
  const clearCauldron = fired.some((reaction) => reaction.effects?.clearCauldron);
  const last = fired[fired.length - 1];

  return {
    fired,
    state: {
      ...after,
      timeLeft: Math.max(0, after.timeLeft - timePenalty),
      lives: Math.max(0, after.lives - livesLost),
      cauldronIngredients: clearCauldron ? [] : after.cauldronIngredients,
      lastReactionId: last ? last.id : (after.lastReactionId ?? null)
    }
  };
}

// Always recalculated from the ingredient list: plain sums first, then the active reactions.
export function getCauldronValues(ingredients: IIngredient[], difficulty: Difficulty): IParameters {
  const active = getActiveReactions(ingredients, getReactionsFor(difficulty));
  return applyReactions(calculateCauldron(ingredients), active);
}
