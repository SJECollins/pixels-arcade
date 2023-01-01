let gameRooms = [
    {
        room: 0,
        text: () => {
            return `Goodbye, ${gameVars.player}...`
        },
    },
    {
        room: 1,
        text: () => {
            return `Welcome ${gameVars.player}, do you want to play a game? Yes / No.`
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
        text: `Good. To play, type the letter of your choice and click enter.
        Or, you can enter "quit" to end the game.
        Or, you can click "reset" above to reset the game.

        Ready to start?
        [A] Okay.
        [B] Actually, I don't think I want to play after all.`,
        options: [
            {
                choice: "a",
                nextRoom: 3,
            },
            {
                choice: "b",
                nextRoom: 0,
            }
        ]
    },
    {
        room: 3,
        text: `You slowly open your eyes to find yourself safely in your own bed. At first the room seems pitch black, except for the light from the clock on your bedside table.It reads: 02:00.
            Slowly, your eyes adjust to the darkness and you look around your quiet room. You don't know why, but you feel wide awake and your heart is beating hard.

            You:
            [A] Try to go back to sleep.
            [B] Get up and make a cup of tea.`,
        options: [
            {
                choice: "a",
                nextRoom: 4,
            },
            {
                choice: "b",
                nextRoom: 7,
            }
        ]
    },
    {
        room: 4,
        text: `You have to get up for school early in the morning. So, you roll over in your bed and pull the covers up over your head.
        After a few moments of silence, you hear a soft rustling. Very slowly, you peek out from under your covers.
        In the darkness, you spy the window open a crack. A light breeze is moving the curtains.
        
        It's chilly in your room, so you:
        [A] Pull the blanket tighter and close your eyes.
        [B] Get up.`,
        options: [
            {
                choice: "a",
                nextRoom: 5,
            },
            {
                choice: "b",
                nextRoom: 8,
            }
        ]
    },
    {
        room: 5,
        text: () => {
            return `You pull the blanket back over your head and squeeze your eyes shut.\n
            "${gameVars.player}..." \n
            You think you hear a voice softly calling you. You're not sure where it's coming from, or even if you really heard it.
            \n
            You decide to:
            [A] Sleep harder.
            [B] Investigate.`
        },
        options: [
            {
                choice: "a",
                nextRoom: 6,
            },
            {
                choice: "b",
                nextRoom: 8,
            },
        ]
    },
    {
        room: 6,
        text: () => {
            return `You really do have to get up early and you've never been a very inquisitive person.
        You pull the blanket tight around your ears and scrunch your eyes closed even harder. 
        As you do, you feel a chill run up the back of your neck and the blanket starts to feel very heavy...\n
        "${gameVars.player}..."\n
        Who's saying that?
        You try to open your eyes and peek out from the covers, but your eyelids won't open and the covers are weighing you down...\n
        The covers press harder and harder and your eyelids squeeze tighter and tighter until all you feel is pressure and all you see is nothingness.\n
        You never wake up again.
        \n
        \n
        The End.`
        },
    },
    {
        room: 7,
        text: `Maybe a cup of tea will warm you up and help you drift off to  sleep. You climb out of bed. 
        You glance at the open window that's letting a cold breeze into the house. At the end of your bed are an oversized pair of fluffy bunny slippers.
        
        You shiver and:
        [A] Close the window.
        [B] Put on your fluffy slippers.`,
        options: [
            {
                choice: "a",
                nextRoom: 8,
            },
            {
                choice: "b",
                nextRoom: 9,
            },
        ]
    },
    // {
    //     room: ,
    //     text: ,
    //     options: [
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         },
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         }
    //     ]
    // },
    // {
    //     room: ,
    //     text: ,
    //     options: [
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         },
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         }
    //     ]
    // },
    // {
    //     room: ,
    //     text: ,
    //     options: [
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         },
    //         {
    //             choice: ,
    //             nextRoom: ,
    //         }
    //     ]
    // },
]

const reset = document.getElementById("reset")
const start = document.getElementById("start")
const display = document.getElementById("message")
const input = document.getElementById("user-input")
const userBtn = document.getElementById("user-answer")

// Variables
let i = 0
let speed = 50
let roomIndex = 1

let gameVars = {
    player: "Stranger",
    started: false,
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
        if (output.charAt(i) == "\n") {
            display.innerHTML += "<br>"
        } else {
            display.innerHTML += output.charAt(i)
        }
        i++
        setTimeout(typewriter, speed, output) 
        display.scrollTop = display.scrollHeight
    } else {
        takeInput()
    }
}

function clearOutput() {
    display.innerHTML = ""
}

function clearInput() {
    input.value = ""
}

function takeInput() {
    userBtn.addEventListener("click", compareChoice, false)
}

function stopInput() {
    userBtn.removeEventListener("click", compareChoice, false)
}

// Game function
function getPlayer() {
    clearOutput()
    input.focus()
    typewriter("Hello, what's your name?")
    start.removeEventListener("click", getPlayer)
    userBtn.addEventListener("click", getName, false)
}

function getName() {
    let username = input.value.trim()
    if (username == undefined || username == null || username == "") {
        gameVars.player = "Stranger"
        userBtn.removeEventListener("click", getName)
        clearInput()
        return startGame()
    } else {
        gameVars.player = username[0].toUpperCase() + username.slice(1).toLowerCase();
        userBtn.removeEventListener("click", getName)
        clearInput()
        return startGame()
    }
}

function startGame() {
    showGameRoom(1)
}

function showGameRoom(roomIndex) {
    stopInput()
    clearInput()
    i = 0
    clearOutput()
    input.focus()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    let roomText
    if (typeof gameRoom.text === "function") {
        roomText = gameRoom.text()
        typewriter(roomText)
    } else {
        roomText = gameRoom.text
        typewriter(roomText)
    }
} 

function compareChoice() {
    let userChoice = input.value.trim().toLowerCase()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    let options = gameRoom.options
    if (userChoice == "quit") {
        return showGameRoom(0)
    } else {
        if (options.some(option => option.choice === userChoice)){
            for (const option of options) {
                if (option.choice === userChoice) {
                    roomIndex = option.nextRoom
                    console.log("This is the nextRoom: " + roomIndex)
                    return showGameRoom(roomIndex)
                    }
                }
        } else {
            clearOutput()
            display.innerHTML += "That is not an option. Try again.<br>"
            setTimeout(() => {
                showGameRoom(gameRoom.room)
            }, 1500)
        }
    }
}


// Eventlisteners
start.addEventListener("click", getPlayer)
reset.addEventListener("click", () => {
    location.reload()
})
openInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="block"
})
  closeInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="none"
})
