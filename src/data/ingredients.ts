import type { IIngredient, IngredientId } from '../types/ingredient';

// Fixed ordered catalogue from the README. Shelves always use the first N entries.
export const INGREDIENTS: readonly IIngredient[] = [
  { id: 'dragon-tears', icon: 'dragon-tears', temperature: 25, density: 8, magicPower: 10 },
  { id: 'fairy-dust', icon: 'fairy-dust', temperature: 12, density: 9, magicPower: 12 },
  { id: 'frost-lotus', icon: 'frost-lotus', temperature: -18, density: 4, magicPower: 14 },
  { id: 'mandrake-root', icon: 'mandrake-root', temperature: -5, density: 20, magicPower: 8 },
  { id: 'caustic-acid', icon: 'caustic-acid', temperature: 10, density: 14, magicPower: 22 },
  { id: 'void-essence', icon: 'void-essence', temperature: -20, density: -10, magicPower: 40 },
  {
    id: 'phoenix-feather',
    icon: 'phoenix-feather',
    temperature: 50,
    density: -10,
    magicPower: 30
  },
  { id: 'toad-slime', icon: 'toad-slime', temperature: 5, density: 30, magicPower: 0 }
];

export function isIngredientId(value: string | undefined): value is IngredientId {
  return INGREDIENTS.some((ingredient) => ingredient.id === value);
}
