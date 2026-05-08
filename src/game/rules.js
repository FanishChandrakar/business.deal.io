export function resolveDebtFromBank(payer, payee, amount) {
  const sorted = [...payer.bank].sort((a, b) => b.value - a.value);
  let due = amount;
  const paid = [];

  for (const card of sorted) {
    if (due <= 0) break;
    paid.push(card);
    due -= card.value;
  }

  payer.bank = payer.bank.filter((card) => !paid.includes(card));
  payee.bank.push(...paid);

  return { remainingDebt: Math.max(0, due), paid };
}

export function applyActionCard(state, actorKey, card) {
  const targetKey = actorKey === "human" ? "cpu" : "human";

  if (card.name === "Debt Collector") {
    state.pendingDebt = { from: targetKey, to: actorKey, amount: 5 };
  }

  if (card.name === "Rent") {
    state.pendingDebt = { from: targetKey, to: actorKey, amount: 3 };
  }
}
