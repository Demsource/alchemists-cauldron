import { getPreviewMode } from './dev/preview';
import { renderLayout } from './ui/layout';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  layout.root.dataset.preview = getPreviewMode();
}
