# Business Deal V1 And Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete single-player Deal-style browser game v1 with money/debt/action mechanics, basic AI decisions, and production deployment on Vercel.

**Architecture:** Keep rendering in the browser with plain HTML/CSS/JS, but split logic from UI rendering so game rules can be tested independently. Introduce a tiny test harness with Vitest for deterministic rule checks while preserving the no-framework runtime. Deploy static assets via Vercel with a minimal config and repeatable deploy workflow.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js, Vitest, Vercel

---

## File Structure Plan

- Create: `package.json`
- Create: `vercel.json`
- Create: `src/game/state.js`
- Create: `src/game/deck.js`
- Create: `src/game/rules.js`
- Create: `src/game/ai.js`
- Create: `src/ui/render.js`
- Create: `src/ui/handlers.js`
- Create: `src/main.js`
- Create: `tests/rules.spec.js`
- Create: `tests/ai.spec.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `README.md`

### Task 1: Baseline Tooling And Test Harness

**Files:**
- Create: `package.json`
- Create: `tests/rules.spec.js`
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/game/state.js";
describe("state bootstrap", () => {
  it("starts with no winner and human turn", () => {
    const state = createInitialState();
    expect(state.winner).toBe(null);
    expect(state.turn).toBe("human");
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/rules.spec.js`
Expected: FAIL with module-not-found for `src/game/state.js` or missing `vitest`.
- [ ] **Step 3: Write minimal implementation**
```json
{
  "name": "business-deal-io",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "dev": "python3 -m http.server 8080"
  },
  "devDependencies": {
    "vitest": "^2.1.9"
  }
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm install && npm run test -- tests/rules.spec.js`
Expected: PASS with 1 passed test.
- [ ] **Step 5: Commit**
```bash
git add package.json src/game/state.js tests/rules.spec.js README.md
git commit -m "chore: add test harness and initial game state module"
```

### Task 2: Extract Deck Model And Card Catalog

**Files:**
- Create: `src/game/deck.js`
- Modify: `src/game/state.js`
- Modify: `src/main.js`
- Test: `tests/rules.spec.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { createDeck } from "../src/game/deck.js";
describe("deck creation", () => {
  it("contains property, money, and action cards", () => {
    const deck = createDeck();
    expect(deck.some((c) => c.type === "property")).toBe(true);
    expect(deck.some((c) => c.type === "money")).toBe(true);
    expect(deck.some((c) => c.type === "action")).toBe(true);
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/rules.spec.js`
Expected: FAIL with missing `src/game/deck.js`.
- [ ] **Step 3: Write minimal implementation**
```js
export const SET_SIZES = { Solar: 2, Marina: 3, Uptown: 3, Central: 3, Metro: 4 };
export function createDeck() {
  const cards = [];
  Object.entries(SET_SIZES).forEach(([group, required]) => {
    for (let i = 0; i < required + 2; i += 1) cards.push({ type: "property", group });
  });
  ["Rent", "Sly Deal", "Debt Collector", "Deal Breaker"].forEach((name) => {
    for (let i = 0; i < 4; i += 1) cards.push({ type: "action", name });
  });
  for (let i = 0; i < 15; i += 1) cards.push({ type: "money", value: 1 + (i % 4) });
  return shuffle(cards);
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/rules.spec.js`
Expected: PASS with deck test green.
- [ ] **Step 5: Commit**
```bash
git add src/game/deck.js src/game/state.js src/main.js tests/rules.spec.js
git commit -m "refactor: extract deck and card catalog module"
```

### Task 3: Implement Money Bank And Debt Resolution Rules

**Files:**
- Create: `src/game/rules.js`
- Modify: `src/game/state.js`
- Modify: `src/ui/render.js`
- Test: `tests/rules.spec.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { resolveDebtFromBank } from "../src/game/rules.js";
describe("debt payment", () => {
  it("pays as much as possible from bank in descending value order", () => {
    const payer = { bank: [{ value: 1 }, { value: 3 }, { value: 2 }] };
    const payee = { bank: [] };
    const result = resolveDebtFromBank(payer, payee, 4);
    expect(result.remainingDebt).toBe(0);
    expect(payee.bank.reduce((s, c) => s + c.value, 0)).toBe(5);
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/rules.spec.js`
Expected: FAIL with missing `resolveDebtFromBank`.
- [ ] **Step 3: Write minimal implementation**
```js
export function resolveDebtFromBank(payer, payee, amount) {
  const sorted = [...payer.bank].sort((a, b) => b.value - a.value);
  let due = amount;
  const paid = [];
  for (const card of sorted) {
    if (due <= 0) break;
    paid.push(card);
    due -= card.value;
  }
  payer.bank = payer.bank.filter((c) => !paid.includes(c));
  payee.bank.push(...paid);
  return { remainingDebt: Math.max(0, due), paid };
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/rules.spec.js`
Expected: PASS for debt test.
- [ ] **Step 5: Commit**
```bash
git add src/game/rules.js src/game/state.js src/ui/render.js tests/rules.spec.js
git commit -m "feat: add bank and debt resolution mechanics"
```

### Task 4: Add Action Card Execution Pipeline

**Files:**
- Modify: `src/game/rules.js`
- Modify: `src/game/state.js`
- Modify: `src/ui/handlers.js`
- Test: `tests/rules.spec.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { applyActionCard } from "../src/game/rules.js";
describe("action resolution", () => {
  it("creates pending debt for Debt Collector action", () => {
    const state = { players: { human: {}, cpu: {} }, pendingDebt: null };
    applyActionCard(state, "human", { type: "action", name: "Debt Collector" });
    expect(state.pendingDebt).toEqual({ from: "cpu", to: "human", amount: 5 });
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/rules.spec.js`
Expected: FAIL because `applyActionCard` is not defined.
- [ ] **Step 3: Write minimal implementation**
```js
export function applyActionCard(state, actorKey, card) {
  const targetKey = actorKey === "human" ? "cpu" : "human";
  if (card.name === "Debt Collector") state.pendingDebt = { from: targetKey, to: actorKey, amount: 5 };
  if (card.name === "Rent") state.pendingDebt = { from: targetKey, to: actorKey, amount: 3 };
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/rules.spec.js`
Expected: PASS with action test green.
- [ ] **Step 5: Commit**
```bash
git add src/game/rules.js src/game/state.js src/ui/handlers.js tests/rules.spec.js
git commit -m "feat: implement action card resolution pipeline"
```

### Task 5: CPU Decision Policy Improvements

**Files:**
- Create: `src/game/ai.js`
- Modify: `src/game/rules.js`
- Modify: `src/main.js`
- Test: `tests/ai.spec.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { chooseCpuPlays } from "../src/game/ai.js";
describe("cpu policy", () => {
  it("prioritizes property completion over money banking", () => {
    const hand = [{ type: "money", value: 3 }, { type: "property", group: "Solar" }];
    const sets = { Solar: [{ type: "property", group: "Solar" }] };
    const picks = chooseCpuPlays({ hand, sets, playsLeft: 1 });
    expect(picks[0].type).toBe("property");
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/ai.spec.js`
Expected: FAIL with missing `src/game/ai.js`.
- [ ] **Step 3: Write minimal implementation**
```js
import { SET_SIZES } from "./deck.js";
export function chooseCpuPlays({ hand, sets, playsLeft }) {
  const scored = hand.map((card) => {
    if (card.type === "property") {
      const owned = (sets[card.group] || []).length;
      const needed = SET_SIZES[card.group] - owned;
      return { card, score: needed <= 1 ? 100 : 70 };
    }
    if (card.type === "action") return { card, score: 60 };
    return { card, score: 40 };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, playsLeft).map((entry) => entry.card);
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/ai.spec.js`
Expected: PASS with CPU priority behavior confirmed.
- [ ] **Step 5: Commit**
```bash
git add src/game/ai.js src/main.js src/game/rules.js tests/ai.spec.js
git commit -m "feat: add cpu decision policy module"
```

### Task 6: UI Surface Upgrade For Bank, Debt, And Action Flow

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `src/ui/render.js`
- Modify: `src/ui/handlers.js`

- [ ] **Step 1: Write the failing test**
```js
import { describe, it, expect } from "vitest";
import { formatStatusLine } from "../src/ui/render.js";
describe("status line", () => {
  it("shows pending debt when present", () => {
    const line = formatStatusLine({ pendingDebt: { from: "cpu", to: "human", amount: 3 } });
    expect(line).toContain("Debt: CPU owes You $3M");
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test -- tests/rules.spec.js`
Expected: FAIL because `formatStatusLine` missing or mismatched.
- [ ] **Step 3: Write minimal implementation**
```js
export function formatStatusLine(state) {
  if (!state.pendingDebt) return `Deck: ${state.deck.length} | Plays left: ${state.playsLeft}`;
  const from = state.pendingDebt.from === "cpu" ? "CPU" : "You";
  const to = state.pendingDebt.to === "cpu" ? "CPU" : "You";
  return `Debt: ${from} owes ${to} $${state.pendingDebt.amount}M`;
}
```
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test -- tests/rules.spec.js`
Expected: PASS with status formatter test green.
- [ ] **Step 5: Commit**
```bash
git add index.html styles.css src/ui/render.js src/ui/handlers.js tests/rules.spec.js
git commit -m "feat: upgrade ui for bank debt and action states"
```

### Task 7: Vercel Deployment Wiring

**Files:**
- Create: `vercel.json`
- Modify: `README.md`

- [ ] **Step 1: Write the failing validation check**
Run: `npx vercel build`
Expected: FAIL or missing config until `vercel.json` and static output assumptions are set.
- [ ] **Step 2: Add minimal deployment configuration**
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    }
  ]
}
```
- [ ] **Step 3: Run local deployment validation**
Run: `npx vercel build`
Expected: PASS with output ready for deploy.
- [ ] **Step 4: Deploy to Vercel**
Run: `npx vercel --prod`
Expected: PASS and return production URL.
- [ ] **Step 5: Commit**
```bash
git add vercel.json README.md
git commit -m "chore: add vercel deployment config and docs"
```

### Task 8: End-To-End Verification And Release Checkpoint

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run full test suite**
Run: `npm run test`
Expected: PASS with all rules and AI specs green.
- [ ] **Step 2: Manual gameplay smoke test**
Run: `npm run dev` then open `http://localhost:8080`
Expected: Human draw/play works, debt resolves, CPU turn completes, winner triggers at 3 full sets.
- [ ] **Step 3: Prepare release notes entry**
```md
## v1 Prototype
- Added action cards, debt resolution, and bank mechanics
- Added improved CPU strategy
- Added automated rule tests and Vercel deploy config
```
- [ ] **Step 4: Commit**
```bash
git add README.md
git commit -m "docs: add v1 verification checklist and release notes"
```

## Self-Review Results

- Spec coverage: Includes mechanics expansion, AI upgrade, testing harness, and Vercel deployment.
- Placeholder scan: No placeholder markers remain.
- Type consistency: Uses `pendingDebt`, `players`, `hand`, `sets`, and `bank` consistently.
