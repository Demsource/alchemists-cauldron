import { createElement } from './dom';

// Same short-lived banner as the brew and reaction messages (CSS fade-out, removed on animationend).
export function showPourOutMessage(container: HTMLElement, penalty: number): void {
  container.querySelector('.brew-message')?.remove();

  const message = createElement('div', 'brew-message brew-message--pour-out');
  message.setAttribute('role', 'status');
  message.append(
    createElement('strong', 'brew-message__title', 'Cauldron poured out'),
    createElement('span', 'brew-message__details', `−${penalty} s · no life lost`)
  );

  message.addEventListener('animationend', () => message.remove());
  container.append(message);
}
