const holes = document.querySelectorAll(".hole")
const rabbits = document.querySelectorAll(".rabbit")

const startOne = document.getElementById("start-one")
const startTwo = document.getElementById("start-two")
const startThree = document.getElementById("start-three")

let time = document.getElementById("time")
let score = document.getElementById("score")
let endScore = document.getElementById("end-score")

let points = 0
let timeUp = false
let lastHole
let countdown
let difficulty

/**
 * Select a random hole for the rabbit
 * Prevent rabbit from popping out of same hole twice
 * Takes parameter of holes which we've selected from the HTML
 */

function randomHole(holes) {
  // Variable block scoped. Using 9 as number of holes but could use holes.length and code could could be used for different levels with different numbers of holes
  let pickHole = Math.floor(Math.random() * 9)
  let hole = holes[pickHole]

  // If the hole that's randomly selected is the same as the last hole the rabbit popped out off, select again
  if (hole === lastHole) {
    return randomHole(holes)
  }

  lastHole = hole
  return hole
}

/**
 * Function to vary the speeds within certain parameters
 */

function levelSpeed(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

// Function to disable buttons in level selection

function disableButtons() {
  startOne.removeEventListener("click", levelOne)
  startTwo.removeEventListener("click", levelTwo)
  startThree.removeEventListener("click", levelThree)
  setTimeout(() => {
    startOne.addEventListener("click", levelOne)
    startTwo.addEventListener("click", levelTwo)
    startThree.addEventListener("click", levelThree)
  }, 30000)
}

/** 
 * Setting levels
*/

function levelOne() {
  difficulty = "easy"
  disableButtons()
  startGame()
}

function levelTwo() {
  difficulty = "medium"
  disableButtons()
  startGame()
}

function levelThree() {
  difficulty = "hard"
  disableButtons()
  startGame()
}

// Popup function, speed decided but diffculty set by level functions above

function popUp() {
  if (difficulty === "easy") {
    speed = levelSpeed(1200, 2000)
  } else if (difficulty === "medium") {
    speed = levelSpeed(800, 1500)
  } else if (difficulty === "hard") {
    speed = levelSpeed(400, 1000)
  }

  let hole = randomHole(holes)
  hole.classList.add("up")
  setTimeout(() => {
    hole.classList.remove("up")
    if (!timeUp) popUp()
  }, speed)
}

function slap(){
  points++
  score.innerHTML = points
  this.style.backgroundImage = "url('assets/images/whack/rabbit-bonk.png')"
  this.style.pointerEvents = "none"
  setTimeout(() => {
    this.style.backgroundImage = "url('assets/images/whack/rabbit.png')"
    this.style.pointerEvents = "all"
  }, 900)
}

// Function to start game and begin timer
function startGame() {
  countdown = 30
  time.innerHTML = countdown
  score.innerHTML = 0
  endScore.innerHTML = 0
  timeUp = false
  points = 0
  popUp()
  // setTimeout(() => timeUp = true, 30000)

  let startTime = setInterval(() => {
    countdown--
    time.innerHTML = countdown
    if (countdown < 1) {
      timeUp = true
      countdown = 0
      clearInterval(startTime)
      time.innerHTML = "Time up!"
      endScore.innerHTML = points
      document.querySelector("#game-over").style.display="block"
    }
  }, 1000)
}

// Event listeners to start game and register hits
rabbits.forEach(rabbit => rabbit.addEventListener("click", slap))
startOne.addEventListener("click", levelOne)
startTwo.addEventListener("click", levelTwo)
startThree.addEventListener("click", levelThree)