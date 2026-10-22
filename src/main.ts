import { isIngredientId } from './data/ingredients';
import { addIngredient } from './logic/cauldron';
import { getSettings, getState, setState, startNewGame, subscribe } from './state/game-state';
import type { IngredientId } from './types/ingredient';
import { renderLayout } from './ui/layout';
import { renderGame } from './ui/render';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const render = (): void => {
    const state = getState();
    renderGame(layout, state, getSettings(state));
  };

  // The shelf is re-rendered on every change, so give keyboard focus back to the same card.
  const refocusCard = (id: IngredientId): void => {
    const card = layout.shelf.querySelector<HTMLButtonElement>(`[data-ingredient-id="${id}"]`);
    if (card && !card.disabled) {
      card.focus();
    }
  };

  layout.shelf.addEventListener('click', (event) => {
    const card = (event.target as Element).closest<HTMLButtonElement>('button[data-ingredient-id]');
    const id = card?.dataset.ingredientId;

    if (!card || card.disabled || !isIngredientId(id)) {
      return;
    }

    const state = getState();
    setState(addIngredient(state, id, getSettings(state)));
    refocusCard(id);
  });

  layout.actions.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');

    if (button?.dataset.action === 'start') {
      setState(startNewGame(getState().difficulty));
    }
  });

  subscribe(render);
  render();
}
