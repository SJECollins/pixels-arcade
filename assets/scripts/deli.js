window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")


    // Images
    const backgroundImg = new Image()
    backgroundImg.src = "../assets/images/deli/counter.png"
    const tinImg = new Image()
    tinImg.src = "../assets/images/deli/tins.png"
    const brownImg = new Image()
    brownImg.src = "../assets/images/deli/brownsauce.png"
    const mayoImg = new Image()
    mayoImg.src = "../assets/images/deli/mayo.png"
    const butterImg = new Image()
    butterImg.src = "../assets/images/deli/butter.png"
    const ticketImg = new Image()
    ticketImg.src = "../assets/images/deli/ticket.png"
    const bellImg = new Image()
    bellImg.src = "../assets/images/deli/bell.png"


    // Variables
    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 48

    let ingredientArray = []
    
    let ticketNumber = 0
    let ticketTimer = 0
    let ticketInterval = 5000
    let randomTicketInterval = Math.random() * 1000 + 10000
    let ticketArray = []

    let currentSandwich = []

    let time = 0
    let score = 0
    let lastTime = 0
    let gameOver = false

    // Background
    class Background {
        constructor() {
            this.img = backgroundImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    // Ingredients
    class Ingredient {
        constructor(ingredientImg, positionX, positionY, imgX, name) {
            this.img = ingredientImg
            this.x = positionX
            this.y = positionY
            this.width = tileSize
            this.height = tileSize
            this.frameX = imgX
            this.frameY = 0
            this.name = name
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        action() {

        }
    }
    
    const spawnIngredients = () => {
        let startXPosition = [16, 64, 112, 160, 208, 256]
        let tinArray = ["chicken", "cheese", "lettuce", "onion", "pepper", "tomato"]
        for (let i = startXPosition.length - 1; i >= 0; i--) {
            let posX = startXPosition.splice(Math.floor(Math.random() * startXPosition.length), 1)
            let name = tinArray[i]
            console.log(name)
            let image = tinImg
            let imgX = 240 - (i * 48)
            console.log(imgX)
            ingredientArray.push(new Ingredient(image, posX, 96, imgX, name))
        }
        ingredientArray.push(new Ingredient(brownImg, 16, 144, 0, "brown sauce"))
        ingredientArray.push(new Ingredient(mayoImg, 64, 144, 0, "mayo"))
        ingredientArray.push(new Ingredient(butterImg, 16, 192, 0, "butter"))
    }
    
    const handleIngredients = () => {
        ingredientArray.forEach(ingredient => {
            ingredient.draw(ctx)
        })
    }


    // Tickets - create a ticket 
    class Ticket {
        constructor() {
            this.img = ticketImg
            this.x = positionX
            this.y = 32
            this.width = tileSize
            this.height = tileSize
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        update() {

        }
    }

    const handleTickets = () => {

    }

    // The sandwich
    class Sandwich {
        constructor() {
            this.imgArray = []
            this.ingredientArray = []
        }
    }

    const handleSandwiches = () => {
        
    }


    const background = new Background()

    const animate = (timeStamp) => {
        console.log("animating")
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        handleIngredients()

        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }
    
    const startGame = () => {
        spawnIngredients()
        animate(0)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})