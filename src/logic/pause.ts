import type { IGameState } from '../types/game';

// Only a running game can be paused; the same state object is returned otherwise.
export function pauseGame(state: IGameState): IGameState {
  return state.status === 'playing' ? { ...state, status: 'paused' } : state;
}

export function resumeGame(state: IGameState): IGameState {
  return state.status === 'paused' ? { ...state, status: 'playing' } : state;
}
