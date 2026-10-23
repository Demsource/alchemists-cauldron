import { SCENE_ICONS, UI_ICONS } from '../assets/icons';
import { createElement, createIcon } from './dom';

interface IRangeView {
  min: number;
  max: number;
}

export interface IRecipePanelView {
  recipe: {
    name: string;
    temperature: IRangeView;
    density: IRangeView;
    magicPower: IRangeView;
  } | null;
  added: number;
  capacity: number;
  difficultyLabel: string;
  activeReactions: string[]; // names of reactions changing the values right now
}

const formatNumber = (value: number): string => (value < 0 ? `−${Math.abs(value)}` : String(value));

const formatRange = (range: IRangeView | undefined): string =>
  range ? `${formatNumber(range.min)} – ${formatNumber(range.max)}` : '—';

function renderRow(
  modifier: string,
  icon: string,
  label: string,
  range: IRangeView | undefined
): HTMLDivElement {
  const row = createElement('div', `recipe__row recipe__row--${modifier}`);
  const term = createElement('dt', 'recipe__row-label');
  term.append(createIcon(icon, 'icon recipe__row-icon'), label);
  row.append(term, createElement('dd', 'recipe__row-range', formatRange(range)));
  return row;
}

function renderCorners(): HTMLElement[] {
  return ['tl', 'tr', 'bl', 'br'].map((corner) =>
    createIcon(SCENE_ICONS.frameCorner, `icon recipe__corner recipe__corner--${corner}`)
  );
}

export function renderRecipePanel(container: HTMLElement, view: IRecipePanelView): void {
  const panel = createElement('article', 'recipe parchment');
  const { recipe } = view;
  panel.classList.toggle('recipe--empty', recipe === null);

  const heading = createElement('header', 'recipe__header');
  heading.append(
    createElement('p', 'recipe__difficulty', `${view.difficultyLabel} mode`),
    createElement('p', 'recipe__kicker', 'Current recipe'),
    createIcon(UI_ICONS.flask, 'icon recipe__flask'),
    createElement('h2', 'recipe__name', recipe ? recipe.name : 'No recipe yet')
  );

  if (!recipe) {
    heading.append(createElement('p', 'recipe__hint', 'Start a game to reveal your first recipe.'));
  }

  const ranges = createElement('dl', 'recipe__ranges');
  ranges.append(
    renderRow('temperature', UI_ICONS.temperature, 'Temperature', recipe?.temperature),
    renderRow('density', UI_ICONS.density, 'Density', recipe?.density),
    renderRow('magic', UI_ICONS.magic, 'Magic Power', recipe?.magicPower)
  );

  const counter = createElement('p', 'recipe__counter');
  counter.setAttribute('aria-live', 'polite');
  counter.append(
    createElement('span', 'recipe__counter-label', 'Ingredients:'),
    createElement('strong', 'recipe__counter-value', `${view.added} / ${view.capacity}`)
  );
  counter.classList.toggle('recipe__counter--full', view.added >= view.capacity);

  panel.append(
    ...renderCorners(),
    heading,
    createIcon(SCENE_ICONS.divider, 'icon recipe__divider'),
    ranges
  );

  // Tells the player why a value is not a plain sum.
  if (view.activeReactions.length > 0) {
    const reactions = createElement('p', 'recipe__reactions');
    reactions.append(
      createElement('span', 'recipe__reactions-label', 'Active reactions:'),
      ` ${view.activeReactions.join(', ')}`
    );
    panel.append(reactions);
  }

  panel.append(counter);
  container.replaceChildren(panel);
}
