const gameBoard = document.getElementById("board")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const gameVars = {
    board: [],
    selected: [],
    matches: [],
    score: 0,
    size: 8,
}

const randomSkull = () => {
    return skullArray[Math.floor(Math.random() * skullArray.length)] 
}

const createBoard = () => {
    gameBoard.style.gridTemplateColumns = `repeat(${gameVars.size}, 1fr)`
    gameBoard.style.gridTemplateRows = `repeat(${gameVars.size}, 1fr)`

    const totalCells = gameVars.size * gameVars.size
    gameVars.board = Array.from({ length: gameVars.size }, () => Array(gameVars.size).fill(null))

    for (let i = 0; i < totalCells; i++) {
        const skull = randomSkull()
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cell.dataset.name = skull.name
        cell.style.backgroundImage = `url(${skull.img})`
        const row = Math.floor(i / gameVars.size)
        const col = i % gameVars.size
        cell.dataset.row = row
        cell.dataset.col = col
        cell.addEventListener("click", selectCell)
        gameBoard.appendChild(cell)

        gameVars.board[row][col] = {
            element: cell,
            name: skull.name,
            img: skull.img
        }
    }
}


const selectCell = (e) => {
    const cell = e.target
    const row = parseInt(cell.dataset.row, 10)
    const col = parseInt(cell.dataset.col, 10)
    const selectedCell = gameVars.board[row][col]

    if (cell.classList.contains("selected")) {
        cell.classList.remove("selected")
        gameVars.selected = gameVars.selected.filter(item => item != cell)
    } else {
        cell.classList.add("selected")
        gameVars.selected.push(cell)
    }

    if (gameVars.selected.length === 2) {
        checkCells()
    }
}

const getCoords = (cell) => {
    return [parseInt(cell.dataset.row, 10), parseInt(cell.dataset.col, 10)]
}

const swapCells = (cellOneCoords, cellTwoCoords) => {
    console.log(gameVars.board)
    const cellOne = gameVars.board[cellOneCoords[0]][cellOneCoords[1]]
    const cellTwo = gameVars.board[cellTwoCoords[0]][cellTwoCoords[1]]
    gameVars.board[cellOneCoords[0]][cellOneCoords[1]] = cellTwo
    gameVars.board[cellTwoCoords[0]][cellTwoCoords[1]] = cellOne
    console.log(gameVars.board)

    const tempImg = cellOne.element.style.backgroundImage
    const tempName = cellOne.name
    cellOne.element.style.backgroundImage = cellTwo.element.style.backgroundImage
    cellTwo.element.style.backgroundImage = tempImg
    cellOne.name = cellTwo.name
    cellTwo.name = tempName
}

const checkCells = () => {
    const cellOne = gameVars.selected[0]
    const cellOneCoords = getCoords(cellOne)
    console.log(cellOneCoords)

    const cellTwo = gameVars.selected[1]
    const cellTwoCoords = getCoords(cellTwo)
    console.log(cellTwoCoords)

    const areAdjacent =
        (cellOneCoords[0] === cellTwoCoords[0] && Math.abs(cellOneCoords[1] - cellTwoCoords[1]) === 1) ||
        (cellOneCoords[1] === cellTwoCoords[1] && Math.abs(cellOneCoords[0] - cellTwoCoords[1]) === 1)

    if (areAdjacent) {
        swapCells(cellOneCoords, cellTwoCoords)
        // checkNeighbours();
    } else {
        // Deselect the cells? Display a message? 
    }

    gameVars.selected = []
};


const checkNeighbours = () => {
    for (let row = 0; row < gameVars.size; row++) {
        for (let col = 0; col < gameVars.size; col++) {
            const cell = gameVars.board[row][col]
            if (!cell) continue

            let matchLength = 1
            for (let i = col + 1; i < gameVars.size && gameVars.board[row][i]?.name === cell.name; i++) {
                matchLength++
            }

            matchLength = 1
            for (let i = row + 1; i < gameVars.size && gameVars.board[i][col]?.name === cell.name; i++) {
                matchLength++
            }
            if (matchLength >= 3) {
                updateBoard
            }
        }
    }
}


const startGame = () => {
    createBoard()
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const skullArray = [{
        name: "owl",
        img: "../assets/images/memory-cards/owl.webp"
    },
    {
        name: "cat",
        img: "../assets/images/memory-cards/cat.webp",
    },
    {
        name: "cow",
        img: "../assets/images/memory-cards/cow.webp",
    },
    {
        name: "gorilla",
        img: "../assets/images/memory-cards/gorilla.webp",
    },
    {
        name: "lion",
        img: "../assets/images/memory-cards/lion.webp",
    },
    {
        name: "deer",
        img: "../assets/images/memory-cards/deer.webp",
    },
    {
        name: "ram",
        img: "../assets/images/memory-cards/ram.webp",
    },
    {
        name: "raven",
        img: "../assets/images/memory-cards/raven.webp",
    },
    {
        name: "walrus",
        img: "../assets/images/memory-cards/walrus.webp",
    },
]