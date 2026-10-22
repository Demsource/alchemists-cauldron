/**
 * Centralized collection of inline SVG icons.
 * Every game element has its own asset; no composite images are used.
 * Icons avoid <defs>/ids so they can be inserted many times without id collisions.
 */

const svg = (viewBox: string, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

/* --------------------------------------------------------------------------
   UI icons (use currentColor so CSS controls the colour)
   -------------------------------------------------------------------------- */

export const UI_ICONS = {
  score: svg(
    '0 0 24 24',
    '<path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.4l-5.6 4.1 2.1-6.7L3 8.8h6.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="11.5" r="1.6" fill="currentColor"/>'
  ),
  clock: svg(
    '0 0 24 24',
    '<circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5V13l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9.5 2.5h5M12 2.5v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  ),
  heart: svg(
    '0 0 24 24',
    '<path d="M12 21s-7.5-4.6-9.6-9.4C.9 8.1 3 4 6.8 4c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3C21 4 23.1 8.1 21.6 11.6 19.5 16.4 12 21 12 21z" fill="currentColor"/><path d="M7 7.2c-1.6.3-2.6 1.9-2.3 3.4" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>'
  ),
  heartEmpty: svg(
    '0 0 24 24',
    '<path d="M12 21s-7.5-4.6-9.6-9.4C.9 8.1 3 4 6.8 4c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3C21 4 23.1 8.1 21.6 11.6 19.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.6"/>'
  ),
  temperature: svg(
    '0 0 24 24',
    '<path d="M10 4a2 2 0 014 0v9.3a4.5 4.5 0 11-4 0z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="17" r="2.4" fill="currentColor"/><path d="M12 15V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6h2M16 9h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  ),
  density: svg(
    '0 0 24 24',
    '<path d="M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0013 0C18.5 10 12 2.5 12 2.5z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 15a3 3 0 002.5 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  ),
  magic: svg(
    '0 0 24 24',
    '<path d="M12 1.5l2 6.2 6.3-2-4 5.3 4 5.3-6.3-2-2 6.2-2-6.2-6.3 2 4-5.3-4-5.3 6.3 2z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.2" fill="currentColor"/>'
  ),
  help: svg(
    '0 0 24 24',
    '<path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5V19c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6v13.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 9h4M5.5 12h4M14.5 9h4M14.5 12h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'
  ),
  settings: svg(
    '0 0 24 24',
    '<path d="M10.3 2h3.4l.5 2.6 1.8.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.8 2.6.5v3.4l-2.6.5-.8 1.8 1.5 2.2-2.4 2.4-2.2-1.5-1.8.8-.5 2.6h-3.4l-.5-2.6-1.8-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.8L2 13.7v-3.4l2.6-.5.8-1.8-1.5-2.2 2.4-2.4 2.2 1.5 1.8-.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  ),
  menu: svg(
    '0 0 24 24',
    '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  ),
  pause: svg(
    '0 0 24 24',
    '<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/>'
  ),
  play: svg('0 0 24 24', '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'),
  trophy: svg(
    '0 0 24 24',
    '<path d="M7 3h10v5a5 5 0 01-10 0z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 5H4v1.5A3.5 3.5 0 007.3 10M17 5h3v1.5a3.5 3.5 0 01-3.3 3.5M12 13v4M8 21h8M9 21l1-4h4l1 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>'
  ),
  close: svg(
    '0 0 24 24',
    '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  ),
  back: svg(
    '0 0 24 24',
    '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  ),
  skull: svg(
    '0 0 24 24',
    '<path d="M12 2.5c-5 0-8.5 3.4-8.5 8 0 2.7 1.3 4.6 3 5.7V19a1.5 1.5 0 001.5 1.5h8A1.5 1.5 0 0017.5 19v-2.8c1.7-1.1 3-3 3-5.7 0-4.6-3.5-8-8.5-8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8.7" cy="11.5" r="2" fill="currentColor"/><circle cx="15.3" cy="11.5" r="2" fill="currentColor"/><path d="M12 14l-1 2h2zM10 20.5v-2M14 20.5v-2" stroke="currentColor" stroke-width="1.2" fill="currentColor"/>'
  ),
  flask: svg(
    '0 0 24 24',
    '<path d="M9 2.5h6M10 2.5v6L4.5 18.5A2 2 0 006.3 21.5h11.4a2 2 0 001.8-3L14 8.5v-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M7 15h10l2 3.5H5z" fill="currentColor" fill-opacity=".35"/><circle cx="10.5" cy="17" r=".9" fill="currentColor"/><circle cx="13.5" cy="18.4" r=".6" fill="currentColor"/>'
  ),
  pourOut: svg(
    '0 0 24 24',
    '<path d="M4 9h11l-1.5 8.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" transform="rotate(-25 9.5 13)"/><path d="M17 14c.8 1.5 1.5 2.6 1.5 3.6a1.5 1.5 0 01-3 0c0-1 .7-2.1 1.5-3.6zM20 9.5c.5 1 1 1.7 1 2.3a1 1 0 01-2 0c0-.6.5-1.3 1-2.3z" fill="currentColor"/>'
  ),
  sparkle: svg(
    '0 0 24 24',
    '<path d="M12 2l1.8 8.2L22 12l-8.2 1.8L12 22l-1.8-8.2L2 12l8.2-1.8z" fill="currentColor"/>'
  )
} as const;

/* --------------------------------------------------------------------------
   Ingredient icons (full colour, keyed by ingredient id)
   -------------------------------------------------------------------------- */

const bottle = (liquid: string, glow: string, extra: string): string =>
  svg(
    '0 0 64 64',
    `<ellipse cx="32" cy="58" rx="16" ry="3" fill="#000" opacity=".4"/>` +
      `<rect x="26" y="5" width="12" height="7" rx="2" fill="#8a5a2b"/>` +
      `<path d="M27 12h10v8c8 3 13 10 13 18a18 18 0 01-36 0c0-8 5-15 13-18z" fill="${glow}" fill-opacity=".18" stroke="#cfe6e0" stroke-opacity=".7" stroke-width="2"/>` +
      `<path d="M16.5 38a15.5 15.5 0 0031 0c0-1.5-.2-3-.7-4.3H17.2c-.5 1.3-.7 2.8-.7 4.3z" fill="${liquid}"/>` +
      extra +
      `<path d="M21 30c-1.5 3-1.8 6-1 9" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>`
  );

export const INGREDIENT_ICONS = {
  'dragon-tears': bottle(
    '#2fb7c9',
    '#7ee6f2',
    '<path d="M32 33s-5 6-5 9a5 5 0 0010 0c0-3-5-9-5-9z" fill="#bff6ff" opacity=".9"/>'
  ),
  'fairy-dust': bottle(
    '#8a3fd1',
    '#d6a8ff',
    '<circle cx="26" cy="42" r="1.4" fill="#fff"/><circle cx="35" cy="38" r="1" fill="#fff"/><circle cx="38" cy="46" r="1.6" fill="#ffe7ff"/><circle cx="30" cy="49" r="1" fill="#fff"/><path d="M32 40l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff6c8"/>'
  ),
  'frost-lotus': svg(
    '0 0 64 64',
    '<ellipse cx="32" cy="56" rx="20" ry="4" fill="#1d4a5c" opacity=".6"/>' +
      '<path d="M32 12c5 8 6 18 0 30-6-12-5-22 0-30z" fill="#bfe9ff" stroke="#e8f8ff" stroke-width="1.2"/>' +
      '<path d="M32 42c-4-10-12-16-21-16 2 10 10 17 21 16z" fill="#8fd2f2" stroke="#e8f8ff" stroke-width="1.2"/>' +
      '<path d="M32 42c4-10 12-16 21-16-2 10-10 17-21 16z" fill="#8fd2f2" stroke="#e8f8ff" stroke-width="1.2"/>' +
      '<path d="M32 46c-7-3-15-3-22 1 7 5 15 5 22-1zM32 46c7-3 15-3 22 1-7 5-15 5-22-1z" fill="#5fb3dc"/>' +
      '<path d="M20 10v6M17 13h6M47 14v5M44.5 16.5h5" stroke="#e8f8ff" stroke-width="1.4" stroke-linecap="round"/>'
  ),
  'mandrake-root': svg(
    '0 0 64 64',
    '<path d="M32 18c-3-6-10-9-15-8 2 5 8 8 15 8zM32 18c3-6 10-9 15-8-2 5-8 8-15 8zM32 18c0-5 1-10 4-13" fill="#5f9e3a" stroke="#3c6b22" stroke-width="1.2"/>' +
      '<path d="M24 20h16c3 6 3 14-1 20l3 12M34 42l1 13M30 42l-1 13M25 40l-4 11M24 20c-3 6-3 14 1 20" fill="#a8794a" stroke="#6b4626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M25 20h14c2.5 6 2.5 13-1 19H26c-3.5-6-3.5-13-1-19z" fill="#b8875a"/>' +
      '<circle cx="29" cy="27" r="1.6" fill="#2a1a0c"/><circle cx="35" cy="27" r="1.6" fill="#2a1a0c"/><path d="M29 33q3 2 6 0" fill="none" stroke="#2a1a0c" stroke-width="1.4" stroke-linecap="round"/>'
  ),
  'caustic-acid': bottle(
    '#8fdc4a',
    '#c8ff8a',
    '<circle cx="28" cy="41" r="2.2" fill="#e6ffc4" opacity=".8"/><circle cx="36" cy="45" r="1.5" fill="#e6ffc4" opacity=".8"/><circle cx="32" cy="38" r="1.1" fill="#e6ffc4"/><path d="M40 24l2-4M44 27l3-2" stroke="#c8ff8a" stroke-width="1.6" stroke-linecap="round"/>'
  ),
  'void-essence': svg(
    '0 0 64 64',
    '<circle cx="32" cy="32" r="24" fill="#0c0714" stroke="#6b3fa0" stroke-width="2"/>' +
      '<path d="M32 12a20 20 0 0118 12c-6-4-14-4-18 0-4 4-3 11 2 13 5 2 10-1 10-6" fill="none" stroke="#a46be0" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M32 52a20 20 0 01-18-12c6 4 14 4 18 0 4-4 3-11-2-13" fill="none" stroke="#5e3a8c" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="32" cy="32" r="3.5" fill="#d9b8ff"/><circle cx="20" cy="20" r="1" fill="#fff"/><circle cx="45" cy="44" r="1.2" fill="#fff"/><circle cx="46" cy="18" r=".8" fill="#fff"/>'
  ),
  'phoenix-feather': svg(
    '0 0 64 64',
    '<path d="M14 54C18 34 30 16 50 8c-2 16-12 34-30 42z" fill="#e0683c" stroke="#ffb35a" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M20 50c4-6 10-14 16-18M24 46l-6-4M28 41l-8-3M32 36l-8-2M36 31l-7-3M40 26l-6-3M30 42l5 3M34 37l6 2M38 32l6 1" stroke="#ffd27a" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M14 54l-4 4" stroke="#8a3a1a" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M46 12c-4 4-6 9-7 14" fill="none" stroke="#fff3c4" stroke-width="1.5" stroke-linecap="round"/>'
  ),
  'toad-slime': svg(
    '0 0 64 64',
    '<path d="M10 46c0-6 6-10 12-9 2-6 8-10 14-9 7 1 11 6 11 12 5 0 8 3 8 6 0 4-4 6-9 6H18c-5 0-8-2-8-6z" fill="#6d8f2a" stroke="#a9c94a" stroke-width="1.6"/>' +
      '<path d="M22 52v5M30 52v7M40 52v4" stroke="#6d8f2a" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="26" cy="42" r="2.5" fill="#c8e27a" opacity=".7"/><circle cx="38" cy="38" r="1.8" fill="#c8e27a" opacity=".7"/><circle cx="45" cy="47" r="1.4" fill="#c8e27a" opacity=".7"/>' +
      '<path d="M20 40c2-3 5-4 8-4" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.5" stroke-linecap="round"/>'
  )
} as const;

/* --------------------------------------------------------------------------
   Scene & decoration
   -------------------------------------------------------------------------- */

export const SCENE_ICONS = {
  cauldron: svg(
    '0 0 240 220',
    // shadow & fire stones
    '<ellipse cx="120" cy="205" rx="95" ry="12" fill="#000" opacity=".5"/>' +
      '<path d="M40 196l18-14h28l10 14zM96 196l12-16h26l12 16zM146 196l10-14h28l18 14z" fill="#3a3f3a" stroke="#565c55" stroke-width="2"/>' +
      '<ellipse class="cauldron__fire" cx="120" cy="182" rx="60" ry="10" fill="#8fdc4a" opacity=".35"/>' +
      // legs
      '<path d="M66 168l-12 26M174 168l12 26" stroke="#2a2e2a" stroke-width="10" stroke-linecap="round"/>' +
      // handles
      '<path d="M38 82a22 22 0 1014 40" fill="none" stroke="#a8884f" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M202 82a22 22 0 1 1-14 40" fill="none" stroke="#a8884f" stroke-width="8" stroke-linecap="round"/>' +
      // body
      '<path d="M30 72h180c6 52-16 104-90 104S24 124 30 72z" fill="#232a25" stroke="#3d4a40" stroke-width="3"/>' +
      '<path d="M48 90c0 34 18 64 58 72" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/>' +
      // rune emblem
      '<circle cx="120" cy="134" r="26" fill="#161b17" stroke="#a8884f" stroke-width="2.5"/>' +
      '<path class="cauldron__rune" d="M120 115l17 29h-34z" fill="none" stroke="#8fdc4a" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle class="cauldron__rune" cx="120" cy="134" r="4" fill="#8fdc4a"/>' +
      '<path d="M120 102v6M120 156v6M90 132h6M144 132h6" stroke="#a8884f" stroke-width="2" stroke-linecap="round"/>' +
      // rim & liquid
      '<ellipse cx="120" cy="72" rx="96" ry="22" fill="#2f3833" stroke="#7d8a80" stroke-width="4"/>' +
      '<ellipse class="cauldron__liquid" cx="120" cy="74" rx="84" ry="15" fill="#8fdc4a"/>' +
      '<ellipse cx="104" cy="70" rx="40" ry="5" fill="#e6ffc4" opacity=".35"/>' +
      '<circle class="cauldron__bubble" cx="92" cy="74" r="6" fill="#c8ff8a"/>' +
      '<circle class="cauldron__bubble" cx="140" cy="70" r="4" fill="#c8ff8a"/>' +
      '<circle class="cauldron__bubble" cx="160" cy="77" r="3" fill="#c8ff8a"/>'
  ),
  alcove: svg(
    '0 0 600 420',
    // pointed (ogival) arch spanning the whole stage
    '<path d="M24 420V204A380 380 0 01300 18a380 380 0 01276 186v216" fill="none" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M46 420V210A356 356 0 01300 44a356 356 0 01254 166v210" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".6"/>' +
      // pillar capitals, bases and stone joints
      '<path d="M12 204h46M542 204h46M12 404h46M542 404h46" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M24 270h22M24 336h22M554 270h22M554 336h22" stroke="currentColor" stroke-width="1.5" opacity=".5"/>' +
      // keystone and rose window at the apex
      '<path d="M300 4l12 16-12 16-12-16z" fill="currentColor" opacity=".7"/>' +
      '<circle cx="300" cy="104" r="34" fill="none" stroke="currentColor" stroke-width="2" opacity=".7"/>' +
      '<circle cx="300" cy="104" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".6"/>' +
      '<path d="M300 70v24M300 114v24M266 104h24M310 104h24M276 80l17 17M307 111l17 17M324 80l-17 17M293 111l-17 17" stroke="currentColor" stroke-width="1.2" opacity=".5"/>' +
      // floor line
      '<path d="M46 404h508" stroke="currentColor" stroke-width="1" opacity=".3"/>'
  ),
  shelfDecor: svg(
    '0 0 220 120',
    '<rect x="0" y="100" width="220" height="8" rx="2" fill="currentColor" opacity=".55"/>' +
      '<path d="M20 100V62h6v-10h8v10h6v38zM48 100V74h20v26zM54 74v-8h8v8" fill="currentColor" opacity=".35"/>' +
      '<path d="M150 100V60h14v40z" fill="currentColor" opacity=".35"/>' +
      '<path class="decor__flame" d="M157 58c-4-5-3-10 0-14 3 4 4 9 0 14z" fill="#ffcf6b"/>' +
      '<path d="M180 100c-6 0-10-4-10-10 0-8 6-12 6-20h8c0 8 6 12 6 20 0 6-4 10-10 10z" fill="currentColor" opacity=".3"/>'
  ),
  frameCorner: svg(
    '0 0 48 48',
    '<path d="M2 46V14A12 12 0 0114 2h32" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
      '<path d="M8 46V18a10 10 0 0110-10h28" fill="none" stroke="currentColor" stroke-width="1" opacity=".6"/>' +
      '<path d="M14 14l5 0 0 5-5 0z" fill="currentColor" transform="rotate(45 16.5 16.5)"/>' +
      '<circle cx="4" cy="4" r="2.5" fill="currentColor"/>'
  ),
  divider: svg(
    '0 0 240 16',
    '<path d="M0 8h100M140 8h100" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M120 1l7 7-7 7-7-7z" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
      '<circle cx="120" cy="8" r="2" fill="currentColor"/><circle cx="104" cy="8" r="1.6" fill="currentColor"/><circle cx="136" cy="8" r="1.6" fill="currentColor"/>'
  ),
  runeCircle: svg(
    '0 0 100 100',
    '<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5"/>' +
      '<path d="M50 14l31 54H19z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="50" cy="50" r="3" fill="currentColor"/>'
  ),
  hexagram: svg(
    '0 0 24 24',
    '<path d="M12 2l8.7 15H3.3zM12 22L3.3 7h17.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>'
  )
} as const;

export type UiIconName = keyof typeof UI_ICONS;
export type IngredientIconName = keyof typeof INGREDIENT_ICONS;
export type SceneIconName = keyof typeof SCENE_ICONS;
