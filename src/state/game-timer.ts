import { getDisplaySecond, getEndTime, getTimeLeft } from '../logic/timer';
import type { IGameState } from '../types/game';
import { getState, setState } from './game-state';

let endTime: number | null = null;
let frameId: number | null = null;

// Each frame re-reads the clock; the state only changes when the shown second changes.
function update(): void {
  if (endTime === null) {
    return;
  }

  const state = getState();
  const timeLeft = getTimeLeft(endTime);

  if (
    state.status === 'playing' &&
    getDisplaySecond(timeLeft) !== getDisplaySecond(state.timeLeft)
  ) {
    setState({ ...state, timeLeft });
  }

  if (timeLeft > 0) {
    frameId = requestAnimationFrame(update);
  } else {
    frameId = null;
  }
}

export function stopTimer(): void {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
  frameId = null;
  endTime = null;
}

export function startTimer(timeLeft: number): void {
  stopTimer();
  endTime = getEndTime(timeLeft);
  frameId = requestAnimationFrame(update);
}

// Moves the end of the running timer, e.g. after the brew time bonus.
export function syncTimer(timeLeft: number): void {
  if (endTime !== null) {
    endTime = getEndTime(timeLeft);
  }
}

// The state only stores whole-second updates, so read the exact time before an action uses it.
export function withCurrentTime(state: IGameState): IGameState {
  return endTime === null ? state : { ...state, timeLeft: getTimeLeft(endTime) };
}
