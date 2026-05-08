import { applyActionCard } from "../game/rules.js";

export function handleActionCardPlay(state, actorKey, card) {
  const handled = applyActionCard(state, actorKey, card);
  state.pendingAction = handled ? { actorKey, card } : null;
  return handled;
}
