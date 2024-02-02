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

    class Fish {
        constructor(img) {
            this.img = img
            this.x = 0
            this.y = 0
            this.width = 32
            this.height = 32
            this.frameX = 0
            this.timer = 0
            this.timerInterval = Math.random() * 4000 + 4000
            
        }
    }

    const startGame = () => {
        runGame(0)
    }

    const background = new Background()

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)

        requestAnimationFrame(runGame)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})