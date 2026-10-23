import { UI_ICONS } from '../assets/icons';
import type { Difficulty } from '../types/recipe';
import { createElement, createIcon } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export interface IDifficultyOptionView {
  difficulty: Difficulty;
  label: string;
  summary: string;
}

export interface IMenuView {
  difficulty: Difficulty;
  options: IDifficultyOptionView[];
  canChangeDifficulty: boolean;
  canContinue: boolean;
}

function renderDifficultyButton(
  option: IDifficultyOptionView,
  isSelected: boolean
): HTMLButtonElement {
  const button = createElement(
    'button',
    `btn menu__difficulty-btn menu__difficulty-btn--${option.difficulty}`
  );
  button.type = 'button';
  button.dataset.action = 'set-difficulty';
  button.dataset.difficulty = option.difficulty;
  button.setAttribute('aria-pressed', String(isSelected));
  button.append(
    createElement('span', 'menu__difficulty-label', option.label),
    createElement('span', 'menu__difficulty-summary', option.summary)
  );
  return button;
}

function renderDifficulty(view: IMenuView): HTMLElement {
  const group = createElement('fieldset', 'menu__difficulty');
  group.disabled = !view.canChangeDifficulty;
  group.append(createElement('legend', 'menu__legend', 'Difficulty'));

  const options = createElement('div', 'menu__difficulty-options');
  options.append(
    ...view.options.map((option) =>
      renderDifficultyButton(option, option.difficulty === view.difficulty)
    )
  );
  group.append(options);

  if (!view.canChangeDifficulty) {
    group.append(
      createElement('p', 'menu__note', 'Difficulty can only be changed before a game starts.')
    );
  }

  return group;
}

function renderMenuButton(
  label: string,
  action: string,
  icon: string,
  isPrimary = false
): HTMLButtonElement {
  const button = createDialogButton(label, action, isPrimary ? 'primary' : 'default');
  button.classList.add('menu__btn');
  button.prepend(createIcon(icon, 'icon menu__btn-icon'));
  return button;
}

export function openMenuDialog(root: HTMLElement, view: IMenuView): IDialogHandle {
  const nav = createElement('nav', 'menu__list');
  nav.setAttribute('aria-label', 'Game menu');

  if (view.canContinue) {
    nav.append(renderMenuButton('Continue Game', 'continue-game', UI_ICONS.play, true));
  }

  nav.append(
    renderMenuButton('New Game', 'new-game', UI_ICONS.flask, !view.canContinue),
    renderMenuButton('Leaderboard', 'open-leaderboard', UI_ICONS.trophy)
  );

  return openDialog(root, {
    id: 'menu-dialog',
    title: 'Menu',
    dismissible: true,
    content: [renderDifficulty(view), nav],
    actions: [createDialogButton('Close', 'close-dialog')]
  });
}

// Moves the selection without reopening the dialog (no flicker, focus stays on the button).
export function updateMenuDifficulty(root: HTMLElement, difficulty: Difficulty): void {
  root
    .querySelectorAll<HTMLButtonElement>('button[data-action="set-difficulty"]')
    .forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.difficulty === difficulty));
    });
}
