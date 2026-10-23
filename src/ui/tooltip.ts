import { UI_ICONS } from '../assets/icons';
import { formatSigned } from '../utils/format';
import { createElement, createIcon } from './dom';

const TOOLTIP_ID = 'ingredient-tooltip';
const GAP = 10; // px between card and tooltip
const EDGE = 8; // px kept free at the viewport edges

export interface ITooltipView {
  name: string;
  description: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface ITooltip {
  show: (anchor: HTMLElement, view: ITooltipView) => void;
  hide: () => void;
}

function renderRow(modifier: string, icon: string, label: string, value: number): HTMLElement {
  const row = createElement('div', `tooltip__row tooltip__row--${modifier}`);
  row.append(
    createIcon(icon, 'icon tooltip__icon'),
    createElement('dt', 'tooltip__label', label),
    createElement('dd', 'tooltip__value', formatSigned(value))
  );
  return row;
}

function renderContent(view: ITooltipView): HTMLElement[] {
  const values = createElement('dl', 'tooltip__values');
  values.append(
    renderRow('temperature', UI_ICONS.temperature, 'Temperature', view.temperature),
    renderRow('density', UI_ICONS.density, 'Density', view.density),
    renderRow('magic', UI_ICONS.magic, 'Magic Power', view.magicPower)
  );

  return [
    createElement('p', 'tooltip__title', view.name),
    values,
    createElement('p', 'tooltip__description', view.description)
  ];
}

/**
 * One shared tooltip placed outside the scrolling shelf, so it is never clipped.
 * It opens to the right of the card, or to the left / upward near the screen edges.
 */
export function createTooltip(root: HTMLElement): ITooltip {
  const tooltip = createElement('div', 'tooltip');
  tooltip.id = TOOLTIP_ID;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  root.append(tooltip);

  let anchor: HTMLElement | null = null;

  const hide = (): void => {
    tooltip.hidden = true;
    tooltip.classList.remove('tooltip--visible');
    anchor?.removeAttribute('aria-describedby');
    anchor = null;
  };

  const show = (target: HTMLElement, view: ITooltipView): void => {
    anchor?.removeAttribute('aria-describedby');
    anchor = target;
    target.setAttribute('aria-describedby', TOOLTIP_ID);

    tooltip.replaceChildren(...renderContent(view));
    tooltip.hidden = false;

    // Measure first, then choose the side from the free space.
    const card = target.getBoundingClientRect();
    const { width, height } = tooltip.getBoundingClientRect();
    const opensLeft = card.right + GAP + width > window.innerWidth - EDGE;
    const opensUp = card.top + height > window.innerHeight - EDGE;

    tooltip.classList.toggle('tooltip--left', opensLeft);
    tooltip.classList.toggle('tooltip--up', opensUp);

    const left = opensLeft ? card.left - GAP - width : card.right + GAP;
    const top = opensUp ? card.bottom - height : card.top;

    tooltip.style.left = `${Math.max(EDGE, left)}px`;
    tooltip.style.top = `${Math.max(EDGE, top)}px`;
    tooltip.classList.add('tooltip--visible');
  };

  return { show, hide };
}
