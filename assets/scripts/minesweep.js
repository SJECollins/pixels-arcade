const boardElement = document.querySelector(".board")
const counter = document.querySelector(".counter")

const boardSize = 10
const numberMines = 10

const tileStatus = {
  hidden: "hidden",
  mine: "mine",
  number: "number",
  marked: "marked",
}

// Creating the board, takes 2 parameters - size of board and number of mines
function createBoard(boardSize, numberMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberMines)

  // To get our x direction
  for (let x = 0; x < boardSize; x++) {
    const row = []

    // Our y direction
    for (let y = 0; y < boardSize; y++) {
      
      // Create the tile
      const element = document.createElement("div")
      element.dataset.status = tileStatus.hidden

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, {x, y})),
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        }
      }
      //Push the tiles to rows
      row.push(tile)
    }
    // Push the rows to the board
    board.push(row)
  }
  return board
}

const board = createBoard(boardSize, numberMines)

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", event => {
      event.preventDefault()
      markTile(tile)
      minesLeft()
    })
  })
})

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y
}

function getMinePositions(boardSize, numberMines) {
  const positions = []

  // While is better than for loop to avoid putting two mines on the same spot
  while (positions.length < numberMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize)
    }
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }
  return positions
}

function markTile(tile) {
  // Check it's not marked or hidden first
  if (tile.status !== tileStatus.hidden &&
      tile.status !== tileStatus.marked) {
        return
      }
  if (tile.status === tileStatus.marked) {
    tile.status = tileStatus.hidden
  } else {
    tile.status = tileStatus.marked
  }
}

function minesLeft() {
  const markedTiles = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === tileStatus.marked).length
  }, 0)
  counter.innerHTML = numberMines - markedTiles
}

function revealTile(board, tile) {
  if (tile.status !== tileStatus.hidden) {
    return
  }

  if (tile.mine) {
    tile.status = tileStatus.mine
    return
  }

  // When a not-mine is revealed, either show adjacent tiles or recursively call revealTile
  tile.status = tileStatus.number
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter(t => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length
  }
}

function nearbyTiles(board, {x, y}) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      // Optional chaining to prevent a bug caused by looking for tiles in x or y coordinates off the board
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }
  return tiles
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, {capture: true})
    boardElement.addEventListener("contextmenu", stopProp, {capture: true})
  }

  if (win) {
    counter.innerHTML = "You win"
  }

  if (lose) {
    counter.innerHTML = "You lose!"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === tileStatus.marked) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(event) {
  event.stopImmediatePropogation()
}

function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return (tile.status === tileStatus.number || 
        (tile.mine && 
          (tile.status === tileStatus.hidden ||
            tile.status === tileStatus.marked)))
    })
  })
}

function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === tileStatus.mine
    })
  })
}

boardElement.style.setProperty("--size", boardSize)
counter.innerHTML = numberMines