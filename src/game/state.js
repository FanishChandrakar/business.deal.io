import { createDeck } from "./deck.js";

export function createInitialState() {
  return {
    deck: createDeck(),
    players: {
      human: { hand: [], sets: {}, bank: [] },
      cpu: { hand: [], sets: {}, bank: [] },
    },
    turn: "human",
    drawnThisTurn: false,
    playsLeft: 3,
    winner: null,
    pendingAction: null,
    pendingDebt: null,
  };
}
