const textDisplay = document.getElementById("test-text")
const timeDisplay = document.getElementById("time-left")
const wpmDisplay = document.getElementById("wpm")
const cpmDisplay = document.getElementById("cpm")
const errorDisplay = document.getElementById("errors")
const startBtn = document.getElementById("start")

let testText
let chars = 0
let words = 0
let errors = 0
let accuracy = 0
let timer = 60

async function getText() {
    let response = await fetch(`https://litipsum.com/api/p/json`)
    let data = await response.json()
    testText = data.text
    console.log(typeof(testText))
    console.log(testText)
    displayText()
}

startBtn.addEventListener("click", () => {
    getText()
})

function displayText() {
    Object.values(testText).forEach(paragraph => {
        console.log(paragraph)
        paragraph = paragraph.replace(/<p>/g, '').replace(/<\/p>/g, ' ')
        paragraph.split("").forEach(char => {
            const span = document.createElement("span")
            span.innerText = char
            textDisplay.appendChild(span)
        })
    })
}

function updateStats() {
    timeDisplay.innerHTML = timer
    wpmDisplay.innerHTML = words
    cpmDisplay.innerHTML = chars
    errorDisplay.innerHTML = errors
}
