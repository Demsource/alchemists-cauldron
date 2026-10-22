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
- [ ] **Level 2 — Extended**: difficulty selection, auto-save & Continue Game.
- [ ] **Level 3 — Full Game**: drag & drop, tooltips, chemical reactions, Pour Out, visual feedback, keyboard shortcuts.

---

## 🎮 How to Play

1. **Start screen** — the shelf and cauldron are empty, score and time are `0`. Press **Start Game** in the centre.
2. **Menu** (cog button) — start a **New Game** or open the **Leaderboard**. The menu is available on the start screen and after a game ends.
3. **Read the recipe** — the parchment on the right shows the recipe name, the three target ranges and the ingredient counter.
4. **Add ingredients** — click a card on the shelf. Each click puts one portion into the cauldron and lowers the number in the round badge. The cauldron takes up to 4 ingredients; when it is full, the shelf is blocked.
5. **Watch the bars** — Temperature, Density and Magic Power change after every ingredient. The green zone is the recipe target, and it glows when the value is inside it.
6. **Brew** — press **Brew** (enabled when the cauldron has at least one ingredient). A message shows whether the potion worked.
7. **Pause** — press **Pause** during a run, or switch to another tab. Choose **Resume** to continue or **Exit to Menu** to leave the run.
8. **Game Over** — the final score and the reason are shown. If the score reaches the Top-10, enter a name (2–15 characters: letters, digits, space, `_` and `-`) and press **Submit Score**. From here you can open the **Leaderboard**, **Play Again** or exit to the menu.

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
  storage/    localStorage access (leaderboard)
  types/      TypeScript interfaces and types
  ui/         DOM rendering: layout, HUD, shelf, cauldron, bars, recipe panel, dialogs
  utils/      formatting and scale helpers
  styles/     main styles and CSS animations
```

Game rules live in `logic/` and never touch the DOM; `ui/` only renders the state.
