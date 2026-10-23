import { DEFAULT_DIFFICULTY } from '../data/difficulty';
import { DIFFICULTIES, DIFFICULTY_LABELS, getDifficulty, isDifficulty } from '../logic/difficulty';
import { addEntry, isTopResult, validatePlayerName } from '../logic/leaderboard';
import { getState } from '../state/game-state';
import { clearLeaderboard, loadLeaderboard, saveLeaderboard } from '../storage/leaderboard';
import type { IGameState } from '../types/game';
import type { Difficulty } from '../types/recipe';
import { closeAllDialogs, openConfirmDialog } from '../ui/dialogs';
import { openGameOverDialog } from '../ui/game-dialogs';
import type { ILayoutRefs } from '../ui/layout';
import { openLeaderboardDialog } from '../ui/leaderboard';

export interface ILeaderboardFlow {
  showGameOver: (state: IGameState) => void;
  submitScore: (form: HTMLFormElement) => void;
  showLeaderboard: (difficulty?: Difficulty) => void;
  switchTab: (value: string | undefined) => void;
  askToClear: () => void;
  confirmClear: () => void;
  resetRun: () => void;
}

interface ILeaderboardFlowDeps {
  showMenu: () => void;
}

export function createLeaderboardFlow(
  layout: ILayoutRefs,
  { showMenu }: ILeaderboardFlowDeps
): ILeaderboardFlow {
  // Set once the finished run is written to the leaderboard, so the name is asked only once.
  let isScoreSaved = false;
  // The difficulty whose list is on screen; Clear Leaderboard applies to this one.
  let leaderboardDifficulty: Difficulty = DEFAULT_DIFFICULTY;

  const resetRun = (): void => {
    isScoreSaved = false;
  };

  const showGameOver = (state: IGameState): void => {
    if (state.gameOverReason) {
      openGameOverDialog(layout.dialogRoot, {
        score: state.score,
        reason: state.gameOverReason,
        isTopResult: isScoreSaved
          ? undefined
          : isTopResult(loadLeaderboard(getDifficulty(state)), state.score)
      });
    }
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

  const showLeaderboard = (difficulty: Difficulty = getDifficulty(getState())): void => {
    leaderboardDifficulty = difficulty;
    closeAllDialogs(layout.dialogRoot);

    const leaderboard = openLeaderboardDialog(layout.dialogRoot, {
      difficulty,
      tabs: DIFFICULTIES.map((item) => ({ difficulty: item, label: DIFFICULTY_LABELS[item] })),
      rows: loadLeaderboard(difficulty).map((entry) => ({
        ...entry,
        difficultyLabel: DIFFICULTY_LABELS[entry.difficulty]
      }))
    });
    leaderboard.element.addEventListener('close', returnFromLeaderboard);
  };

  const switchTab = (value: string | undefined): void => {
    if (isDifficulty(value) && value !== leaderboardDifficulty) {
      showLeaderboard(value);
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

    const difficulty = getDifficulty(state);
    const entries = addEntry(loadLeaderboard(difficulty), {
      name: validation.name,
      score: state.score,
      timestamp: Date.now(),
      difficulty
    });
    saveLeaderboard(difficulty, entries);
    isScoreSaved = true;

    showLeaderboard(difficulty);
  };

  const askToClear = (): void => {
    const label = DIFFICULTY_LABELS[leaderboardDifficulty];

    openConfirmDialog(layout.dialogRoot, {
      id: 'clear-leaderboard-dialog',
      title: `Clear ${label} results?`,
      message: `Every name and score on the ${label} leaderboard will be erased. This cannot be undone.`,
      confirmLabel: 'Clear',
      confirmAction: 'confirm-clear-leaderboard'
    });
  };

  const confirmClear = (): void => {
    clearLeaderboard(leaderboardDifficulty);
    showLeaderboard(leaderboardDifficulty);
  };

  return {
    showGameOver,
    submitScore,
    showLeaderboard,
    switchTab,
    askToClear,
    confirmClear,
    resetRun
  };
}
