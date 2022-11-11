const reset = document.getElementById("reset")
const start = document.getElementById("start")
const display = document.getElementById("message")
const input = document.getElementById("user-input")
const userBtn = document.getElementById("user-answer")

let player = "Stranger"
let i = 0
let speed = 100

let gameVars = {
    player: "",
    window_closed: false,
    door_open: false,
    stool_out: false,
    shadow_delayed: false,
}

let pickUps = []

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

function userInput() {
    let userText = input.value.trim().toLowerCase()
    return userText
}

start.addEventListener("click", () => {
   startGame()
})

function startGame() {
    showGameRoom(1)
}

function showGameRoom(roomIndex) {
    i = 0
	const gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    const roomText = gameRoom.text
    typewriter(roomText)
    userBtn.addEventListener("click", () => {
        compareChoice(gameRoom)
    })
} 

function compareChoice(gameRoom) {
    let userChoice = input.value.trim().toLowerCase()
    console.log(userChoice)
    console.log(gameRoom.room)

    let options = gameRoom.options
    console.log(options)
    if (options.some(option => option.choice === userChoice)){
        for (const option of options) {
        console.log(option)
        if (option.choice === userChoice) {
            let roomIndex = option.nextRoom
            console.log(roomIndex)
            clearOutput()
            return showGameRoom(roomIndex)
            }
        }
    } else {
        display.innerHTML += "That is not an option. Try again.<br>"
            return showGameRoom(gameRoom.room)
    }
}

const gameRooms = [
    {
        room: 1,
        text: "Do you want to play a game?",
        options: [
            {
                choice: "a",
                nextRoom: 2,
            },
            {
                choice: "b",
                nextRoom: 2,
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