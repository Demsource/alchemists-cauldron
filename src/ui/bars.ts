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

function renderTick(value: number, bar: IBarView, modifier = ''): HTMLSpanElement {
  const tick = createElement('span', `bar__tick ${modifier}`.trim(), formatTick(value));
  tick.style.setProperty('--pos', `${toPercent(value, bar.min, bar.max)}%`);
  return tick;
}

function renderBar(bar: IBarView): HTMLDivElement {
  const card = createElement('div', `bar panel bar--${bar.key}`);
  card.classList.toggle('bar--in-target', bar.isInTarget);

  const zero = toPercent(0, bar.min, bar.max);
  const current = toPercent(bar.value, bar.min, bar.max);

  const header = createElement('div', 'bar__header');
  header.append(
    createIcon(BAR_ICONS[bar.key], 'icon bar__icon'),
    createElement('span', 'bar__label', bar.label),
    createElement('output', 'bar__value', formatSigned(bar.value))
  );

  const track = createElement('div', 'bar__track');
  track.setAttribute('role', 'meter');
  track.setAttribute('aria-label', bar.label);
  track.setAttribute('aria-valuemin', String(bar.min));
  track.setAttribute('aria-valuemax', String(bar.max));
  track.setAttribute('aria-valuenow', String(bar.value));
  track.style.setProperty('--zero', `${zero}%`);
  track.style.setProperty('--fill-start', `${Math.min(zero, current)}%`);
  track.style.setProperty('--fill-size', `${Math.abs(current - zero)}%`);
  track.style.setProperty('--marker', `${current}%`);

  const fill = createElement('div', 'bar__fill');
  const marker = createElement('div', 'bar__marker');
  track.append(fill);

  if (bar.target) {
    const zone = createElement('div', 'bar__zone');
    const start = toPercent(bar.target.min, bar.min, bar.max);
    const end = toPercent(bar.target.max, bar.min, bar.max);
    zone.style.setProperty('--zone-start', `${start}%`);
    zone.style.setProperty('--zone-size', `${end - start}%`);
    track.append(zone);
  }

  if (bar.min < 0) {
    track.append(createElement('div', 'bar__zero'));
  }
  track.append(marker);

  const ticks = createElement('div', 'bar__ticks');
  ticks.setAttribute('aria-hidden', 'true');
  ticks.append(renderTick(bar.min, bar), renderTick(bar.max, bar));
  if (bar.min < 0) {
    ticks.append(renderTick(0, bar));
  }
  if (bar.target) {
    ticks.append(
      renderTick(bar.target.min, bar, 'bar__tick--target'),
      renderTick(bar.target.max, bar, 'bar__tick--target')
    );
  }

  const target = createElement(
    'p',
    'bar__target',
    bar.target ? `Target ${formatTick(bar.target.min)} – ${formatTick(bar.target.max)}` : 'Target —'
  );

  card.append(header, track, ticks, target);
  return card;
}

export function renderBars(container: HTMLElement, bars: IBarView[]): void {
  const wrapper = createElement('div', 'bars');
  wrapper.append(...bars.map(renderBar));
  container.replaceChildren(wrapper);
}
