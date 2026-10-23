import { createElement } from './dom';

export interface IReactionMessageItem {
  name: string;
  description: string;
}

// Same short-lived banner as the brew result (CSS fade-out, removed on animationend).
export function showReactionMessage(container: HTMLElement, items: IReactionMessageItem[]): void {
  if (items.length === 0) {
    return;
  }

  container.querySelector('.brew-message')?.remove();

  const message = createElement('div', 'brew-message brew-message--reaction');
  message.setAttribute('role', 'status');
  message.append(
    createElement(
      'strong',
      'brew-message__title',
      `⚗ ${items.map((item) => item.name).join(' + ')}!`
    ),
    createElement(
      'span',
      'brew-message__details',
      items.map((item) => item.description).join(' · ')
    )
  );

  message.addEventListener('animationend', () => message.remove());
  container.append(message);
}
