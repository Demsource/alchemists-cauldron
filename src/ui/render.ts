import { BAR_SCALES } from '../data/bar-scales';
import { getShelfIngredients } from '../data/difficulty';
import { isCauldronFull } from '../logic/cauldron';
import { getStock } from '../logic/stock';
import type { IDifficultySettings, IGameState } from '../types/game';
import { renderActions } from './actions';
import { renderBars, type IBarView } from './bars';
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

function getBars(state: IGameState): IBarView[] {
  const recipe = state.activeRecipe;

  return [
    {
      key: 'temperature',
      label: 'Temperature',
      value: 0,
      ...BAR_SCALES.temperature,
      target: recipe?.temperature ?? null,
      isInTarget: false
    },
    {
      key: 'density',
      label: 'Density',
      value: 0,
      ...BAR_SCALES.density,
      target: recipe?.density ?? null,
      isInTarget: false
    },
    {
      key: 'magic',
      label: 'Magic Power',
      value: 0,
      ...BAR_SCALES.magicPower,
      target: recipe?.magicPower ?? null,
      isInTarget: false
    }
  ];
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
