/**
 * TEMPORARY dev-only UI preview.
 * Open the app with `?preview=<mode>` to see a screen state before game logic exists.
 * This whole folder is removed once the UI phase is finished.
 */

import type { IBarView } from '../ui/bars';
import type { ICauldronView } from '../ui/cauldron';
import type { IHudView } from '../ui/hud';
import type { IRecipePanelView } from '../ui/recipe-panel';
import type { IShelfView } from '../ui/shelf';

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

const isStartLike = (mode: PreviewMode): boolean =>
  mode === 'start' || mode === 'menu' || mode === 'help' || mode === 'leaderboard';

const PLAYING_SHELF: IShelfView = {
  isBlocked: false,
  showValues: true,
  items: [
    {
      id: 'dragon-tears',
      name: 'Dragon Tears',
      temperature: 25,
      density: 8,
      magicPower: 10,
      stock: 9
    },
    {
      id: 'fairy-dust',
      name: 'Fairy Dust',
      temperature: 12,
      density: 9,
      magicPower: 12,
      stock: 12
    },
    {
      id: 'frost-lotus',
      name: 'Frost Lotus',
      temperature: -18,
      density: 4,
      magicPower: 14,
      stock: 0
    },
    {
      id: 'mandrake-root',
      name: 'Mandrake Root',
      temperature: -5,
      density: 20,
      magicPower: 8,
      stock: 7
    },
    {
      id: 'caustic-acid',
      name: 'Caustic Acid',
      temperature: 10,
      density: 14,
      magicPower: 22,
      stock: 3
    },
    {
      id: 'void-essence',
      name: 'Essence of the Void',
      temperature: -20,
      density: -10,
      magicPower: 40,
      stock: 15
    }
  ]
};

export function getPreviewShelf(mode: PreviewMode): IShelfView {
  return isStartLike(mode) ? { items: [], isBlocked: false, showValues: true } : PLAYING_SHELF;
}

export function getPreviewCauldron(mode: PreviewMode): ICauldronView {
  if (isStartLike(mode)) {
    return { ingredients: [], capacity: 4 };
  }

  return {
    capacity: 4,
    ingredients: [
      { id: 'dragon-tears', name: 'Dragon Tears' },
      { id: 'fairy-dust', name: 'Fairy Dust' }
    ]
  };
}

export function getPreviewRecipe(mode: PreviewMode): IRecipePanelView {
  if (isStartLike(mode)) {
    return { recipe: null, added: 0, capacity: 4 };
  }

  return {
    added: 2,
    capacity: 4,
    recipe: {
      name: 'Frost Acid',
      temperature: { min: -13, max: -3 },
      density: { min: 13, max: 23 },
      magicPower: { min: 31, max: 41 }
    }
  };
}

export function getPreviewBars(mode: PreviewMode): IBarView[] {
  const isStart = isStartLike(mode);

  return [
    {
      key: 'temperature',
      label: 'Temperature',
      value: isStart ? 0 : 37,
      min: -100,
      max: 100,
      target: isStart ? null : { min: -13, max: -3 },
      isInTarget: false
    },
    {
      key: 'density',
      label: 'Density',
      value: isStart ? 0 : 17,
      min: -50,
      max: 100,
      target: isStart ? null : { min: 13, max: 23 },
      isInTarget: !isStart
    },
    {
      key: 'magic',
      label: 'Magic Power',
      value: isStart ? 0 : 22,
      min: -50,
      max: 150,
      target: isStart ? null : { min: 31, max: 41 },
      isInTarget: false
    }
  ];
}

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
