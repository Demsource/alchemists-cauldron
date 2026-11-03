import type { IngredientIconName } from '../assets/icons';

export type IngredientId =
  | 'dragon-tears'
  | 'fairy-dust'
  | 'frost-lotus'
  | 'mandrake-root'
  | 'caustic-acid'
  | 'void-essence'
  | 'phoenix-feather'
  | 'toad-slime';

export interface IParameters {
  temperature: number;
  density: number;
  magicPower: number;
}

// Name and tooltip description live in the locale files (ingredients.<id>).
export interface IIngredient extends IParameters {
  id: IngredientId;
  icon: IngredientIconName;
}
