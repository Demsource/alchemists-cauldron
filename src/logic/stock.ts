import type { IGameState } from '../types/game';
import type { IIngredient, IngredientId } from '../types/ingredient';

export const MIN_STOCK = 2;
export const MAX_STOCK = 15;

type ShelfStock = IGameState['shelfStock'];

export function rollStock(random: () => number = Math.random): number {
  return Math.floor(random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
}

export function createStock(
  ingredients: readonly IIngredient[],
  random: () => number = Math.random
): ShelfStock {
  const stock: ShelfStock = {};
  ingredients.forEach((ingredient) => {
    stock[ingredient.id] = rollStock(random);
  });
  return stock;
}

export function getStock(stock: ShelfStock, id: IngredientId): number {
  return stock[id] ?? 0;
}

export function hasStock(stock: ShelfStock, id: IngredientId): boolean {
  return getStock(stock, id) > 0;
}

export function takeFromStock(stock: ShelfStock, id: IngredientId): ShelfStock {
  return { ...stock, [id]: Math.max(0, getStock(stock, id) - 1) };
}

export function isShelfEmpty(stock: ShelfStock): boolean {
  return Object.values(stock).every((count) => (count ?? 0) <= 0);
}
