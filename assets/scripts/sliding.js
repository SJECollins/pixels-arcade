const EASY = [{
    name: "turtle",
    images: ["../assets/images/sliding/turt-1.png", "../assets/images/sliding/turt-2.png", "../assets/images/sliding/turt-3.png", "../assets/images/sliding/turt-4.png", "../assets/images/sliding/turt-5.png", "../assets/images/sliding/turt-6.png", "../assets/images/sliding/turt-7.png", "../assets/images/sliding/turt-8.png"]
}]

const HARD = [{
    name: "turtle-hard",
    images: ["../assets/images/sliding/orc-hard-1.png", "../assets/images/sliding/orc-hard-2.png", "../assets/images/sliding/orc-hard-3.png", "../assets/images/sliding/orc-hard-4.png", "../assets/images/sliding/orc-hard-5.png", "../assets/images/sliding/orc-hard-6.png", "../assets/images/sliding/orc-hard-7.png", "../assets/images/sliding/orc-hard-8.png", "../assets/images/sliding/orc-hard-9.png", "../assets/images/sliding/orc-hard-10.png", "../assets/images/sliding/orc-hard-11.png", "../assets/images/sliding/orc-hard-12.png", "../assets/images/sliding/orc-hard-13.png", "../assets/images/sliding/orc-hard-14.png", "../assets/images/sliding/orc-hard-15.png",]
}]

const startEasyBtn = document.getElementById("start-easy")
const startHardBtn = document.getElementById("start-hard")
const resetBtn = document.getElementById("reset")
const cantMove = document.getElementById("cant-move")
const board = document.getElementById("puzzle")
const grid = document.createElement("div")

let size = ""
let correctOrder = []

function createBoard() {
    let puzzle = {}
    let currentPuzzle = []

    if (size == "small") {
        puzzle = EASY[Math.floor(Math.random() * EASY.length)]
    }

    if (size == "big") {
        puzzle = HARD[Math.floor(Math.random() * HARD.length)]
    }

    correctOrder = puzzle.images
    puzzle.images.forEach((image) => {
        const tile = document.createElement("div")
        if (size == "small") {
            tile.classList.add("tile", "easy")
        } else {
            tile.classList.add("tile", "hard")
        }

        tile.addEventListener("click", moveTile)

        const face = document.createElement("div")

        face.classList.add("face")
        face.style.backgroundImage = `url(${image})`

        currentPuzzle.push(tile)
        tile.appendChild(face)
    })
    const emptyTile = document.createElement("div")
    if (size == "small") {
        emptyTile.classList.add("tile", "easy", "empty")
    } else {
        emptyTile.classList.add("tile", "hard", "empty")
    }
    currentPuzzle.push(emptyTile)
    shufflePuzzle(currentPuzzle)
}

function shufflePuzzle(currentPuzzle) {
    let moves = 0
    let gridSize
    if (size == "small") {
        gridSize = 3
    } else {
        gridSize = 4
    }

    while (moves < 30) {
        let randomTile = Math.floor(Math.random() * currentPuzzle.length)
        let emptyTile = currentPuzzle.findIndex(tile => tile.classList.contains("empty"))
        let move = findMove(randomTile, emptyTile, gridSize)
        if (move != "no") {
            [currentPuzzle[randomTile], currentPuzzle[emptyTile]] = [currentPuzzle[emptyTile], currentPuzzle[randomTile]]
            moves += 1
        }        
    }
    currentPuzzle.forEach((tile) => {
        grid.appendChild(tile)
    })
}

function findMove(tile, emptyTile, gridSize) {
    if (tile - gridSize == emptyTile) {
        return "above"
    } else if (tile + gridSize == emptyTile) {
        return "below"
    } else if (tile - 1 == emptyTile) {
        return "left"
    } else if (tile + 1 == emptyTile) {
        return "right"
    } else {
        return "no"
    }
}

function moveTile(event) {
    let gridSize = 0
    let tiles = Array.from(document.getElementsByClassName("tile"))
    let emptyTile = tiles.findIndex(tile => tile.classList.contains("empty"))
    let selectedTile = tiles.findIndex((tile) => {
        if (tile.firstChild) {
            if (tile.firstChild.style.backgroundImage == event.target.style.backgroundImage) {
                return tile
            }
        }
    })

    // so we have the index, now we want to find if there's a free adjacent tile
    if (size == "small") {
        gridSize = 3
    } else {
        gridSize = 4
    }
    let move = findMove(selectedTile, emptyTile, gridSize)
    if (move === "no") {
        cantMove.style.display = "block"
        setTimeout(function () {
            cantMove.style.display = "none"
        }, 500)
    } else {
        return redrawBoard(tiles, selectedTile, emptyTile)
    }
}

function redrawBoard(tiles, tile, emptyTile) {
    [tiles[tile], tiles[emptyTile]] = [tiles[emptyTile], tiles[tile]]
    grid.innerHTML = ""
    tiles.forEach((tile) => {
        grid.appendChild(tile)
    })
    checkWin(tiles)
}

function checkArrays(array1, array2) {
    if (array1.length === array2.length) {
        return array1.every((element, index) => {
            if (element === array2[index]) {
                return true;
            }
            return false;
        });
    }
    return false;
}

function checkWin(tiles) {
    let currentOrder = []
    tiles.forEach((tile) => {
        if (tile.firstChild) {
            image = tile.firstChild.style.backgroundImage.slice(4, -1).replace(/"/g, "")
            currentOrder.push(image)
        }
    })
    if (checkArrays(correctOrder, currentOrder)) {
        console.log("You win!")
    }
}

function startEasy() {
    grid.classList.add("grid", "small")
    board.appendChild(grid)
    size = "small"
    createBoard()
}

function startHard() {
    grid.classList.add("grid", "big")
    board.appendChild(grid)
    size = "big"
    createBoard()
}

startEasyBtn.addEventListener("click", startEasy)
startHardBtn.addEventListener("click", startHard)