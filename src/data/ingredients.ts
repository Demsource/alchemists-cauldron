import type { IIngredient, IngredientId } from '../types/ingredient';

// Fixed ordered catalogue from the README. Shelves always use the first N entries.
export const INGREDIENTS: readonly IIngredient[] = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    icon: 'dragon-tears',
    description: 'Wept by an old dragon. Warm to the touch and faintly glowing.',
    temperature: 25,
    density: 8,
    magicPower: 10
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    icon: 'fairy-dust',
    description: 'Glittering powder from fairy wings. Light, lively and a little mischievous.',
    temperature: 12,
    density: 9,
    magicPower: 12
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    icon: 'frost-lotus',
    description: 'A flower that blooms only on frozen lakes. It cools any brew.',
    temperature: -18,
    density: 4,
    magicPower: 14
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    icon: 'mandrake-root',
    description: 'A grumpy root that thickens the mixture. Handle with earmuffs.',
    temperature: -5,
    density: 20,
    magicPower: 8
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    icon: 'caustic-acid',
    description: 'Bubbling green acid. Strong, heavy and full of raw power.',
    temperature: 10,
    density: 14,
    magicPower: 22
  },
  {
    id: 'void-essence',
    name: 'Essence of the Void',
    icon: 'void-essence',
    description: 'A drop of pure darkness. It chills and thins the brew but floods it with magic.',
    temperature: -20,
    density: -10,
    magicPower: 40
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    icon: 'phoenix-feather',
    description: 'Still smouldering from rebirth. Fierce heat and bright magic.',
    temperature: 50,
    density: -10,
    magicPower: 30
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    icon: 'toad-slime',
    description: 'Thick swamp slime. Makes any potion heavy, but holds no magic at all.',
    temperature: 5,
    density: 30,
    magicPower: 0
  }
];

export function isIngredientId(value: string | undefined): value is IngredientId {
  return INGREDIENTS.some((ingredient) => ingredient.id === value);
}
