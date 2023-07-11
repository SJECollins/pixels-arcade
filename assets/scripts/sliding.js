const EASY = [{
    name: "turtle",
    images: ["../assets/images/sliding/turt-1.png", "../assets/images/sliding/turt-2.png", "../assets/images/sliding/turt-3.png", "../assets/images/sliding/turt-4.png", "../assets/images/sliding/turt-5.png", "../assets/images/sliding/turt-6.png", "../assets/images/sliding/turt-7.png", "../assets/images/sliding/turt-8.png"]
}]

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const cantMove = document.getElementById("cant-move")
const board = document.getElementById("puzzle")
const grid = document.createElement("div")

let size = ""
let correctOrder = []

function createBoard() {
    let puzzle = {}
    if (size == "small") {
        puzzle = EASY[Math.floor(Math.random() * EASY.length)]
    }
    correctOrder = puzzle.images
    puzzle.images.sort(() => 0.5 - Math.random())
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

        grid.appendChild(tile)
        tile.appendChild(face)
    })
    const emptyTile = document.createElement("div")
    if (size == "small") {
        emptyTile.classList.add("tile", "easy", "empty")
    } else {
        emptyTile.classList.add("tile", "hard", "empty")
    }
    grid.appendChild(emptyTile)
}

function getPosition(tileIndex, gridSize) {
    let tilePosition = []
    if (tileIndex % gridSize === 0) {
        tilePosition.push("left")
    }
    if ((tileIndex + 1) % gridSize === 0) {
        tilePosition.push("right")
    }
    if (Math.floor(tileIndex / gridSize) === 0) {
        tilePosition.push("top")
    }
    if (Math.floor(tileIndex / gridSize) === (gridSize - 1)) {
        tilePosition.push("bottom")
    }
    return tilePosition
}

function findMove(tile, tilePos, emptyTile, gridSize) {
    if (!tilePos.includes("top") && tile - gridSize == emptyTile) {
        return "above"
    } else if (!tilePos.includes("bottom") && tile + gridSize == emptyTile) {
        return "below"
    } else if (!tilePos.includes("left") && tile - 1 == emptyTile) {
        return "left"
    } else if (!tilePos.includes("right") && tile + 1 == emptyTile) {
        return "right"
    } else {
        return "no"
    }
}

function moveTile(event) {
    let gridSize = 0
    let tiles = Array.from(document.getElementsByClassName("tile"))
    tiles.forEach(tile => console.log(tile.firstChild))
    let emptyTile = tiles.findIndex(tile => tile.classList.contains("empty"))
    console.log("Empty tile: ", emptyTile)
    let selectedTile = tiles.findIndex((tile) => {
        if (tile.firstChild) {
            if (tile.firstChild.style.backgroundImage == event.target.style.backgroundImage) {
                return tile
            }
        }
    })
    console.log("Selected tile: ", selectedTile)

    // so we have the index, now we want to find if there's a free adjacent tile
    if (size == "small") {
        gridSize = 3
    }
    let tilePosition = getPosition(selectedTile, gridSize)
    console.log("Edge: ", tilePosition)
    let move = findMove(selectedTile, tilePosition, emptyTile, gridSize)
    console.log("Can move: ", move)
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
    tiles.forEach(tile => console.log("New tiles: ", tile.firstChild))
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
    if (checkArrays(correctOrder, tiles)) {
        console.log("You win!")
    }
}

function startEasy() {
    grid.classList.add("grid", "small")
    board.appendChild(grid)
    size = "small"
    createBoard()
}

startBtn.addEventListener("click", startEasy)