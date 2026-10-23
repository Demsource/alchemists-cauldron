import { BAR_SCALES } from '../data/bar-scales';
import { DEFAULT_DIFFICULTY, getShelfIngredients } from '../data/difficulty';
import { DIFFICULTY_LABELS } from '../logic/difficulty';
import { isInRange } from '../logic/calculate-cauldron';
import { getActiveReactions, getCauldronValues, getReactionsFor } from '../logic/reactions-logic';
import { isCauldronFull } from '../logic/cauldron';
import { canBrew } from '../logic/score';
import { getStock } from '../logic/stock';
import type { IDifficultySettings, IGameState } from '../types/game';
import type { IParameters } from '../types/ingredient';
import { renderActions } from './actions';
import { renderBars, type BarKey, type IBarView } from './bars';
import { renderCauldron } from './cauldron';
import { renderHud } from './hud';
import type { ILayoutRefs } from './layout';
import { renderRecipePanel } from './recipe-panel';
import { renderShelf, type IShelfItemView } from './shelf';

function getShelfItems(state: IGameState, settings: IDifficultySettings): IShelfItemView[] {
  if (state.status === 'menu') {
    return [];
  }

  return getShelfIngredients(settings).map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    temperature: ingredient.temperature,
    density: ingredient.density,
    magicPower: ingredient.magicPower,
    stock: getStock(state.shelfStock, ingredient.id)
  }));
}

const BAR_DEFINITIONS: { key: BarKey; parameter: keyof IParameters; label: string }[] = [
  { key: 'temperature', parameter: 'temperature', label: 'Temperature' },
  { key: 'density', parameter: 'density', label: 'Density' },
  { key: 'magic', parameter: 'magicPower', label: 'Magic Power' }
];

function getBars(state: IGameState): IBarView[] {
  const values = getCauldronValues(
    state.cauldronIngredients,
    state.difficulty ?? DEFAULT_DIFFICULTY
  );
  const recipe = state.activeRecipe;

  return BAR_DEFINITIONS.map(({ key, parameter, label }) => {
    const value = values[parameter];
    const target = recipe ? recipe[parameter] : null;

    return {
      key,
      label,
      value,
      ...BAR_SCALES[parameter],
      target,
      isInTarget: target !== null && isInRange(value, target)
    };
  });
}

// Last rendered view per container, as JSON (views are plain data).
const lastViews = new WeakMap<HTMLElement, string>();

function renderIfChanged<T>(
  container: HTMLElement,
  render: (target: HTMLElement, view: T) => void,
  view: T
): void {
  const key = JSON.stringify(view);

  if (lastViews.get(container) !== key) {
    lastViews.set(container, key);
    render(container, view);
  }
}

// Facts from outside the state (e.g. storage) that the screen needs.
export interface IRenderOptions {
  hasSave: boolean;
}

export function renderGame(
  layout: ILayoutRefs,
  state: IGameState,
  settings: IDifficultySettings,
  options: IRenderOptions
): void {
  const isPlaying = state.status !== 'menu';
  const isFull = isCauldronFull(state.cauldronIngredients, settings);

  layout.root.dataset.status = state.status;

  renderHud(layout.hud, {
    isActive: isPlaying,
    score: state.score,
    timeLeft: state.timeLeft,
    timeTotal: settings.startTime,
    lives: state.lives,
    maxLives: settings.lives
  });

  // HUD and bars patch their own DOM in place, so they can run on every change (incl. timer ticks).
  renderBars(layout.bars, getBars(state));

  // These sections rebuild their DOM, so render them only when their view data changed.
  // Otherwise every timer tick would recreate them, restarting CSS animations and hover effects.
  renderIfChanged(layout.shelf, renderShelf, {
    items: getShelfItems(state, settings),
    isBlocked: isFull || state.status !== 'playing',
    showValues: 'touch-only'
  });

  renderIfChanged(layout.stage, renderCauldron, {
    ingredients: state.cauldronIngredients.map(({ id, name }) => ({ id, name })),
    capacity: settings.maxCauldronIngredients
  });

  renderIfChanged(layout.recipe, renderRecipePanel, {
    recipe: state.activeRecipe,
    added: state.cauldronIngredients.length,
    capacity: settings.maxCauldronIngredients,
    difficultyLabel: DIFFICULTY_LABELS[state.difficulty ?? DEFAULT_DIFFICULTY],
    activeReactions: getActiveReactions(
      state.cauldronIngredients,
      getReactionsFor(state.difficulty ?? DEFAULT_DIFFICULTY)
    ).map((reaction) => reaction.name)
  });

  renderIfChanged(layout.actions, renderActions, {
    isPlaying,
    canPause: state.status === 'playing',
    // The menu holds actions used outside a run.
    canOpenMenu: state.status === 'menu' || state.status === 'game-over',
    // A running game must be paused first, so Help never opens over a live timer.
    canOpenHelp: state.status === 'menu' || state.status === 'game-over',
    canContinue: state.status === 'menu' && options.hasSave,
    canBrew: canBrew(state),
    showPourOut: false,
    canPourOut: false
  });
}
