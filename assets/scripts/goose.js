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
        shoot() {

        }
    }

    const handleInputs = () => {

    }

    class Bullet {
        constructor() {

        }
        draw(context) {

        }
        update() {

        }
    }

    const handleBullets = () => {

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
        console.log("Goose timer: ", gooseTimer)
        console.log("Goose interval: ", gooseInterval)
        console.log("Random goose interval: ", randomGooseInterval)
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
            console.log("goose spawed")
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

        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})