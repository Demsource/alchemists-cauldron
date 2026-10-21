import { renderActions } from './ui/actions';
import { renderBars } from './ui/bars';
import { renderCauldron } from './ui/cauldron';
import { renderHud } from './ui/hud';
import { renderLayout } from './ui/layout';
import { renderRecipePanel } from './ui/recipe-panel';
import { renderShelf } from './ui/shelf';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);

  renderHud(layout.hud, {
    isActive: false,
    score: 0,
    timeLeft: 0,
    timeTotal: 150,
    lives: 0,
    maxLives: 3
  });
  renderShelf(layout.shelf, { items: [], isBlocked: false, showValues: true });
  renderCauldron(layout.stage, { ingredients: [], capacity: 4 });
  renderRecipePanel(layout.recipe, { recipe: null, added: 0, capacity: 4 });
  renderBars(layout.bars, [
    {
      key: 'temperature',
      label: 'Temperature',
      value: 0,
      min: -100,
      max: 100,
      target: null,
      isInTarget: false
    },
    {
      key: 'density',
      label: 'Density',
      value: 0,
      min: -50,
      max: 100,
      target: null,
      isInTarget: false
    },
    {
      key: 'magic',
      label: 'Magic Power',
      value: 0,
      min: -50,
      max: 150,
      target: null,
      isInTarget: false
    }
  ]);
  renderActions(layout.actions, {
    isPlaying: false,
    canBrew: false,
    showPourOut: false,
    canPourOut: false
  });
}
