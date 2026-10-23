import { INGREDIENT_ICONS, SCENE_ICONS, type IngredientIconName } from '../assets/icons';
import { createElement, createIcon } from './dom';

export interface ICauldronItemView {
  id: IngredientIconName;
  name: string;
}

export interface ICauldronView {
  ingredients: ICauldronItemView[];
  capacity: number;
}

function renderSlot(index: number, item: ICauldronItemView | undefined): HTMLLIElement {
  const slot = createElement('li', 'cauldron__slot');

  if (item) {
    slot.classList.add('cauldron__slot--filled');
    slot.title = item.name;
    slot.append(
      createIcon(INGREDIENT_ICONS[item.id], 'icon cauldron__slot-icon'),
      createElement('span', 'visually-hidden', item.name)
    );
  } else {
    slot.append(createElement('span', 'cauldron__slot-number', String(index + 1)));
  }

  return slot;
}

export function renderCauldron(container: HTMLElement, view: ICauldronView): void {
  const cauldron = createElement('div', 'cauldron');
  cauldron.classList.toggle('cauldron--empty', view.ingredients.length === 0);

  const vessel = createElement('div', 'cauldron__vessel');
  const floating = createElement('div', 'cauldron__floating');
  floating.setAttribute('aria-hidden', 'true');
  // Icons come from the same ingredient data as the shelf. The cauldron only re-renders
  // when its content changes, so the last icon is the one just added: it drops in first.
  floating.append(
    ...view.ingredients.map((item, index) => {
      const isNewest = index === view.ingredients.length - 1;
      return createIcon(
        INGREDIENT_ICONS[item.id],
        `icon cauldron__float-icon${isNewest ? ' cauldron__float-icon--new' : ''}`
      );
    })
  );
  vessel.append(createIcon(SCENE_ICONS.cauldron, 'icon cauldron__art'), floating);

  const slots = createElement('ol', 'cauldron__slots');
  slots.setAttribute('aria-label', 'Ingredients in the cauldron');
  for (let index = 0; index < view.capacity; index += 1) {
    slots.append(renderSlot(index, view.ingredients[index]));
  }

  const status = createElement(
    'p',
    'cauldron__status',
    view.ingredients.length === 0
      ? 'The cauldron is empty.'
      : view.ingredients.map((item) => item.name).join(' · ')
  );

  cauldron.append(vessel, slots, status);
  container.querySelector('.cauldron')?.remove();
  container.append(cauldron);
}
