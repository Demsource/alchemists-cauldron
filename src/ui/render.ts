import { BAR_SCALES } from '../data/bar-scales';
import { getShelfIngredients } from '../data/difficulty';
import { calculateCauldron, isInRange } from '../logic/calculate-cauldron';
import { isCauldronFull } from '../logic/cauldron';
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
  const values = calculateCauldron(state.cauldronIngredients);
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

export function renderGame(
  layout: ILayoutRefs,
  state: IGameState,
  settings: IDifficultySettings
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

  renderShelf(layout.shelf, {
    items: getShelfItems(state, settings),
    isBlocked: isFull,
    showValues: true
  });

  renderCauldron(layout.stage, {
    ingredients: state.cauldronIngredients.map(({ id, name }) => ({ id, name })),
    capacity: settings.maxCauldronIngredients
  });

  renderRecipePanel(layout.recipe, {
    recipe: state.activeRecipe,
    added: state.cauldronIngredients.length,
    capacity: settings.maxCauldronIngredients
  });

  renderBars(layout.bars, getBars(state));

  renderActions(layout.actions, {
    isPlaying,
    canBrew: state.cauldronIngredients.length > 0,
    showPourOut: false,
    canPourOut: false
  });
}
