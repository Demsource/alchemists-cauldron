import { DEFAULT_DIFFICULTY } from '../data/difficulty';
import {
  canChangeDifficulty,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  getDifficulty,
  getDifficultySettings,
  getDifficultySummary,
  isDifficulty,
  setDifficulty
} from '../logic/difficulty';
import { createInitialState, getState, setState } from '../state/game-state';
import { loadDifficulty, saveDifficulty } from '../storage/preferences';
import { hasSave } from '../storage/save';
import { closeAllDialogs } from '../ui/dialogs';
import type { ILayoutRefs } from '../ui/layout';
import { openMenuDialog, updateMenuDifficulty } from '../ui/menu';

export interface IMenuFlow {
  showMenu: () => void;
  chooseDifficulty: (value: string | undefined) => void;
  restoreDifficulty: () => void;
}

export function createMenuFlow(layout: ILayoutRefs): IMenuFlow {
  const showMenu = (): void => {
    closeAllDialogs(layout.dialogRoot);
    const state = getState();

    openMenuDialog(layout.dialogRoot, {
      difficulty: getDifficulty(state),
      options: DIFFICULTIES.map((difficulty) => ({
        difficulty,
        label: DIFFICULTY_LABELS[difficulty],
        summary: getDifficultySummary(getDifficultySettings(difficulty))
      })),
      canChangeDifficulty: canChangeDifficulty(state),
      canContinue: state.status === 'menu' && hasSave()
    });
  };

  const chooseDifficulty = (value: string | undefined): void => {
    if (!isDifficulty(value)) {
      return;
    }

    const state = getState();
    const next = setDifficulty(state, value);

    if (next !== state) {
      // After Game Over the finished run belongs to its own difficulty (and leaderboard),
      // so choosing another one leaves that run and returns to a fresh start screen.
      setState(
        state.status === 'game-over' ? { ...createInitialState(), difficulty: value } : next
      );
      saveDifficulty(value);
      updateMenuDifficulty(layout.dialogRoot, value);
    }
  };

  // Start on the difficulty the player chose last time (Medium when nothing is saved).
  const restoreDifficulty = (): void => {
    setState(setDifficulty(getState(), loadDifficulty(DEFAULT_DIFFICULTY)));
  };

  return { showMenu, chooseDifficulty, restoreDifficulty };
}
