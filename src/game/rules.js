import { chooseCpuPlays } from "./ai.js";

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

export function chooseCpuTurnPlays(player, playsLeft) {
  if (!player || !Array.isArray(player.hand) || !player.sets) {
    return [];
  }

  return chooseCpuPlays({
    hand: player.hand,
    sets: player.sets,
    playsLeft,
  });
}

export function applyActionCard(state, actorKey, card) {
  if (!card || card.type !== "action" || typeof card.name !== "string") {
    return false;
  }

  const targetKey = actorKey === "human" ? "cpu" : "human";

  if (card.name === "Debt Collector") {
    state.pendingDebt = { from: targetKey, to: actorKey, amount: 5 };
    return true;
  }

  if (card.name === "Rent") {
    state.pendingDebt = { from: targetKey, to: actorKey, amount: 3 };
    return true;
  }

  return false;
}
