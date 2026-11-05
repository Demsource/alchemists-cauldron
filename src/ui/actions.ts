import { SCENE_ICONS, UI_ICONS } from '../assets/icons';
import { t } from '../i18n';
import { SHORTCUT_KEYS } from '../logic/shortcuts';
import { createElement, createIcon } from './dom';

export type ActionName =
  'help' | 'menu' | 'start' | 'continue-game' | 'brew' | 'pause' | 'pour-out';

export interface IActionsView {
  isPlaying: boolean;
  canPause: boolean;
  canOpenMenu: boolean;
  canOpenHelp: boolean;
  canContinue: boolean;
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

// Shows the key on the button and names it for assistive tech, e.g. "Brew (B)".
function addShortcutHint(button: HTMLButtonElement, label: string, key: string): HTMLElement {
  button.setAttribute('aria-label', `${label} (${key})`);
  button.setAttribute('aria-keyshortcuts', key);
  const hint = createElement('kbd', 'actions__key', key);
  hint.setAttribute('aria-hidden', 'true');
  return hint;
}

function renderIconButton(
  action: ActionName,
  icon: string,
  label: string,
  key?: string
): HTMLButtonElement {
  const button = createActionButton(action, 'btn btn--icon actions__icon-btn', label);
  const caption = createElement('span', 'actions__icon-label', label);
  if (key) {
    caption.append(' ', addShortcutHint(button, label, key));
  }
  button.append(createIcon(icon), caption);
  return button;
}

function renderPrimary(view: IActionsView): HTMLButtonElement {
  const action: ActionName = view.isPlaying ? 'brew' : 'start';
  const label = view.isPlaying ? t('actions.brew') : t('actions.startGame');
  const button = createActionButton(action, 'btn btn--primary btn--large actions__primary', label);
  button.disabled = view.isPlaying && !view.canBrew;
  button.append(
    createIcon(SCENE_ICONS.hexagram, 'icon actions__ornament'),
    createElement('span', 'actions__primary-label', label)
  );
  if (view.isPlaying) {
    button.append(addShortcutHint(button, label, SHORTCUT_KEYS.brew));
  }
  button.append(createIcon(SCENE_ICONS.hexagram, 'icon actions__ornament'));
  return button;
}

function renderPourOut(view: IActionsView): HTMLButtonElement {
  const label = t('actions.pourOut');
  const button = createActionButton('pour-out', 'btn actions__pour-out', label);
  button.disabled = !view.canPourOut;
  button.append(
    createIcon(UI_ICONS.pourOut, 'icon actions__btn-icon'),
    label,
    addShortcutHint(button, label, SHORTCUT_KEYS.pourOut)
  );
  return button;
}

export function renderActions(container: HTMLElement, view: IActionsView): void {
  const left = createElement('div', 'actions__side actions__side--left');
  const help = renderIconButton('help', UI_ICONS.help, t('actions.help'));
  help.disabled = !view.canOpenHelp;
  left.append(help);

  const center = createElement('div', 'actions__center');
  if (!view.isPlaying && view.canContinue) {
    const label = t('actions.continueGame');
    const resume = createActionButton('continue-game', 'btn actions__continue', label);
    resume.append(createIcon(UI_ICONS.play, 'icon actions__btn-icon'), label);
    center.append(resume);
  }
  center.append(renderPrimary(view));
  // Pour Out sits to the right of Brew.
  if (view.isPlaying && view.showPourOut) {
    center.append(renderPourOut(view));
  }

  const right = createElement('div', 'actions__side actions__side--right');
  if (view.canPause) {
    right.append(
      renderIconButton('pause', UI_ICONS.pause, t('actions.pause'), SHORTCUT_KEYS.pause)
    );
  }
  const menu = renderIconButton('menu', UI_ICONS.settings, t('actions.menu'));
  menu.disabled = !view.canOpenMenu;
  right.append(menu);

  container.replaceChildren(left, center, right);
}
