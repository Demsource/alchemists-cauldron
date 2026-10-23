import { restoreGame, toSavedGame } from '../logic/save';
import type { IGameState } from '../types/game';

const SAVE_KEY = 'alchemists-cauldron:save';

export function clearSave(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

// Writes the running game; returns false when there is nothing to save or storage fails.
export function saveGame(state: IGameState): boolean {
  const save = toSavedGame(state);

  if (!save) {
    return false;
  }

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

// Returns the restored (paused) game, or null. A broken save is deleted so the game starts normally.
export function loadGame(): IGameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (raw === null) {
      return null;
    }

    const state = restoreGame(JSON.parse(raw));

    if (!state) {
      clearSave();
    }

    return state;
  } catch {
    clearSave();
    return null;
  }
}

export function hasSave(): boolean {
  return loadGame() !== null;
}
