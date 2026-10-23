import { SCENE_ICONS } from '../assets/icons';
import { createElement, createIcon } from './dom';

export type DialogVariant = 'stone' | 'parchment';

export interface IDialogOptions {
  id: string;
  title: string;
  content: Node[];
  actions?: HTMLButtonElement[];
  variant?: DialogVariant;
  dismissible?: boolean;
  wide?: boolean;
  // What Escape does for a dialog that is not simply closable (e.g. leave the paused game).
  onDismiss?: () => void;
}

export interface IDialogHandle {
  element: HTMLDialogElement;
  close: () => void;
}

const BLUR_CLASS = 'app--dialog-open';

export function createDialogButton(
  label: string,
  action: string,
  variant: 'default' | 'primary' | 'danger' = 'default'
): HTMLButtonElement {
  const button = createElement('button', 'btn dialog__btn', label);
  button.type = 'button';
  button.dataset.action = action;

  if (variant !== 'default') {
    button.classList.add(`btn--${variant}`);
  }

  return button;
}

function renderFrame(variant: DialogVariant): HTMLElement[] {
  const corners = ['tl', 'tr', 'bl', 'br'].map((corner) =>
    createIcon(SCENE_ICONS.frameCorner, `icon dialog__corner dialog__corner--${corner}`)
  );
  const emblem = createIcon(
    variant === 'parchment' ? SCENE_ICONS.hexagram : SCENE_ICONS.runeCircle,
    'icon dialog__emblem'
  );
  return [...corners, emblem];
}

export function openDialog(root: HTMLElement, options: IDialogOptions): IDialogHandle {
  const variant = options.variant ?? 'stone';
  const titleId = `${options.id}-title`;

  const dialog = createElement('dialog', `dialog dialog--${variant}`);
  dialog.id = options.id;
  dialog.classList.toggle('dialog--wide', options.wide === true);
  dialog.setAttribute('aria-labelledby', titleId);

  const title = createElement('h2', 'dialog__title', options.title);
  title.id = titleId;

  const body = createElement('div', 'dialog__body');
  body.append(...options.content);

  dialog.append(
    ...renderFrame(variant),
    title,
    createIcon(SCENE_ICONS.divider, 'icon dialog__divider'),
    body
  );

  if (options.actions && options.actions.length > 0) {
    const footer = createElement('div', 'dialog__actions');
    footer.append(...options.actions);
    dialog.append(footer);
  }

  const app = root.closest('.app');

  const close = (): void => closeDialog(dialog);

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    if (options.onDismiss) {
      options.onDismiss();
    } else if (options.dismissible) {
      close();
    }
  });

  // The browser may still close a modal itself (Chrome ignores a repeated preventDefault
  // on Escape). Whatever closed it, remove it and the page blur, so no overlay is left behind.
  dialog.addEventListener('close', () => {
    if (dialog.isConnected) {
      closeDialog(dialog);
    }
  });

  root.querySelector(`#${options.id}`)?.remove();
  root.append(dialog);
  app?.classList.add(BLUR_CLASS);
  dialog.showModal();

  return { element: dialog, close };
}

export interface IConfirmOptions {
  id: string;
  title: string;
  message: string;
  confirmLabel: string;
  confirmAction: string;
}

// In-app replacement for window.confirm(): Cancel uses the generic "close-dialog" action.
export function openConfirmDialog(root: HTMLElement, options: IConfirmOptions): IDialogHandle {
  return openDialog(root, {
    id: options.id,
    title: options.title,
    dismissible: true,
    content: [createElement('p', 'dialog__text', options.message)],
    actions: [
      createDialogButton(options.confirmLabel, options.confirmAction, 'danger'),
      createDialogButton('Cancel', 'close-dialog', 'primary')
    ]
  });
}

export function closeDialog(dialog: HTMLDialogElement): void {
  const root = dialog.parentElement;

  if (dialog.open) {
    dialog.close();
  }
  dialog.remove();

  if (root && root.querySelector('dialog') === null) {
    root.closest('.app')?.classList.remove(BLUR_CLASS);
  }
}

export function closeAllDialogs(root: HTMLElement): void {
  root.querySelectorAll('dialog').forEach((dialog) => {
    dialog.close();
    dialog.remove();
  });
  root.closest('.app')?.classList.remove(BLUR_CLASS);
}
