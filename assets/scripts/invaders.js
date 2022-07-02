const board = document.getElementById("board")
const result = document.getElementById("result")
const score = document.getElementById("score")
const endScore = document.getElementById("end-score")
const startButton = document.getElementById("start")
const fire = document.getElementById("fire")

let currentPosition = 217
let width = 15
let direction = 1
let goingRight = true
let invadersRemoved = []
let points = 0
let gameEnd = ""
let invadersId = 0
let intervalTime = 0

for (let i = 0; i < 225; i++) {
    const square = document.createElement("div")
    board.appendChild(square)
}

const squares = Array.from(document.querySelectorAll("#board div"))

const invaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < invaders.length; i++) {
        if (!invadersRemoved.includes(i)){
            squares[invaders[i]].classList.add("invader")
        }
    }
}

function remove() {
    for (let i = 0; i < invaders.length; i++) {
        squares[invaders[i]].classList.remove("invader")
    }
}

function moveTank(event) {
    squares[currentPosition].classList.remove("tank")
    switch(event.key) {
        case "ArrowLeft":
            if (currentPosition % width !== 0) currentPosition -= 1
            break;
        case "ArrowRight":
            if (currentPosition % width < width - 1) currentPosition += 1
            break;
        }
    squares[currentPosition].classList.add("tank")
} 

function moveLeft() {
  squares[currentPosition].classList.remove("tank")
  if (currentPosition % width !== 0) currentPosition -= 1
  squares[currentPosition].classList.add("tank")
}

function moveRight() {
  squares[currentPosition].classList.remove("tank")
  if (currentPosition % width < width - 1) currentPosition += 1
  squares[currentPosition].classList.add("tank")
}

function moveInvaders() {
    const leftEdge = invaders[0] % width === 0
    const rightEdge = invaders[invaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] += width + 1
            direction = - 1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < invaders.length; i++) {
        invaders[i] += direction
    }
    
    draw()

    if (squares[currentPosition].classList.contains("invader","tank")) {
        gameEnd = "DIED"
        endGame()
    }

    for (let i = 0; i < invaders.length; i++) {
        if (invaders[i] > squares.length) {
            gameEnd = "DIED"
            endGame()
        }
    }

    if (invadersRemoved.length === invaders.length) {
        gameEnd = "WIN"
        endGame()
    }
}

function shoot(event) {
    let missileId
    let missilePosition = currentPosition
 
    function movemissile() {
        squares[missilePosition].classList.remove("missile")
        missilePosition -= width
        squares[missilePosition].classList.add("missile")

        if (missilePosition <= 14) {
          squares[missilePosition].classList.remove("missile")
          clearInterval(missileId)
          return
        }
        
        if (squares[missilePosition].classList.contains("invader")) {
            squares[missilePosition].classList.remove("missile")
            squares[missilePosition].classList.remove("invader")
            squares[missilePosition].classList.add("boom")

            setTimeout(() => squares[missilePosition].classList.remove("boom"), 200)
            clearInterval(missileId)

            const invaderRemoved = invaders.indexOf(missilePosition)
            invadersRemoved.push(invaderRemoved)
            points++
            score.innerHTML = points
        } 
        
    }
    switch(event.key) {
        case "ArrowUp":
            missileId = setInterval(movemissile, 100)
            document.removeEventListener("keydown", shoot)
            fire.removeEventListener("keydown", shoot)
            setTimeout(() => {
              document.addEventListener("keydown", shoot)
              fire.addEventListener("keydown", shoot)
            }, 500)
    }
}

function startGame() {
  startButton.removeEventListener("click", startGame)
  intervalTime = 500
  invadersId = setInterval(moveInvaders, intervalTime)
  points = 0
  gameEnd = ""
}

function endGame() {
  clearInterval(invadersId)
  result.innerHTML = gameEnd
  endScore.innerHTML = points
  document.querySelector("#game-over").style.display="block"
}

squares[currentPosition].classList.add("tank")
fire.addEventListener("click", () => {
  let keydown = new KeyboardEvent("keydown", {key: "ArrowUp"});
  fire.dispatchEvent(keydown);
})
fire.addEventListener("click", shoot)
document.addEventListener("keydown", shoot)
document.addEventListener("keydown", moveTank)
startButton.addEventListener("click", startGame)