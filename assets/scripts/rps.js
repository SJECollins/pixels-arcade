const computer = document.getElementById("computer");
const user = document.getElementById("user");
const userScoreDisplay = document.getElementById("user-score");
const computerScoreDisplay = document.getElementById("computer-score")
const resultDisplay = document.getElementById("result")
let endScore = document.getElementById("end-score")

const choices = document.querySelectorAll(".selections");

let userPick;
let computerPick;
let result;
let userScore = 0;
let computerScore = 0;

console.log(choices)

choices.forEach(choice => choice.addEventListener("click", (event) => {
    userPick = event.target.id;
    console.log(userPick)
    userChoice()
    computerChoice();
    winner();
}))

function userChoice(){
  if (userPick === "rock") {
    user.src = "assets/images/rps/rock.webp"
  }
  if (userPick === "paper") {
    user.src = "assets/images/rps/paper.webp"
  }
  if (userPick === "scissors") {
    user.src = "assets/images/rps/scissors.webp"
  }
}

function computerChoice() {
    const randomNumber = Math.floor(Math.random() * choices.length)

    if (randomNumber === 0) {
        computerPick = "rock";
        computer.src = "assets/images/rps/rock.webp"
    }
    if (randomNumber === 1) {
        computerPick = "paper";
        computer.src = "assets/images/rps/paper.webp"
    }
    if (randomNumber === 2) {
        computerPick = "scissors";
        computer.src = "assets/images/rps/scissors.webp"
    }
}

function winner() {
    if (computerPick === "rock" && userPick === "paper") {
        userScore++;
        result = "You win";
    } else if (computerPick === "paper" && userPick === "scissors") {
        userScore++;
        result = "You win";
    } else if (computerPick === "scissors" && userPick === "rock") {
        userScore++;
        result = "You win";
    } else if (computerPick === userPick) {
        result = "It's a draw";
    } else {
        computerScore++;
        result = "You lose";
    }

    endGame()
    resultDisplay.innerHTML = result;
    userScoreDisplay.innerHTML = userScore;
    computerScoreDisplay.innerHTML = computerScore;
}

// Function for best of 5
function endGame() {
  if (computerScore === 5) {
    endScore.innerHTML = "YOU LOST"
    document.querySelector("#game-over").style.display="block"
  } else if (userScore === 5) {
    endScore.innerHTML = "YOU WON"
    document.querySelector("#game-over").style.display="block"
  } else {
    return
  }
}