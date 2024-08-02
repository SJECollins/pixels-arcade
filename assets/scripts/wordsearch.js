const gameGrid = document.getElementById("game")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const gameVars = {
    "size": 10,
    "theme": {},
    "selected": [],
    "directions": {
        "l-r": [0, 1],
        "r-l": [0, -1],
        "t-b": [1, 0],
        "b-t": [-1, 0],
        "t-r-d": [1, 1],
        "b-r-d": [-1, 1],
        "t-l-d": [1, -1],
        "b-l-d": [-1, -1]
    },
    "boardArray": Array.from({ length: 10 }, () => Array(10).fill(''))
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function canPlaceWord(word, row, col, direction) {
    const [rowDir, colDir] = gameVars["directions"][direction]

    let endRow = row + (word.length - 1) * rowDir
    let endCol = col + (word.length - 1) * colDir

    if (endRow < 0 || endRow >= gameVars["size"] || endCol < 0 || endCol >= gameVars["size"]) {
        return false
    }

    for (let i = 0; i < word.length; i++) {
        let curRow = row + i * rowDir
        let curCol = col + i * colDir
        if (gameVars["boardArray"][curRow][curCol] !== "" && gameVars["boardArray"][curRow][curCol] !== word[i]) {
            return false
        }
    }

    return true
}

function placeWord(word, row, col, direction) {
    const [rowDir, colDir] = gameVars["directions"][direction]

    for (let i = 0; i < word.length; i++) {
        let curRow = row + i * rowDir
        let curCol = col + i * colDir
        gameVars["boardArray"][curRow][curCol] = word[i]
    }
}

function fillEmptyCells() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    for (let row = 0; row < gameVars["size"]; row++) {
        for (let col = 0; col < gameVars["size"]; col++) {
            if (gameVars["boardArray"][row][col] === "") {
                gameVars["boardArray"][row][col] = alphabet[Math.floor(Math.random() * alphabet.length)]
            }
        }
    }
}

const renderGrid = () => {
    const directions = ["l-r", "r-l", "t-b", "b-t", "t-r-d", "b-r-d", "t-l-d", "b-l-d"]

    gameGrid.style.gridTemplateColumns = `repeat(${gameVars["size"]}, 1fr)`
    gameGrid.style.gridTemplateRows = `repeat(${gameVars["size"]}, 1fr)`

    for (let word of gameVars["theme"]["words"]) {
        let placed = false

        while (!placed) {
            const randomRow = Math.floor(Math.random() * gameVars["size"])
            const randomCol = Math.floor(Math.random() * gameVars["size"])
            let direction = directions[Math.floor(Math.random() * directions.length)]
            console.log(direction)

            if (canPlaceWord(word, randomRow, randomCol, direction)) {
                placeWord(word, randomRow, randomCol, direction)
                placed = true
            }
        }
    }

    fillEmptyCells()

    gameVars["boardArray"].forEach(row => {
        row.forEach(cell => {
            const div = document.createElement("div")
            div.classList.add("grid-cell", "selectable")
            div.textContent = cell
            div.addEventListener("click", selectCell)
            gameGrid.appendChild(div)
        })
    })

}

const selectCell = () => {

}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)

    const shuffledGroups = shuffle([...wordArray])

    gameVars["theme"] = shuffledGroups.slice(0, 1)[0]


    renderGrid()
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const wordArray = [{
        "theme": "Parts of the body",
        "words": ["head", "heart", "eye", "tendon", "ligament", "knee", "stomach", "ear", "finger", "hand"]
    },
    {
        "theme": "Measurements of time",
        "words": ["minute", "hour", "second", "year", "month", "week", "fortnight", "decade", "day", "century"]
    },
    {
        "theme": "Periodic elements",
        "words": ["lead", "neon", "helium", "argon", "nitrogen", "boron", "bismuth", "tin", "xenon", "sulfur"]
    },
    {
        "theme": "Video games",
        "words": ["tetris", "pacman", "bully", "contra", "fallout", "infamous", "myst", "pong", "simcity", "snake"]
    },
]