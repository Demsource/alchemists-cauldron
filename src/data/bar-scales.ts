import type { IParameters } from '../types/ingredient';
import type { IRecipeRange } from '../types/recipe';

// Visible range of each parameter bar. Values outside are clamped to the bar edge.
// Temperature and Density can be negative, so their scale is symmetric and 0 is the centre line.
// Magic Power is never negative, so its bar starts at 0.
export const BAR_SCALES: Readonly<Record<keyof IParameters, IRecipeRange>> = {
  temperature: { min: -100, max: 100 },
  density: { min: -100, max: 100 },
  magicPower: { min: 0, max: 150 }
};
