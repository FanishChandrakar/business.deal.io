function totalBankValue(player) {
  return player.bank.reduce((sum, card) => sum + card.value, 0);
}

export function renderState(state) {
  return {
    turn: state.turn,
    winner: state.winner,
    pendingDebt: state.pendingDebt,
    banks: {
      human: totalBankValue(state.players.human),
      cpu: totalBankValue(state.players.cpu),
    },
  };
}
