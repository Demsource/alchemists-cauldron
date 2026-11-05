import { INGREDIENTS } from '../data/ingredients';
import { getIngredientName, getRecipeName } from '../i18n/game-text';
import { POUR_OUT_PENALTY } from '../logic/cauldron';
import { getHint, type Hint } from '../logic/hint';
import { getSettings, getState } from '../state/game-state';
import type { IngredientId } from '../types/ingredient';
import { openHintDialog, type IHintStepView, type IHintView } from '../ui/hint-dialog';
import type { ILayoutRefs } from '../ui/layout';
import type { IGameFlow } from './game-flow';

export interface IHintFlow {
  showHint: () => void;
}

// Same ingredient in a row becomes one step with a count ("Dragon Tears × 2").
function toSteps(ids: IngredientId[]): IHintStepView[] {
  return ids.reduce<IHintStepView[]>((steps, id) => {
    const last = steps[steps.length - 1];
    const ingredient = INGREDIENTS.find((item) => item.id === id);

    if (last && ingredient && last.icon === ingredient.icon) {
      last.count += 1;
    } else if (ingredient) {
      steps.push({ icon: ingredient.icon, name: getIngredientName(id), count: 1 });
    }
    return steps;
  }, []);
}

function toView(hint: Hint, recipeName: string): IHintView {
  if (!hint.found) {
    return { recipeName, pourOutSeconds: null, steps: [], values: null };
  }

  return {
    recipeName,
    pourOutSeconds: hint.pourOutFirst ? POUR_OUT_PENALTY : null,
    steps: toSteps(hint.add),
    values: hint.values
  };
}

// The game is paused while the hint is open (without the Pause dialog); OK or Escape resume it.
export function createHintFlow(layout: ILayoutRefs, game: IGameFlow): IHintFlow {
  const showHint = (): void => {
    if (!game.freeze()) {
      return;
    }

    // Read after freezing, so the plan uses the exact time left.
    const state = getState();
    const recipe = state.activeRecipe;
    if (!recipe) {
      game.resume();
      return;
    }

    openHintDialog(
      layout.dialogRoot,
      toView(getHint(state, getSettings(state)), getRecipeName(recipe.id)),
      game.resume
    );
  };

  return { showHint };
}
