import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/game/state.js";
import { createDeck, SET_SIZES } from "../src/game/deck.js";

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
