const gameBoard = document.getElementById("game")
const correctCats = document.getElementById("correct-categories")
const message = document.getElementById("message")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const guessBtn = document.getElementById("guess")

const gameVars = {
    "categories": [],
    "difficulty": 3,
    "chances": 3,
    "selected": []
}

const selectCategories = (difficulty) => {
    const randomised = categories.sort(() => 0.5 - Math.random());
    gameVars["categories"] = randomised.slice(0, difficulty)
}

const selectWord = (e) => {
    const selectedBtn = e.target

    if (selectedBtn.classList.contains("selected")) {
        selectedBtn.classList.remove("selected")
        gameVars["selected"] = gameVars["selected"].filter(word => {
            return word != selectedBtn.innerHTML
        })
    } else {
        selectedBtn.classList.add("selected")
        gameVars["selected"].push(selectedBtn.innerHTML)
    }
}

const submitGuess = () => {
    console.log("submitted")
    const category = checkGuess()
    if (category) {
        const catDiv = document.createElement("div")
        catDiv.classList.add("category-display")
        const theme = document.createElement("p")
        theme.innerHTML = category["theme"]
        catDiv.appendChild(theme)
        const words = document.createElement("p")
        words.innerHTML = category["words"].join(", ")
        catDiv.appendChild(words)
        correctCats.appendChild(catDiv)

        const wordBtns = document.querySelectorAll(".word-button")

        Array.from(wordBtns).filter(btn => btn.classList.contains("selected")).forEach(btn => btn.remove())
    } else {
        const selectedBtns = document.querySelectorAll(".selected")
        for (let btn of selectedBtns) {
            btn.classList.remove("selected")
        }
    }

    
}

const checkGuess = () => {
    if (gameVars["selected"].length != 4) {
        displayMessage("Please select 4 words")
        return false
    } else {
        const sortedSelected = gameVars["selected"].slice().sort()
        for (let category of gameVars["categories"]) {
            const sortedCat = category["words"].slice().sort()
            if (sortedSelected.every((value, index) => value === sortedCat[index])) {
                displayMessage("Correct!")
                return category
            }
        }
        displayMessage("Not a match...")
        return false
    }
}

const correctGuess = (category) => {

}

const buildBoard = () => {
    let allWords = []
    gameVars["categories"].forEach(category => {
        for (let word of category["words"]) {
            allWords.push(word)
        }
    })

    allWords = allWords.sort(() => 0.5 - Math.random())

    gameBoard.style.gridTemplateColumns = `repeat(4, 1fr)`
    gameBoard.style.gridTemplateRows = `repeat(${gameVars["difficulty"]}, 1fr)`

    for (let i = 0; i < allWords.length; i++) {
        const wordBtn = document.createElement("button")
        wordBtn.innerHTML = allWords[i]
        wordBtn.classList.add("word-button")
        wordBtn.addEventListener("click", selectWord)
        gameBoard.appendChild(wordBtn)
    }
}

const displayMessage = (text) => {
    message.innerHTML = text
    setTimeout(() => {
        message.innerHTML = ""
    }, 500)
}

const startGame = () => {
    gameVars["difficulty"] = parseInt(document.querySelector("input[name='categories']:checked").value)
    selectCategories(gameVars["difficulty"])

    buildBoard()

    guessBtn.style.display = "block"
    guessBtn.addEventListener("click", submitGuess)
}

guessBtn.style.display = "none"
startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const categories = [
    {
        "theme": "Words beginning with 'mid'",
        "words": ["night", "term", "range", "day"]
    },
    {
        "theme": "Stomach chambers",
        "words": ["rumen", "reticulum", "omasum", "abomasum"]
    },
    {
        "theme": "Types of bird",
        "words": ["tit", "grackle", "warbler", "shag"]
    },
    {
        "theme": "Units of time",
        "words": ["second", "minute", "hour", "fortnight"]
    },
    {
        "theme": "Elements",
        "words": ["neon", "lead", "nitrogen", "helium"]
    },
    {
        "theme": "Shades of blue",
        "words": ["azure", "cobalt", "teal", "navy"]
    },
    {
        "theme": "Programming languages",
        "words": ["c", "python", "ruby", "javascript"]
    },
    {
        "theme": "Types of snake",
        "words": ["copperhead", "cottonmouth", "boa", "python"]
    },
]