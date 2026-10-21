import {
  getPreviewActions,
  getPreviewBars,
  getPreviewCauldron,
  getPreviewHud,
  getPreviewMode,
  getPreviewRecipe,
  getPreviewShelf,
  PREVIEW_GAME_OVER
} from './dev/preview';
import { renderActions } from './ui/actions';
import { renderBars } from './ui/bars';
import { renderCauldron } from './ui/cauldron';
import { openGameOverDialog, openHelpDialog, openPauseDialog } from './ui/game-dialogs';
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

  if (previewMode === 'pause') {
    openPauseDialog(layout.dialogRoot);
  } else if (previewMode === 'gameover') {
    openGameOverDialog(layout.dialogRoot, PREVIEW_GAME_OVER);
  } else if (previewMode === 'help') {
    openHelpDialog(layout.dialogRoot);
  }
}
