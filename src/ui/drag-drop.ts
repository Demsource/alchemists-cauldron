const DRAG_TYPE = 'text/plain';
const DROP_ZONE_ACTIVE = 'board__stage--drop-target';
const CARD_DRAGGING = 'shelf-card--dragging';

export interface IDragDropHandlers {
  // Game rules stay outside: the UI only asks whether a drop is allowed and reports it.
  canDrop: (id: string) => boolean;
  onDrop: (id: string) => void;
}

/**
 * HTML5 drag & drop from the shelf cards to the cauldron area.
 * Drag data is hidden from scripts during dragover, so the dragged id is also kept here.
 */
export function bindDragAndDrop(
  shelf: HTMLElement,
  dropZone: HTMLElement,
  { canDrop, onDrop }: IDragDropHandlers
): void {
  let draggedId: string | null = null;
  let draggedCard: HTMLElement | null = null;

  const setHighlight = (isActive: boolean): void => {
    dropZone.classList.toggle(DROP_ZONE_ACTIVE, isActive);
  };

  const reset = (): void => {
    setHighlight(false);
    draggedCard?.classList.remove(CARD_DRAGGING);
    draggedId = null;
    draggedCard = null;
  };

  shelf.addEventListener('dragstart', (event) => {
    const card = (event.target as Element).closest<HTMLButtonElement>('[data-ingredient-id]');
    const id = card?.dataset.ingredientId;

    if (!card || card.disabled || !id || !event.dataTransfer) {
      event.preventDefault();
      return;
    }

    draggedId = id;
    draggedCard = card;
    card.classList.add(CARD_DRAGGING);
    event.dataTransfer.setData(DRAG_TYPE, id);
    event.dataTransfer.effectAllowed = 'copy';
  });

  shelf.addEventListener('dragend', reset);

  dropZone.addEventListener('dragover', (event) => {
    // Without preventDefault the browser refuses the drop.
    if (draggedId !== null && canDrop(draggedId)) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
      setHighlight(true);
    } else {
      setHighlight(false);
    }
  });

  dropZone.addEventListener('dragleave', (event) => {
    // Moving over the zone's own children also fires dragleave; only react when really leaving.
    if (!(event.relatedTarget instanceof Node && dropZone.contains(event.relatedTarget))) {
      setHighlight(false);
    }
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    const id = event.dataTransfer?.getData(DRAG_TYPE) || draggedId;
    reset();

    // Checked again on drop: the game may have been paused or filled meanwhile.
    if (id && canDrop(id)) {
      onDrop(id);
    }
  });
}
