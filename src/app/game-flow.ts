import { addIngredient } from '../logic/cauldron';
import { endGame, getGameOverReason } from '../logic/game-over';
import { pauseGame, resumeGame } from '../logic/pause';
import { resolveReactions } from '../logic/reactions-logic';
import { brew } from '../logic/score';
import {
  createInitialState,
  getSettings,
  getState,
  setState,
  startNewGame,
  subscribe
} from '../state/game-state';
import { startTimer, stopTimer, syncTimer, withCurrentTime } from '../state/game-timer';
import { clearSave, loadGame } from '../storage/save';
import type { IGameState } from '../types/game';
import type { IngredientId } from '../types/ingredient';
import { showBrewMessage } from '../ui/brew-message';
import { closeAllDialogs } from '../ui/dialogs';
import { openPauseDialog } from '../ui/game-dialogs';
import type { ILayoutRefs } from '../ui/layout';

export interface IGameFlow {
  startGame: () => void;
  continueGame: () => void;
  exitToMenu: () => void;
  pause: () => void;
  resume: () => void;
  brewMixture: () => void;
  addToCauldron: (id: IngredientId) => void;
  watchGameOver: () => void;
}

interface IGameFlowDeps {
  onNewGame: () => void;
  onGameOver: (state: IGameState) => void;
}

export function createGameFlow(
  layout: ILayoutRefs,
  { onNewGame, onGameOver }: IGameFlowDeps
): IGameFlow {
  const startGame = (): void => {
    closeAllDialogs(layout.dialogRoot);
    onNewGame();
    const newGame = startNewGame(getState().difficulty);
    setState(newGame);
    startTimer(newGame.timeLeft);
  };

  // Leaving the run on purpose drops its save.
  const exitToMenu = (): void => {
    closeAllDialogs(layout.dialogRoot);
    stopTimer();
    clearSave();
    setState({ ...createInitialState(), difficulty: getState().difficulty });
  };

  // Restores the saved run (stock included, never re-rolled) and opens it paused;
  // Resume starts the timer from the saved time.
  const continueGame = (): void => {
    const saved = loadGame();

    if (!saved) {
      return;
    }

    closeAllDialogs(layout.dialogRoot);
    stopTimer();
    onNewGame();
    setState(saved);
    openPauseDialog(layout.dialogRoot);
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

  const brewMixture = (): void => {
    const state = withCurrentTime(getState());
    const settings = getSettings(state);
    const outcome = brew(state, settings);
    setState(outcome.state);
    syncTimer(outcome.state.timeLeft);

    if (outcome.check) {
      showBrewMessage(layout.stage, outcome.check, settings);
    }
  };

  // The shelf is re-rendered on every change, so give keyboard focus back to the same card.
  const refocusCard = (id: IngredientId): void => {
    const card = layout.shelf.querySelector<HTMLButtonElement>(`[data-ingredient-id="${id}"]`);
    if (card && !card.disabled) {
      card.focus();
    }
  };

  const addToCauldron = (id: IngredientId): void => {
    // Exact time, so a reaction's time penalty starts from the real remaining time.
    const state = withCurrentTime(getState());
    const added = addIngredient(state, id, getSettings(state));

    if (added === state) {
      return;
    }

    // Reactions that just fired apply their one-time effects; value effects come from the list.
    const outcome = resolveReactions(state, added);
    setState(outcome.state);

    if (outcome.state.timeLeft !== added.timeLeft) {
      syncTimer(outcome.state.timeLeft);
    }

    refocusCard(id);
  };

  // Every state change (timer, add, brew) passes this check first, so the game ends
  // at 00:00, at 0 lives, or when the ingredients run out.
  const watchGameOver = (): void => {
    subscribe((state) => {
      const reason = getGameOverReason(state);

      if (reason) {
        stopTimer();
        const finished = endGame(state, reason);
        setState(finished);
        onGameOver(finished);
      }
    });
  };

  return {
    startGame,
    continueGame,
    exitToMenu,
    pause,
    resume,
    brewMixture,
    addToCauldron,
    watchGameOver
  };
}
