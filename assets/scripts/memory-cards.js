const levelEasy = document.getElementById("easy")
const levelMedium = document.getElementById("medium")
const levelHard = document.getElementById("hard")

let timer = document.getElementById("timer")
let matches = document.getElementById("matches")
let attempts = document.getElementById("flips")
let endScore = document.getElementById("end-score")
let endTime = document.getElementById("end-time")

const cardsArray = [
  {
    name: "cat",
    img: "assets/images/memory-cards/cat.webp",
  },
  {
    name: "cow",
    img: "assets/images/memory-cards/cow.webp",
  },
  {
    name: "gorilla",
    img: "assets/images/memory-cards/gorilla.webp",
  },
  {
    name: "elephant",
    img: "assets/images/memory-cards/elephant.webp",
  },
  {
    name: "hippo",
    img: "assets/images/memory-cards/hippo.webp",
  },
  {
    name: "lion",
    img: "assets/images/memory-cards/lion.webp",
  },
  {
    name: "parrot",
    img: "assets/images/memory-cards/parrot.webp",
  },
  {
    name: "bat",
    img: "assets/images/memory-cards/bat.webp",
  },
  {
    name: "chameleon",
    img: "assets/images/memory-cards/chameleon.webp",
  },
  {
    name: "deer",
    img: "assets/images/memory-cards/deer.webp",
  },
  {
    name: "frog",
    img: "assets/images/memory-cards/frog.webp",
  },
  {
    name: "ram",
    img: "assets/images/memory-cards/ram.webp",
  },
  {
    name: "raven",
    img: "assets/images/memory-cards/raven.webp",
  },
  {
    name: "sabre",
    img: "assets/images/memory-cards/sabre.webp",
  },
  {
    name: "turtle",
    img: "assets/images/memory-cards/turtle.webp",
  },
  {
    name: "walrus",
    img: "assets/images/memory-cards/walrus.webp",
  },
]

let gameLevel = "easy"
let gameOver = false
let time = 0
let flips = 0
let matchedCards = 0
let hasFlippedCard = false
let lockBoard = true
let firstCard
let secondCard
let gameCards = []

const board = document.getElementById("board")
const grid = document.createElement("div")
grid.setAttribute("class", "grid")
board.appendChild(grid)

function numberOfCards () {
  let selectedCards = []
  // First, shuffle the cards so their randomly selected
  let randomCards = cardsArray.sort(() => 0.5 - Math.random())
  // The slice amount of cards depending on gameLevel
  if (gameLevel === "easy") {
    selectedCards = randomCards.slice(0, 8)
  } else if (gameLevel === "medium") {
    selectedCards = randomCards.slice(0, 10)
  } else if (gameLevel === "hard") {
    selectedCards = randomCards.slice(0, 12)
  } 
  gameCards = selectedCards.concat(selectedCards)
}

function createCards() {
  gameCards.sort(() => 0.5 - Math.random())
  gameCards.forEach((item) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.name = item.name
    card.addEventListener("click", flipCard)

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');
    frontFace.style.backgroundImage = `url(${item.img})`;

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');
    
    grid.appendChild(card);
    card.appendChild(frontFace);
    card.appendChild(backFace);
  })
}

function flipCard() {
    if (lockBoard) return
    if (this === firstCard) return

    this.classList.toggle("flip")

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true
        firstCard = this
        return
    }
    // Second click
    secondCard = this
    flips++
    attempts.innerHTML = flips

    checkForMatch()
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name

    isMatch ? disableCards() : unflipCards()
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard)
    secondCard.removeEventListener("click", flipCard)
    matchedCards++
    matches.innerHTML = matchedCards
    resetBoard()
}

function unflipCards() {
    lockBoard = true
    setTimeout(() => {
        firstCard.classList.remove("flip")
        secondCard.classList.remove("flip")  
        resetBoard()  
        }, 1000)
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

// Set the level difficulty
function levelOne() {
  gameLevel = "easy"
  grid.style.gridTemplateColumns = "auto auto auto auto"
  startGame()
}

function levelTwo() {
  gameLevel = "medium"
  grid.style.gridTemplateColumns = "auto auto auto auto auto"
  startGame()
}

function levelThree() {
  gameLevel = "hard"
  grid.style.gridTemplateColumns = "auto auto auto auto auto auto"
  startGame()
}

function shuffle() {
  gameCards.sort(() => 0.5 - Math.random())
}

function checkWin() {
  if (gameLevel === "easy" && matchedCards === 8) {
    win()
  } else if (gameLevel === "medium" && matchedCards === 10) {
    win()
  } else if (gameLevel === "hard" && matchedCards === 12) {
    win()
  } else {
    return
  }
}

function win() {
  gameOver = true
  lockBoard = true
  document.querySelector("#game-over").style.display="block"
  endScore.innerHTML = matchedCards
  endTime.innerHTML = time
}

function startGame() {
  levelEasy.removeEventListener("click", levelOne)
  levelMedium.removeEventListener("click", levelTwo)
  levelHard.removeEventListener("click", levelThree)
  lockBoard = false
  numberOfCards()
  createCards()
  
  let startTime = setInterval(() => {
    time++
    timer.innerHTML = time
    checkWin()
    if (gameOver) {
      time = 0
      clearInterval(startTime)
    }
  }, 1000)
}

levelEasy.addEventListener("click", levelOne)
levelMedium.addEventListener("click", levelTwo)
levelHard.addEventListener("click", levelThree)