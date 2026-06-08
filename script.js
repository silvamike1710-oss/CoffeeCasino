/* game state */

let state = {
    money: 100,
    chips: 0,
    bet: 1,
    spinning: false
};

/* chip packages */

const CHIP_PACKAGES = {
    10: 5,
    25: 10,
    50: 20,
    100: 35
};

/* slot symbols */

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

function getRandomSymbol() {
    const pool = [];

    for (const sym of SYMBOLS) {
        for (let i = 0; i < sym.weight; i++) {
            pool.push(sym);
        }
    }

    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

function updateUI() {
    document.getElementById('money-display').textContent =
        state.money.toFixed(2);

    document.getElementById('chips-display').textContent =
        state.chips;

    document.getElementById('cashier-money-display').textContent =
        state.money.toFixed(2);

    document.getElementById('bet-display').textContent =
        state.bet;

    const chipsInMachine =
        document.getElementById('chips-in-machine');

    if (chipsInMachine) {
        chipsInMachine.textContent = state.chips;
    }

    const maxWin =
        document.getElementById('max-win-display');

    if (maxWin) {
        maxWin.textContent = state.bet * 50;
    }

    const spinBtn = document.getElementById('spin-btn');

    if (spinBtn) {
        spinBtn.disabled =
            !(state.chips >= state.bet && !state.spinning);
    }
}

function goToSlots() {
    document.getElementById('lobby').classList.remove('active');
    document.getElementById('slots').classList.add('active');

    document.getElementById('title-bar-text').textContent =
        'Lucky 7 Slots';

    updateUI();
}

function goToLobby() {
    document.getElementById('slots').classList.remove('active');
    document.getElementById('lobby').classList.add('active');

    document.getElementById('title-bar-text').textContent =
        'CoffeeCasino v1.0';

    updateUI();
}

function buyChips() {
    const select =
        document.getElementById('chip-package');

    const chipsAmt =
        parseInt(select.value);

    const cost =
        CHIP_PACKAGES[chipsAmt];

    const msgEl =
        document.getElementById('cashier-msg');

    if (state.money < cost) {
        if (msgEl) {
            msgEl.textContent =
                'GOTTA GAMBLE MORE!';
            msgEl.style.color =
                '#cc0000';
        }

        return;
    }

    state.money -= cost;
    state.chips += chipsAmt;

    if (msgEl) {
        msgEl.textContent =
            `GOT ${chipsAmt} CHIPS FOR $${cost}!`;

        msgEl.style.color =
            '#006600';

        setTimeout(() => {
            msgEl.textContent = '';
        }, 2000);
    }

    updateUI();
}

function cashOut() {
    if (state.chips === 0) {
        showToast('NO CHIPS TO CASH OUT!');
        return;
    }

    const earned =
        Math.floor(state.chips / 2);

    state.money += earned;

    const cashed =
        state.chips;

    state.chips = 0;

    showToast(
        `CASHED OUT ${cashed} CHIPS FOR $${earned.toFixed(2)}!`
    );

    updateUI();
}

function changeBet(delta) {
    state.bet += delta;

    if (state.bet < 1) {
        state.bet = 1;
    }

    if (state.chips > 0 &&
        state.bet > state.chips) {
        state.bet = state.chips;
    }

    updateUI();
}

function spin() {
    if (state.spinning) return;

    if (state.chips < state.bet) {
        showToast('NOT ENOUGH CHIPS!');
        return;
    }

    state.spinning = true;

    document.getElementById('spin-btn').disabled = true;

    document.getElementById('result-msg').textContent = '';

    state.chips -= state.bet;

    updateUI();

    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    for (let i = 0; i < 3; i++) {
        document
            .getElementById(`reel-${i}`)
            .classList.add('spinning');
    }

    const stopDelays = [600, 1000, 1400];

    stopDelays.forEach((delay, i) => {
        setTimeout(() => {
            document
                .getElementById(`reel-${i}`)
                .classList.remove('spinning');

            document
                .getElementById(`sym-${i}`)
                .textContent =
                results[i].emoji;
        }, delay);
    });

    setTimeout(() => {
        evaluateResult(results);
    }, 1600);
}

function evaluateResult(results) {
    const [s0, s1, s2] = results;

    const msgEl =
        document.getElementById('result-msg');

    const reelsWindow =
        document.getElementById('reels-window');

    let payout = 0;
    let msgText = '';

    if (
        s0.emoji === s1.emoji &&
        s1.emoji === s2.emoji
    ) {
        payout =
            state.bet * s0.payout;

        msgText =
            s0.payout >= 50
                ? `JACKPOT! +${payout} CHIPS!`
                : s0.payout >= 20
                ? `BIG WIN! +${payout} CHIPS!`
                : `WIN! +${payout} CHIPS!`;

        reelsWindow.classList.add(
            'win-flash'
        );

        setTimeout(() => {
            reelsWindow.classList.remove(
                'win-flash'
            );
        }, 900);
    }
    else if (
        s0.emoji === '🍒' &&
        s1.emoji === '🍒'
    ) {
        payout = state.bet;

        msgText =
            `🍒🍒 PARTIAL WIN! +${payout} CHIPS`;
    }
    else {
        msgText = '- TRY AGAIN -';
    }

    state.chips += payout;

    msgEl.textContent = msgText;

    state.spinning = false;

    if (
        state.bet > state.chips &&
        state.chips > 0
    ) {
        state.bet = state.chips;
    }

    updateUI();

    if (
        state.chips === 0 &&
        state.money < 5
    ) {
        setTimeout(() => {
            state.money += 10;

            showToast(
                "YOU'RE BROKE! HERE'S A TIP!"
            );

            updateUI();
        }, 1000);
    }
}

function showToast(msg) {
    const toast =
        document.getElementById('toast');

    toast.textContent = msg;

    toast.style.display = 'block';

    clearTimeout(
        window._toastTimer
    );

    window._toastTimer =
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
}

updateUI();