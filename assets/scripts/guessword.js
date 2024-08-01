const wordGrid = document.getElementById("word-grid")
const guessInput = document.getElementById("guess-input")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const guessBtn = document.getElementById("guess-button")

const gameVars = {
    "length": 0,
    "guesses": [],
    "word": ""
}

const preventNumeric = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')
}

const getLength = () => {
    return parseInt(document.querySelector("input[name='word-length']:checked").value)
}

const renderGrid = (length) => {
    wordGrid.innerHTML = ""

    wordGrid.style.gridTemplateColumns = `repeat(${length}, 1fr)`;
    wordGrid.style.gridTemplateRows = `repeat(${length}, 1fr)`;

    const totalCells = length * length;
    for (let i = 1; i <= totalCells; i++) {
        const gridCell = document.createElement('div');
        gridCell.classList.add("grid-cell", "cell")
        wordGrid.appendChild(gridCell);
    }

    for (let i = 1; i <= length; i++) {
        const guessCell = document.createElement('input')
        guessCell.type = "text"
        guessCell.name = "guess"
        guessCell.maxLength = 1
        guessCell.classList.add("cell", "guess-cell")
        guessCell.addEventListener("input", preventNumeric)
        guessInput.appendChild(guessCell)
    }
}

const pickWord = (length) => {
    if (length == 3) {
        return threeLetters[Math.floor(Math.random() * threeLetters.length)]
    } else if (length == 4) {
        return fourLetters[Math.floor(Math.random() * fourLetters.length)]
    } else {
        return fiveLetters[Math.floor(Math.random() * fiveLetters.length)]
    }
}

const checkGuess = () => {
    guessBtn.removeEventListener("click", checkGuess)
    let guess = ""
    let correct = 0
    
    const guessCells = document.querySelectorAll(".guess-cell")    
    guessCells.forEach(cell => guess += cell.value)
    console.log(guess)
    console.log(gameVars["word"])

    if (guess.length != gameVars["word"].length) {
        return console.log("wrong length")
    }

    const gridCells = document.querySelectorAll(".grid-cell")
    let emptyGridCells = Array.from(gridCells).filter(cell => cell.innerHTML === "");

    for (let i = 0; i < guess.length; i++) {
        const cell = emptyGridCells[i];
        const guessedLetter = guess[i];
        
        if (gameVars["word"][i] === guessedLetter) {
            cell.classList.add("correct-place");
            correct++;
        } else if (gameVars["word"].includes(guessedLetter)) {
            cell.classList.add("correct-letter");
        } else {
            cell.classList.add("wrong-letter");
        }
        
        cell.innerHTML = guessedLetter;
    }

    gameVars["guesses"].push(guess)
    
    guessCells.forEach(cell => cell.value = "");

    setTimeout(() => {
        if (correct === gameVars["word"].length) {
            document.getElementById("game-over").style.display = "block"
            document.getElementById("result").innerHTML = "WON!"
            document.getElementById("right-word").innerHTML = gameVars["word"]
        } else if (gameVars["length"] == gameVars["guesses"].length) {
            document.getElementById("game-over").style.display = "block"
            document.getElementById("result").innerHTML = "lost..."
            document.getElementById("right-word").innerHTML = gameVars["word"]
        } else {
            guessBtn.addEventListener("click", checkGuess)
        }
    }, 500)
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)
    gameVars["length"] = getLength()
    renderGrid(gameVars["length"])
    gameVars["word"] = pickWord(gameVars["length"])
    guessBtn.addEventListener("click", checkGuess)
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})


const threeLetters = ["not", "net", "the", "yes", "ate", "new", "fin", "fit", "fat", "ten", "tic", "toc", "ton", "she", "her", "him", "hot", "his", "hat", "day", "son", "sin", "sun", "set", "sat", "sit", "sum", "sad", "men", "man", "mic", "mad"]

const fourLetters = ["thin", "then", "than", "tone", "tune", "that", "they", "them", "sent", "send", "sand", "sign", "sing", "yell", "bang", "tell", "bent", "days", "week", "weak", "tall", "feel", "felt", "yelp", "sumo", "song", "sang"]

const fiveLetters = ["their", "yells", "theme", "tunes", "tones", "tuner", "sings", "songs", "signs", "human", "catch", "canoe", "banjo", "bangs", "bingo", "bento", "weeks", "weird", "waste", "waist", "shame", "feels", "cause"]