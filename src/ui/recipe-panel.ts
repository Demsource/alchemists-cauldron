import { SCENE_ICONS, UI_ICONS } from '../assets/icons';
import { t } from '../i18n';
import { SHORTCUT_KEYS } from '../logic/shortcuts';
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
  canHint: boolean; // only during a running game
}

// Compact on purpose: the recipe panel sets the board's row height.
function renderHintButton(canHint: boolean): HTMLButtonElement {
  const label = t('recipe.hintButton');
  const key = SHORTCUT_KEYS.hint;
  const button = createElement('button', 'btn recipe__hint-btn');
  button.type = 'button';
  button.dataset.action = 'hint';
  button.disabled = !canHint;
  button.setAttribute('aria-label', `${label} (${key})`);
  button.setAttribute('aria-keyshortcuts', key);

  const hint = createElement('kbd', 'actions__key', key);
  hint.setAttribute('aria-hidden', 'true');
  button.append(createIcon(UI_ICONS.hint, 'icon recipe__hint-icon'), label, hint);
  return button;
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
    createElement(
      'p',
      'recipe__difficulty',
      t('recipe.mode', { difficulty: view.difficultyLabel })
    ),
    createElement('p', 'recipe__kicker', t('recipe.kicker')),
    createIcon(UI_ICONS.flask, 'icon recipe__flask'),
    createElement('h2', 'recipe__name', recipe ? recipe.name : t('recipe.none'))
  );

  if (!recipe) {
    heading.append(createElement('p', 'recipe__hint', t('recipe.hint')));
  }

  const ranges = createElement('dl', 'recipe__ranges');
  ranges.append(
    renderRow('temperature', UI_ICONS.temperature, t('params.temperature'), recipe?.temperature),
    renderRow('density', UI_ICONS.density, t('params.density'), recipe?.density),
    renderRow('magic', UI_ICONS.magic, t('params.magicPower'), recipe?.magicPower)
  );

  const counter = createElement('p', 'recipe__counter');
  counter.setAttribute('aria-live', 'polite');
  counter.append(
    createElement('span', 'recipe__counter-label', t('recipe.ingredients')),
    createElement('strong', 'recipe__counter-value', `${view.added} / ${view.capacity}`)
  );
  counter.classList.toggle('recipe__counter--full', view.added >= view.capacity);

  panel.append(
    ...renderCorners(),
    heading,
    createIcon(SCENE_ICONS.divider, 'icon recipe__divider'),
    ranges
  );

  if (recipe) {
    panel.append(renderHintButton(view.canHint));
  }

  // Tells the player why a value is not a plain sum.
  if (view.activeReactions.length > 0) {
    const reactions = createElement('p', 'recipe__reactions');
    reactions.append(
      createElement('span', 'recipe__reactions-label', t('recipe.activeReactions')),
      ` ${view.activeReactions.join(', ')}`
    );
    panel.append(reactions);
  }

  panel.append(counter);
  container.replaceChildren(panel);
}
