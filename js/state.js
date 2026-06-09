/* ==========================================================
   GLOBAL GAME STATE
   Shared by every page in the casino.
========================================================== */

let state = {
    money: 100,
    chips: 0,
    bet: 1,
    spinning: false
};

/* ==========================================================
   CHIP PACKAGE PRICES
========================================================== */

const CHIP_PACKAGES = {
    10: 5,
    25: 10,
    50: 20,
    100: 35
};

/* ==========================================================
   SLOT SYMBOLS
   weight = chance of appearing
   payout = multiplier
========================================================== */

const SYMBOLS = [
    { emoji: '🍒', weight: 30, payout: 2 },
    { emoji: '🍇', weight: 25, payout: 3 },
    { emoji: '🍊', weight: 20, payout: 4 },
    { emoji: '🔔', weight: 15, payout: 5 },
    { emoji: '⭐', weight: 10, payout: 8 },
    { emoji: '🍋', weight: 8, payout: 10 },
    { emoji: '💎', weight: 4, payout: 20 },
    { emoji: '7️⃣', weight: 2, payout: 50 }
];

/* ==========================================================
   PICK RANDOM SYMBOL USING WEIGHTS
========================================================== */

function getRandomSymbol() {

    const pool = [];

    for (const sym of SYMBOLS) {

        for (let i = 0; i < sym.weight; i++) {
            pool.push(sym);
        }

    }

    const index =
        Math.floor(Math.random() * pool.length);

    return pool[index];
}