import { SCENE_ICONS } from '../assets/icons';
import { t } from '../i18n';
import { createElement, createIcon } from './dom';

export interface ILayoutRefs {
  root: HTMLDivElement;
  hud: HTMLElement;
  shelf: HTMLElement;
  stage: HTMLElement;
  recipe: HTMLElement;
  bars: HTMLElement;
  actions: HTMLElement;
  dialogRoot: HTMLDivElement;
}

function renderHeader(): HTMLElement {
  const header = createElement('header', 'app-header');
  const title = createElement('h1', 'app-title');

  title.append(
    createIcon(SCENE_ICONS.hexagram, 'app-title__ornament'),
    createElement('span', 'app-title__text', t('app.title')),
    createIcon(SCENE_ICONS.hexagram, 'app-title__ornament')
  );

  header.append(title, createIcon(SCENE_ICONS.divider, 'app-header__divider'));
  return header;
}

function renderStageDecor(): HTMLDivElement {
  const decor = createElement('div', 'stage__decor');

  decor.append(
    createIcon(SCENE_ICONS.alcove, 'stage__alcove'),
    createIcon(SCENE_ICONS.shelfDecor, 'stage__shelf-decor stage__shelf-decor--left'),
    createIcon(SCENE_ICONS.shelfDecor, 'stage__shelf-decor stage__shelf-decor--right')
  );

  return decor;
}

export function renderLayout(mount: HTMLElement): ILayoutRefs {
  const root = createElement('div', 'app');
  const hud = createElement('section', 'hud');
  const board = createElement('main', 'board');
  const shelf = createElement('aside', 'board__shelf');

  const stage = createElement('section', 'board__stage');
  stage.append(renderStageDecor());

  const recipe = createElement('aside', 'board__recipe');
  const bars = createElement('section', 'board__bars');

  board.append(shelf, stage, recipe, bars);

  const actions = createElement('footer', 'actions');
  const dialogRoot = createElement('div', 'dialog-root');

  root.append(renderHeader(), hud, board, actions, dialogRoot);
  mount.replaceChildren(root);

  const layout = { root, hud, shelf, stage, recipe, bars, actions, dialogRoot };
  updateLayoutText(layout);
  return layout;
}

// The layout is built once, so a language change patches its text in place.
export function updateLayoutText(layout: ILayoutRefs): void {
  const title = layout.root.querySelector('.app-title__text');
  if (title) {
    title.textContent = t('app.title');
  }

  layout.hud.setAttribute('aria-label', t('layout.hud'));
  layout.shelf.setAttribute('aria-label', t('layout.shelf'));
  layout.stage.setAttribute('aria-label', t('layout.stage'));
  layout.recipe.setAttribute('aria-label', t('layout.recipe'));
  layout.bars.setAttribute('aria-label', t('layout.bars'));
}
