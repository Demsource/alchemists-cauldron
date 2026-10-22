import { getSettings, getState, setState, startNewGame, subscribe } from './state/game-state';
import { renderLayout } from './ui/layout';
import { renderGame } from './ui/render';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const render = (): void => {
    const state = getState();
    renderGame(layout, state, getSettings(state));
  };

  layout.actions.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');

    if (button?.dataset.action === 'start') {
      setState(startNewGame(getState().difficulty));
    }
  });

  subscribe(render);
  render();
}
