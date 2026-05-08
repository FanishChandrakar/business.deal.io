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
