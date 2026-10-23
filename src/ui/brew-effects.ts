import { UI_ICONS } from '../assets/icons';
import { createElement, createIcon } from './dom';
import { playEffect, spawnEffect } from './effects';
import type { ILayoutRefs } from './layout';

const SPARKLE_COUNT = 8;

export interface ISuccessEffectView {
  scoreGain: number;
  timeGain: number; // seconds actually added (0 when the timer was already full)
}

function renderSparkles(): HTMLElement {
  const ring = createElement('div', 'effect-sparkles__ring');

  for (let index = 0; index < SPARKLE_COUNT; index += 1) {
    const sparkle = createIcon(UI_ICONS.sparkle, 'icon effect-sparkles__item');
    // Each sparkle flies out at its own angle; the angle is read by CSS.
    sparkle.style.setProperty('--angle', `${(360 / SPARKLE_COUNT) * index}deg`);
    ring.append(sparkle);
  }

  return ring;
}

// Short "+N" text that rises from a HUD block and fades out.
function floatText(target: Element | null, text: string, modifier: string): void {
  if (target instanceof HTMLElement) {
    spawnEffect(target, `effect-float effect-float--${modifier}`, text);
  }
}

// Called after the state update, so it decorates the freshly rendered cauldron and HUD.
export function playSuccessEffect(layout: ILayoutRefs, view: ISuccessEffectView): void {
  const vessel = layout.stage.querySelector<HTMLElement>('.cauldron__vessel');

  if (vessel) {
    playEffect(vessel, 'effect-success-flash');
    spawnEffect(vessel, 'effect-sparkles', renderSparkles());
  }

  floatText(layout.hud.querySelector('.hud__block--score'), `+${view.scoreGain}`, 'score');

  if (view.timeGain > 0) {
    floatText(layout.hud.querySelector('.hud__block--timer'), `+${view.timeGain}s`, 'time');
  }
}
