import { createInitialState } from "./game/state.js";
import { drawCards } from "./game/deck.js";

export function createRuntimeState() {
  const state = createInitialState();
  drawCards(state, "human", 5);
  drawCards(state, "cpu", 5);
  return state;
}
