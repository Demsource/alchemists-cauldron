import { SCENE_ICONS } from '../assets/icons';
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
    createElement('span', 'app-title__text', "Alchemist's Cauldron"),
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
  hud.setAttribute('aria-label', 'Game status');

  const board = createElement('main', 'board');

  const shelf = createElement('aside', 'board__shelf');
  shelf.setAttribute('aria-label', 'Ingredient shelf');

  const stage = createElement('section', 'board__stage');
  stage.setAttribute('aria-label', 'Cauldron');
  stage.append(renderStageDecor());

  const recipe = createElement('aside', 'board__recipe');
  recipe.setAttribute('aria-label', 'Current recipe');

  const bars = createElement('section', 'board__bars');
  bars.setAttribute('aria-label', 'Cauldron parameters');

  board.append(shelf, stage, recipe, bars);

  const actions = createElement('footer', 'actions');
  const dialogRoot = createElement('div', 'dialog-root');

  root.append(renderHeader(), hud, board, actions, dialogRoot);
  mount.replaceChildren(root);

  return { root, hud, shelf, stage, recipe, bars, actions, dialogRoot };
}
