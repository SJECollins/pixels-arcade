const startBtn = document.getElementById("start")
const reset = document.getElementById("reset")
const currentBet = document.getElementById("curr-bet")
const currentChips = document.getElementById("player-chips")
const dealerCards = document.getElementById("dealer-area")
const playerCards = document.getElementById("player-area")
const hitMe = document.getElementById("hit-me")
const stay = document.getElementById("stay")
const options = document.getElementById("player-options")
const betPop = document.getElementById("bet")
const betBtn = document.getElementById("enter-bet")
const userBet = document.getElementById("user-bet")
const gameOver = document.getElementById("game-over")
const endHand = document.getElementById("end-hand")
const handResult = document.getElementById("hand-result")
const nextHand = document.getElementById("next-hand")

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
let handOver = false

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
    dealCards()
}

// Deal cards
function dealCards() {
    options.style.display = "none"
    let card = {}
    if (deck.length == 0) {
        while (deadCards.length > 0) {
            let card = deadCards.shift()
            deck.push(card)
        }
        shuffleDeck()
    }
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
        if ((dealerScore < 21 && dealerScore < playerScore) || (dealerScore < 17)) {
            card = deck.pop()
            dealerHand.push(card)
            renderHand(card, "dealer")
        }
    }
    // Display current scores ???
    console.log(deck)
    console.log(playerHand)
    console.log(dealerHand)
    playRound()
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

// Play a round
function playRound() {
    options.style.display = "block"
    checkScore()
}

hitMe.addEventListener("click", () => {
    hit = true
    dealCards()
})
stay.addEventListener("click", () => {
    hit = false
    dealCards()
})

// Play another round
function nextRound() {
    endHand.style.display = "none"
    playerScore = 0
    dealerScore = 0
    playerBet = 0
    for (let i = 0; i < playerHand.length; i++) {
        let card = playerHand.shift()
        deadCards.push(card)
        i--
    }
    for (let i = 0; i < dealerHand.length; i++) {
        let card = dealerHand.shift()
        deadCards.push(card)
        i--
    }
    document.getElementById("player-area").innerHTML = ""
    document.getElementById("dealer-area").innerHTML = ""
    placeBet()
}

// Check scores
function checkScore() {
    playerHand.forEach(card => playerScore += card.value)
    dealerHand.forEach(card => dealerScore += card.value)
    console.log("player score: " + playerScore)
    console.log("dealer score: " + dealerScore)
    if (playerScore > 21) {
        // You lose
        if (playerChips == 0) {
            gameOver.style.display = "block"
        } else {
            endHand.style.display = "block"
            handResult.innerHTML = "You bust!"
            nextHand.addEventListener("click", nextRound)
        }
    } else if (playerScore == 21) {
        // You win
        playerChips += playerBet * 2
        endHand.style.display = "block"
        handResult.innerHTML = `You won ${playerBet * 2}!`
        nextHand.addEventListener("click", nextRound)
    }
    if (dealerScore > 21) {
        // You win
        playerChips += playerBet * 2
        endHand.style.display = "block"
        handResult.innerHTML = `You won ${playerBet * 2}!`
        nextHand.addEventListener("click", nextRound)
    } else if (dealerScore == 21) {
        // You lose
        if (playerChips == 0) {
            gameOver.style.display = "block"
        } else {
            endHand.style.display = "block"
            handResult.innerHTML = "Dealer wins!"
            nextHand.addEventListener("click", nextRound)
        }
    }
}

function startGame() {
    startBtn.removeEventListener("click", startGame)
    createDeck()
}

startBtn.addEventListener("click", startGame)
reset.addEventListener("click", () => {
    location.reload()
})