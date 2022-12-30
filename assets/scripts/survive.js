window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const startBtn = document.getElementById("start")
    const reset = document.getElementById("reset")
    const currentWave = document.getElementById("wave")
    const scoreDisplay = document.getElementById("score")
    const openInstructions = document.getElementById("instructions")
    const closeInstructions = document.getElementById("close-pop-up")
    const endWave = document.getElementById("wave-count")
    const endResult = document.getElementById("result")

    const playerImg = new Image()
    playerImg.src = "../assets/images/survive/player.png"
    const zombieImg = new Image()
    zombieImg.src = "../assets/images/survive/zombie.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/survive/background.png"
    const fogImg = new Image()
    fogImg.src = "../assets/images/survive/fog.png"

    const gameWidth = 320
    const gameHeight = 320
    const tileSize = 32
    let wave = 0
    let score = 0
    let zombies = []
    let bullets = []
    let lastTime = 0
    let bulletInterval = 0
    let maxZombies = 10
    let zombieTimer = 0
    let zombieInterval = 1000
    let randomZombieInterval = Math.random() * 1000 + 1000 
    let gameOver = false

    // Player class
    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 144
            this.y = 144
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.moveX = 0
            this.moveY = 0
            this.rotate = 0
        }
        draw(context, deltaTime, zombies) {
            zombies.forEach(zombie => {
                const distanceX = zombie.x - this.x
                const distanceY = zombie.y - this.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < zombie.width / 3 + this.width / 3) {
                    gameOver = true
                }
            })
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
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            this.x += this.moveX
            this.y += this.moveY
            if (input.keys.indexOf("KeyD") > -1) {
                this.moveX = 1
                this.frameY = 32
            } else if (input.keys.indexOf("KeyA") > -1) {
                this.moveX = -1
                this.frameY = 64
            } else if (input.keys.indexOf("KeyW") > -1) {
                this.moveY = -1
                this.frameY = 96
            } else if (input.keys.indexOf("KeyS") > -1) {
                this.moveY = 1
                this.frameY = 0
            } else {
                this.moveX = 0
                this.moveY = 0
            }
        }
        shoot(input, deltaTime, handleBullets) {
            let bulletX = 0
            let bulletY = 0
            let speedX = 0
            let speedY = 0
            if (input.keys.indexOf("Space") > -1) {
                const delay = 2000
                const damage = 5
                if (this.frameY == 0) {
                    speedY = -2
                    bulletX = this.x + this.width / 2
                    bulletY = this.y + this.width
                } else if (this.frameY == 32) {
                    speedX = -2
                    bulletX = this.x
                    bulletY = this.y + this.width / 2
                } else if (this.frameY == 64) {
                    speedX = +2
                    bulletX = this.x + this.width
                    bulletY = this.y + this.width / 2
                } else {
                    speedY = -2
                    bulletX = this.x + this.width / 2
                    bulletY = this.y
                }
                handleBullets(bulletX, bulletY, speedX, speedY, delay, damage, deltaTime)
            }
        }
    }

    // Handle inputs
    class InputHandler {
        constructor() {
            this.keys = []
            window.addEventListener("keydown", (e) => {
                if ((e.code == "KeyW" ||
                     e.code == "KeyD" ||
                     e.code == "KeyS" ||
                     e.code == "KeyA" ||
                     e.code == "Space")
                     && this.keys.indexOf(e.code) === -1) {
                        this.keys.push(e.code)
                     }
            })
            window.addEventListener("keyup", (e) => {
                if (e.code == "KeyW" ||
                    e.code == "KeyD" ||
                    e.code == "KeyS" ||
                    e.code == "KeyA" ||
                    e.code == "Space") {
                    this.keys.splice(this.keys.indexOf(e.code), 1)
                    }
            })    
        }
    }

    // Handle bullets
    class Bullet {
        constructor(bulletX, bulletY, speedX, speedY, damage) {
            this.gameWidth = gameWidth
            this.x = bulletX
            this.y = bulletY
            this.speedX = speedX
            this.speedY = speedY
            this.damage = damage
            this.width = 2
            this.height = 4
            this.color = "white"
            this.markedForDeletion = false
        }
        draw(ctx) {
            if (!this.markedForDeletion) {
                ctx.fillStyle = this.color
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
        }
        update() {
            this.x += this.speedX
            this.y += this.speedY
            // if (this.x < 0 - this.gameWidth || this.y < 0 - this.gameWidth) {
            //     this.markedForDeletion = true
            // }
        }
    }

    function handleBullets(bulletX, bulletY, speedX, speedY, delay, damage, deltaTime) {
        console.log("Is being called")
        if (bulletInterval <= 0) {
            console.log("new bullet")
            bullets.push(new Bullet(bulletX, bulletY, speedX, speedY, damage))
            bulletInterval += delay
        } else {
            console.log("no bullet")
        }

    }


    // Background - static for now
    class Background {
        constructor() {
            this.img = bgImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    // Enemies
    class Zombie {
        constructor(spawnX, spawnY) {
            this.width = tileSize
            this.height = tileSize
            this.x = spawnX
            this.y = spawnY
            this.img = zombieImg
            this.frameX = 0
            this.frameCount = 3
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.speed = 1
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime) {
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
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    function handleZombies(deltaTime) {
        let spawnX = 0
        let spawnY = 0
        if (maxZombies != 0) {
            if (zombieTimer > zombieInterval + randomZombieInterval) {
                let spawn = Math.random() < 0.5 ? "x" : "y"
                let position = Math.random() < 0.5 ? 0 : 288
                if (spawn == "x") {
                    spawnX = position
                    spawnY = Math.floor(Math.random() * 288)
                    zombies.push(new Zombie(spawnX, spawnY))
                } else {
                    spawnY = position
                    spawnX = Math.floor(Math.random() * 288)
                    zombies.push(new Zombie(spawnX, spawnY))
                }
                randomZombieInterval = Math.random() * 1000 + 1000
                zombieTimer = 0
                maxZombies--
            } else {
                zombieTimer += deltaTime
            }
        }
        zombies.forEach(zombie => {
            zombie.draw(ctx)
            zombie.update(deltaTime)
        })
        zombies = zombies.filter(zombie => !zombie.markedForDeletion)
    }

    // Run game
    const background = new Background()
    const player = new Player()
    const input = new InputHandler()

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        bulletInterval -= deltaTime
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        player.draw(ctx, deltaTime, zombies)
        player.update(input)
        player.shoot(input, deltaTime, handleBullets)
        handleZombies(deltaTime)
        ctx.drawImage(fogImg, 0, 0, gameWidth, gameHeight)
        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }

    // Start Game
    function startGame() {
        animate(0)
        startBtn.removeEventListener("click", startGame)
        window.addEventListener("keydown", function(e) {
            console.log(e)
        })   
    }

    // Check wave

    startBtn.addEventListener("click", startGame)
    reset.addEventListener("click", () => {
    location.reload() 
    })
    openInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="block"
    })
    closeInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="none"
    })   
})