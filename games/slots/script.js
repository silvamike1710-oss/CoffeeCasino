/* ==========================================================
   BET CONTROLS
========================================================== */

function changeBet(delta) {

    state.bet += delta;

    if (state.bet < 1) {
        state.bet = 1;
    }

    if (
        state.chips > 0 &&
        state.bet > state.chips
    ) {
        state.bet = state.chips;
    }

    updateUI();
}

/* ==========================================================
   START SPIN
========================================================== */

function spin() {

    if (state.spinning) return;

    if (state.chips < state.bet) {

        showToast(
            'NOT ENOUGH CHIPS!'
        );

        return;
    }

    state.spinning = true;

    state.chips -= state.bet;

    saveState();

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

    const stopDelays =
        [600, 1000, 1400];

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

/* ==========================================================
   CHECK WIN CONDITIONS
========================================================== */

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
            `WIN! +${payout}`;

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
            '🍒🍒 PARTIAL WIN';

    }
    else {

        msgText =
            '- TRY AGAIN -';

    }

    state.chips += payout;

    msgEl.textContent =
        msgText;

    console.log("evaluateResult called");
    
    state.spinning = false;

    console.log("spinning reset");
    saveState();

    updateUI();
}

