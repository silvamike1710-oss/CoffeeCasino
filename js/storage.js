/* Load save */

function loadState() {

    const save =
        localStorage.getItem("casinoSave");

    if (save) {
        state = JSON.parse(save);
    }

    state.spinning = false;
}

/* Save game */

function saveState() {

    localStorage.setItem(
        "casinoSave",
        JSON.stringify(state)
    );

}