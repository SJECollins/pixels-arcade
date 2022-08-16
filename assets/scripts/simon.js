const counter = document.querySelector("#score")
const firstColor = document.querySelector("#firstcolor")
const secondColor = document.querySelector("#secondcolor")
const thirdColor = document.querySelector("#thirdcolor")
const fourthColor = document.querySelector("#fourthcolor")
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
  strict = strictButton.checked
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
      setTimeout(() => {
        addListeners()
      }, 250)
      addListeners()
  }

  if (computerTurn) {
      removeListeners()
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
  firstColor.style.backgroundColor = "lightgreen"
}

function two() {
  secondColor.style.backgroundColor = "tomato"
}

function three() {
  thirdColor.style.backgroundColor = "yellow"
}

function four() {
  fourthColor.style.backgroundColor = "lightskyblue"
}

function clearColor() {
  firstColor.style.backgroundColor = "#04650d"
  secondColor.style.backgroundColor = "#c40d0d"
  thirdColor.style.backgroundColor = "#b4c40d"
  fourthColor.style.backgroundColor = "#0d29c4"
}

function flashColor() {
  firstColor.style.backgroundColor = "#25c40d"
  secondColor.style.backgroundColor = "#ea0707"
  thirdColor.style.backgroundColor = "#fbff00"
  fourthColor.style.backgroundColor = "#003aff"
}

function addListeners() {
    firstColor.addEventListener("click", oneClick)
    secondColor.addEventListener("click", twoClick)
    thirdColor.addEventListener("click", threeClick)
    fourthColor.addEventListener("click", fourClick)
}

function removeListeners() {
    firstColor.removeEventListener("click", oneClick)
    secondColor.removeEventListener("click", twoClick)
    thirdColor.removeEventListener("click", threeClick)
    fourthColor.removeEventListener("click", fourClick)
}

function oneClick() {
    playerOrder.push(1)
    check()
    one()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
}

function twoClick() {
    playerOrder.push(2)
    check()
    two()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
}

function threeClick() {
  playerOrder.push(3)
  check()
  three()
  if (!win) {
      setTimeout(() => {
          clearColor()
      }, 300)
  }
}

function fourClick() {
    playerOrder.push(4)
    check()
    four()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

function check() {
  if (playerOrder[playerOrder.length - 1] != order[playerOrder.length - 1]) 
  good = false

  if (playerOrder.length === rounds && good) {
    endGame()
  }

  if (good === false) {
      flashColor()
      counter.innerHTML = "NO"
      if (strict) {
        endGame()
      } else {
          computerTurn = true
          flash = 0
          playerOrder = []
          good = true
          intervalId = setInterval(gameTurn, 800)
      }
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