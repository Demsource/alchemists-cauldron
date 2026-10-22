import { isIngredientId } from './data/ingredients';
import { addIngredient } from './logic/cauldron';
import { endGame, getGameOverReason } from './logic/game-over';
import { pauseGame, resumeGame } from './logic/pause';
import { brew } from './logic/score';
import {
  createInitialState,
  getSettings,
  getState,
  setState,
  startNewGame,
  subscribe
} from './state/game-state';
import { startTimer, stopTimer, syncTimer, withCurrentTime } from './state/game-timer';
import type { IGameState } from './types/game';
import type { IngredientId } from './types/ingredient';
import { showBrewMessage } from './ui/brew-message';
import { closeAllDialogs } from './ui/dialogs';
import { openGameOverDialog, openPauseDialog } from './ui/game-dialogs';
import { renderLayout } from './ui/layout';
import { renderGame } from './ui/render';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const render = (): void => {
    const state = getState();
    renderGame(layout, state, getSettings(state));
  };

  const startGame = (): void => {
    closeAllDialogs(layout.dialogRoot);
    const newGame = startNewGame(getState().difficulty);
    setState(newGame);
    startTimer(newGame.timeLeft);
  };

  const exitToMenu = (): void => {
    closeAllDialogs(layout.dialogRoot);
    stopTimer();
    setState({ ...createInitialState(), difficulty: getState().difficulty });
  };

  const pause = (): void => {
    // Keep the exact remaining time, then freeze it.
    const state = withCurrentTime(getState());
    const paused = pauseGame(state);

    if (paused === state) {
      return;
    }

    stopTimer();
    setState(paused);
    openPauseDialog(layout.dialogRoot);
  };

  const resume = (): void => {
    const state = getState();
    const resumed = resumeGame(state);

    if (resumed === state) {
      return;
    }

    closeAllDialogs(layout.dialogRoot);
    setState(resumed);
    startTimer(resumed.timeLeft);
  };

  const showGameOver = (state: IGameState): void => {
    if (state.gameOverReason) {
      openGameOverDialog(layout.dialogRoot, {
        score: state.score,
        reason: state.gameOverReason
      });
    }
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

    if (!button || button.disabled) {
      return;
    }

    const state = withCurrentTime(getState());

    switch (button.dataset.action) {
      case 'start':
        startGame();
        break;
      case 'brew': {
        const settings = getSettings(state);
        const outcome = brew(state, settings);
        setState(outcome.state);
        syncTimer(outcome.state.timeLeft);

        if (outcome.check) {
          showBrewMessage(layout.stage, outcome.check, settings);
        }
        break;
      }
      case 'pause':
        pause();
        break;
      default:
        break;
    }
  });

  layout.dialogRoot.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');

    switch (button?.dataset.action) {
      case 'play-again':
        startGame();
        break;
      case 'resume':
        resume();
        break;
      case 'exit-to-menu':
        exitToMenu();
        break;
      default:
        break;
    }
  });

  // Every state change (timer, add, brew) passes this check first, so the game ends
  // at 00:00, at 0 lives, or when the ingredients run out.
  subscribe((state) => {
    const reason = getGameOverReason(state);

    if (reason) {
      stopTimer();
      const finished = endGame(state, reason);
      setState(finished);
      showGameOver(finished);
    }
  });

  subscribe(render);
  render();
}
