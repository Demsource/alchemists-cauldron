import { SCENE_ICONS, UI_ICONS } from '../assets/icons';
import { createElement, createIcon } from './dom';

export type ActionName = 'help' | 'menu' | 'start' | 'brew' | 'pause' | 'pour-out';

export interface IActionsView {
  isPlaying: boolean;
  canPause: boolean;
  canBrew: boolean;
  showPourOut: boolean;
  canPourOut: boolean;
}

function createActionButton(
  action: ActionName,
  className: string,
  label: string
): HTMLButtonElement {
  const button = createElement('button', className);
  button.type = 'button';
  button.dataset.action = action;
  button.setAttribute('aria-label', label);
  return button;
}

function renderIconButton(action: ActionName, icon: string, label: string): HTMLButtonElement {
  const button = createActionButton(action, 'btn btn--icon actions__icon-btn', label);
  button.append(createIcon(icon), createElement('span', 'actions__icon-label', label));
  return button;
}

function renderPrimary(view: IActionsView): HTMLButtonElement {
  const action: ActionName = view.isPlaying ? 'brew' : 'start';
  const label = view.isPlaying ? 'Brew' : 'Start Game';
  const button = createActionButton(action, 'btn btn--primary btn--large actions__primary', label);
  button.disabled = view.isPlaying && !view.canBrew;
  button.append(
    createIcon(SCENE_ICONS.hexagram, 'icon actions__ornament'),
    createElement('span', 'actions__primary-label', label),
    createIcon(SCENE_ICONS.hexagram, 'icon actions__ornament')
  );
  return button;
}

function renderPourOut(view: IActionsView): HTMLButtonElement {
  const button = createActionButton('pour-out', 'btn actions__pour-out', 'Pour Out');
  button.disabled = !view.canPourOut;
  button.append(createIcon(UI_ICONS.pourOut, 'icon actions__btn-icon'), 'Pour Out');
  return button;
}

export function renderActions(container: HTMLElement, view: IActionsView): void {
  const left = createElement('div', 'actions__side actions__side--left');
  left.append(renderIconButton('help', UI_ICONS.help, 'Help'));

  const center = createElement('div', 'actions__center');
  if (view.isPlaying && view.showPourOut) {
    center.append(renderPourOut(view));
  }
  center.append(renderPrimary(view));

  const right = createElement('div', 'actions__side actions__side--right');
  if (view.canPause) {
    right.append(renderIconButton('pause', UI_ICONS.pause, 'Pause'));
  }
  right.append(renderIconButton('menu', UI_ICONS.settings, 'Menu'));

  container.replaceChildren(left, center, right);
}
