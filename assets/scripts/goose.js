window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const gunImg = new Image()
    gunImg.src = "../assets/images/goose/gun.png"
    const gooseImg = new Image()
    gooseImg.src = "../assets/images/goose/goose.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/goose/background.png"
    const grassImg = new Image()
    grassImg.src = "../assets/images/goose/grass.png"
    const movingGrassImg = new Image()
    movingGrassImg.src = "../assets/images/goose/movinggrass.png"
    const treeImg = new Image()
    treeImg.src = "../assets/images/goose/trees.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let gooseArray = []
    let bulletArray = []
    let gooseTimer = 0
    let bulletTimer = 0
    let gooseInterval = 3000
    let bulletInterval = 0
    let randomGooseInterval = Math.random() * 1000 + 1000
    let lastTime = 0
    let gameOver = false

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

    class Foreground {
        constructor(spawnX, spawnY, fgImg, imgX, imgWidth, imgHeight) {
            this.img = fgImg
            this.x = spawnX
            this.y = spawnY
            this.frameX = imgX
            this.width = imgWidth
            this.height = imgHeight
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
    }

    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize * 2
            this.x = 144
            this.y = gameHeight - this.height
            this.img = gunImg
            this.frameX = 64
            this.frameY = 0
            this.facing = "up"
            this.shooting = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            if (input == "KeyD" && this.frameX <= 128) {
                this.frameX += 32
            } else if (input == "KeyA" && this.frameX >= 0) {
                this.frameX -= 32
            }
            switch (this.frameX) {
                case 0:
                    this.facing = "left"
                    break
                case 32:
                    this.facing = "left-up"
                    break
                case 64:
                    this.facing = "up"
                    break
                case 96:
                    this.facing = "right-up"
                    break
                case 128:
                    this.facing = "right"
                    break
            }
        }
        shoot(input) {
            let bulletX = 159
            let bulletY = 228
            let speedY = -2
            let speedX = 0
            if (input == "Space") {
                this.shooting = true
                switch (this.frameX) {
                    case 0:
                        bulletX = 124
                        speedX = -1.8
                        break
                    case 32:
                        bulletX = 142
                        speedX = -0.9
                        this.facing = "left-up"
                        break
                    case 96:
                        bulletX = 176
                        speedX = 0.9
                        this.facing = "right-up"
                        break
                    case 128:
                        bulletX = 190
                        speedX = 1.8
                        this.facing = "right"
                        break
                }
            }
            handleBullets(bulletX, bulletY, speedX, speedY)
        }
    }

    const handleInputs = (e) => {
        let input = e.code
        console.log(input)
        if (input == "KeyD" || input == "KeyA") {
            player.update(input)
        } else if (input == "Space") {
            player.shoot(input)
        }
    }

    class Bullet {
        constructor(bulletX, bulletY, speedX, speedY) {
            this.x = bulletX
            this.y = bulletY
            this.speedX = speedX
            this.speedY = speedY
            this.width = 2
            this.height = 2
            this.color = "black"
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.fillStyle = this.color
                context.fillRect(this.x, this.y, this.width, this.height)
            }
        }
        update() {
            this.x += this.speedX
            this.y += this.speedY
            if (this.x < 0 || this.y < 0 || this.x > gameWidth || this.y > gameHeight) {
                this.markedForDelection = true
            }
        }
    }

    const handleBullets = (bulletX, bulletY, speedX, speedY) => {
        if (bulletInterval <= 0 && player.shooting) {
            bulletArray.push(new Bullet(bulletX, bulletY, speedX, speedY))
            bulletInterval += 100
            player.shooting = false
        } else if (bulletInterval > 0) {
            bulletInterval--
            player.shooting = false
        } else {
            bulletInterval = 0
            player.shooting = false
        }

        bulletArray.forEach(bullet => {
            bullet.draw(ctx)
            bullet.update()
        })

        bulletArray = bulletArray.filter(bullet => !bullet.markedForDelection)
    }

    class Goose {
        constructor(spawnX, imgY, movingTo) {
            this.width = tileSize
            this.height = tileSize
            this.x = spawnX
            this.y = 224
            this.img = gooseImg
            this.frameX = 0
            this.frameY = imgY
            this.fps = 10
            this.frameCount = 1
            this.frameTimer = 0
            this.frameInterval = 2000/this.fps
            this.speed = 0.2
            this.direction = movingTo
            this.shot = false
            this.markedforDeletion = false
        }
        draw(context) {
            if (!this.markedforDeletion) {
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
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

            // Moving
            if (!this.shot) {
                if (this.direction == "right") {
                    this.x += this.speed
                    this.y -= this.speed
                } else if (this.direction == "left") {
                    this.x -= this.speed
                    this.y -= this.speed
                } else {
                    this.y -= this.speed
                }                
            } else {
                this.frameY = 96
                this.y += this.speed
            }
            // Delete the goose
            if (this.y > gameHeight) {
                this.markedforDeletion = true
            }
        }
    }

    const handleGeese = (deltaTime) => {
        let spawnX = 0
        let imgY = 0
        let movingTo = ""
        if (gooseTimer > gooseInterval + randomGooseInterval) {
            spawnX = Math.floor(Math.random() * 9) * 32
            if (spawnX < 96) {
                imgY = 32
                movingTo = "right"
            } else if (spawnX > 192) {
                imgY = 64
                movingTo = "left"
            } else {
                imgY = 0
                movingTo = "up"
            }
            const newGoose = new Goose(spawnX, imgY, movingTo)
            gooseArray.push(newGoose)
            randomGooseInterval = Math.random() * 4000 + 2500
            gooseTimer = 0
        } else {
            gooseTimer += deltaTime
        }
        gooseArray.forEach(goose => {
            goose.draw(ctx)
            goose.update(deltaTime)
        })
        gooseArray = gooseArray.filter(goose => !goose.markedforDeletion)
    }

    const background = new Background()
    const leftTree = new Foreground(0, 32, treeImg, 0, 64, 192)
    const rightTree = new Foreground(gameWidth - 64, 32, treeImg, 64, 64, 192)
    const grass = new Foreground(0, gameHeight - 128, grassImg, 0, gameWidth, 128)
    const player = new Player()

    const startGame = () => {
        startBtn.removeEventListener("click", startGame)
        window.addEventListener("keydown", handleInputs)
        runGame(0)
    }

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        handleGeese(deltaTime)
        leftTree.draw(ctx)
        rightTree.draw(ctx)
        grass.draw(ctx)
        player.draw(ctx)
        player.update()
        handleBullets()

        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})