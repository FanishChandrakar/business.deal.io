import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/game/state.js";
import { createDeck } from "../src/game/deck.js";

describe("state bootstrap", () => {
  it("starts with no winner and human turn", () => {
    const state = createInitialState();
    expect(state.winner).toBe(null);
    expect(state.turn).toBe("human");
  });
});

describe("deck creation", () => {
  it("contains property, money, and action cards", () => {
    const deck = createDeck();
    expect(deck.some((c) => c.type === "property")).toBe(true);
    expect(deck.some((c) => c.type === "money")).toBe(true);
    expect(deck.some((c) => c.type === "action")).toBe(true);
  });
});
