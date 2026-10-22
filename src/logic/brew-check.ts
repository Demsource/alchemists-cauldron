import type { IParameters } from '../types/ingredient';
import type { IRecipe, IRecipeRange } from '../types/recipe';
import { isInRange } from './calculate-cauldron';

export interface IBrewCheck {
  isSuccess: boolean;
  passed: Record<keyof IParameters, boolean>;
}

export function expandRange(range: IRecipeRange, tolerance: number): IRecipeRange {
  return { min: range.min - tolerance, max: range.max + tolerance };
}

// Worked example: recipe 32..42 with tolerance ±8 is checked as 24..50.
export function checkBrew(values: IParameters, recipe: IRecipe, tolerance: number): IBrewCheck {
  const passed = {
    temperature: isInRange(values.temperature, expandRange(recipe.temperature, tolerance)),
    density: isInRange(values.density, expandRange(recipe.density, tolerance)),
    magicPower: isInRange(values.magicPower, expandRange(recipe.magicPower, tolerance))
  };

  return {
    isSuccess: passed.temperature && passed.density && passed.magicPower,
    passed
  };
}
