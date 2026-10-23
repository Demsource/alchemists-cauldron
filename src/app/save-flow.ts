import { canSave } from '../logic/save';
import { getState, subscribe } from '../state/game-state';
import { withCurrentTime } from '../state/game-timer';
import { clearSave, saveGame } from '../storage/save';

export interface ISaveFlow {
  watchChanges: () => void;
}

export function createSaveFlow(): ISaveFlow {
  // Every change of a running or paused game is saved (timer ticks included), so the save
  // stays current even if the page closes without a clean pagehide. A finished game is
  // never offered as Continue, so its save is removed.
  const watchChanges = (): void => {
    subscribe((state) => {
      if (canSave(state)) {
        saveGame(state);
      } else if (state.status === 'game-over') {
        clearSave();
      }
    });

    // Leaving or reloading the page stores the exact remaining time, not the last whole second.
    window.addEventListener('pagehide', () => {
      const state = getState();

      if (canSave(state)) {
        saveGame(state.status === 'playing' ? withCurrentTime(state) : state);
      }
    });
  };

  return { watchChanges };
}
