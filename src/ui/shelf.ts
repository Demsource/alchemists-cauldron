import { INGREDIENT_ICONS, type IngredientIconName } from '../assets/icons';
import { formatSigned } from '../utils/format';
import { createElement, createIcon } from './dom';

export interface IShelfItemView {
  id: IngredientIconName;
  name: string;
  temperature: number;
  density: number;
  magicPower: number;
  stock: number;
}

export interface IShelfView {
  items: IShelfItemView[];
  isBlocked: boolean;
  showValues: boolean;
}

function renderValue(modifier: string, short: string, label: string, value: number): HTMLElement {
  const chip = createElement('span', `value-chip value-chip--${modifier}`);
  chip.title = label;
  chip.append(
    createElement('span', 'value-chip__key', short),
    createElement('span', 'value-chip__num', formatSigned(value))
  );
  return chip;
}

function renderCard(item: IShelfItemView, isBlocked: boolean, showValues: boolean): HTMLLIElement {
  const slot = createElement('li', 'shelf__slot');
  const card = createElement('button', 'shelf-card');
  card.type = 'button';
  card.dataset.ingredientId = item.id;

  const isEmpty = item.stock <= 0;
  card.classList.toggle('shelf-card--empty', isEmpty);
  card.disabled = isEmpty || isBlocked;
  // Only a usable card can be dragged: never at stock 0, while blocked or paused.
  card.draggable = !card.disabled;
  card.setAttribute('aria-label', `Add ${item.name}, ${item.stock} left`);

  const iconWrap = createElement('span', 'shelf-card__icon');
  if (!isEmpty) {
    iconWrap.append(createIcon(INGREDIENT_ICONS[item.id]));
  }

  const body = createElement('span', 'shelf-card__body');
  body.append(createElement('span', 'shelf-card__name', item.name));

  if (showValues) {
    const values = createElement('span', 'shelf-card__values');
    values.append(
      renderValue('temperature', 'T', 'Temperature', item.temperature),
      renderValue('density', 'D', 'Density', item.density),
      renderValue('magic', 'MP', 'Magic Power', item.magicPower)
    );
    body.append(values);
  }

  const badge = createElement('span', 'shelf-card__stock', String(Math.max(0, item.stock)));
  badge.setAttribute('aria-hidden', 'true');

  card.append(iconWrap, body, badge);
  slot.append(card);
  return slot;
}

export function renderShelf(container: HTMLElement, view: IShelfView): void {
  const panel = createElement('div', 'shelf panel panel--wood');
  panel.classList.toggle('shelf--blocked', view.isBlocked);
  panel.append(createElement('h2', 'panel-title shelf__title', 'Ingredients'));

  if (view.items.length === 0) {
    panel.append(createElement('p', 'shelf__empty', 'The shelf fills up when a game starts.'));
  } else {
    const list = createElement('ul', 'shelf__list');
    list.append(...view.items.map((item) => renderCard(item, view.isBlocked, view.showValues)));
    panel.append(list);
  }

  container.replaceChildren(panel);
}
