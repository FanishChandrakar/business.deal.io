import { applyActionCard } from "../game/rules.js";

export function handleActionCardPlay(state, actorKey, card) {
  state.pendingAction = { actorKey, card };
  applyActionCard(state, actorKey, card);
}
