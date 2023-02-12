const startBtn = document.getElementById("start")
const reset = document.getElementById("reset")
const currentBet = document.getElementById("curr-bet")
const currentChips = document.getElementById("player-chips")
const dealerCards = document.getElementById("dealer-area")
const playerCards = document.getElementById("player-area")
const hitMe = document.getElementById("hit-me")
const stay = document.getElementById("stay")
const betPop = document.getElementById("bet")
const betBtn = document.getElementById("enter-bet")
const userBet = document.getElementById("user-bet")

const suits = ["hearts", "diams", "clubs", "spades"]
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
let deck = []
let deadCards = []
let playerHand = []
let playerScore = 0
let dealerHand = []
let dealerScore = 0
let playerBet = 0
let playerChips = 100
let hit = false

// Create the card deck
function createDeck() {
    for (let i = 0; i < ranks.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            let value = parseInt(ranks[i])
            if (ranks[i] == "J" || ranks[i] == "Q" || ranks[i] == "K") {
                value = 10
            }
            if (ranks[i] == "A") {
                value = 11
            }
            let card = {
                rank: ranks[i],
                suit: suits[j],
                value: value
            }
            deck.push(card)
        }
    }
    shuffleDeck(deck)
}

// Shuffle the card deck - Fisher Yates?
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let randPos = Math.floor(Math.random() * (i + 1))
        let temp = deck[randPos]
        deck[randPos] = deck[i]
        deck[i] = temp
    }
    dealCards()
    betBtn.addEventListener("click", placeBet)
    betPop.style.display = "block"
}

// Place a bet at the start of a round
function placeBet() {
    playerBet = userBet.value
    playerChips -= playerBet
    currentBet.innerHTML = playerBet
    currentChips.innerHTML = playerChips
    betPop.style.display = "none"
    betBtn.removeEventListener("click", placeBet)
}

// Deal cards
function dealCards() {
    let card = {}
    if (playerHand.length < 2) {
        let i = 1
        while (i < 5) {
            card = deck.pop()
            if (i % 2 == 0) {
                playerHand.push(card)
                renderHand(card, "player")
            } else {
                dealerHand.push(card)
                renderHand(card, "dealer")
            }
            i++
        }
    } else {
        if (hit) {
            card = deck.pop()
            playerHand.push(card)
            renderHand(card, "player")
        }
        if (dealerScore < 21 && dealerScore < playerScore) {
            card = deck.pop()
            dealerHand.push(card)
            renderHand(card, "dealer")
        }
    }
    // Display current scores ???
    console.log(deck)
    console.log(playerHand)
    console.log(dealerHand)
}

// Play a round
function playRound() {

}

// Add card to player's area
function renderHand(card, player) {
    let hand = document.getElementById(player + "-area")
    let newCard = document.createElement("div")
    newCard.className = "card"
    newCard.innerHTML = `
    &${card.suit};
    <br>
    <br>
    ${card.rank}
    `
    hand.appendChild(newCard)
}

// Check scores
function checkScore() {
    playerHand.forEach(card => playerScore += card.value)
    dealerHand.forEach(card => dealerScore += card.value)
    if (playerScore > 21) {

    } else if (playerScore = 21) {

    }
    if (dealerScore > 21) {

    } else if (dealerScore = 21) {

    }
}

function startGame() {
    createDeck()
}

startGame()