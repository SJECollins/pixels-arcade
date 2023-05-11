const textDisplay = document.getElementById("test-text")
const userInput = document.getElementById("user-input")
const timeDisplay = document.getElementById("time-left")
const wpmDisplay = document.getElementById("wpm")
const cpmDisplay = document.getElementById("cpm")
const errorDisplay = document.getElementById("errors")
const overallDisplay = document.getElementById("overall")
const cpmResult = document.getElementById("cpm-result")
const wpmResult = document.getElementById("wpm-result")
const accResult = document.getElementById("accuracy")
const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

let testText
let charIndex = 0
let chars = 0
let words = 0
let errors = 0
let accuracy = 0
let timer
let time = 60

async function getText() {
    let response = await fetch(`https://litipsum.com/api/p/json`)
    let data = await response.json()
    testText = data.text
    console.log(typeof(testText))
    console.log(testText)
    displayText()
}

function displayText() {
    Object.values(testText).forEach(paragraph => {
        console.log(paragraph)
        paragraph = paragraph.replace(/<p>/g, '').replace(/<\/p>/g, ' ').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
        paragraph.split("").forEach(char => {
            const span = document.createElement("span")
            span.innerText = char
            textDisplay.appendChild(span)
        })
    })
}

function updateStats() {
    chars = charIndex - errors
    words = Math.round((((charIndex - errors) / 5) / (60 - time)) * 60)
    words = words < 0 || !words || words === Infinity ? 0 : words
    timeDisplay.innerHTML = time
    wpmDisplay.innerHTML = words
    cpmDisplay.innerHTML = chars
    errorDisplay.innerHTML = errors
}

function countdown() {
    if (time <= 0) {
        clearInterval(timer)
    } else {
        time -= 1
    }
    updateStats()
}

function userTyping() {
    const testChars = textDisplay.querySelectorAll("span")
    let userChar = userInput.value.split("")[charIndex]
    
    if (time > 0) {
        if (userChar == null) {
            charIndex--
            if (testChars[charIndex].classList.contains("wrong")) {
                errors--
            }
            testChars[charIndex].classList.remove("right", "wrong")
        } else {
            if (testChars[charIndex].innerText === userChar) {
                testChars[charIndex].classList.add("right")
            } else {
                errors += 1
                testChars[charIndex].classList.add("wrong")
            }
            charIndex++        
        }
    } else {
        clearInterval(timer)
        endGame()
    }
    testChars.forEach(char => char.classList.remove("current"))
    testChars[charIndex].classList.add("current")
}

function startTest() {
    getText()
    textDisplay.addEventListener("click", () => userInput.focus())
    document.addEventListener("keydown", () => userInput.focus())
    userInput.addEventListener("input", userTyping)   
    timer = setInterval(countdown, 1000)
}

function endGame() {
    document.getElementById("game-over").style.display = "block"
    cpmResult.innerHTML = chars
    wpmResult.innerHTML = words
    if (errors === 0) {
        accuracy = 100
    } else {
        let num = chars - errors
        accuracy = Math.round((num / chars) * 100).toFixed(2)
    }
    accResult.innerHTML = accuracy
}

startBtn.addEventListener("click", startTest)