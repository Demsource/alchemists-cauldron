import { bindEvents } from './app/events';
import { createGameFlow } from './app/game-flow';
import { createLeaderboardFlow } from './app/leaderboard-flow';
import { createMenuFlow } from './app/menu-flow';
import { getSettings, getState, subscribe } from './state/game-state';
import { renderLayout } from './ui/layout';
import { renderGame } from './ui/render';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);

  const menu = createMenuFlow(layout);
  const leaderboard = createLeaderboardFlow(layout, { showMenu: menu.showMenu });
  const game = createGameFlow(layout, {
    onNewGame: leaderboard.resetRun,
    onGameOver: leaderboard.showGameOver
  });

  bindEvents(layout, { game, menu, leaderboard });

  // The game-over check must run before rendering, so it subscribes first.
  game.watchGameOver();
  menu.restoreDifficulty();

  const render = (): void => {
    const state = getState();
    renderGame(layout, state, getSettings(state));
  };

  subscribe(render);
  render();
}
