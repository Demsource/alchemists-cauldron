import { DEFAULT_DIFFICULTY } from './data/difficulty';
import { isIngredientId } from './data/ingredients';
import { addIngredient } from './logic/cauldron';
import { endGame, getGameOverReason } from './logic/game-over';
import { addEntry, isTopResult, validatePlayerName } from './logic/leaderboard';
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
import { clearLeaderboard, loadLeaderboard, saveLeaderboard } from './storage/leaderboard';
import type { IGameState } from './types/game';
import type { IngredientId } from './types/ingredient';
import { showBrewMessage } from './ui/brew-message';
import { closeAllDialogs, closeDialog, openConfirmDialog } from './ui/dialogs';
import { openGameOverDialog, openPauseDialog } from './ui/game-dialogs';
import { renderLayout } from './ui/layout';
import { openLeaderboardDialog } from './ui/leaderboard';
import { openMenuDialog } from './ui/menu';
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
    isScoreSaved = false;
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

  // Set once the finished run is written to the leaderboard, so the name is asked only once.
  let isScoreSaved = false;

  const showGameOver = (state: IGameState): void => {
    if (state.gameOverReason) {
      openGameOverDialog(layout.dialogRoot, {
        score: state.score,
        reason: state.gameOverReason,
        isTopResult: isScoreSaved ? undefined : isTopResult(loadLeaderboard(), state.score)
      });
    }
  };

  const submitScore = (form: HTMLFormElement): void => {
    const input = form.querySelector<HTMLInputElement>('input[name="playerName"]');
    const error = form.querySelector<HTMLElement>('.name-form__error');
    const state = getState();

    if (!input || state.status !== 'game-over' || isScoreSaved) {
      return;
    }

    const validation = validatePlayerName(input.value);

    if (!validation.isValid) {
      input.setAttribute('aria-invalid', 'true');
      if (error) {
        error.textContent = validation.error;
      }
      input.focus();
      return;
    }

    const entries = addEntry(loadLeaderboard(), {
      name: validation.name,
      score: state.score,
      timestamp: Date.now()
    });
    saveLeaderboard(entries);
    isScoreSaved = true;

    showLeaderboard();
  };

  const showMenu = (): void => {
    closeAllDialogs(layout.dialogRoot);
    openMenuDialog(layout.dialogRoot, {
      difficulty: getState().difficulty ?? DEFAULT_DIFFICULTY,
      isDifficultyEnabled: false, // Level 2
      canContinue: false // Level 2
    });
  };

  // Closing the leaderboard (Back or Escape) returns to where it was opened from:
  // the Game Over screen after a run, otherwise the menu.
  const returnFromLeaderboard = (): void => {
    if (layout.dialogRoot.querySelector('dialog')) {
      return;
    }

    const state = getState();

    if (state.status === 'game-over') {
      showGameOver(state);
    } else if (state.status === 'menu') {
      showMenu();
    }
  };

  const showLeaderboard = (): void => {
    closeAllDialogs(layout.dialogRoot);
    const leaderboard = openLeaderboardDialog(layout.dialogRoot, loadLeaderboard());
    leaderboard.element.addEventListener('close', returnFromLeaderboard);
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
      case 'menu':
        showMenu();
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
      case 'new-game':
        startGame();
        break;
      case 'open-leaderboard':
        showLeaderboard();
        break;
      case 'clear-leaderboard':
        openConfirmDialog(layout.dialogRoot, {
          id: 'clear-leaderboard-dialog',
          title: 'Clear all results?',
          message: 'Every name and score on the leaderboard will be erased. This cannot be undone.',
          confirmLabel: 'Clear',
          confirmAction: 'confirm-clear-leaderboard'
        });
        break;
      case 'confirm-clear-leaderboard':
        clearLeaderboard();
        showLeaderboard();
        break;
      case 'close-dialog': {
        const dialog = button?.closest('dialog');
        if (dialog) {
          closeDialog(dialog);
        }
        break;
      }
      case 'exit-to-menu':
        exitToMenu();
        break;
      default:
        break;
    }
  });

  layout.dialogRoot.addEventListener('submit', (event) => {
    const form = event.target;

    if (form instanceof HTMLFormElement && form.id === 'player-name-form') {
      event.preventDefault();
      submitScore(form);
    }
  });

  // Typing clears the previous name error.
  layout.dialogRoot.addEventListener('input', (event) => {
    const input = event.target;

    if (input instanceof HTMLInputElement && input.name === 'playerName') {
      input.removeAttribute('aria-invalid');
      const error = input.form?.querySelector('.name-form__error');
      if (error) {
        error.textContent = '';
      }
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

  // Leaving the tab pauses a running game; the player resumes it from the dialog.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && getState().status === 'playing') {
      pause();
    }
  });

  subscribe(render);
  render();
}
