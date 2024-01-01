window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")
    const selectCar = document.getElementById("select-car")
    const carDisplay = document.getElementById("car-choice")
    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const bgImg = new Image()
    bgImg.src = "../assets/images/vroom/road.png"
    const carsImg = new Image()
    carsImg.src = "../assets/images/vroom/cars.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let time = 0
    let score = 0
    let carUpArray = []
    let carDownArray = []
    let carUpTimer = 0
    let carDownTimer = 0
    let carUpInterval = 1000
    let carDownInterval = 1000
    let carUpRandomInterval = Math.random() * 1000 + 1000
    let carDownRandomInterval = Math.random() * 1000 + 1000
    let lastTime = 0
    let gameOver = false
    let velocity = 0.5
    let player = {}

    class Background {
        constructor() {
            this.img = bgImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = velocity
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height)
        }
        update() {
            this.y += this.speed
            if (this.y > this.height) {
                this.y = 0
            }
        }
    }

    class Player {
        constructor(imgX, imgY) {
            this.img = carsImg
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.x = gameHeight - tileSize * 2
            this.y = tileSize
            this.frameX = imgX
            this.frameY = imgY
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
    }

    const showCars = () => carDisplay.style.display = "block"

    const chooseCar = () => {
        startBtn.removeEventListener("click", showCars)
        let color = document.querySelector("input[name='color']:checked").value
        let type = document.querySelector("input[name='type']:checked").value

        let x = 0
        let y = (type == "sedan") ? 0 : 64
        switch (color) {
            case "red":
                x = 0;
                break;
            case "blue":
                x = 64;
                break;
            case "green":
                x = 128;
                break;
            case "purple":
                x = 192;
                break;
        }
        player = new Player(x, y)
        carDisplay.style.display = "none"
        runGame()
    }

    const background = new Background()
    // const player = new Player()

    const runGame = () => {
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        background.update()
        player.draw(ctx)
        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    selectCar.addEventListener("click", chooseCar)
    startBtn.addEventListener("click", showCars)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})