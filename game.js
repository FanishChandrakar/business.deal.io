const SET_SIZES = {
  Solar: 2,
  Marina: 3,
  Uptown: 3,
  Central: 3,
  Metro: 4,
};

const PROPERTY_META = {
  Solar: { color: "#f59e0b", value: 3, rent: [1, 3] },
  Marina: { color: "#14b8a6", value: 2, rent: [1, 2, 4] },
  Uptown: { color: "#60a5fa", value: 2, rent: [1, 2, 4] },
  Central: { color: "#f43f5e", value: 3, rent: [1, 3, 5] },
  Metro: { color: "#a78bfa", value: 4, rent: [1, 2, 3, 7] },
};

const state = {
  deck: [],
  players: {
    human: { hand: [], sets: {} },
    cpu: { hand: [], sets: {} },
  },
  turn: "human",
  drawnThisTurn: false,
  playsLeft: 3,
  winner: null,
};

function createDeck() {
  const cards = [];
  Object.entries(SET_SIZES).forEach(([group, count]) => {
    for (let i = 0; i < count + 2; i += 1) cards.push({ type: "property", group });
  });
  for (let i = 0; i < 10; i += 1) cards.push({ type: "action", name: "Swap Deal" });
  for (let i = 0; i < 10; i += 1) cards.push({ type: "money", value: 1 + (i % 3) });
  return shuffle(cards);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function draw(player, count) {
  for (let i = 0; i < count; i += 1) {
    if (state.deck.length === 0) return;
    state.players[player].hand.push(state.deck.pop());
  }
}

function init() {
  state.deck = createDeck();
  state.players.human = { hand: [], sets: {} };
  state.players.cpu = { hand: [], sets: {} };
  state.turn = "human";
  state.drawnThisTurn = false;
  state.playsLeft = 3;
  state.winner = null;
  draw("human", 5);
  draw("cpu", 5);
  render();
}

function cardLabel(card) {
  if (card.type === "property") return `${card.group} District`;
  if (card.type === "money") return `Cash $${card.value}M`;
  return card.name;
}

function totalBankValue(player) {
  if (!player?.bank) return 0;
  return player.bank.reduce((sum, card) => sum + (card.value || 0), 0);
}

function labelForPlayer(key) {
  return key === "cpu" ? "CPU" : "You";
}

function formatDebtLine() {
  if (!state.pendingDebt) return "Debt: None";
  const { from, to, amount } = state.pendingDebt;
  return `Debt: ${labelForPlayer(from)} owes ${labelForPlayer(to)} $${amount}M`;
}

function formatActionLine() {
  if (!state.pendingAction) return "Action: None";
  return `Action: ${labelForPlayer(state.pendingAction.actorKey)} played ${state.pendingAction.card.name}`;
}

function playCard(player, index) {
  if (state.winner || player !== "human" || state.turn !== "human" || state.playsLeft <= 0) return;
  const hand = state.players.human.hand;
  const card = hand[index];
  if (!card) return;
  hand.splice(index, 1);

  if (card.type === "property") {
    const sets = state.players.human.sets;
    sets[card.group] = sets[card.group] || [];
    sets[card.group].push(card);
  }
  state.playsLeft -= 1;
  checkWinner();
  render();
}

function completeSetCount(player) {
  const sets = state.players[player].sets;
  let complete = 0;
  Object.entries(sets).forEach(([group, cards]) => {
    if (cards.length >= SET_SIZES[group]) complete += 1;
  });
  return complete;
}

function checkWinner() {
  if (completeSetCount("human") >= 3) state.winner = "You";
  if (completeSetCount("cpu") >= 3) state.winner = "Computer";
}

function cpuTurn() {
  state.turn = "cpu";
  state.drawnThisTurn = true;
  draw("cpu", 2);
  for (let i = 0; i < 3; i += 1) {
    const hand = state.players.cpu.hand;
    const propIndex = hand.findIndex((c) => c.type === "property");
    if (propIndex < 0) break;
    const card = hand.splice(propIndex, 1)[0];
    const sets = state.players.cpu.sets;
    sets[card.group] = sets[card.group] || [];
    sets[card.group].push(card);
  }
  checkWinner();
  state.turn = "human";
  state.drawnThisTurn = false;
  state.playsLeft = 3;
  render();
}

function renderSets(target, player) {
  const sets = state.players[player].sets;
  target.innerHTML = "";
  Object.keys(SET_SIZES).forEach((group) => {
    const count = (sets[group] || []).length;
    const req = SET_SIZES[group];
    const meta = PROPERTY_META[group];
    const div = document.createElement("div");
    div.className = "card property-card";
    div.style.borderColor = meta.color;
    div.innerHTML = `
      <div class="card-title">${group} District</div>
      <div class="card-meta">Set: ${count}/${req}</div>
      <div class="card-meta">Value: $${meta.value}M</div>
      <div class="card-meta">Rent path: ${meta.rent.join(" / ")}</div>
    `;
    target.appendChild(div);
  });
}

function renderHand(target, player) {
  const hand = state.players[player].hand;
  target.innerHTML = "";
  hand.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    if (card.type === "property") {
      const meta = PROPERTY_META[card.group];
      const owned = (state.players[player].sets[card.group] || []).length;
      const needed = SET_SIZES[card.group];
      cardEl.classList.add("property-card");
      cardEl.style.borderColor = meta.color;
      cardEl.innerHTML = `
        <div class="card-title">${card.group} District</div>
        <div class="card-meta">Set progress: ${owned}/${needed}</div>
        <div class="card-meta">Value: $${meta.value}M</div>
        <div class="card-meta">Rent path: ${meta.rent.join(" / ")}</div>
      `;
    } else {
      cardEl.textContent = cardLabel(card);
    }
    if (player === "human" && state.turn === "human" && !state.winner && state.playsLeft > 0) {
      const btn = document.createElement("button");
      btn.textContent = "Play";
      btn.onclick = () => playCard("human", idx);
      cardEl.appendChild(btn);
    }
    target.appendChild(cardEl);
  });
}

function render() {
  const status = document.getElementById("status");
  const bankLine = document.getElementById("bank-line");
  const debtLine = document.getElementById("debt-line");
  const actionLine = document.getElementById("action-line");
  const drawBtn = document.getElementById("draw-btn");
  const endBtn = document.getElementById("end-btn");
  drawBtn.disabled = state.turn !== "human" || state.drawnThisTurn || !!state.winner;
  endBtn.disabled = state.turn !== "human" || !state.drawnThisTurn || !!state.winner;

  if (state.winner) {
    status.innerHTML = `<span class="danger">${state.winner} wins with 3 full sets.</span>`;
  } else {
    status.textContent = `Deck: ${state.deck.length} | Plays left: ${state.playsLeft}`;
  }
  bankLine.textContent = `Bank - You: $${totalBankValue(state.players.human)}M | CPU: $${totalBankValue(state.players.cpu)}M`;
  debtLine.textContent = formatDebtLine();
  actionLine.textContent = formatActionLine();

  renderSets(document.getElementById("player-sets"), "human");
  renderSets(document.getElementById("cpu-sets"), "cpu");
  renderHand(document.getElementById("player-hand"), "human");
  renderHand(document.getElementById("cpu-hand"), "cpu");
}

document.getElementById("draw-btn").addEventListener("click", () => {
  if (state.drawnThisTurn || state.winner) return;
  draw("human", 2);
  state.drawnThisTurn = true;
  render();
});

document.getElementById("end-btn").addEventListener("click", () => {
  if (!state.drawnThisTurn || state.winner) return;
  cpuTurn();
});

document.getElementById("restart-btn").addEventListener("click", init);

init();
