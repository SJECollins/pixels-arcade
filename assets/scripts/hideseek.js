const reset = document.getElementById("reset")
const start = document.getElementById("start")
const display = document.getElementById("message")
const input = document.getElementById("user-input")
const userBtn = document.getElementById("user-answer")

let player = "Stranger"
let i = 0
let speed = 100

function typewriter(text) {
    let output = text
    if (i < output.length) {
        display.innerHTML += output.charAt(i);
        i++;
        setTimeout(typewriter, speed, output);
    }
}

function userInput() {
    let userText = input.value.trim().toLowerCase()
    console.log(userText)
    typewriter(userText)
}


userBtn.addEventListener("click", () => {
    userInput()
})
start.addEventListener("click", () => {
   intro()
})


function startGame() {
    display.innerHTML = ""
    typewriter("This is super fucking cool")
}

function intro() {
    typewriter("Hello, what's your name?")
    userBtn.addEventListener("click", () => {
        userInput()
    })
    let username = userInput()
    console.log(username)
    if (player == "") {
        player = "Stranger"
    } else {
        player = username
    }
    typewriter(`Welcome ${player}, do you want to play a game?`)

}