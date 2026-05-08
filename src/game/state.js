export function createInitialState() {
  return {
    deck: [],
    players: {
      human: { hand: [], sets: {}, bank: [] },
      cpu: { hand: [], sets: {}, bank: [] },
    },
    turn: "human",
    drawnThisTurn: false,
    playsLeft: 3,
    winner: null,
    pendingDebt: null,
  };
}
