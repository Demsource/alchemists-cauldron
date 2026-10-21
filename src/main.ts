import { getPreviewCauldron, getPreviewHud, getPreviewMode, getPreviewShelf } from './dev/preview';
import { renderCauldron } from './ui/cauldron';
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
  renderCauldron(layout.stage, getPreviewCauldron(previewMode));
}
