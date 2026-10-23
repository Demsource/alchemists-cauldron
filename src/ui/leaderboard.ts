import type { Difficulty } from '../types/recipe';
import { formatDate } from '../utils/format';
import { createElement } from './dom';
import { createDialogButton, openDialog, type IDialogHandle } from './dialogs';

export interface ILeaderboardRowView {
  name: string;
  score: number;
  timestamp: number;
  difficultyLabel: string;
}

export interface ILeaderboardTabView {
  difficulty: Difficulty;
  label: string;
}

export interface ILeaderboardView {
  difficulty: Difficulty; // list on screen
  tabs: ILeaderboardTabView[];
  rows: ILeaderboardRowView[];
}

const COLUMNS = ['Rank', 'Name', 'Score', 'Difficulty', 'Date'];
const MEDALS = ['gold', 'silver', 'bronze'];

function renderTabs(view: ILeaderboardView): HTMLElement {
  const tabs = createElement('div', 'leaderboard__tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Difficulty');

  tabs.append(
    ...view.tabs.map((tab) => {
      const button = createElement('button', 'btn leaderboard__tab', tab.label);
      button.type = 'button';
      button.dataset.action = 'leaderboard-tab';
      button.dataset.difficulty = tab.difficulty;
      button.setAttribute('aria-pressed', String(tab.difficulty === view.difficulty));
      return button;
    })
  );

  return tabs;
}

function renderRank(index: number): HTMLTableCellElement {
  const cell = createElement('td', 'leaderboard__rank');
  const medal = MEDALS[index];

  if (medal) {
    cell.append(
      createElement('span', `leaderboard__medal leaderboard__medal--${medal}`, String(index + 1))
    );
  } else {
    cell.textContent = String(index + 1);
  }

  return cell;
}

function renderRow(row: ILeaderboardRowView, index: number): HTMLTableRowElement {
  const tr = createElement('tr', 'leaderboard__row');
  const date = createElement('time', '', formatDate(row.timestamp));
  date.dateTime = new Date(row.timestamp).toISOString();

  const dateCell = createElement('td', 'leaderboard__date');
  dateCell.append(date);

  tr.append(
    renderRank(index),
    createElement('td', 'leaderboard__name', row.name),
    createElement('td', 'leaderboard__score', String(row.score)),
    createElement('td', 'leaderboard__difficulty', row.difficultyLabel),
    dateCell
  );
  return tr;
}

function renderTable(rows: ILeaderboardRowView[]): HTMLElement {
  if (rows.length === 0) {
    return createElement('p', 'leaderboard__empty', 'No alchemist has brewed a result yet.');
  }

  const wrapper = createElement('div', 'leaderboard__scroll');
  const table = createElement('table', 'leaderboard');
  table.append(createElement('caption', 'visually-hidden', 'Top 10 results'));

  const headRow = createElement('tr');
  headRow.append(
    ...COLUMNS.map((column) => {
      const th = createElement('th', 'leaderboard__head', column);
      th.scope = 'col';
      return th;
    })
  );
  const head = createElement('thead');
  head.append(headRow);

  const body = createElement('tbody');
  body.append(...rows.map(renderRow));

  table.append(head, body);
  wrapper.append(table);
  return wrapper;
}

export function openLeaderboardDialog(root: HTMLElement, view: ILeaderboardView): IDialogHandle {
  const clear = createDialogButton('Clear Leaderboard', 'clear-leaderboard', 'danger');
  clear.disabled = view.rows.length === 0;

  return openDialog(root, {
    id: 'leaderboard-dialog',
    title: 'Top Alchemists',
    variant: 'parchment',
    dismissible: true,
    wide: true,
    content: [renderTabs(view), renderTable(view.rows)],
    actions: [clear, createDialogButton('Back', 'close-dialog', 'primary')]
  });
}
