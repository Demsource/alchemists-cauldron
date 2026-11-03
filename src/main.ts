import { bindEvents } from './app/events';
import { createGameFlow } from './app/game-flow';
import { createLeaderboardFlow } from './app/leaderboard-flow';
import { createMenuFlow } from './app/menu-flow';
import { createSaveFlow } from './app/save-flow';
import { bindTooltip } from './app/tooltip-flow';
import { DEFAULT_LOCALE, initI18n, onLocaleChange } from './i18n';
import { getSettings, getState, subscribe } from './state/game-state';
import { loadLocale } from './storage/preferences';
import { hasSave } from './storage/save';
import { renderLayout, updateLayoutText } from './ui/layout';
import { renderGame, resetRenderedViews } from './ui/render';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  // Before any rendering, so every t() call has its resources and the saved language.
  initI18n(loadLocale(DEFAULT_LOCALE));
  const layout = renderLayout(mount);

  const menu = createMenuFlow(layout);
  const leaderboard = createLeaderboardFlow(layout, { showMenu: menu.showMenu });
  const game = createGameFlow(layout, {
    onNewGame: leaderboard.resetRun,
    onGameOver: leaderboard.showGameOver
  });

  bindEvents(layout, { game, menu, leaderboard });
  bindTooltip(layout);

  // The game-over check must run before saving and rendering, so it subscribes first.
  game.watchGameOver();
  createSaveFlow().watchChanges();
  menu.restoreDifficulty();

  const render = (): void => {
    const state = getState();
    // The save is only read on the start screen, where Continue Game can appear.
    renderGame(layout, state, getSettings(state), {
      hasSave: state.status === 'menu' && hasSave()
    });
  };

  subscribe(render);
  render();

  // A language change keeps the state but redraws every text on screen.
  onLocaleChange(() => {
    updateLayoutText(layout);
    resetRenderedViews(layout);
    render();
  });
}
