function totalBankValue(player) {
  return player.bank.reduce((sum, card) => sum + card.value, 0);
}

function labelForPlayer(key) {
  return key === "cpu" ? "CPU" : "You";
}

export function formatStatusLine(state) {
  if (!state?.pendingDebt) {
    return `Deck: ${state.deck.length} | Plays left: ${state.playsLeft}`;
  }

  const { from, to, amount } = state.pendingDebt;
  return `Debt: ${labelForPlayer(from)} owes ${labelForPlayer(to)} $${amount}M`;
}

export function renderState(state) {
  const humanBank = totalBankValue(state.players.human);
  const cpuBank = totalBankValue(state.players.cpu);

  return {
    turn: state.turn,
    winner: state.winner,
    pendingDebt: state.pendingDebt,
    pendingAction: state.pendingAction,
    statusLine: formatStatusLine(state),
    bankLine: `Bank - You: $${humanBank}M | CPU: $${cpuBank}M`,
    actionLine: state.pendingAction
      ? `Action: ${labelForPlayer(state.pendingAction.actorKey)} played ${state.pendingAction.card.name}`
      : "Action: None",
    banks: {
      human: humanBank,
      cpu: cpuBank,
    },
  };
}
