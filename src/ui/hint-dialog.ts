import { INGREDIENT_ICONS, type IngredientIconName } from '../assets/icons';
import { t } from '../i18n';
import type { IParameters } from '../types/ingredient';
import { formatSigned } from '../utils/format';
import { createElement, createIcon } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export interface IHintStepView {
  icon: IngredientIconName;
  name: string;
  count: number;
}

export interface IHintView {
  recipeName: string;
  pourOutSeconds: number | null; // set when the plan starts with Pour Out
  steps: IHintStepView[]; // empty: the cauldron is already right
  values: IParameters | null; // null: no winning plan exists
}

const PARAMETERS: (keyof IParameters)[] = ['temperature', 'density', 'magicPower'];

function renderSteps(steps: IHintStepView[]): HTMLElement {
  const list = createElement('ol', 'hint__steps');
  list.append(
    ...steps.map((step) => {
      const item = createElement('li', 'hint__step');
      item.append(
        createIcon(INGREDIENT_ICONS[step.icon], 'icon hint__icon'),
        createElement('span', 'hint__name', step.name)
      );
      if (step.count > 1) {
        item.append(createElement('span', 'hint__count', `× ${step.count}`));
      }
      return item;
    })
  );
  return list;
}

function renderValues(values: IParameters): HTMLElement {
  const block = createElement('dl', 'hint__values');
  PARAMETERS.forEach((key) => {
    block.append(
      createElement('dt', 'hint__value-label', t(`params.${key}`)),
      createElement('dd', 'hint__value', formatSigned(values[key]))
    );
  });
  return block;
}

function renderPlan(view: IHintView, values: IParameters): Node[] {
  const content: Node[] = [];

  if (view.pourOutSeconds !== null) {
    const pourOut = t('hint.pourOutFirst', { seconds: view.pourOutSeconds });
    content.push(createElement('p', 'dialog__text hint__pour-out', pourOut));
  }

  if (view.steps.length === 0) {
    content.push(createElement('p', 'dialog__text', t('hint.brewNow')));
  } else {
    content.push(
      createElement('p', 'dialog__text', t('hint.add')),
      renderSteps(view.steps),
      createElement('p', 'dialog__text', t('hint.thenBrew'))
    );
  }

  content.push(createElement('p', 'hint__result-label', t('hint.result')), renderValues(values));
  return content;
}

// onDismiss: what Escape does (resume the game, like OK).
export function openHintDialog(
  root: HTMLElement,
  view: IHintView,
  onDismiss: () => void
): IDialogHandle {
  const ok = createDialogButton(t('hint.ok'), 'resume', 'primary');
  ok.autofocus = true;

  const content: Node[] = [
    createElement('p', 'hint__recipe', t('hint.recipe', { recipe: view.recipeName }))
  ];
  content.push(
    ...(view.values
      ? renderPlan(view, view.values)
      : [createElement('p', 'dialog__text', t('hint.none'))])
  );

  return openDialog(root, {
    id: 'hint-dialog',
    title: t('hint.title'),
    variant: 'parchment',
    onDismiss,
    content,
    actions: [ok]
  });
}
