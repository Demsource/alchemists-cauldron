# 🧪 Alchemist's Cauldron

## 📌 Project Overview

**Alchemist's Cauldron** is a web-based alchemy puzzle mini-game built with pure TypeScript [1, 5]. The player acts as an alchemist selecting ingredients from a shelf into a brewing cauldron [1, 3]. The goal is to reach target ranges for **Temperature**, **Density**, and **Magic Power** defined by randomly generated recipes before running out of time, lives, or ingredient stock [1, 3, 9, 10].

---

## 🎯 Game Goal &amp; Core Gameplay

- **Primary Objective**: Successfully brew potions by matching the combined parameters of ingredients in the cauldron to the target ranges specified by the active recipe [1, 3, 9].
- **Core Parameters**:
  - 🌡️ **Temperature** [3]
  - ⚖️ **Density** [3]
  - ✨ **Magic Power** [3]
- **Win/Loss Conditions**:
  - **Score &amp; Bonus Time**: Successfully brewing a potion grants score points and bonus time based on difficulty [8].
  - **Game Over**: Occurs when time expires (\\(0\text{s}\\)), lives reach \\(0\\), or ingredient stock is completely exhausted (empty shelf and empty cauldron) [3, 10].

---

## 🛠️ Task Set Structure

The project specification is structured into four progressive stages totaling **393 points** [2]:

1. **Precondition 1 — Project Setup &amp; Technical Base (58 pts)** [2, 4]:
   - Repository setup, tooling, folder structure, code formatting, and quality checks.
2. **Level 1 — Basic Game (170 pts / 228 total score)** [2, 4]:
   - Fixed Medium difficulty rule set [2, 8].
   - Core mechanics: Ingredient selection, parameter summing, recipe tolerance check (\\(\pm 8\\)), timer, lives, pause menu, and Top-10 leaderboard [4, 8].
3. **Level 2 — Extended Functionality (50 pts / 278 total score)** [2, 4]:
   - Difficulty selection (Easy, Medium, Hard) [2, 4, 8].
   - Variable shelf ingredients, cauldron capacity, initial time, lives, time bonuses, and tolerances (\\(\pm 12\\), \\(\pm 8\\), \\(\pm 5\\)) [8].
   - Auto-save and continue game state via `localStorage` [4, 11].
4. **Level 3 — Full Game &amp; Enhanced UX (115 pts / 393 total score)** [2, 5]:
   - Drag &amp; drop ingredient interaction [2, 5, 11].
   - Tooltip popups displaying ingredient statistics on hover [2, 5, 8, 11].
   - Chemical reactions dynamically modifying combined parameter values [2, 5, 8, 11].
   - "Pour Out" action to clear cauldron contents [2, 3, 5].
   - Keyboard shortcuts and visual feedback/animations [2, 5].

---

## ✅ Implementation Status

_Developers can mark implemented parts of the task set:_

- [x] **Precondition 1**: Repository setup, TypeScript tooling, folder structure, quality checks.
- [x] **Level 1 (Basic Game)**: Core game loop, shelf and cauldron, parameter bars, recipe brew check, timer, lives, pause, leaderboard.
- [x] **Level 2 (Extended)**: Difficulty selection (Easy/Medium/Hard), auto-save &amp; continue (`localStorage`).
- [x] **Level 3 (Full Game)**: Drag &amp; Drop, ingredient tooltips, chemical reactions, Pour Out feature, visual feedback, keyboard shortcuts.

---

## 🎮 How the Player Interacts with the Game

- **Start Screen &amp; Navigation**:
  - Launch from the start screen with **Start Game** or open **Help** to review rules [6, 7].
  - Open **Settings / Menu** to choose difficulty, start a new run, continue a saved game, or inspect the **Leaderboard** [7].
- **Managing Ingredients &amp; Stock**:
  - Add ingredients from the shelf to the cauldron (via click or drag &amp; drop in Level 3) [3, 5].
  - Each ingredient has limited stock (randomly assigned whole number from \\(2\\) to \\(15\\) at game start) [12].
  - Cards display names and icons; parameter stats are visible directly (Levels 1–2) or in hover tooltips (Level 3) [7, 8].
- **Brewing &amp; Clearing**:
  - Track combined values on the **Temperature**, **Density**, and **Magic Power** parameter bars [3].
  - Click **Brew** to verify if parameter totals fit target recipe ranges within the active difficulty tolerance [3, 8, 13].
  - Click **Pour Out** (Level 3) to discard cauldron contents without submitting a brew check [3, 5].
- **Controls**:
  - Pointer click or drag &amp; drop [5, 11].
  - Keyboard shortcuts for streamlined gameplay [2, 5].

---

## 🚀 How to Run the Game

### Technical Requirements

- **Stack**: Pure **TypeScript** only (no external frameworks or game engines permitted), HTML5, CSS/SVG/Canvas [5].
- **Browser**: Latest Google Chrome [5].
- **Viewport**: Fully responsive for screens from 375 px to 1920 px wide [5].

### Setup and Running Instructions

1. **Clone &amp; Navigate**:
   Clone your project repository and open the project root directory.

2. **Install Dependencies**:
   Execute package installation:
   `npm install`

3. **Start Local Server**:
   Launch the development server:
   `npm run dev` or `npm start`
   Open the provided localhost address in Google Chrome.

4. **Build Production Assets**:
   Compile the production bundle:
   `npm run build`
