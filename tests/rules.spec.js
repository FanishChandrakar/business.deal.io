import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/game/state.js";

describe("state bootstrap", () => {
  it("starts with no winner and human turn", () => {
    const state = createInitialState();
    expect(state.winner).toBe(null);
    expect(state.turn).toBe("human");
  });
});
