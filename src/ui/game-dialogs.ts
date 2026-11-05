import { t } from '../i18n';
import { PLAYER_NAME_MAX, PLAYER_NAME_MIN } from '../logic/leaderboard';
import { SHORTCUT_KEYS } from '../logic/shortcuts';
import type { GameOverReason } from '../types/game';
import { formatNumber } from '../utils/format';
import { createElement } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export interface IGameOverView {
  score: number;
  reason: GameOverReason;
  isTopResult?: boolean; // undefined: leaderboard not checked, no name prompt or hint
}

// onDismiss: what Escape does (the dialog itself never just closes over a paused game).
export function openPauseDialog(root: HTMLElement, onDismiss?: () => void): IDialogHandle {
  // Focus starts on Resume, so Enter / Space resume with the native button behaviour
  // (no game shortcut runs while paused).
  const resume = createDialogButton(t('dialogs.pause.resume'), 'resume', 'primary');
  resume.autofocus = true;

  return openDialog(root, {
    id: 'pause-dialog',
    title: t('dialogs.pause.title'),
    onDismiss,
    content: [createElement('p', 'dialog__text', t('dialogs.pause.text'))],
    actions: [resume, createDialogButton(t('dialogs.exitToMenu'), 'exit-to-menu')]
  });
}

function renderNameField(): HTMLFormElement {
  const form = createElement('form', 'name-form');
  form.id = 'player-name-form';
  form.noValidate = true;

  const label = createElement(
    'label',
    'name-form__label',
    t('dialogs.nameForm.label', { min: PLAYER_NAME_MIN, max: PLAYER_NAME_MAX })
  );
  label.htmlFor = 'player-name';

  const input = createElement('input', 'input name-form__input');
  input.id = 'player-name';
  input.name = 'playerName';
  input.type = 'text';
  input.setAttribute('autocomplete', 'nickname');
  input.placeholder = t('dialogs.nameForm.placeholder');
  input.minLength = PLAYER_NAME_MIN;
  input.maxLength = PLAYER_NAME_MAX;
  input.required = true;
  input.setAttribute('aria-describedby', 'player-name-hint player-name-error');

  const hint = createElement('p', 'name-form__hint', t('dialogs.nameForm.hint'));
  hint.id = 'player-name-hint';

  const error = createElement('p', 'name-form__error');
  error.id = 'player-name-error';
  error.setAttribute('role', 'alert');

  form.append(label, input, hint, error);
  return form;
}

export function openGameOverDialog(root: HTMLElement, view: IGameOverView): IDialogHandle {
  const reason = createElement(
    'p',
    'game-over__reason',
    t(`dialogs.gameOver.reason.${view.reason}`)
  );
  const scoreBlock = createElement('div', 'game-over__score');
  scoreBlock.append(
    createElement('span', 'game-over__score-label', t('dialogs.gameOver.finalScore')),
    createElement('strong', 'game-over__score-value', formatNumber(view.score))
  );

  const content: Node[] = [reason, scoreBlock];
  const actions: HTMLButtonElement[] = [];

  if (view.isTopResult) {
    content.push(renderNameField());
    const submit = createDialogButton(t('dialogs.gameOver.submitScore'), 'submit-score', 'primary');
    submit.type = 'submit';
    submit.setAttribute('form', 'player-name-form');
    actions.push(submit);
  } else if (view.isTopResult === false) {
    content.push(createElement('p', 'dialog__text', t('dialogs.gameOver.notTop')));
  }

  actions.push(
    createDialogButton(
      t('dialogs.gameOver.playAgain'),
      'play-again',
      view.isTopResult === true ? 'default' : 'primary'
    ),
    createDialogButton(t('dialogs.gameOver.leaderboard'), 'open-leaderboard'),
    createDialogButton(t('dialogs.exitToMenu'), 'exit-to-menu')
  );

  return openDialog(root, {
    id: 'game-over-dialog',
    title: t('dialogs.gameOver.title'),
    content,
    actions,
    persistent: true
  });
}

export interface IHelpSection {
  title: string;
  items: string[];
}

// Fixed rules, in display order; text lives in dialogs.help.<section> in the locale files.
const HELP_SECTIONS = [
  'language',
  'goal',
  'howToPlay',
  'hint',
  'difficulty',
  'keyboard',
  'stock',
  'gameOver'
] as const;

// Built on open, so the text follows the current language.
function getHelpSections(): IHelpSection[] {
  return HELP_SECTIONS.map((section) => ({
    title: t(`dialogs.help.${section}.title`),
    items: t(`dialogs.help.${section}.items`, { returnObjects: true, ...SHORTCUT_KEYS })
  }));
}

// Extra sections (built from game data, e.g. reactions) are added after the fixed rules.
export function openHelpDialog(
  root: HTMLElement,
  extraSections: IHelpSection[] = []
): IDialogHandle {
  const content = [...getHelpSections(), ...extraSections].map((section) => {
    const block = createElement('section', 'help__section');
    const list = createElement('ul', 'help__list');
    list.append(...section.items.map((item) => createElement('li', 'help__item', item)));
    block.append(createElement('h3', 'help__title', section.title), list);
    return block;
  });

  return openDialog(root, {
    id: 'help-dialog',
    title: t('dialogs.help.title'),
    variant: 'parchment',
    dismissible: true,
    wide: true,
    content,
    actions: [createDialogButton(t('dialogs.close'), 'close-dialog', 'primary')]
  });
}
