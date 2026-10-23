import { INGREDIENTS } from '../data/ingredients';
import { getState, subscribe } from '../state/game-state';
import type { ILayoutRefs } from '../ui/layout';
import { createTooltip } from '../ui/tooltip';

const findCard = (target: EventTarget | null): HTMLElement | null =>
  target instanceof Element ? target.closest<HTMLElement>('[data-ingredient-id]') : null;

// Shows the ingredient base values on hover or keyboard focus, only during a running game.
export function bindTooltip(layout: ILayoutRefs): void {
  const tooltip = createTooltip(layout.root);
  let current: HTMLElement | null = null;

  const hide = (): void => {
    current = null;
    tooltip.hide();
  };

  const showFor = (card: HTMLElement | null): void => {
    const ingredient = INGREDIENTS.find((item) => item.id === card?.dataset.ingredientId);

    if (!card || !ingredient || getState().status !== 'playing') {
      hide();
      return;
    }

    if (card !== current) {
      current = card;
      tooltip.show(card, ingredient);
    }
  };

  const { shelf } = layout;

  // mouseover/mouseout bubble, so one pair of listeners covers every card.
  shelf.addEventListener('mouseover', (event) => showFor(findCard(event.target)));
  shelf.addEventListener('mouseout', (event) => {
    if (
      current &&
      !(event.relatedTarget instanceof Node && current.contains(event.relatedTarget))
    ) {
      hide();
    }
  });

  // Keyboard players get the same values when a card is focused.
  shelf.addEventListener('focusin', (event) => showFor(findCard(event.target)));
  shelf.addEventListener('focusout', hide);

  // Anything that moves or covers the card closes the tooltip.
  shelf.addEventListener('dragstart', hide);
  shelf.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);

  // Hidden while paused or outside a run, and when the shelf re-rendered the card away.
  subscribe((state) => {
    if (state.status !== 'playing' || (current && !current.isConnected)) {
      hide();
    }
  });
}
