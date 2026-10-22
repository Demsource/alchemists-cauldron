import type { IIngredient, IParameters } from '../types/ingredient';
import type { IRecipeRange } from '../types/recipe';

export const EMPTY_PARAMETERS: Readonly<IParameters> = {
  temperature: 0,
  density: 0,
  magicPower: 0
};

// Pure: always recalculated from the ingredient list, never mutated in place.
export function calculateCauldron(ingredients: readonly IIngredient[]): IParameters {
  return ingredients.reduce<IParameters>(
    (totals, ingredient) => ({
      temperature: totals.temperature + ingredient.temperature,
      density: totals.density + ingredient.density,
      magicPower: totals.magicPower + ingredient.magicPower
    }),
    { ...EMPTY_PARAMETERS }
  );
}

export function isInRange(value: number, range: IRecipeRange): boolean {
  return value >= range.min && value <= range.max;
}
