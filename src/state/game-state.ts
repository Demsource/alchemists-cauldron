import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS, getShelfIngredients } from '../data/difficulty';
import { createStock } from '../logic/stock';
import type { IDifficultySettings, IGameState } from '../types/game';

type Listener = (state: IGameState) => void;

export function getSettings(state: IGameState): IDifficultySettings {
  return DIFFICULTY_SETTINGS[state.difficulty ?? DEFAULT_DIFFICULTY];
}

export function createInitialState(): IGameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    difficulty: DEFAULT_DIFFICULTY
  };
}

export function startNewGame(difficulty = DEFAULT_DIFFICULTY): IGameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  return {
    status: 'playing',
    score: 0,
    timeLeft: settings.startTime,
    lives: settings.lives,
    activeRecipe: null, // picked in US 1.3
    cauldronIngredients: [],
    shelfStock: createStock(getShelfIngredients(settings)),
    difficulty
  };
}

let currentState: IGameState = createInitialState();
const listeners = new Set<Listener>();

export function getState(): IGameState {
  return currentState;
}

export function setState(nextState: IGameState): void {
  if (nextState === currentState) {
    return;
  }

  currentState = nextState;
  listeners.forEach((listener) => listener(currentState));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
