import { UI_ICONS } from '../assets/icons';
import { formatSigned } from '../utils/format';
import { toPercent } from '../utils/scale';
import { createElement, createIcon } from './dom';

export type BarKey = 'temperature' | 'density' | 'magic';

export interface IBarView {
  key: BarKey;
  label: string;
  value: number;
  min: number;
  max: number;
  target: { min: number; max: number } | null;
  isInTarget: boolean;
}

const BAR_ICONS: Record<BarKey, string> = {
  temperature: UI_ICONS.temperature,
  density: UI_ICONS.density,
  magic: UI_ICONS.magic
};

const formatTick = (value: number): string => (value < 0 ? `−${Math.abs(value)}` : String(value));

function setTick(tick: HTMLElement, value: number, bar: IBarView): void {
  tick.textContent = formatTick(value);
  tick.style.setProperty('--pos', `${toPercent(value, bar.min, bar.max)}%`);
}

function query<T extends HTMLElement>(parent: HTMLElement, selector: string): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Bar element "${selector}" is missing`);
  }
  return element;
}

// Builds the static structure once. All changing parts are set in updateBar().
function createBar(bar: IBarView): HTMLDivElement {
  const card = createElement('div', `bar panel bar--${bar.key}`);
  card.dataset.bar = bar.key;

  const header = createElement('div', 'bar__header');
  header.append(
    createIcon(BAR_ICONS[bar.key], 'icon bar__icon'),
    createElement('span', 'bar__label', bar.label),
    createElement('output', 'bar__value')
  );

  const track = createElement('div', 'bar__track');
  track.setAttribute('role', 'meter');
  track.setAttribute('aria-label', bar.label);
  track.append(
    createElement('div', 'bar__fill'),
    createElement('div', 'bar__zone'),
    createElement('div', 'bar__zero'),
    createElement('div', 'bar__marker')
  );

  const ticks = createElement('div', 'bar__ticks');
  ticks.setAttribute('aria-hidden', 'true');
  ticks.append(
    createElement('span', 'bar__tick bar__tick--min'),
    createElement('span', 'bar__tick bar__tick--max'),
    createElement('span', 'bar__tick bar__tick--zero'),
    createElement('span', 'bar__tick bar__tick--target bar__tick--target-min'),
    createElement('span', 'bar__tick bar__tick--target bar__tick--target-max')
  );

  card.append(header, track, ticks, createElement('p', 'bar__target'));
  return card;
}

// Only changes text, attributes and CSS custom properties, so CSS transitions can animate.
function updateBar(card: HTMLElement, bar: IBarView): void {
  const zero = toPercent(0, bar.min, bar.max);
  const current = toPercent(bar.value, bar.min, bar.max);
  const hasNegative = bar.min < 0;

  card.classList.toggle('bar--in-target', bar.isInTarget);
  card.classList.toggle('bar--has-target', bar.target !== null);
  card.classList.toggle('bar--has-zero', hasNegative);

  query(card, '.bar__value').textContent = formatSigned(bar.value);

  const track = query(card, '.bar__track');
  track.setAttribute('aria-valuemin', String(bar.min));
  track.setAttribute('aria-valuemax', String(bar.max));
  track.setAttribute('aria-valuenow', String(bar.value));
  track.style.setProperty('--zero', `${zero}%`);
  track.style.setProperty('--fill-start', `${Math.min(zero, current)}%`);
  track.style.setProperty('--fill-size', `${Math.abs(current - zero)}%`);
  track.style.setProperty('--marker', `${current}%`);

  setTick(query(card, '.bar__tick--min'), bar.min, bar);
  setTick(query(card, '.bar__tick--max'), bar.max, bar);
  setTick(query(card, '.bar__tick--zero'), 0, bar);

  const zone = query(card, '.bar__zone');
  const target = query(card, '.bar__target');

  if (bar.target) {
    const start = toPercent(bar.target.min, bar.min, bar.max);
    const end = toPercent(bar.target.max, bar.min, bar.max);
    zone.style.setProperty('--zone-start', `${start}%`);
    zone.style.setProperty('--zone-size', `${end - start}%`);
    setTick(query(card, '.bar__tick--target-min'), bar.target.min, bar);
    setTick(query(card, '.bar__tick--target-max'), bar.target.max, bar);
    target.textContent = `Target ${formatTick(bar.target.min)} – ${formatTick(bar.target.max)}`;
  } else {
    target.textContent = 'Target —';
  }
}

export function renderBars(container: HTMLElement, bars: IBarView[]): void {
  let wrapper = container.querySelector<HTMLDivElement>(':scope > .bars');

  if (!wrapper) {
    wrapper = createElement('div', 'bars');
    wrapper.append(...bars.map(createBar));
    container.replaceChildren(wrapper);
  }

  bars.forEach((bar) => {
    const card = wrapper.querySelector<HTMLElement>(`[data-bar="${bar.key}"]`);
    if (card) {
      updateBar(card, bar);
    }
  });
}
