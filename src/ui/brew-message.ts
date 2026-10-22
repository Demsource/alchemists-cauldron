import type { IBrewCheck } from '../logic/brew-check';
import type { IDifficultySettings } from '../types/game';
import type { IParameters } from '../types/ingredient';
import { createElement } from './dom';

const PARAMETER_LABELS: Record<keyof IParameters, string> = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power'
};

function getFailedLabels(check: IBrewCheck): string[] {
  return (Object.keys(check.passed) as (keyof IParameters)[])
    .filter((parameter) => !check.passed[parameter])
    .map((parameter) => PARAMETER_LABELS[parameter]);
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
      createElement('strong', 'brew-message__title', 'Perfect brew!'),
      createElement(
        'span',
        'brew-message__details',
        `+${settings.scorePerBrew} points · +${settings.timeBonus}s`
      )
    );
  } else {
    message.append(
      createElement('strong', 'brew-message__title', 'The mixture failed…'),
      createElement(
        'span',
        'brew-message__details',
        `Off target: ${getFailedLabels(check).join(', ')} · −1 life`
      )
    );
  }

  message.addEventListener('animationend', () => message.remove());
  container.append(message);
}
