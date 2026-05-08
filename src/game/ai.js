import { SET_SIZES } from "./deck.js";

function scoreCard(card, sets) {
  if (card.type === "property") {
    const owned = (sets[card.group] || []).length;
    const needed = SET_SIZES[card.group] - owned;
    return needed <= 1 ? 100 : 70;
  }

  if (card.type === "action") {
    return 60;
  }

  return 40;
}

export function chooseCpuPlays({ hand, sets, playsLeft }) {
  return [...hand]
    .sort((a, b) => scoreCard(b, sets) - scoreCard(a, sets))
    .slice(0, playsLeft);
}
