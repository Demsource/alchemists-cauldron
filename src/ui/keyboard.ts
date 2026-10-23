import type { IKeyInput } from '../logic/shortcuts';

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/**
 * The single keyboard listener of the game. It only describes the key press;
 * `onKey` decides (from the game state) and returns true when it used the key.
 * Unused keys keep their normal browser behaviour.
 */
export function bindKeyboard(onKey: (input: IKeyInput) => boolean): void {
  document.addEventListener('keydown', (event) => {
    const isHandled = onKey({
      key: event.key,
      repeat: event.repeat,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      isTyping: isTypingTarget(event.target)
    });

    if (isHandled) {
      event.preventDefault();
    }
  });
}
