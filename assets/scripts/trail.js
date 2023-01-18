window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Window Displays
    const dayDisplay = document.getElementById("day-display")
    const weatherDisplay = document.getElementById("weather-display")
    const foodDisplay = document.getElementById("food-display")
    const waterdisplay = document.getElementById("water-display")
    const paceDisplay = document.getElementById("pace-display")
    const moodDisplay = document.getElementById("mood-display")

    // Window Controls
    const checkInvBtn = document.getElementById("check-inventory")
    const scavengeBtn = document.getElementById("scavenge")
    const restBtn = document.getElementById("rest")
    const paceSlowBtn = document.getElementById("pace-slow")
    const paceNormBtn = document.getElementById("pace-normal")
    const paceFastBtn = document.getElementById("pace-fast")

    // Game Pop Ups
    const createCharPop = document.getElementById("char-pop-up")
    const charOneName = document.getElementById("first-char")
    const charSecName = document.getElementById("second-char")
    const charThirdName = document.getElementById("third-char")
    const enterChars = document.getElementById("enter-chars")
    const gamePopUp = document.getElementById("game-pop-up")
    const gamePopText = document.getElementById("game-text")
    const gameChoices = document.getElementById("game-choices")
    const closePopBtn = document.getElementById("close-game-pop-up")

    // Game Imgs
    const roadImg = new Image()
    roadImg.src = "../assets/images/trail/road.png"
    const bgSkyImg = new Image()
    bgSkyImg.src = "../assets/images/trail/backgroundsky.png"
    const rainImg = new Image()
    rainImg.src = "../assets/images/trail/rain.png"
    const charOneImg = new Image()
    charOneImg.src = "../assets/images/trail/charonecomp.png"
    const charTwoImg = new Image()
    charTwoImg.src = "../assets/images/trail/chartwocomp.png"
    const charThreeImg = new Image()
    charThreeImg.src = "../assets/images/trail/charthreecomp.png"

    // Game variables
    const gameWidth = 512
    const gameHeight = 218
    let lastTime = 0
    let speed = 1
    let dayTimer = 0
    let dayCounter = 0
    let fgTimer = 0
    let fgInterval = 1000
    let randomFgInterval = Math.random() * 1000 + 1000
    let obstacleTimer = 0
    let obstacleInterval = 2000
    let randomObstacleInterval = Math.random() * 2000 + 10000
    let gameOver = false
    let gamePaused = false
    let weather = 'raining'

    // Game Stats
    let gameStats = {
        numChars: 0,
        pace: 1,
        food: 0,
        water: 0,
    }

    // How to manage inventory???
    let inventory = []
    let pickUps = []


    // Array of characters (should be 3 max)
    let gameChars = []

    const characterImages = [charOneImg, charTwoImg, charThreeImg]

    // Characters
    class Character {
        constructor(charName, charSheet, spawnX, spawnY) {
            this.name = charName
            this.img = charSheet
            this.health = 10
            this.food = 10
            this.water = 10
            this.rest = 10
            this.mood = 10
            this.injury = []
            this.alive = true
            this.width = 32
            this.height = 64
            this.x = spawnX
            this.y = spawnY
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 5
            this.frameTimer = 0
            this.fps = 6
            this.frameInterval = 1000/this.fps
        }
        draw(context) {
            if (this.alive){
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)

            }
        }
        update(deltaTime) {
            // Update frames
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            if (weather == 'raining') {
                this.frameY = 128
            }      
        }
        updateHealth() {
            // Check health against other stats for each character
        }
        updateMood() {
            // Check mood against other stats for each character
        }
        rest() {
            // Update rest, food and water
        }
    }

    // Create character function to be called at start
    enterChars.addEventListener("click", createCharacters)

    function createCharacters() {
        const characters = document.getElementsByName('characters')
        let names = []
        let posX = 180
        let posY = 42
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].value !== ''){
                names.push(characters[i].value)
            }
        }
        for (let i = 0; i < names.length; i++) {
            let spawnX = posX += 32
            let spawnY = posY += 32
            gameChars.push(new Character(names[i], characterImages[i], spawnX, spawnY))
            console.log(gameChars)
        }
        console.log(gameChars[0])
        // Remove eventlistener just to be safe
        createCharPop.style.display="none"
        enterChars.removeEventListener("click", createCharacters)
    }

    // Handle Characters - for now, just draw, but need to manage health, mood, food, etc
    function handleCharacters(ctx, deltaTime) {
        gameChars.forEach(char => {
            char.draw(ctx)
            char.update(deltaTime)
        })
    }

    // Background
    class Background {
        constructor() {
            this.img = bgSkyImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 1
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed
            // Reset img when scrolled off screen
            if (this.x < 0 - this.width) {
                this.x = 0
            }
        }
    }

    class Sky {
        constructor() {
            this.img = rainImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 1
        }
        draw(context) {
            // Draw img FOUR times for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
            context.drawImage(this.img, this.x, this.y - this.height, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y - this.height, this.width, this.height)
        }
        update() {
            this.y += this.speed
            this.x -= this.speed
            // Reset img when scrolled off screen - this jerk is going to drive me insane
            if (this.y > 207) {
                this.x = 0
                this.y = 0
            }
        }
    }

    class Ground {
        constructor() {
            this.img = roadImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 1
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed
            // Reset img when scrolled off screen
            if (this.x < 0 - this.width) {
                this.x = 0
            }
        }
    }

    class Obstacles {
        constructor() {
            this.type = ''
            this.img = ''
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 1
        }
        draw(context) {

        }
        update() {
            
        }
    }

    const background = new Background()
    const sky = new Sky()
    const ground = new Ground()

    function runGame(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        background.update()
        ground.draw(ctx)
        ground.update()
        handleCharacters(ctx, deltaTime)
        if (weather == 'raining') {
            sky.draw(ctx)
            sky.update()    
        }
        if (!gameOver && !gamePaused) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", () => {
        runGame()
        createCharPop.style.display="block"
        console.log("clicked")
    })

})