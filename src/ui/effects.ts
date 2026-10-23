import { createElement } from './dom';

/**
 * One-shot CSS effects. All timing lives in CSS; cleanup happens on animationend,
 * never with setTimeout / setInterval.
 */

// Adds an animation class to an existing element, restarting it if it is still running.
export function playEffect(element: HTMLElement, className: string): void {
  element.classList.remove(className);
  // Reading layout here makes the browser drop the old animation, so re-adding restarts it.
  void element.offsetWidth;
  element.classList.add(className);

  const onEnd = (event: AnimationEvent): void => {
    // Ignore animations of children that bubble up.
    if (event.target === element) {
      element.classList.remove(className);
      element.removeEventListener('animationend', onEnd);
    }
  };
  element.addEventListener('animationend', onEnd);
}

// Adds a temporary decorative element that removes itself when its own animation ends.
export function spawnEffect(
  container: HTMLElement,
  className: string,
  content?: string | Node
): HTMLElement {
  const effect = createElement('div', `effect ${className}`);
  effect.setAttribute('aria-hidden', 'true');

  if (typeof content === 'string') {
    effect.textContent = content;
  } else if (content) {
    effect.append(content);
  }

  effect.addEventListener('animationend', (event) => {
    if (event.target === effect) {
      effect.remove();
    }
  });

  container.append(effect);
  return effect;
}
