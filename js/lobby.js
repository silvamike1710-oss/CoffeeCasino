/* ==========================================================
   BUY CHIPS
========================================================== */

function buyChips() {

    const select =
        document.getElementById('chip-package');

    const chipsAmt =
        parseInt(select.value);

    const cost =
        CHIP_PACKAGES[chipsAmt];

    if (state.money < cost) {

        showToast(
            'GOTTA GAMBLE MORE!'
        );

        return;
    }

    state.money -= cost;
    state.chips += chipsAmt;

    showToast(
        `BOUGHT ${chipsAmt} CHIPS`
    );
    saveState();

    updateUI();
}

/* ==========================================================
   CASH OUT
========================================================== */

function cashOut() {

    if (state.chips === 0) {

        showToast(
            'NO CHIPS TO CASH OUT!'
        );

        return;
    }

    const earned =
        Math.floor(state.chips / 2);

    const cashed =
        state.chips;

    state.money += earned;
    state.chips = 0;

    showToast(
        `CASHED ${cashed} CHIPS`
    );

    saveState();

    updateUI();
}