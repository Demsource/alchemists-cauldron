import {
  getPreviewActions,
  getPreviewBars,
  getPreviewCauldron,
  getPreviewHud,
  getPreviewMode,
  getPreviewRecipe,
  getPreviewShelf
} from './dev/preview';
import { renderActions } from './ui/actions';
import { renderBars } from './ui/bars';
import { renderCauldron } from './ui/cauldron';
import { renderHud } from './ui/hud';
import { renderLayout } from './ui/layout';
import { renderRecipePanel } from './ui/recipe-panel';
import { renderShelf } from './ui/shelf';

const mount = document.querySelector<HTMLDivElement>('#app');

if (mount) {
  const layout = renderLayout(mount);
  const previewMode = getPreviewMode();
  layout.root.dataset.preview = previewMode;

  renderHud(layout.hud, getPreviewHud(previewMode));
  renderShelf(layout.shelf, getPreviewShelf(previewMode));
  renderCauldron(layout.stage, getPreviewCauldron(previewMode));
  renderRecipePanel(layout.recipe, getPreviewRecipe(previewMode));
  renderBars(layout.bars, getPreviewBars(previewMode));
  renderActions(layout.actions, getPreviewActions(previewMode));
}
