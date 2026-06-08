THE TWO SCREENS
The app has a screen system — two <div>s that each have class="screen". Only the one with class="active" is visible (display: flex). The goToSlots() and goToLobby() functions swap the class between them. This is how you'll add more games later — just add a third screen and a new card in the lobby grid.

THE WIN95 STYLE
The retro effect comes from two CSS classes: .raised (borders lighter on top-left, darker on bottom-right) and .sunken (the opposite). This simple trick fakes a 3D bevel. Every button, panel, and input uses one of these. When you click a button, the borders flip — which is why it feels like it physically presses in.

THE MONEY & CHIPS SYSTEM (state object)
All the data lives in one object:
jslet state = { money: 100, chips: 0, bet: 1, spinning: false }
The updateUI() function reads this object and updates every number on screen. Whenever anything changes (buy chips, win, lose), you call updateUI() to keep everything in sync.

THE CASHIER (lobby)
The CHIP_PACKAGES object maps "chips received → dollars paid". The buyChips() function reads the dropdown, checks state.money >= cost, and if so does the exchange. cashOut() converts chips back at $0.50 per chip (the house takes a small cut).

THE SLOT MACHINE
The outcome is decided before the animation starts — getRandomSymbol() runs once per reel using a weighted random system. Rarer symbols (like 7️⃣) have low weight so they appear less often. The reels stop one by one using setTimeout with delays of 600ms, 1000ms, and 1400ms. After the last reel stops, evaluateResult() checks for three-of-a-kind or two cherries.

TO ADD A NEW GAME LATER, just:

Add a card to the games-grid in the lobby
Add a new <div id="mygame" class="screen"> below the slots screen
Write a goToMyGame() function that swaps the active class