export const SET_SIZES = {
  Solar: 2,
  Marina: 3,
  Uptown: 3,
  Central: 3,
  Metro: 4,
};

const ACTION_NAMES = ["Rent", "Sly Deal", "Debt Collector", "Deal Breaker"];
const PROPERTY_COPIES_ABOVE_SET_SIZE = 2;
const ACTION_COPIES_PER_NAME = 4;
const MONEY_CARD_COUNT = 15;
const MONEY_VALUE_OFFSET = 1;
const MONEY_VALUE_VARIANTS = 4;

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createDeck() {
  const cards = [];

  Object.entries(SET_SIZES).forEach(([group, required]) => {
    for (let i = 0; i < required + PROPERTY_COPIES_ABOVE_SET_SIZE; i += 1) {
      cards.push({ type: "property", group });
    }
  });

  ACTION_NAMES.forEach((name) => {
    for (let i = 0; i < ACTION_COPIES_PER_NAME; i += 1) {
      cards.push({ type: "action", name });
    }
  });

  for (let i = 0; i < MONEY_CARD_COUNT; i += 1) {
    cards.push({ type: "money", value: MONEY_VALUE_OFFSET + (i % MONEY_VALUE_VARIANTS) });
  }

  return shuffle(cards);
}

export function drawCards(state, playerKey, count) {
  const player = state.players[playerKey];
  if (!player || !Array.isArray(player.hand)) return;
  for (let i = 0; i < count; i += 1) {
    if (state.deck.length === 0) return;
    player.hand.push(state.deck.pop());
  }
}
