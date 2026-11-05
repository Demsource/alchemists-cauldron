import { t } from '../i18n';
import type { IBrewCheck } from '../logic/brew-check';
import type { IDifficultySettings } from '../types/game';
import type { IParameters } from '../types/ingredient';
import { createElement } from './dom';

function getFailedLabels(check: IBrewCheck): string[] {
  return (Object.keys(check.passed) as (keyof IParameters)[])
    .filter((parameter) => !check.passed[parameter])
    .map((parameter) => t(`params.${parameter}`));
}

// Short-lived message; it fades out with a CSS animation and removes itself on animationend.
export function showBrewMessage(
  container: HTMLElement,
  check: IBrewCheck,
  settings: IDifficultySettings
): void {
  container.querySelector('.brew-message')?.remove();

  const message = createElement('div', 'brew-message');
  message.setAttribute('role', 'status');
  message.classList.add(check.isSuccess ? 'brew-message--success' : 'brew-message--fail');

  if (check.isSuccess) {
    message.append(
      createElement('strong', 'brew-message__title', t('messages.brewSuccess')),
      createElement(
        'span',
        'brew-message__details',
        t('messages.brewSuccessDetails', {
          points: settings.scorePerBrew,
          seconds: settings.timeBonus
        })
      )
    );
  } else {
    message.append(
      createElement('strong', 'brew-message__title', t('messages.brewFail')),
      createElement(
        'span',
        'brew-message__details',
        t('messages.brewFailDetails', { params: getFailedLabels(check).join(', ') })
      )
    );
  }

  message.addEventListener('animationend', () => message.remove());
  container.append(message);
}
