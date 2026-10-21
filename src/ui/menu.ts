import { UI_ICONS } from '../assets/icons';
import { createElement, createIcon } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export type DifficultyOption = 'easy' | 'medium' | 'hard';

export interface IMenuView {
  difficulty: DifficultyOption;
  isDifficultyEnabled: boolean;
  canContinue: boolean;
}

const DIFFICULTY_LABELS: Record<DifficultyOption, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

function renderDifficulty(view: IMenuView): HTMLElement {
  const group = createElement('fieldset', 'menu__difficulty');
  group.disabled = !view.isDifficultyEnabled;
  group.append(createElement('legend', 'menu__legend', 'Difficulty'));

  const options = createElement('div', 'menu__difficulty-options');
  (Object.keys(DIFFICULTY_LABELS) as DifficultyOption[]).forEach((difficulty) => {
    const button = createElement(
      'button',
      `btn menu__difficulty-btn menu__difficulty-btn--${difficulty}`,
      DIFFICULTY_LABELS[difficulty]
    );
    button.type = 'button';
    button.dataset.action = 'set-difficulty';
    button.dataset.difficulty = difficulty;
    button.setAttribute('aria-pressed', String(difficulty === view.difficulty));
    options.append(button);
  });

  group.append(options);

  if (!view.isDifficultyEnabled) {
    group.append(createElement('p', 'menu__note', 'Difficulty selection unlocks in Level 2.'));
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
