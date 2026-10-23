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

function renderTimer(): HTMLDivElement {
  const block = createElement('div', 'hud__block hud__block--timer');

  const row = createElement('div', 'hud__timer-row');
  const time = createElement('time', 'hud__value hud__time');
  time.setAttribute('role', 'timer');
  row.append(
    createIcon(UI_ICONS.clock, 'icon hud__icon'),
    createElement('span', 'hud__label', 'Time'),
    time
  );

  const track = createElement('div', 'hud__time-track');
  track.append(createElement('div', 'hud__time-fill'));

  block.append(row, track);
  return block;
}

// The time changes every second, so it is patched in place: the time bar transition
// and the low-time pulse keep running instead of restarting.
function updateTimer(frame: HTMLElement, { isActive, timeLeft, timeTotal }: IHudView): void {
  const block = frame.querySelector<HTMLElement>('.hud__block--timer');
  const time = frame.querySelector<HTMLElement>('.hud__time');
  const fill = frame.querySelector<HTMLElement>('.hud__time-fill');
  const ratio = timeTotal > 0 ? Math.min(1, Math.max(0, timeLeft / timeTotal)) : 0;

  block?.classList.toggle('hud__block--low', isActive && timeLeft < LOW_TIME_THRESHOLD);
  if (time) {
    time.textContent = formatTime(timeLeft);
  }
  fill?.style.setProperty('--time-ratio', String(ratio));
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
  const staticKey = `${view.isActive}|${view.score}|${view.lives}|${view.maxLives}`;
  let frame = container.querySelector<HTMLElement>(':scope > .hud__frame');

  // Score and lives change rarely: rebuild only then.
  if (!frame || frame.dataset.key !== staticKey) {
    frame = createElement('div', 'hud__frame panel');
    frame.dataset.key = staticKey;
    frame.append(renderScore(view.score), renderTimer(), renderLives(view));
    container.replaceChildren(frame);
  }

  updateTimer(frame, view);
}
