import { calculateCauldron } from '../logic/calculate-cauldron';
import type { IIngredient, IngredientId } from '../types/ingredient';
import type { IReaction } from '../types/reaction';

// Trigger helpers. Stat triggers always use the plain sums (before any reaction).
const hasAll = (ingredients: IIngredient[], ...ids: IngredientId[]): boolean =>
  ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));

const sums = calculateCauldron;

// Percent change, rounded so the bars and the brew check use whole numbers.
const percent = (value: number, change: number): number => Math.round(value * (1 + change / 100));

/**
 * Full reaction table from US 3.3, in table order (reactions apply in this order).
 * `difficulty` marks the enabled set: Medium 2 reactions, Hard 3, Easy none.
 */
export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    description: 'Magic Power +50%, −10 s',
    difficulty: 'medium',
    isActive: (list) => hasAll(list, 'fairy-dust', 'caustic-acid'),
    apply: (v) => ({ ...v, magicPower: percent(v.magicPower, 50) }),
    effects: { timePenalty: 10 }
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    description: '−1 life, the cauldron is cleared',
    difficulty: 'hard',
    isActive: (list) => hasAll(list, 'phoenix-feather', 'void-essence'),
    apply: (v) => v,
    effects: { loseLife: true, clearCauldron: true }
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    description: 'Temperature set to 0, Density +20%',
    difficulty: 'medium',
    isActive: (list) => hasAll(list, 'dragon-tears', 'frost-lotus'),
    apply: (v) => ({ ...v, temperature: 0, density: percent(v.density, 20) })
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    description: 'Density +25%, Magic Power −10%',
    difficulty: 'hard',
    isActive: (list) => hasAll(list, 'mandrake-root', 'toad-slime'),
    apply: (v) => ({
      ...v,
      density: percent(v.density, 25),
      magicPower: percent(v.magicPower, -10)
    })
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    description: 'Temperature +10, Magic Power +25%',
    difficulty: null,
    isActive: (list) => hasAll(list, 'phoenix-feather', 'fairy-dust'),
    apply: (v) => ({
      ...v,
      temperature: v.temperature + 10,
      magicPower: percent(v.magicPower, 25)
    })
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    description: 'Temperature set to 0, Density doubled',
    difficulty: null,
    isActive: (list) =>
      list.some((item) => item.temperature > 15) && list.some((item) => item.temperature < -15),
    apply: (v) => ({ ...v, temperature: 0, density: v.density * 2 })
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    description: 'Density set to 70, Magic Power +10%',
    difficulty: 'hard',
    isActive: (list) => sums(list).density >= 70,
    apply: (v) => ({ ...v, density: 70, magicPower: percent(v.magicPower, 10) })
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    description: 'Magic Power +20%, Density −10%',
    difficulty: null,
    isActive: (list) => sums(list).temperature >= 60,
    apply: (v) => ({
      ...v,
      magicPower: percent(v.magicPower, 20),
      density: percent(v.density, -10)
    })
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    description: 'Density +15%, Magic Power −15%',
    difficulty: null,
    isActive: (list) => sums(list).temperature <= -20,
    apply: (v) => ({
      ...v,
      density: percent(v.density, 15),
      magicPower: percent(v.magicPower, -15)
    })
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    description: 'Magic Power set to 80, Temperature +5',
    difficulty: null,
    isActive: (list) => sums(list).magicPower >= 80,
    apply: (v) => ({ ...v, magicPower: 80, temperature: v.temperature + 5 })
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    description: 'Temperature +10, −5 s',
    difficulty: null,
    isActive: (list) =>
      hasAll(list, 'dragon-tears', 'caustic-acid') && sums(list).temperature >= 35,
    apply: (v) => ({ ...v, temperature: v.temperature + 10 }),
    effects: { timePenalty: 5 }
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    description: 'Temperature −10, Magic Power +20%',
    difficulty: null,
    isActive: (list) => hasAll(list, 'frost-lotus', 'void-essence') && sums(list).density <= 0,
    apply: (v) => ({
      ...v,
      temperature: v.temperature - 10,
      magicPower: percent(v.magicPower, 20)
    })
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    description: 'Density +20%, Magic Power +10%',
    difficulty: null,
    isActive: (list) => hasAll(list, 'fairy-dust', 'toad-slime') && sums(list).density >= 40,
    apply: (v) => ({
      ...v,
      density: percent(v.density, 20),
      magicPower: percent(v.magicPower, 10)
    })
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    description: 'Temperature +15, Density −10%',
    difficulty: null,
    isActive: (list) =>
      hasAll(list, 'mandrake-root', 'phoenix-feather') && sums(list).temperature >= 40,
    apply: (v) => ({
      ...v,
      temperature: v.temperature + 15,
      density: percent(v.density, -10)
    })
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    description: 'Magic Power +30%, Temperature −5',
    difficulty: null,
    isActive: (list) => hasAll(list, 'void-essence', 'dragon-tears') && sums(list).magicPower >= 50,
    apply: (v) => ({
      ...v,
      magicPower: percent(v.magicPower, 30),
      temperature: v.temperature - 5
    })
  }
];
