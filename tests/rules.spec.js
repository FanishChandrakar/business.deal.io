import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/game/state.js";
import { createDeck, SET_SIZES } from "../src/game/deck.js";
import { resolveDebtFromBank, applyActionCard } from "../src/game/rules.js";

describe("state bootstrap", () => {
  it("starts with no winner and human turn", () => {
    const state = createInitialState();
    expect(state.winner).toBe(null);
    expect(state.turn).toBe("human");
  });
});

describe("deck creation", () => {
  it("contains the expected card composition", () => {
    const deck = createDeck();
    const propertyCards = deck.filter((card) => card.type === "property");
    const actionCards = deck.filter((card) => card.type === "action");
    const moneyCards = deck.filter((card) => card.type === "money");

    const expectedPropertyCount = Object.values(SET_SIZES).reduce(
      (total, required) => total + required + 2,
      0
    );
    const expectedActionCount = 4 * 4;
    const expectedMoneyCount = 15;

    expect(deck.length).toBe(expectedPropertyCount + expectedActionCount + expectedMoneyCount);
    expect(propertyCards).toHaveLength(expectedPropertyCount);
    expect(actionCards).toHaveLength(expectedActionCount);
    expect(moneyCards).toHaveLength(expectedMoneyCount);

    Object.entries(SET_SIZES).forEach(([group, required]) => {
      const groupCards = propertyCards.filter((card) => card.group === group);
      expect(groupCards).toHaveLength(required + 2);
    });
  });
});

describe("debt payment", () => {
  it("moves highest-value bank cards first and settles debt when possible", () => {
    const payer = { bank: [{ value: 1 }, { value: 3 }, { value: 2 }] };
    const payee = { bank: [] };

    const result = resolveDebtFromBank(payer, payee, 4);

    expect(result.remainingDebt).toBe(0);
    expect(result.paid.map((card) => card.value)).toEqual([3, 2]);
    expect(payer.bank.map((card) => card.value)).toEqual([1]);
    expect(payee.bank.map((card) => card.value)).toEqual([3, 2]);
  });

  it("returns remaining debt when payer bank is exhausted", () => {
    const payer = { bank: [{ value: 2 }, { value: 1 }] };
    const payee = { bank: [] };

    const result = resolveDebtFromBank(payer, payee, 7);

    expect(result.remainingDebt).toBe(4);
    expect(result.paid.map((card) => card.value)).toEqual([2, 1]);
    expect(payer.bank).toEqual([]);
    expect(payee.bank.map((card) => card.value)).toEqual([2, 1]);
  });
});

describe("action resolution", () => {
  it("creates pending debt for Debt Collector action", () => {
    const state = { players: { human: {}, cpu: {} }, pendingDebt: null };

    applyActionCard(state, "human", { type: "action", name: "Debt Collector" });

    expect(state.pendingDebt).toEqual({ from: "cpu", to: "human", amount: 5 });
  });
});
