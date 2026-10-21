import { getPreviewHud, getPreviewMode } from './dev/preview';
import { renderHud } from './ui/hud';
import { renderLayout } from './ui/layout';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const previewMode = getPreviewMode();
  layout.root.dataset.preview = previewMode;

  renderHud(layout.hud, getPreviewHud(previewMode));
}
