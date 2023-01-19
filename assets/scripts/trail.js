window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Window Displays
    const dayDisplay = document.getElementById("day-display")
    const weatherDisplay = document.getElementById("weather-display")
    const foodDisplay = document.getElementById("food-display")
    const waterDisplay = document.getElementById("water-display")
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
    const enterChars = document.getElementById("enter-chars")
    const gamePopUp = document.getElementById("game-pop-up")
    const restMenu = document.getElementById("rest-pop-up")
    const gamePopText = document.getElementById("game-text")
    const gameChoices = document.getElementById("game-choices")
    const closePopBtn = document.getElementById("close-game-pop-up")
    const closeRestBtn = document.getElementById("rest-options")

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
    let dayTimer = 0
    let dayCounter = 0
    let fgTimer = 0
    let fgInterval = 1000
    let randomFgInterval = Math.random() * 1000 + 1000
    let obstacleTimer = 0
    let obstacleInterval = 2000
    let randomObstacleInterval = Math.random() * 2000 + 10000

    // Game Stats
    let gameStats = {
        pace: 2,
        food: 10,
        water: 10,
        weather: 'Fine',
        gameOver: false,
        gamePaused: false,
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
            this.fps = 3
            this.frameInterval = 1000/this.fps
            this.status = []
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
                this.frameTimer += deltaTime * gameStats.pace
            }
            if (gameStats.weather == 'Fine') {
                if (this.mood < 5 || this.health < 5) {
                    this.frameY = 64
                } else {
                    this.frameY = 0
                }
            } else if (gameStats.weather != 'Fine') {
                this.frameY = 128
            }
        }
        updateHealth() {
            if (!gameStats.gamePaused) {
                // Check health against other stats for each character
                // Decrease stats
                this.food -= 1
                this.water -= 1
                this.rest -= 1
                // Cap stats
                if (this.food > 10) {
                    this.food = 10
                }
                if (this.water > 10) {
                    this.water = 10
                }
                if (this.rest > 10) {
                    this.rest = 10
                }
                // Reduce health when other stats below threshold
                if (this.food < 7) {
                    this.health -= 1
                }
                if (this.water < 7) {
                    this.health -= 1
                }
                if (this.rest < 7) {
                    this.health -= 1
                }          
            }
        }
        updateMood() {
            if (!gameStats.gamePaused) {
                // Check mood against other stats for each character
                if (this.food < 7 || this.water < 7 || this.rest < 7) {
                    this.mood -= 1
                }
                if (this.health < 5 && this.mood > 5) {
                        // Prevent mood going above 5 when health is low
                    this.mood = 4
                }
                if (this.food < 5 && !this.status.includes("Hungry")) {
                    this.status.push("Hungry")
                } else if (this.food > 5 && this.status.includes("Hungry")) {
                    let index = this.status.indexOf("Hungry")
                    this.status.splice(index, 1)
                }
                if (this.water < 5 && !this.status.includes("Thirsty")) {
                    this.status.push("Thirsty")
                } else if (this.food > 5 && this.status.includes("Thirsty")) {
                    let index = this.status.indexOf("Thirsty")
                    this.status.splice(index, 1)
                }
                if (this.rest < 5 && !this.status.includes("Tired")) {
                    this.status.push("Tired")
                } else if (this.food > 5 && this.status.includes("Tired")) {
                    let index = this.status.indexOf("Tired")
                    this.status.splice(index, 1)
                }            
            }
        }
        rest() {
            // Update rest, food and water

        }
    }

    // Create character function to be called at start - add event listeners for options
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
        }
        checkInvBtn.addEventListener("click", openInventory)
        scavengeBtn.addEventListener("click", openScavenge)
        restBtn.addEventListener("click", openRestMenu)
        paceSlowBtn.addEventListener("click", handlePace)
        paceNormBtn.addEventListener("click", handlePace)
        paceFastBtn.addEventListener("click", handlePace)
        dayTimer = 0
        gameStats.pace = 2
        createCharPop.style.display="none"
        foodDisplay.innerHTML = gameStats.food
        waterDisplay.innerHTML = gameStats.water
        enterChars.removeEventListener("click", createCharacters)
    }

    // Handle Characters - for now, just draw, but need to manage health, mood, food, etc
    function handleCharacters(ctx, deltaTime) {
        gameChars.forEach(char => {
            char.draw(ctx)
            char.update(deltaTime)
        })
        // Update health stuff
        if (dayTimer % 2000 == 0) {
            gameChars.forEach(char => {
                char.updateHealth()
                char.updateMood()
        })
        }
        // Checking mood of group
        let moodAvg = gameChars.map(char => char.mood).reduce((acc, val) => {return acc + val}, 0)
        if (moodAvg / gameChars.length >= 7) {
            moodDisplay.innerHTML = "Good"
        } else if (moodAvg / gameChars.length > 3 && moodAvg / gameChars.length < 7 ) {
            moodDisplay.innerHTML = "Okay"
        } else {
            moodDisplay.innerHTML = "Poor"
            gameStats.pace = 1
        }
        // Remove dead characters...
        gameChars = gameChars.filter(char => char.alive)
    }

    // Background
    class Background {
        constructor() {
            this.img = bgSkyImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 0.5
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
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
            this.speed = 0.5
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
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

    // Handle the day timer
    function manageDays() {
        dayTimer += 1
        if (dayTimer >= 5000) {
            ctx.fillStyle = 'rgba(87, 67, 50, 0.4)'
            ctx.fillRect(0, 0, gameWidth, gameHeight)
        }
        if (dayTimer >= 10000) {
            let weatherRand = Math.floor(Math.random() * 4)
            dayTimer = 0
            dayCounter += 1
            dayDisplay.innerHTML = dayCounter
            if (weatherRand == 0) {
                gameStats.weather = 'Rain'
            } else {
                gameStats.weather = 'Fine'
            }
            weatherDisplay.innerHTML = gameStats.weather
        }
    }

    // Handle pace
    function handlePace(e) {
        if (e.target.id == 'pace-slow') {
            gameStats.pace = 1
            paceDisplay.innerHTML = 'Slow'
        } else if (e.target.id == 'pace-normal') {
            gameStats.pace = 2
            paceDisplay.innerHTML = 'Normal'
        } else if (e.target.id == 'pace-fast') {
            gameStats.pace = 3
            paceDisplay.innerHTML = 'Fast'
        }

    }
    
    // Handle rest options
    function openRestMenu() {
        gameStats.gamePaused = true
        restMenu.style.display="block"
        closeRestBtn.addEventListener("click", handleRest)
    }

    function handleRest() {
        gameStats.gamePaused = false
        restMenu.style.display="none"
        closeRestBtn.removeEventListener("click", handleRest)
        let eating = document.querySelector("input[name='eating']:checked").value
        let drinking = document.querySelector("input[name='drinking']:checked").value
        let resting = document.querySelector("input[name='resting']:checked").value

        switch (eating) {
            case "nothing":
                break;
            case "small-meal":
                if (gameStats.food >= gameChars.length) {
                    gameStats.food -= gameChars.length / 2
                    gameChars.forEach((char) => {
                        if (char.food <= 5) {
                            char.food += 5
                        } else {
                            char.food = 10
                        }
                    })
                } else {
                    gameStats.food = 0
                    gameChars.forEach((char) => {
                        if (char.food <= 7) {
                            char.food += 3
                        } else {
                            char.food = 10
                        }
                    })
                    // Should return note about not having enough food??
                }
                break;
            case "large-meal":
                if (gameStats.food >= gameChars.length) {
                    gameStats.food -= gameChars.length
                    gameChars.forEach((char) => {
                        char.food = 10
                        char.mood = 10                        
                    })
                } else {
                    gameStats.food = 0
                    gameChars.forEach((char) => {
                        if (char.food <= 7) {
                            char.food += 3
                        } else {
                            char.food = 10
                        }
                    })
                    // Should return note about not having enough food??
                }
                break;
        }
        switch (drinking) {
            case "nothing":
                break;
            case "small-drink":
                if (gameStats.water >= gameChars.length) {
                    gameStats.water -= gameChars.length / 2
                    gameChars.forEach((char) => {
                        if (char.water <= 7) {
                            char.water += 3
                        } else {
                            char.water = 10
                        }
                    })
                } else {
                    gameStats.water = 0
                    gameChars.forEach((char) => {
                        if (char.water <= 9) {
                            char.water += 1
                        } else {
                            char.water = 10
                        }
                    })
                    // Should return note about not having enough water??
                }
                break;
            case "large-drink":
                if (gameStats.water >= gameChars.length) {
                    gameStats.water -= gameChars.length
                    gameChars.forEach((char) => {
                        if (char.water <= 5) {
                            char.water += 5
                        } else {
                            char.water = 10
                        }
                    })
                } else {
                    gameStats.water = 0
                    gameChars.forEach((char) => {
                        if (char.water <= 9) {
                            char.water += 1
                        } else {
                            char.water = 10
                        }
                    })
                    // Should return note about not having enough water??
                }
                break;
        }
        switch (resting) {
            case "nothing":
                break;
            case "short-sleep":
                gameChars.forEach((char) => {
                    if (char.rest <= 5) {
                        char.rest += 5
                    } else {
                        char.rest = 10
                    }
                })
                if (dayTimer <= 7999) {
                    dayTimer += 2000
                } else {
                    let time = 10000 - dayTimer
                    dayTimer = 0 + time
                    dayCounter++
                }
                break;
            case "long-sleep":
                gameChars.forEach((char) => {
                    if (char.rest <= 5) {
                        char.rest += 5
                    } else {
                        char.rest = 10
                    }
                })
                if (dayTimer <= 5999) {
                    dayTimer += 4000
                } else {
                    let time = 10000 - dayTimer
                    dayTimer = 0 + time
                    dayCounter += 1
                }
                break;
        }
        dayDisplay.innerHTML = dayCounter
        foodDisplay.innerHTML = gameStats.food
        waterDisplay.innerHTML = gameStats.water
        console.log(eating, drinking, resting)
        console.log(gameChars)
        console.log(gameChars.length)
    }

    // Handle Scavenging
    function openScavenge() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        closePopBtn.addEventListener("click", () => {
            gameStats.gamePaused = false
            gamePopUp.style.display="none"
        })
    }

    // Handle inventory
    function openInventory() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"


        closePopBtn.addEventListener("click", () => {
            gameStats.gamePaused = false
            gamePopUp.style.display="none"
        })
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
        if (gameStats.weather == 'Rain') {
            sky.draw(ctx)
            sky.update()    
        }
        if (!gameStats.gamePaused) {
            manageDays()
        }
        if (!gameStats.gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", () => {
        runGame()
        createCharPop.style.display="block"
    })

})