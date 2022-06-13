const counter = document.querySelector("#score")
const topLeft = document.querySelector("#topleft")
const topRight = document.querySelector("#topright")
const bottomLeft = document.querySelector("#bottomleft")
const bottomRight = document.querySelector("#bottomright")
const strictButton = document.querySelector("#strict")
const start = document.querySelector("#start")

let order = []
let playerOrder = []
let computerTurn
let flash
let turn
let good
let intervalId
let strict = false
let win
let rounds = 20

strictButton.addEventListener("click", () => {
  if (strictButton.checked === true) {
      strict = true
  } else {
      strict = false
  }
})

function play() {
  win = false
  order = []
  playerOrder = []
  flash = 0
  intervalId = 0
  turn = 1
  counter.innerHTML = turn
  good = true

  for (let i = 0; i < rounds; i++) {
      order.push(Math.floor(Math.random() * 4) + 1)
  }

  computerTurn = true

  intervalId = setInterval(gameTurn, 800)
}

function gameTurn() {
  if(flash === turn) {
      clearInterval(intervalId)
      computerTurn = false
      clearColor()
  }

  if (computerTurn) {
      clearColor()
      setTimeout(() => {
          if (order[flash] === 1) one()
          if (order[flash] === 2) two()
          if (order[flash] === 3) three()
          if (order[flash] === 4) four()
          flash++;
      }, 200)
  }
}

function one() {
  topLeft.style.backgroundColor = "lightgreen"
}

function two() {
  topRight.style.backgroundColor = "tomato"
}

function three() {
  bottomLeft.style.backgroundColor = "yellow"
}

function four() {
  bottomRight.style.backgroundColor = "lightskyblue"
}

function clearColor() {
  topLeft.style.backgroundColor = "#04650d"
  topRight.style.backgroundColor = "#c40d0d"
  bottomLeft.style.backgroundColor = "#b4c40d"
  bottomRight.style.backgroundColor = "#0d29c4"
}

function flashColor() {
  topLeft.style.backgroundColor = "#25c40d"
  topRight.style.backgroundColor = "#ea0707"
  bottomLeft.style.backgroundColor = "#fbff00"
  bottomRight.style.backgroundColor = "#003aff"
}

topLeft.addEventListener("click", () => {
      playerOrder.push(1)
      check()
      one()
      if (!win) {
          setTimeout(() => {
              clearColor()
          }, 300)
      }
  }
)

topRight.addEventListener("click", () => {
      playerOrder.push(2)
      check()
      two()
      if (!win) {
          setTimeout(() => {
              clearColor()
          }, 300)
      }
  }
)

bottomLeft.addEventListener("click", () => {
      playerOrder.push(3)
      check()
      three()
      if (!win) {
          setTimeout(() => {
              clearColor()
          }, 300)
      }
  }
)

bottomRight.addEventListener("click", () => {
      playerOrder.push(4)
      check()
      four()
      if (!win) {
          setTimeout(() => {
              clearColor()
          }, 300)
      }
  }
)

function check() {
  if (playerOrder[playerOrder.length - 1] != order[playerOrder.length - 1]) 
  good = false

  if (playerOrder.length === rounds && good) {
    endGame()
  }

  if (good === false) {
      flashColor()
      counter.innerHTML = "NO"
      setTimeout(() => {
          counter.innerHTML = turn
          clearColor()

          if (strict) {
            endGame()
          } else {
              computerTurn = true
              flash = 0
              playerOrder = []
              good = true
              intervalId = setInterval(gameTurn, 800)
          }
      }, 800)
  }

  if (turn === playerOrder.length && good && !win) {
      turn++
      playerOrder = []
      computerTurn = true
      flash = 0
      counter.innerHTML = turn
      intervalId = setInterval(gameTurn, 800)
  }
}

function endGame() {
  clearInterval(intervalId)
  counter.innerHTML = turn
  document.querySelector("#end-time").innerHTML = turn
  document.querySelector("#game-over").style.display="block"
}

start.addEventListener("click", play)