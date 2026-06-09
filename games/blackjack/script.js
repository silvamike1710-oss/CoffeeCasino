
// all four suits and all 13 face values
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// hearts and diamonds are red, rest are black
const RED_SUITS = new Set(['♥', '♦']);

// deck helpers
function buildDeck() {
    state.deck = [];
    for (const suit of SUITS) {
        for (const value of VALUES) {
            state.deck.push({ s: suit, v: value});
        }
    }
    // fisher yates shuffle
    for (let i = state.deck.lenght - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.deck[i], state.deck[j]] = [state.deck[j]], state.deck[i];
    }
}

function draw() {
    return state.deck.pop();
}

// scoring 
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

// rendering 
function renderCard(card, hidden) {
    if (hidden) return `<div class"card hidden"</div>`;
    const colourClass = RED_SUITS
}

