/* ============================================================
   CoffeeJack — Blackjack usando state global
   ============================================================ */

// ── Card data ───────────────────────────────────────────────
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RED_SUITS = new Set(['♥', '♦']);

// ── Deck helpers ────────────────────────────────────────────
function buildDeck() {
  state.deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      state.deck.push({ s: suit, v: value });
    }
  }
  // Fisher-Yates shuffle
  for (let i = state.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
}

function draw() {
  return state.deck.pop();
}

// ── Scoring ─────────────────────────────────────────────────
function cardValue(v) {
  if (v === 'A') return 11;
  if (['J', 'Q', 'K'].includes(v)) return 10;
  return parseInt(v, 10);
}

function handScore(hand) {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    score += cardValue(card.v);
    if (card.v === 'A') aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

// ── Rendering ───────────────────────────────────────────────
function renderCard(card, hidden) {
  if (hidden) return `<div class="card hidden"></div>`;
  const colourClass = RED_SUITS.has(card.s)? ' red' : '';
  return `
    <div class="card${colourClass}">
      <div class="top">${card.v}<br>${card.s}</div>
      <div class="mid">${card.s}</div>
      <div class="bot">${card.v}<br>${card.s}</div>
    </div>
  `;
}

function render(revealDealer) {
  const playerHandEl = document.getElementById('player-hand');
  const dealerHandEl = document.getElementById('dealer-hand');
  const playerScoreEl = document.getElementById('player-score');
  const dealerScoreEl = document.getElementById('dealer-score');

  playerHandEl.innerHTML = state.playerHand
   .map(card => renderCard(card, false))
   .join('');

  dealerHandEl.innerHTML = state.dealerHand
   .map((card, index) => renderCard(card, index === 1 &&!revealDealer))
   .join('');

  playerScoreEl.textContent = handScore(state.playerHand);

  if (revealDealer || state.dealerShown) {
    dealerScoreEl.textContent = handScore(state.dealerHand);
  } else {
    dealerScoreEl.textContent = `${handScore([state.dealerHand[0]])} +?`;
  }
}

// ── UI helpers ──────────────────────────────────────────────
function setMsg(text) {
  document.getElementById('msg-box').textContent = text;
}

function updateUI() {
  // Mesma função usada pelo slots
  document.getElementById('balance').textContent = state.chips;
  document.getElementById('bet-display').textContent = state.bet;
}

function setButtons(playing) {
  document.getElementById('deal-btn').disabled = playing;
  document.getElementById('hit-btn').disabled =!playing;
  document.getElementById('stand-btn').disabled =!playing;
  document.getElementById('double-btn').disabled =!playing;
  document.getElementById('clear-btn').disabled = playing;
}

// ── Betting ─────────────────────────────────────────────────
function addBet(amount) {
  if (!state.gameOver) return;
  state.bet += amount;
  if (state.bet > state.chips) state.bet = state.chips; // mesmo limite do slots
  updateUI();
}

function clearBet() {
  if (!state.gameOver) return;
  state.bet = 0;
  updateUI();
}

// ── Core game actions ───────────────────────────────────────
function deal() {
  if (state.bet === 0) {
    setMsg('Place a bet first!');
    return;
  }
  if (state.bet > state.chips) {
    setMsg('Not enough chips!');
    return;
  }

  state.chips -= state.bet; // cobra aposta igual slots
  buildDeck();

  state.playerHand = [draw(), draw()];
  state.dealerHand = [draw(), draw()];
  state.dealerShown = false;
  state.gameOver = false;

  setButtons(true);
  updateUI();
  render(false);

  if (handScore(state.playerHand) === 21) {
    setMsg('BLACKJACK! You win 1.5x!');
    endGame('blackjack');
    return;
  }
  setMsg('Hit or Stand?');
}

function hit() {
  state.playerHand.push(draw());
  render(false);
  const score = handScore(state.playerHand);

  if (score > 21) {
    setMsg('BUST! You went over 21.');
    endGame('bust');
  } else if (score === 21) {
    setMsg('21! Standing automatically.');
    stand();
  } else {
    setMsg(`You have ${score}. Hit or Stand?`);
  }
}

function stand() {
  state.dealerShown = true;
  setButtons(false);
  state.gameOver = true;
  render(true);

  const dealerInterval = setInterval(() => {
    if (handScore(state.dealerHand) < 17) {
      state.dealerHand.push(draw());
      render(true);
    } else {
      clearInterval(dealerInterval);
      resolveGame();
    }
  }, 600);
}

function doubleDown() {
  if (state.bet > state.chips) {
    setMsg('Not enough chips to double!');
    return;
  }
  state.chips -= state.bet; // cobra mais 1x aposta
  state.bet *= 2;
  updateUI();

  state.playerHand.push(draw());
  render(false);

  const score = handScore(state.playerHand);
  if (score > 21) {
    setMsg('BUST on double down!');
    endGame('bust');
  } else {
    stand();
  }
}

// ── Round resolution ────────────────────────────────────────
function resolveGame() {
  const playerScore = handScore(state.playerHand);
  const dealerScore = handScore(state.dealerHand);

  if (dealerScore > 21) {
    setMsg('Dealer busts! You WIN!');
    endGame('win');
  } else if (playerScore > dealerScore) {
    setMsg(`You WIN! ${playerScore} beats ${dealerScore}.`);
    endGame('win');
  } else if (playerScore === dealerScore) {
    setMsg(`PUSH — it's a tie at ${playerScore}.`);
    endGame('push');
  } else {
    setMsg(`Dealer wins. ${dealerScore} beats ${playerScore}.`);
    endGame('lose');
  }
}

function endGame(result) {
  state.gameOver = true;
  state.dealerShown = true;
  setButtons(false);
  render(true);

  if (result === 'blackjack') {
    state.chips += Math.floor(state.bet * 2.5); // paga 3:2
  } else if (result === 'win') {
    state.chips += state.bet * 2; // aposta de volta + lucro
  } else if (result === 'push') {
    state.chips += state.bet; // devolve aposta
  }
  // lose/bust: não devolve nada

  state.bet = 0;
  updateUI();

  if (state.chips <= 0) {
    setMsg('Out of chips! Resetting...');
    setTimeout(() => {
      state.chips = 200;
      updateUI();
      setMsg('Place your bet to start!');
    }, 2000);
  }
}