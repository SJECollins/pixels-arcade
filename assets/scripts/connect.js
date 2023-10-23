const startBtn = document.getElementById("start")
const board = document.getElementById("board")

const gameVars = {
    player1: "red",
    player2: "yellow",
    computer: true,
    current: "",
    gameOver: false,
}

const createBoard = () => {
    for (let i = 0; i < 42; i++) {
        const spot = document.createElement("div")
        spot.classList.add("spot")
        spot.classList.add("_" + (i + 1))
        spot.addEventListener("click", addDisc)
        board.appendChild(spot)
    }
}

const addDisc = (event) => {
    const clicked = event.target
    let classes = Array.from(clicked.classList)

    const colOne = ["_1", "_8", "_15", "_22", "_29", "_36"]
    const colTwo = ["_2", "_9", "_16", "_23", "_30", "_37"]
    const colThree = ["_3", "_10", "_17", "_24", "_31", "_38"]
    const colFour = ["_4", "_11", "_18", "_25", "_32", "_39"]
    const colFive = ["_5", "_12", "_19", "_26", "_33", "_40"]
    const colSix = ["_6", "_13", "_20", "_27", "_34", "_41"]
    const colSeven = ["_7", "_14", "_21", "_28", "_35", "_42"]

    if (checkClasses(colOne, classes)) {
        checkColumn(colOne, 1)
    } else if (checkClasses(colTwo, classes)) {
        checkColumn(colTwo, 2)
    } else if (checkClasses(colThree, classes)) {
        checkColumn(colThree, 3)
    } else if (checkClasses(colFour, classes)) {
        checkColumn(colFour, 4)
    } else if (checkClasses(colFive, classes)) {
        checkColumn(colFive, 5)
    } else if (checkClasses(colSix, classes)) {
        checkColumn(colSix, 6)
    } else if (checkClasses(colSeven, classes)) {
        checkColumn(colSeven, 7)
    } else {
        console.log("What?")
    }
}

const checkClasses = (column, classes) => {
    return classes.some(item => {
        return column.includes(item);
    });
}

const checkColumn = (column, columnNumber) => {
    for (let i = column.length - 1; i >= 0; i--) {
        const spot = document.querySelector(`.${column[i]}`)
        let classes = Array.from(spot.classList)
        if (!classes.includes("disc")) {
            spot.classList.add("disc", gameVars.current)
            return checkBoard(columnNumber, i)
        }
    }
}

const changePlayer = () => {
    if (gameVars.current == gameVars.player1) {
        gameVars.current = gameVars.player2
    } else {
        gameVars.current = gameVars.player1
    }
}

const checkBoard = (colNum, rowNum) => {
    let allSpots = document.querySelectorAll(".spot")
    let spotArray = Array.from(allSpots)
    let spots = []
    for (let i = 0; i < spotArray.length; i += 7) {
        const row = spotArray.slice(i, i + 7)
        spots.push(row)
    }
    if (checkSpots(spots, colNum, rowNum)) {
        return endGame()
    } else {
        return changePlayer()
    }

}

const checkSpots = (spots, col, row) => {
    col = col - 1
    // Right
    if (col < 4) {
        let num = 0
        for (let i = 0; i < 4; i++) {    
            let spot = Array.from(spots[row][col + i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }            
            if (num == 4) return true
        }        
    }
    // Left
    if (col > 2) {
        let num = 0
        for (let i = 0; i < 4; i++) {
            let spot = Array.from(spots[row][col - i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    // Down
    if (row < 3) {
        let num = 0
        for (let i = 0; i < 4; i++) {
            let spot = Array.from(spots[row + i][col].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    // Right down
    if (row < 3 && col < 4) {
        let num = 0
        for (let i = 0; i < 4; i++) {
            let spot = Array.from(spots[row + i][col + i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    //Left down
    if (row < 3 && col > 2) {
        let num = 0
        for (let i = 0; i < 4; i++) {    
            let spot = Array.from(spots[row + i][col - i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    // Right Up
    if (row > 2 && col < 4) {
        let num = 0
        for (let i = 0; i < 4; i++) {    
            let spot = Array.from(spots[row - i][col + i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    // Left up
    if (row > 2 && col > 2) {
        let num = 0
        for (let i = 0; i < 4; i++) {
            let spot = Array.from(spots[row - i][col - i].classList)
            if (spot.includes(gameVars.current)) {
                num += 1
            }
            if (num == 4) return true
        }        
    }
    return false
}

const endGame = () => {
    console.log("Game over")
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)
    createBoard()
    gameVars.current = gameVars.player1

}

startBtn.addEventListener("click", startGame)