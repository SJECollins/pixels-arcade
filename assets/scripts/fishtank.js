window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const bgImg = new Image()
    bgImg.src = "../assets/images/fishtank/background.png"
    const fishImg = new Image()
    fishImg.src = "../assets/images/fishtank/fish.png"
    const snailImg = new Image()
    snailImg.src = "../assets/images/fishtank/snail.png"
    const smallTankImg = new Image()
    smallTankImg.src = "../assets/images/fishtank/small.png"
    const mediumTankImg = new Image()
    mediumTankImg.src = "../assets/images/fishtank/medium.png"
    const largeTankImg = new Image()
    largeTankImg.src = "../assets/images/fishtank/large.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let fishArray = []
    let snailArray = []
    let tank = {}
    let lastTime = 0
    
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

    class Tank {
        constructor(tankImg, tankX, tankY, tankW, tankH) {
            this.img = tankImg
            this.x = tankX
            this.y = tankY
            this.width = tankW
            this.height = tankH
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    const addTank = (size) => {
        switch (size) {
            case "small":
                tank = new Tank(smallTankImg, 112, 144, 96, 80);
                break;
            case "medium":
                tank = new Tank(mediumTankImg, 48, 128, 160, 96);
                break;
            case "large":
                tank = new Tank(largeTankImg, 32, 112, 256, 112);
                break;
        }
    }

    class Fish {
        constructor(startX, startY, fishY, startMoveX, startMoveY) {
            this.img = fishImg
            this.x = startX
            this.y = startY
            this.width = tileSize
            this.height = tileSize
            this.frameX = 0
            this.frameY = fishY
            this.flipTimer = 0
            this.flipInterval = Math.random() * 4000 + 4000
            this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
            this.moveX = startMoveX
            this.moveY = startMoveY
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            this.x += this.moveX
            this.y += this.moveY
            if (this.flipTimer > this.frameInterval) {
                this.frameX = this.frameX == 0 ? 1 : 0
                this.flipInterval = Math.random() * 4000 + 4000
            } else if (this.x <= tank.x) {
                this.moveX = this.moveSpeed
                this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
                this.frameX = 1
            } else if (this.x + this.width >= tank.x + tank.width) {
                this.moveX = -this.moveSpeed
                this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
                this.frameX = 0
            } else {
                this.flipTimer += deltaTime
            }
            if (this.y <= tank.y) {
                this.moveY = this.moveSpeed
                this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
            } else if (this.y + this.height >= tank.y + tank.height) {
                this.moveY = -this.moveSpeed
                this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
            }
        }
    }

    const addFish = (fish) => {
        let frameY = fish
        let randomStartX = Math.floor(Math.random() * (160 - 128 + 1)) + 128
        let randomStartY = Math.floor(Math.random() * (192 - 160 + 1)) + 160
        let startMoveX = Math.floor(Math.random() * 5 + 1) / 10
        let startMoveY = Math.floor(Math.random() * 5 + 1) / 10
        let newFish = new Fish(randomStartX, randomStartY, frameY, startMoveX, startMoveY)
        fishArray.push(newFish)
    }

    const handleFish = (deltaTime) => {
        fishArray.forEach(fish => {
            fish.draw(ctx)
            fish.update(deltaTime)
        })
    }

    const startGame = () => {
        addTank("small")
        addFish(32)
        runGame(0)

    }

    const background = new Background()

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        handleFish(deltaTime)
        tank.draw(ctx)

        requestAnimationFrame(runGame)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})