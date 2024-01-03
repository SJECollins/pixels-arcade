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
    let gooseInterval = 1000
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

        }
        draw(context) {

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
        constructor() {

        }
        draw(context) {

        }
        update() {

        }
    }

    const handleGeese = () => {

    }

    const background = new Background()
    const leftTree = new Foreground(0, 32, treeImg, 0, 64, 192)
    const rightTree = new Foreground(gameWidth - 64, 32, treeImg, 64, 64, 192)
    const grass = new Foreground(0, gameHeight - 128, grassImg, 0, gameWidth, 128)

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)

        leftTree.draw(ctx)
        rightTree.draw(ctx)
        grass.draw(ctx)

        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", runGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})