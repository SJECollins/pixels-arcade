let gameRooms = [
    {
        room: 0,
        text: () => {
            `Goodbye, ${gameVars.player}...`
        },
        options: [
            {
                choice: "a",
                nextRoom: 3,
            },
            {
                choice: "b",
                nextRoom: 3,
            }
        ]
    },
    {
        room: 1,
        text: () => {
            return `Welcome ${gameVars.player}, do you want to play a game? Yes / No.

            You can type "quit" at any time to end the game.`
        },
        options: [
            {
                choice: "yes",
                nextRoom: 2,
            },
            {
                choice: "no",
                nextRoom: 0,
            }
        ]
    },
    {
        room: 2,
        text: "Well, you made it to the next room.",
        options: [
            {
                choice: "a",
                nextRoom: 3,
            },
            {
                choice: "b",
                nextRoom: 3,
            }
        ]
    },
    {
        room: 3,
        text: "And then the next room.",
        options: [
            {
                choice: "a",
                nextRoom: 4,
            },
            {
                choice: "b",
                nextRoom: 4,
            }
        ]
    },
    {
        room: 4,
        text: "And this is another room.",
        options: [
            {
                choice: "a",
                nextRoom: 5,
            },
            {
                choice: "b",
                nextRoom: 5,
            }
        ]
    },

]

const reset = document.getElementById("reset")
const start = document.getElementById("start")
const display = document.getElementById("message")
const input = document.getElementById("user-input")
const userBtn = document.getElementById("user-answer")


// Variables
let i = 0
let speed = 100
let roomIndex = 1

let gameVars = {
    player: "Stranger",
    window_closed: false,
    door_open: false,
    stool_out: false,
    shadow_delayed: false,
}

let pickUps = []

/**
 * Functions affecting output
 */

function typewriter(text) {
    let output = text
    if (i < output.length) {
        display.innerHTML += output.charAt(i)
        i++
        setTimeout(typewriter, speed, output)
    }
}

function clearOutput() {
    display.innerHTML = ""
}

function clearInput() {
    input.value = ""
}

// Game functions

function getPlayer() {
    clearOutput()
    typewriter("Hello, what's your name?")
    start.removeEventListener("click", getPlayer)
    userBtn.addEventListener("click", getName, false)
}

function getName() {
    let username = input.value.trim()
    console.log(username)
    console.log(gameVars.player)
    if (username == undefined || username == null || username == "") {
        gameVars.player = "Stranger"
        userBtn.removeEventListener("click", getName)
        clearInput()
        return startGame()
    } else {
        gameVars.player = username[0].toUpperCase() + username.slice(1).toLowerCase();
        userBtn.removeEventListener("click", getName)
        console.log("Took input")
        clearInput()
        return startGame()
    }
}

function startGame() {
    showGameRoom(1)
    console.log(gameVars.player)
    userBtn.addEventListener("click", compareChoice, false)
}

function showGameRoom(roomIndex) {
    i = 0
    clearOutput()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    let roomText
    if (typeof gameRoom.text === "function") {
        roomText = gameRoom.text()
        typewriter(roomText)
    } else {
        roomText = gameRoom.text
        typewriter(roomText)
    }
    console.log("This is the roomtext: " + roomText)
    console.log("This is the roomIndex leaving the func: " + gameRoom.room)
    console.log(gameRoom)
} 

function compareChoice() {
    let userChoice = input.value.trim().toLowerCase()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    console.log("This is the userChoice: " + userChoice)
    console.log("This is the roomIndex coming into the function: " + gameRoom.room)
    let options = gameRoom.options
    console.log("These are the room options: " + options)
    console.log(options)
    if (options.some(option => option.choice === userChoice)){
        for (const option of options) {
            if (option.choice === userChoice) {
                roomIndex = option.nextRoom
                console.log("This is the nextRoom: " + roomIndex)
                return showGameRoom(roomIndex)
                }
            }
    } else {
        display.innerHTML += "That is not an option. Try again.<br>"
            return showGameRoom(gameRoom.room)
    }
}

// Eventlisteners
start.addEventListener("click", () => {
    getPlayer()
})
reset.addEventListener("click", () => {
    location.reload()
})
openInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="block"
})
  closeInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="none"
})
