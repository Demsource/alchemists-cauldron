import { getPreviewHud, getPreviewMode, getPreviewShelf } from './dev/preview';
import { renderHud } from './ui/hud';
import { renderLayout } from './ui/layout';
import { renderShelf } from './ui/shelf';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const previewMode = getPreviewMode();
  layout.root.dataset.preview = previewMode;

  renderHud(layout.hud, getPreviewHud(previewMode));
  renderShelf(layout.shelf, getPreviewShelf(previewMode));
}
