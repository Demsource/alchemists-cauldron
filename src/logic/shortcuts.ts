import type { GameStatus } from '../types/game';

export type ShortcutAction =
  | { type: 'add'; index: number } // shelf position, 0-based
  | { type: 'brew' }
  | { type: 'pour-out' }
  | { type: 'pause' };

// What the handler needs to know about a key press (a plain object, so this stays pure).
export interface IKeyInput {
  key: string;
  repeat: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  isTyping: boolean; // focus is in a text field
}

const SHELF_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'];

// Small and explicit. Enter and Space are never listed: focused buttons keep their native behaviour.
const KEY_MAP: Readonly<Record<string, ShortcutAction>> = {
  ...Object.fromEntries(
    SHELF_KEYS.map((key, index): [string, ShortcutAction] => [key, { type: 'add', index }])
  ),
  b: { type: 'brew' },
  o: { type: 'pour-out' },
  p: { type: 'pause' },
  escape: { type: 'pause' }
};

export const SHORTCUT_KEYS = {
  brew: 'B',
  pourOut: 'O',
  pause: 'P'
} as const;

/**
 * Returns the game action for a key press, or null when the browser should handle the key.
 * Shortcuts run only during an active run (`playing`): never on the start, pause or
 * Game Over screens, never while typing, never with modifier keys and never on auto-repeat.
 */
export function getShortcut(input: IKeyInput, status: GameStatus): ShortcutAction | null {
  if (
    status !== 'playing' ||
    input.isTyping ||
    input.repeat ||
    input.ctrlKey ||
    input.altKey ||
    input.metaKey
  ) {
    return null;
  }

  return KEY_MAP[input.key.toLowerCase()] ?? null;
}
