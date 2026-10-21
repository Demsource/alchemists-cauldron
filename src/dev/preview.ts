/**
 * TEMPORARY dev-only UI preview.
 * Open the app with `?preview=<mode>` to see a screen state before game logic exists.
 * This whole folder is removed once the UI phase is finished.
 */

const PREVIEW_MODES = [
  'start',
  'playing',
  'pause',
  'gameover',
  'help',
  'menu',
  'leaderboard'
] as const;

export type PreviewMode = (typeof PREVIEW_MODES)[number];

function isPreviewMode(value: string | null): value is PreviewMode {
  return PREVIEW_MODES.some((mode) => mode === value);
}

export function getPreviewMode(): PreviewMode {
  const value = new URLSearchParams(window.location.search).get('preview');
  return isPreviewMode(value) ? value : 'start';
}
