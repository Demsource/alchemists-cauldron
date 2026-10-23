# 🧪 Alchemist's Cauldron

🔗 **Live demo:** [demsource.github.io/alchemists-cauldron](https://demsource.github.io/alchemists-cauldron/)

## 📌 Project Overview

**Alchemist's Cauldron** is a browser alchemy puzzle game written in pure TypeScript, without frameworks, CSS libraries or game engines. The player picks ingredients from a shelf, drops them into a cauldron and tries to bring **Temperature**, **Density** and **Magic Power** into the target ranges of a random recipe before time, lives or ingredients run out.

---

## 🎯 Game Goal & Core Gameplay

- **Goal**: brew as many potions as possible. A brew succeeds when all three cauldron values are inside the recipe ranges, widened by the difficulty tolerance (±8 in Level 1).
- **Parameters**:
  - 🌡️ **Temperature**
  - 💧 **Density**
  - ✨ **Magic Power**
- **Successful brew**: +200 score, +10 s (never above the 150 s start time), the cauldron is emptied and a new recipe is picked.
- **Failed brew**: −1 life and the cauldron is emptied.
- **Used ingredients are spent** in both cases — the stock is never refilled.
- **Game Over** happens when:
  - the timer reaches `00:00`;
  - all lives are lost;
  - the ingredients run out (every shelf slot is empty and the cauldron is empty).

---

## 🛠️ Task Set Structure

The task is split into four stages with a maximum of **393 points**:

1. **Precondition 1 — Project Setup & Technical Base (58 pts)**: repository, tooling, folder structure and quality checks.
2. **Level 1 — Basic Game (170 pts, 228 total)**: one full game with the Medium rule set — shelf and cauldron, parameter bars, recipes and brew check, timer and lives, pause, Top-10 leaderboard.
3. **Level 2 — Extended (50 pts, 278 total)**: difficulty selection (Easy / Medium / Hard) and auto-save with Continue Game.
4. **Level 3 — Full Game (115 pts, 393 total)**: drag & drop, ingredient tooltips, chemical reactions, Pour Out, visual feedback and keyboard shortcuts.

---

## ✅ Implementation Status

- [x] **Precondition 1** — Vite + TypeScript (strict mode), ESLint, Prettier, Husky, lint-staged, commitlint, folder structure.
- [x] **Level 1 — Basic Game**
  - [x] **US 1.1** Ingredient shelf & cauldron — 6 ingredient cards with icon, name, values and stock badge; random stock from 2 to 15 per new game; empty slots stay in place and can't be used; the cauldron keeps the order of ingredients and holds up to 4.
  - [x] **US 1.2** Parameter bars — three bars with live sums, a centre zero line for negative values, smooth movement, the recipe target zone, a value marker and a green glow inside the target.
  - [x] **US 1.3** Recipe & brewing check — 20 fixed recipes, a random Medium recipe per game and after each success, an ingredient counter (`Ingredients: 2 / 4`), the Brew check with ±8 tolerance and a short result message.
  - [x] **US 1.4** Timer & Game Over — `MM:SS` timer with a shrinking bar, calculated from timestamps; red pulsing timer under 15 s; the Game Over screen shows the reason and the final score.
  - [x] **US 1.5** Pause — Pause button, blurred play field, Resume / Exit to Menu dialog, automatic pause when the tab is hidden.
  - [x] **US 1.6** Leaderboard — Top-10 in `localStorage`, name entry with validation, sorting with ties kept in order, `DD.MM.YYYY HH:MM` dates, Clear Leaderboard with an in-app confirmation; broken saved data never crashes the game.
- [x] **Level 2 — Extended**
  - [x] **US 2.1** Difficulty selection — Help button with the game rules; Easy / Medium / Hard in the Menu, each with a short summary; all values from the difficulty table (shelf size, cauldron limit, start time, tolerance, lives, score per brew, time bonus); recipes picked from the chosen difficulty; difficulty locked during a run and remembered after reload; one Top-10 leaderboard per difficulty with tabs and a Difficulty column.
  - [x] **US 2.2** Auto-save & Continue Game — the running game (difficulty, score, time left, lives, recipe, cauldron, shelf stock, status) is saved to `localStorage` after every change, on pause and when the page closes; **Continue Game** appears on the start screen and in the Menu only for a valid unfinished save and opens it paused with the saved stock; a new game overwrites the save, while Game Over and Exit to Menu remove it; broken or edited saves are validated, deleted and never crash the game.
- [ ] **Level 3 — Full Game**
  - [x] **US 3.1** Drag & drop — drag a shelf card into the cauldron area (HTML5 `dragstart`, `dragover`, `dragleave`, `drop`); the cauldron glows as a drop zone only for a valid drag; drops are ignored while paused, with a full cauldron or at stock 0; a drop adds the ingredient and spends one portion exactly like a click, which still works.
  - [x] **US 3.2** Ingredient tooltip — with a mouse, shelf cards show only the icon, name and stock; hovering or focusing a card opens a tooltip with Temperature, Density and Magic Power (`+` / `−`) and a short description; it opens to the left near the right edge and upward near the bottom edge, stays above the rest of the game and is hidden while paused or dragging. On touch screens without hover the numbers stay on the cards.
  - [x] **US 3.3** Chemical reactions — all 15 reactions kept as a typed `IReaction[]`; Easy has none, Medium enables Bubbling and Solar Frost, Hard enables Volatile Mix, Rooted Steam and Pressure Spike; cauldron values are always recalculated from the ingredient list and the active reactions are applied to them (bars and brew check use the same values); a reaction fires only when it turns from inactive to active, applying its one-time effects (lost seconds, lost life, cleared cauldron) and showing a message; active reactions are listed on the recipe panel and in Help.
  - [x] **US 3.4** Pour Out — a **Pour Out** button next to **Brew** clears the whole cauldron for 10 seconds without losing a life; it is disabled when the cauldron is empty; the poured ingredients stay spent and every other value is unchanged; a short message confirms it.
  - [x] **US 3.5** Visual feedback — a correct brew flashes the cauldron and bursts sparkles, with `+score` and `+10s` floating up from the HUD; a failed brew shows an explosion with smoke and a short shake of the HUD and play field; ingredient icons float inside the cauldron and the newest one drops in; the parameter bars move smoothly. All effects are CSS animations cleaned up on `animationend` (no `setTimeout` / `setInterval`), and with reduced motion only short colour flashes remain.
  - [ ] **US 3.6** Keyboard shortcuts.

---

## 🎮 How to Play

1. **Start screen** — the shelf and cauldron are empty, score and time are `0`. Press **Start Game** in the centre, or **Help** (book button) to read the rules.
2. **Menu** (cog button) — choose the difficulty, start a **New Game** or open the **Leaderboard**. The menu is available on the start screen and after a game ends.

   | Difficulty | Ingredients | Cauldron | Time  | Tolerance | Lives | Score / brew | Time bonus |
   | ---------- | :---------: | :------: | :---: | :-------: | :---: | :----------: | :--------: |
   | Easy       |      4      |    4     | 180 s |    ±12    |   5   |     100      |   +15 s    |
   | Medium     |      6      |    4     | 150 s |    ±8     |   3   |     200      |   +10 s    |
   | Hard       |      8      |    5     | 150 s |    ±5     |   3   |     300      |    +5 s    |

3. **Read the recipe** — the parchment on the right shows the difficulty, the recipe name, the three target ranges and the ingredient counter.
4. **Check the ingredients** — hover a shelf card (or focus it with the keyboard) to see its Temperature, Density and Magic Power in a tooltip. On touch screens the numbers are shown on the cards.
5. **Add ingredients** — click a card on the shelf, or drag it with the mouse and drop it on the cauldron (it glows when the drop is allowed). Each one puts one portion into the cauldron and lowers the number in the round badge. When the cauldron reaches its limit, the shelf is blocked.
6. **Watch the bars** — Temperature, Density and Magic Power change after every ingredient. The green zone is the recipe target, and it glows when the value is inside it.
   On Medium and Hard some combinations cause a **reaction** (listed in **Help**): a purple message shows what happened, the recipe panel lists the active reactions, and the bars already include their effect. Some reactions also cost time or a life, or empty the cauldron.
7. **Brew** — press **Brew** (enabled when the cauldron has at least one ingredient). A message shows whether the potion worked. If the mixture is clearly wrong, press **Pour Out** instead: it empties the cauldron for 10 seconds and you keep your lives (the poured ingredients are not returned).
8. **Pause** — press **Pause** during a run, or switch to another tab. Choose **Resume** to continue or **Exit to Menu** to leave the run (this also deletes its save).
9. **Continue later** — the game saves itself while you play. After a reload or when you come back, press **Continue Game** (next to **Start Game** or in the Menu). The run opens paused, exactly where you left it; press **Resume** to go on. Starting a new game replaces the saved one.
10. **Game Over** — the final score and the reason are shown. If the score reaches the Top-10, enter a name (2–15 characters: letters, digits, space, `_` and `-`) and press **Submit Score**. From here you can open the **Leaderboard** (one Top-10 per difficulty, switched with the tabs), **Play Again** or exit to the menu.

---

## 🚀 How to Run the Game

### Requirements

- Node.js (version from `.nvmrc`) and npm.
- Latest Google Chrome.
- Works on screens from 375 px to 1920 px wide.

### Setup

```bash
git clone <repository-url>
cd alchemists-cauldron
npm install
```

### Scripts

| Command                | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `npm run dev`          | Start the development server (open the URL shown in the terminal) |
| `npm run build`        | Type-check and build the production bundle into `dist/`           |
| `npm run preview`      | Serve the production build locally                                |
| `npm run lint`         | Run ESLint                                                        |
| `npm run lint:fix`     | Run ESLint and fix what it can                                    |
| `npm run format`       | Format the code with Prettier                                     |
| `npm run format:check` | Check formatting without changing files                           |

---

## 🗂️ Project Structure

```text
src/
  assets/     SVG icons (one separate asset per game element)
  data/       ingredients, recipes, difficulty settings, bar scales
  logic/      pure game rules: stock, cauldron sums, brew check, score, timer, game over, leaderboard
  state/      game state store and the countdown timer
  app/        game flows (game, menu, leaderboard, save) and event wiring
  storage/    localStorage access (leaderboard, game save, difficulty preference)
  types/      TypeScript interfaces and types
  ui/         DOM rendering: layout, HUD, shelf, cauldron, bars, recipe panel, dialogs
  utils/      formatting and scale helpers
  styles/     main styles and CSS animations
```

Game rules live in `logic/` and never touch the DOM; `ui/` only renders the state.
