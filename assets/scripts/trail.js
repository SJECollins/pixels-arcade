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
    const statBtn = document.getElementById("status")
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
    const treeImg = new Image()
    treeImg.src = "../assets/images/trail/trees.png"

    // Game variables
    const gameWidth = 512
    const gameHeight = 218
    let lastTime = 0
    let dayTimer = 0
    let dayCounter = 0
    let kmsToGo = 100
    let treeFgTimer = 0
    let treeBgTimer = 0
    let treeFgInterval = 6000
    let treeBgInterval = 4000
    let randTreeInterval = Math.random() * 2000 + 2500
    let obstacleTimer = 0
    let obstacleInterval = 2000
    let randomObstacleInterval = Math.random() * 2000 + 10000

    let bgTrees = []
    let fgTrees = []

    // How to manage inventory???
    let inventory = []
    let pickUps = ['medkit', 'hatchet', 'knife', 'map', 'blanket']

    // Game Stats
    let gameStats = {
        kph: 3,
        pace: 2,
        food: 10,
        water: 10,
        weather: 'Fine',
        gameOver: false,
        gamePaused: false,
    }

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
                if (this.health > 10) {
                    this.health = 10
                }
                // Reduce health when other stats below threshold (or increase if food above)
                // Cap health loss so can only die if no water, then if runs out of water, dies
                if (this.food < 7 && this.health >= 2) {
                    this.health -= 1
                } else {
                    this.health += 1
                }
                if (this.water < 7) {
                    this.health -= 1
                }
                if (this.rest < 7 && this.health >= 2) {
                    this.health -= 1
                }
                // If out of food, worsen thirst
                if (this.food <= 0) {
                    this.water -= 1
                }
                // If thirst or health at zero, die
                if (this.water <= 0 || this.health <= 0 ) {
                    this.alive = false
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
                if (this.food <= 5 && !this.status.includes("Hungry")) {
                    this.status.push("Hungry")
                } else if (this.food > 5 && this.status.includes("Hungry")) {
                    this.status = this.status.filter(stat => stat != "Hungry")
                }
                if (this.water <= 5 && !this.status.includes("Thirsty")) {
                    this.status.push("Thirsty")
                } else if (this.water > 5 && this.status.includes("Thirsty")) {
                    this.status = this.status.filter(stat => stat != "Thirsty")
                }
                if (this.rest <= 5 && !this.status.includes("Tired")) {
                    this.status.push("Tired")
                } else if (this.rest > 5 && this.status.includes("Tired")) {
                    this.status = this.status.filter(stat => stat != "Tired")
                }            
            }
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
        if (!names.length) {
            // If no characters entered
            gamePopUp.style.display="block"
            gamePopText.innerHTML = "<h2>Enjoy the scenery...</h2>"
            closePopBtn.addEventListener("click", () => {
                gamePopText.innerHTML = ""
                gamePopUp.style.display="none"
            })
        } else {
            for (let i = 0; i < names.length; i++) {
                let spawnX = posX += 32
                let spawnY = posY += 32
                gameChars.push(new Character(names[i], characterImages[i], spawnX, spawnY))
            }            
        }
        startBtn.removeEventListener("click", () => {
            runGame()
            createCharPop.style.display="block"
        })
        checkInvBtn.addEventListener("click", openInventory)
        scavengeBtn.addEventListener("click", openScavenge)
        restBtn.addEventListener("click", openRestMenu)
        statBtn.addEventListener("click", openStats)
        paceSlowBtn.addEventListener("click", handlePace)
        paceNormBtn.addEventListener("click", handlePace)
        paceFastBtn.addEventListener("click", handlePace)
        dayTimer = 0
        treeBgTimer = 0
        treeFgTimer = 0
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

    class Tree {
        constructor(spawnY, spawnSpeed, spawnFrame) {
            this.img = treeImg
            this.gameWidth = gameWidth
            this.x = this.gameWidth
            this.y = spawnY
            this.width = 32
            this.height = 192
            this.frameX = spawnFrame
            this.speed = spawnSpeed
            this.markedForDeletion = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    // Handle trees
    function handleBgTrees(deltaTime) {
        if (treeBgTimer > treeBgInterval + randTreeInterval) {
            let frameX = (Math.floor(Math.random() * 6)) * 32
            console.log("background")
            bgTrees.push(new Tree(0, 0.4, frameX))
            randTreeInterval = Math.random() * 2000 + 2500
            treeBgTimer = 0
        } else {
            treeBgTimer += deltaTime
        }
        bgTrees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        bgTrees = bgTrees.filter(tree => !tree.markedForDeletion)        
    }

    function handleFgTrees(deltaTime) {
        if (treeFgTimer > treeFgInterval + randTreeInterval) {
            let frameX = (Math.floor(Math.random() * 6)) * 32
            console.log("foreground")
            fgTrees.push(new Tree(96, 0.6, frameX))
            randTreeInterval = Math.random() * 2000 + 2500
            treeFgTimer = 0
        } else {
            treeFgTimer += deltaTime
        }
        fgTrees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        fgTrees = fgTrees.filter(tree => !tree.markedForDeletion)        
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

    // Obstacles
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

    // Handle obstacle spawning
    function handleObstacles() {
        // Need to spawn new obstacles every x amt of time
        // Need to randomly decide what kind of obstacle - strangers or background
        // Should background be more regular ?
        // Should have whole days where nothing happens though
    }

    // Handle the day timer
    function manageDays() {
        dayTimer += 1
        // Every 1000, reduce kmsToGo
        if (dayTimer >= 1000) {
            kmsToGo -= (gameStats.kph + gameStats.pace)
        }
        // Add darkness
        if (dayTimer >= 5000) {
            ctx.fillStyle = 'rgba(87, 67, 50, 0.4)'
            ctx.fillRect(0, 0, gameWidth, gameHeight)
        }
        // Update day, also roll for weather
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
                        if (char.food <= 8) {
                            char.food += 2
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
                        if (char.food <= 8) {
                            char.food += 2
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
        gameChars.forEach(char => char.updateMood())
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

        gamePopText.insertAdjacentHTML(
            "afterbegin",
            "<h2>Scavenging</h2><p>Who will scavenge and who will rest...</p>")

        gameChars.forEach((char) => {
            if (char.health <= 2){
                gamePopText.insertAdjacentHTML("beforeend", `
                <fieldset id="${char.name}-scav-options">
                <legend>${char.name}</legend>
                <label for="${char.name}-scav-rest">Rest</label>
                <input type="radio" value="rest" name="${char.name}-scav-options" id="${char.name}-scav-rest" checked>
                <p>${char.name} is unable to scavenge...</p>
                </fieldset>`)           
            } else {
                gamePopText.insertAdjacentHTML("beforeend", `
                <fieldset id="${char.name}-scav-options">
                <legend>${char.name}</legend>
                <label for="${char.name}-scav-rest">Rest</label>
                <input type="radio" value="rest" name="${char.name}-scav-options" id="${char.name}-scav-rest" checked>
                <label for="${char.name}-scav-scav">Scavenge</label>
                <input type="radio" value="scavenge" name="${char.name}-scav-options" id="${char.name}-scav-scav">
                </fieldset>`)
            }
        })

        gameChoices.insertAdjacentHTML("afterbegin", "<button id='go-scavenge'>Scavenge</button>")
        gameChoices.addEventListener("click", (e) => {
            if (e.target && e.target.id == "go-scavenge") {
                handleScavenge()
                gameChoices.innerHTML = ""
            }
        })

        closePopBtn.innerHTML = "Close"
        closePopBtn.addEventListener("click", () => {
            gamePopText.innerHTML = ""
            gameChoices.innerHTML = ""
            gameStats.gamePaused = false
            gamePopUp.style.display="none"
        })
    }

    function handleScavenge() {
        closePopBtn.innerHTML = "Okay"
        // Get our options for scavenging and resting
        let scavOptions = []
        gameChars.forEach(char => {
            let option = document.querySelector(`input[name="${char.name}-scav-options"]:checked`)
            let name = option.id.split("-")[0]
            let value = option.value
            scavOptions.push({name: name, job: value})
        })
        let rested = scavOptions.filter(option => option.job == "rest").map(option => option.name)
        let scavenged = scavOptions.filter(option => option.job == "scavenge").map(option => option.name)

        // Deal with our options
        if (scavenged.length == 0) {
            // If player decides not to scavenge for some reason
            gameChars.forEach((char) => {
                if (char.rest <= 5) {
                    char.rest += 5
                } else {
                    char.rest = 10
                }
            })
            gamePopText.innerHTML = "<p>Everybody rested...</p>"
        } else {
            // If player sends characters to scavenge
            let result = Math.floor(Math.random() * 6)
            if (result == 0) {
                // Good outcome!
                let foundWater = Math.floor(Math.random() * 4) + 4
                let foundFood = Math.floor(Math.random() * 4) + 4
                let randItem = pickUps[Math.floor(Math.random() * pickUps.length)]
                gameStats.water += foundWater
                gameStats.food += foundFood
                inventory.push(randItem)
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went well...</h2>
                    <p>${scavenged} found ${foundWater}l of water, ${foundFood}kg of food, and a ${randItem}.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went well...</h2>
                    <p>${scavenged} found ${foundWater}l of water, ${foundFood}kg of food, and a ${randItem}.</p>
                    <p>${rested} rested.</p>`                      
                }               
            } else if (result == 1) {
                // Bad outcome!
                let foundWater = 1
                let foundFood = 1
                gameStats.water += foundWater
                gameStats.food += foundFood
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went poorly...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went poorly...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>
                    <p>${rested} rested.</p>`                      
                }       
            } else {
                // Eh, okay outcome
                let foundWater = Math.floor(Math.random() * 2) + 2
                let foundFood = Math.floor(Math.random() * 2) + 2
                gameStats.water += foundWater
                gameStats.food += foundFood
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went okay...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went okay...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>
                    <p>${rested} rested.</p>`                      
                }      
            }
            // Recharge resting characters
            if (rested.length) {
                gameChars.forEach((char) => {
                    if (rested.includes(gameChars.name)) {
                        if (char.rest <= 5) {
                            char.rest += 5
                        } else {
                            char.rest = 10
                        }                        
                    }
                })
            }
        }
        // Regardless if all rested or all scavenged, time will pass
        if (dayTimer <= 7999) {
            dayTimer += 2000
        } else {
            let time = 10000 - dayTimer
            dayTimer = 0 + time
            dayCounter++
        }
    }

    // Handle inventory
    function openInventory() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        if (inventory.length) {
            gamePopText.innerHTML = `
            <h2>Inventory</h2>
            <p>You have ${gameStats.food}kg of food</p>
            <p>You have ${gameStats.water}l of water</p>
            <p>You also have ${inventory}</p>
            `            
        } else {
            gamePopText.innerHTML = `
            <h2>Inventory</h2>
            <p>You have ${gameStats.food}kg of food</p>
            <p>You have ${gameStats.water}l of water</p>
            <p>You have no other items.</p>
            `          
        }
        closePopBtn.addEventListener("click", () => {
            gamePopText.innerHTML = ""
            gameStats.gamePaused = false
            gamePopUp.style.display="none"
        })
    }

    // Display stats
    function openStats() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        gamePopText.insertAdjacentHTML("afterbegin", "<h2>Status</h2>")

        gameChars.forEach((char) => {
            if (!char.status.length && !char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is fine.</p>`)
            } else if (!char.status.length && char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} has ${char.injury}.</p>`)
            } else if (char.status.length && !char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is ${char.status}.</p>`)
            } else {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is ${char.status} and has ${char.injury}.</p>`)
            }
        })
        closePopBtn.addEventListener("click", () => {
            gameStats.gamePaused = false
            gamePopText.innerHTML = ""
            gamePopUp.style.display="none"
        })
    }

    // Check for end conditions...
    function checkEnd() {
        if (dayCounter > 1) {
            if (kmsToGo <= 0) {
                gameStats.gameOver = true
                document.querySelector("#km-count").innerHTML = 100 - kmsToGo
                document.querySelector("#day-count").innerHTML = dayCounter
                document.querySelector("#outcome").innerHTML = "And made it to your destination."
                document.querySelector("#game-over").style.display="block"
            }
            if (!gameChars.length) {
                gameStats.gameOver = true
                document.querySelector("#km-count").innerHTML = 100 - kmsToGo
                document.querySelector("#day-count").innerHTML = dayCounter
                document.querySelector("#outcome").innerHTML = "But you didn't make it..."
                document.querySelector("#game-over").style.display="block"
            }            
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
        handleBgTrees(deltaTime)
        ground.draw(ctx)
        ground.update()
        handleCharacters(ctx, deltaTime)
        handleFgTrees(deltaTime)
        if (gameStats.weather == 'Rain') {
            sky.draw(ctx)
            sky.update()    
        }
        if (!gameStats.gamePaused) {
            manageDays()
        }
        checkEnd()
        if (!gameStats.gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", () => {
        runGame()
        createCharPop.style.display="block"
    })
    resetBtn.addEventListener("click", () => {
        location.reload() 
    })

})