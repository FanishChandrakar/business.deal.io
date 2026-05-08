function totalBankValue(player) {
  return player.bank.reduce((sum, card) => sum + card.value, 0);
}

function labelForPlayer(key) {
  return key === "cpu" ? "CPU" : "You";
}

export function formatBankLine(state) {
  const humanBank = totalBankValue(state.players.human);
  const cpuBank = totalBankValue(state.players.cpu);
  return `Bank - You: $${humanBank}M | CPU: $${cpuBank}M`;
}

export function formatStatusLine(state) {
  if (!state?.pendingDebt) {
    return `Deck: ${state.deck.length} | Plays left: ${state.playsLeft}`;
  }

  const { from, to, amount } = state.pendingDebt;
  return `Debt: ${labelForPlayer(from)} owes ${labelForPlayer(to)} $${amount}M`;
}

export function formatDebtLine(state) {
  if (!state.pendingDebt) return "Debt: None";
  const { from, to, amount } = state.pendingDebt;
  return `Debt: ${labelForPlayer(from)} owes ${labelForPlayer(to)} $${amount}M`;
}

export function formatActionLine(state) {
  if (!state.pendingAction) return "Action: None";
  return `Action: ${labelForPlayer(state.pendingAction.actorKey)} played ${state.pendingAction.card.name}`;
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
    bankLine: formatBankLine(state),
    debtLine: formatDebtLine(state),
    actionLine: formatActionLine(state),
    banks: {
      human: humanBank,
      cpu: cpuBank,
    },
  };
}
