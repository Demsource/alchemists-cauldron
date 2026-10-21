import { UI_ICONS } from '../assets/icons';
import { formatTime } from '../utils/format';
import { createElement, createIcon } from './dom';

const LOW_TIME_THRESHOLD = 15;

export interface IHudView {
  isActive: boolean;
  score: number;
  timeLeft: number;
  timeTotal: number;
  lives: number;
  maxLives: number;
}

function renderScore(score: number): HTMLDivElement {
  const block = createElement('div', 'hud__block hud__block--score');
  const value = createElement('span', 'hud__value', String(score));

  block.append(
    createIcon(UI_ICONS.score, 'icon hud__icon'),
    createElement('span', 'hud__label', 'Score'),
    value
  );
  return block;
}

function renderTimer({ isActive, timeLeft, timeTotal }: IHudView): HTMLDivElement {
  const block = createElement('div', 'hud__block hud__block--timer');
  const isLow = isActive && timeLeft < LOW_TIME_THRESHOLD;
  block.classList.toggle('hud__block--low', isLow);

  const row = createElement('div', 'hud__timer-row');
  const time = createElement('time', 'hud__value hud__time', formatTime(timeLeft));
  time.setAttribute('role', 'timer');
  row.append(
    createIcon(UI_ICONS.clock, 'icon hud__icon'),
    createElement('span', 'hud__label', 'Time'),
    time
  );

  const track = createElement('div', 'hud__time-track');
  const fill = createElement('div', 'hud__time-fill');
  const ratio = timeTotal > 0 ? Math.min(1, Math.max(0, timeLeft / timeTotal)) : 0;
  fill.style.setProperty('--time-ratio', String(ratio));
  track.append(fill);

  block.append(row, track);
  return block;
}

function renderLives({ isActive, lives, maxLives }: IHudView): HTMLDivElement {
  const block = createElement('div', 'hud__block hud__block--lives');
  const hearts = createElement('div', 'hud__hearts');
  hearts.setAttribute('role', 'img');
  hearts.setAttribute('aria-label', isActive ? `${lives} of ${maxLives} lives left` : 'No lives');

  if (isActive) {
    for (let index = 0; index < maxLives; index += 1) {
      const isFull = index < lives;
      hearts.append(
        createIcon(
          isFull ? UI_ICONS.heart : UI_ICONS.heartEmpty,
          `icon hud__heart ${isFull ? '' : 'hud__heart--lost'}`.trim()
        )
      );
    }
  } else {
    hearts.append(createElement('span', 'hud__placeholder', '—'));
  }

  block.append(createElement('span', 'hud__label', 'Lives'), hearts);
  return block;
}

export function renderHud(container: HTMLElement, view: IHudView): void {
  const frame = createElement('div', 'hud__frame panel');
  frame.append(renderScore(view.score), renderTimer(view), renderLives(view));
  container.replaceChildren(frame);
}
