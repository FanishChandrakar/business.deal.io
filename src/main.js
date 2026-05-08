import { createInitialState } from "./game/state.js";
import { drawCards } from "./game/deck.js";
import { chooseCpuTurnPlays } from "./game/rules.js";

export function createRuntimeState() {
  const state = createInitialState();
  drawCards(state, "human", 5);
  drawCards(state, "cpu", 5);
  Object.defineProperty(state, "cpuPlaysPreview", {
    get() {
      return chooseCpuTurnPlays(state.players.cpu, state.playsLeft);
    },
    enumerable: true,
    configurable: true,
  });
  return state;
}
