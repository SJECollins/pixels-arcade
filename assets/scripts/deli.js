window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")

    const canvas = document.getElementById("canvas")
    const ctx = document.getContext("2d")


    // Images


    // Variables
    const gameWidth = 320
    const gameHeight = 28
    const tileSize = 32
    
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
            this.img = ""
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
        constructor(ingredientImg) {
            this.img = ingredientImg
            this.x = positionX
            this.y = positionY
            this.width = tileSize
            this.height = tileSize
            this.ingredientArray = []
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        action() {

        }
    }
    
    
    const handleIngredients = () => {

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
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)

        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }
    
    const startGame = () => {
        animate(0)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})