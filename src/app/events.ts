import { isIngredientId } from '../data/ingredients';
import { canAddIngredient } from '../logic/cauldron';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../logic/difficulty';
import { getReactionsFor } from '../logic/reactions-logic';
import { getSettings, getState } from '../state/game-state';
import { closeDialog } from '../ui/dialogs';
import { bindDragAndDrop } from '../ui/drag-drop';
import { openHelpDialog, type IHelpSection } from '../ui/game-dialogs';
import type { ILayoutRefs } from '../ui/layout';
import type { IGameFlow } from './game-flow';
import type { ILeaderboardFlow } from './leaderboard-flow';
import type { IMenuFlow } from './menu-flow';

interface IFlows {
  game: IGameFlow;
  menu: IMenuFlow;
  leaderboard: ILeaderboardFlow;
}

// Help lists the enabled reactions per difficulty, straight from the reaction data.
function getReactionHelp(): IHelpSection {
  const items = DIFFICULTIES.map((difficulty) => {
    const reactions = getReactionsFor(difficulty);
    const list = reactions.length
      ? reactions
          .map(
            (reaction) => `${reaction.name} (${reaction.trigger ?? ''}): ${reaction.description}`
          )
          .join('; ')
      : 'no reactions';
    return `${DIFFICULTY_LABELS[difficulty]} — ${list}.`;
  });

  return {
    title: 'Reactions',
    items: [
      'Some combinations react in the cauldron and change the values, so watch more than the plain sums.',
      'A reaction fires once when its combination appears; its value change lasts while the combination stays.',
      ...items
    ]
  };
}

const findActionButton = (event: Event): HTMLButtonElement | null =>
  (event.target as Element).closest<HTMLButtonElement>('button[data-action]');

function bindShelf(layout: ILayoutRefs, { game }: IFlows): void {
  layout.shelf.addEventListener('click', (event) => {
    const card = (event.target as Element).closest<HTMLButtonElement>('button[data-ingredient-id]');
    const id = card?.dataset.ingredientId;

    if (card && !card.disabled && isIngredientId(id)) {
      game.addToCauldron(id);
    }
  });
}

// Drop uses the same rule and the same action as a click on the card.
function bindDrag(layout: ILayoutRefs, { game }: IFlows): void {
  bindDragAndDrop(layout.shelf, layout.stage, {
    canDrop: (id) => {
      const state = getState();
      return isIngredientId(id) && canAddIngredient(state, id, getSettings(state));
    },
    onDrop: (id) => {
      if (isIngredientId(id)) {
        game.addToCauldron(id);
      }
    }
  });
}

function bindFooter(layout: ILayoutRefs, { game, menu }: IFlows): void {
  layout.actions.addEventListener('click', (event) => {
    const button = findActionButton(event);

    if (!button || button.disabled) {
      return;
    }

    switch (button.dataset.action) {
      case 'start':
        game.startGame();
        break;
      case 'continue-game':
        game.continueGame();
        break;
      case 'brew':
        game.brewMixture();
        break;
      case 'pour-out':
        game.pourOutMixture();
        break;
      case 'pause':
        game.pause();
        break;
      case 'menu':
        menu.showMenu();
        break;
      case 'help':
        openHelpDialog(layout.dialogRoot, [getReactionHelp()]);
        break;
      default:
        break;
    }
  });
}

function bindDialogs(layout: ILayoutRefs, { game, menu, leaderboard }: IFlows): void {
  layout.dialogRoot.addEventListener('click', (event) => {
    const button = findActionButton(event);

    switch (button?.dataset.action) {
      case 'play-again':
      case 'new-game':
        game.startGame();
        break;
      case 'resume':
        game.resume();
        break;
      case 'continue-game':
        game.continueGame();
        break;
      case 'exit-to-menu':
        game.exitToMenu();
        break;
      case 'set-difficulty':
        menu.chooseDifficulty(button?.dataset.difficulty);
        break;
      case 'open-leaderboard':
        leaderboard.showLeaderboard();
        break;
      case 'leaderboard-tab':
        leaderboard.switchTab(button?.dataset.difficulty);
        break;
      case 'clear-leaderboard':
        leaderboard.askToClear();
        break;
      case 'confirm-clear-leaderboard':
        leaderboard.confirmClear();
        break;
      case 'close-dialog': {
        const dialog = button?.closest('dialog');
        if (dialog) {
          closeDialog(dialog);
        }
        break;
      }
      default:
        break;
    }
  });

  layout.dialogRoot.addEventListener('submit', (event) => {
    const form = event.target;

    if (form instanceof HTMLFormElement && form.id === 'player-name-form') {
      event.preventDefault();
      leaderboard.submitScore(form);
    }
  });

  // Typing clears the previous name error.
  layout.dialogRoot.addEventListener('input', (event) => {
    const input = event.target;

    if (input instanceof HTMLInputElement && input.name === 'playerName') {
      input.removeAttribute('aria-invalid');
      const error = input.form?.querySelector('.name-form__error');
      if (error) {
        error.textContent = '';
      }
    }
  });
}

function bindVisibility({ game }: IFlows): void {
  // Leaving the tab pauses a running game; the player resumes it from the dialog.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && getState().status === 'playing') {
      game.pause();
    }
  });
}

export function bindEvents(layout: ILayoutRefs, flows: IFlows): void {
  bindShelf(layout, flows);
  bindDrag(layout, flows);
  bindFooter(layout, flows);
  bindDialogs(layout, flows);
  bindVisibility(flows);
}
