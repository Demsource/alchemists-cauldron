/**
 * TEMPORARY dev-only UI preview.
 * Open the app with `?preview=<mode>` to see a screen state before game logic exists.
 * This whole folder is removed once the UI phase is finished.
 */

import type { IHudView } from '../ui/hud';

const PREVIEW_MODES = [
  'start',
  'playing',
  'lowtime',
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

const START_HUD: IHudView = {
  isActive: false,
  score: 0,
  timeLeft: 0,
  timeTotal: 150,
  lives: 0,
  maxLives: 3
};

const PLAYING_HUD: IHudView = {
  isActive: true,
  score: 1250,
  timeLeft: 105,
  timeTotal: 150,
  lives: 2,
  maxLives: 3
};

export function getPreviewHud(mode: PreviewMode): IHudView {
  switch (mode) {
    case 'start':
    case 'menu':
    case 'help':
    case 'leaderboard':
      return START_HUD;
    case 'lowtime':
      return { ...PLAYING_HUD, timeLeft: 12 };
    default:
      return PLAYING_HUD;
  }
}
