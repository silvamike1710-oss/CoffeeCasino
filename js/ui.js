/* ==========================================================
   UPDATE ALL VISIBLE VALUES
   Safe to call from any page.
========================================================== */

function updateUI() {

    const moneyDisplay =
        document.getElementById('money-display');

    if (moneyDisplay) {
        moneyDisplay.textContent =
            state.money.toFixed(2);
    }

    const chipsDisplay =
        document.getElementById('chips-display');

    if (chipsDisplay) {
        chipsDisplay.textContent =
            state.chips;
    }

    const cashierMoney =
        document.getElementById('cashier-money-display');

    if (cashierMoney) {
        cashierMoney.textContent =
            state.money.toFixed(2);
    }

    const betDisplay =
        document.getElementById('bet-display');

    if (betDisplay) {
        betDisplay.textContent =
            state.bet;
    }

    const spinBtn =
        document.getElementById('spin-btn');

    if (spinBtn) {

        spinBtn.disabled =
            !(state.chips >= state.bet &&
              !state.spinning);

    }

}

/* ==========================================================
   TOAST NOTIFICATION
========================================================== */

function showToast(msg) {

    const toast =
        document.getElementById('toast');

    if (!toast) return;

    toast.textContent = msg;
    toast.style.display = 'block';

    clearTimeout(window._toastTimer);

    window._toastTimer =
        setTimeout(() => {

            toast.style.display = 'none';

        }, 2000);
}