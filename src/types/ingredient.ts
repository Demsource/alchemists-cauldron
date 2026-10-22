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

export interface IIngredient extends IParameters {
  id: IngredientId;
  name: string;
  icon: IngredientIconName;
}
