import { createElement } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export type GameOverReason = 'time' | 'lives' | 'ingredients';

export interface IGameOverView {
  score: number;
  reason: GameOverReason;
  isTopResult: boolean;
}

const REASON_TEXT: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'No lives left',
  ingredients: 'Out of ingredients'
};

export const PLAYER_NAME_MIN = 2;
export const PLAYER_NAME_MAX = 15;

export function openPauseDialog(root: HTMLElement): IDialogHandle {
  return openDialog(root, {
    id: 'pause-dialog',
    title: 'Game Paused',
    content: [createElement('p', 'dialog__text', 'The cauldron simmers quietly. Take a breath.')],
    actions: [
      createDialogButton('Resume', 'resume', 'primary'),
      createDialogButton('Exit to Menu', 'exit-to-menu')
    ]
  });
}

function renderNameField(): HTMLFormElement {
  const form = createElement('form', 'name-form');
  form.id = 'player-name-form';
  form.noValidate = true;

  const label = createElement(
    'label',
    'name-form__label',
    `Enter your name (${PLAYER_NAME_MIN}–${PLAYER_NAME_MAX} chars):`
  );
  label.htmlFor = 'player-name';

  const input = createElement('input', 'input name-form__input');
  input.id = 'player-name';
  input.name = 'playerName';
  input.type = 'text';
  input.setAttribute('autocomplete', 'nickname');
  input.placeholder = 'Alchemist name…';
  input.minLength = PLAYER_NAME_MIN;
  input.maxLength = PLAYER_NAME_MAX;
  input.required = true;
  input.setAttribute('aria-describedby', 'player-name-hint player-name-error');

  const hint = createElement(
    'p',
    'name-form__hint',
    'Letters, digits, space, _ and - are allowed.'
  );
  hint.id = 'player-name-hint';

  const error = createElement('p', 'name-form__error');
  error.id = 'player-name-error';
  error.setAttribute('role', 'alert');

  form.append(label, input, hint, error);
  return form;
}

export function openGameOverDialog(root: HTMLElement, view: IGameOverView): IDialogHandle {
  const reason = createElement('p', 'game-over__reason', REASON_TEXT[view.reason]);
  const scoreBlock = createElement('div', 'game-over__score');
  scoreBlock.append(
    createElement('span', 'game-over__score-label', 'Final Score'),
    createElement('strong', 'game-over__score-value', String(view.score))
  );

  const content: Node[] = [reason, scoreBlock];
  const actions: HTMLButtonElement[] = [];

  if (view.isTopResult) {
    content.push(renderNameField());
    const submit = createDialogButton('Submit Score', 'submit-score', 'primary');
    submit.type = 'submit';
    submit.setAttribute('form', 'player-name-form');
    actions.push(submit);
  } else {
    content.push(
      createElement('p', 'dialog__text', 'Not enough for the Top-10 this time. Brew again!')
    );
  }

  actions.push(
    createDialogButton('Play Again', 'play-again', view.isTopResult ? 'default' : 'primary'),
    createDialogButton('Exit to Menu', 'exit-to-menu')
  );

  return openDialog(root, { id: 'game-over-dialog', title: 'Game Over', content, actions });
}

const HELP_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Goal',
    items: [
      'Brew the current recipe: move Temperature, Density and Magic Power into the green target zones.',
      'Each correct brew gives points, bonus time and a new recipe.'
    ]
  },
  {
    title: 'How to play',
    items: [
      'Click an ingredient on the shelf to add it to the cauldron.',
      'The recipe shows how many ingredients you may use, e.g. Ingredients: 2 / 4.',
      'Watch the 3 bars change after every ingredient.',
      'Press Brew to check the mixture. A small tolerance is allowed around each target.'
    ]
  },
  {
    title: 'Stock',
    items: [
      'Every ingredient has a limited stock shown in the round badge.',
      'Used ingredients are spent — even when a brew fails.',
      'An empty slot stays on the shelf but can no longer be used.'
    ]
  },
  {
    title: 'Game over',
    items: [
      'A failed brew costs one life.',
      'The game ends when time runs out, all lives are lost, or you run out of ingredients.',
      'Reach the Top-10 to write your name on the leaderboard.'
    ]
  }
];

export function openHelpDialog(root: HTMLElement): IDialogHandle {
  const content = HELP_SECTIONS.map((section) => {
    const block = createElement('section', 'help__section');
    const list = createElement('ul', 'help__list');
    list.append(...section.items.map((item) => createElement('li', 'help__item', item)));
    block.append(createElement('h3', 'help__title', section.title), list);
    return block;
  });

  return openDialog(root, {
    id: 'help-dialog',
    title: 'How to Brew',
    variant: 'parchment',
    dismissible: true,
    wide: true,
    content,
    actions: [createDialogButton('Close', 'close-dialog', 'primary')]
  });
}
