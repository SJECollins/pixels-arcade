window.addEventListener("load", function() {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")
    
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Images
    const playerImg = new Image()
    playerImg.src = "../assets/images/stockboy/stockboy.png"
    const playerInteractingImg = new Image()
    playerInteractingImg.src = "../assets/images/stockboy/stockboyinteracting.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/stockboy/floor.png"
    const shelfImg = new Image()
    shelfImg.src = "../assets/images/stockboy/shelf.png"
    const customerImg = new Image()
    customerImg.src = "../assets/images/stockboy/customer.png"
    const spillImg = new Image()
    spillImg.src = "../assets/images/stockboy/spill.png"
    const exclamationImg = new Image()
    exclamationImg.src = "../assets/images/stockboy/exclamation.png"

    // Variables
    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 16
    let time = 0
    let score = 0
    let customers = []
    let maxCustomers = 0
    let currentCustomers = 0
    let customerTimer = 0
    let customerInterval = 1000
    let randomCustomerInterval = Math.random() * 1000 + 1000
    let spawned = 0
    let spills = []
    let maxSpills = 0
    let currentSpills = 0
    let shelves = []
    let maxShelves = 0
    let lastTime = 0
    let gameOver = false

    // Background class
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

    // Player class
    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize * 2
            this.x = 300
            this.y = 124
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.moveX = 0
            this.moveY = 0
            this.moving = false
            this.interactingTime = 240
            this.interacting = false
        }
        draw(context, deltaTime) {
            if (!this.interacting) {
                this.img = playerImg
            } else {
                this.img = playerInteractingImg
            }
            // Update frames
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                if (this.moving || this.interacting) {
                    this.frameTimer += deltaTime
                } else {
                    this.frameX = 0
                }
            }
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            // Move player and update frameY
            this.x += this.moveX
            this.y += this.moveY
            if (!this.interacting) {
                if (input.keys.indexOf("KeyD") > -1 || input.keys.indexOf("right") > -1) {
                    this.moveX = 1
                    this.frameY = 64
                    this.moving = true
                    if (this.x == 304) {
                        this.moveX = 0
                        this.moving = false
                    }
                } else if (input.keys.indexOf("KeyA") > -1 || input.keys.indexOf("left") > -1) {
                    this.moveX = -1
                    this.frameY = 96
                    this.moving = true
                    if (this.x == 0) {
                        this.moveX = 0
                        this.moving = false
                    }
                } else if (input.keys.indexOf("KeyW") > -1 || input.keys.indexOf("up") > -1) {
                    this.moveY = -1
                    this.frameY = 32
                    this.moving = true
                    if (this.y == 0) {
                        this.moveY = 0
                        this.moving = false
                    }
                } else if (input.keys.indexOf("KeyS") > -1 || input.keys.indexOf("down") > -1) {
                    this.moveY = 1
                    this.frameY = 0
                    this.moving = true
                    if (this.y == 256) {
                        this.moveY = 0
                        this.moving = false
                    }
                } else {
                    this.moveX = 0
                    this.moveY = 0
                    this.moving = false
                }                
            }
        }
        interact(input) {
            if (input.keys.indexOf("KeyE") > -1 || input.keys.indexOf("interact") > -1) {
                this.frameCount = 1
                this.interacting = true
                setTimeout(() => {
                    this.interacting = false
                    this.frameCount = 3
                }, 3000)                
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
                     e.code == "KeyE")
                     && this.keys.indexOf(e.code) === -1) {
                        this.keys.push(e.code)
                     }
            })
            window.addEventListener("mousedown", (e) => {
                if ((e.target.id == "left"||
                     e.target.id == "up" ||
                     e.target.id == "down" ||
                     e.target.id == "right" ||
                     e.target.id == "interact")
                     && this.keys.indexOf(e.target.id) === -1) {
                        this.keys.push(e.target.id)
                     }
            })
            window.addEventListener("keyup", (e) => {
                if (e.code == "KeyW" ||
                    e.code == "KeyD" ||
                    e.code == "KeyS" ||
                    e.code == "KeyA" ||
                    e.code == "KeyE") {
                    this.keys.splice(this.keys.indexOf(e.code), 1)
                    }
            })
            window.addEventListener("mouseup", (e) => {
                if (e.target.id == "left"||
                    e.target.id == "up" ||
                    e.target.id == "down" ||
                    e.target.id == "right" ||
                    e.target.id == "interact") {
                    this.keys.splice(this.keys.indexOf(e.target.id), 1)
                    }
            })            
        }
    }

    // Customers
    class Customer {
        constructor(spawnY) {
            this.width = tileSize
            this.height = tileSize
            this.x = 0
            this.y = spawnY
            this.img = customerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 10
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.speed = 0.25
            this.turn = false
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update() {
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
        }
    }

    // Handle customers
    function handleCustomers() {
        let spawnY = 0
    }

    // Shelf class
    class Shelf {
        constructor() {
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.x = spawnX
            this.y = spawnY
            this.img = shelfImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 2
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.health = 2
        }
    }

    function handleShelves() {
        let spawnX = 0
        let spawnY = 0
    }

    // Spill class
    class Spill {
        constructor(spawnX, spawnY) {
            this.img = spillImg
            this.x = spawnX
            this.y = spawnY
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.x, this.y, this.width, this.height)
            }
        }
    }

    // Handle spills
    function handleSpills() {
        let spawnX = 0
        let spawnY = 0
    }

    // Exclamation class
    class Exclamation {
        constructor(spawnX, spawnY) {
            this.img = exclamationImg
            this.x = spawnX
            this.y = spawnY
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 1
            this.fps = 10
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.x, this.y, this.width, this.height)
            }
        }
        update() {
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
        }
    }

    // Handle exclamations
    function handleExclamations() {
        let spawnX = 0
        let spawnY = 0
    }


    // Starting classes
    const background = new Background()
    const player = new Player()
    const input = new InputHandler()

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        player.draw(ctx, deltaTime)
        player.update(input)
        player.interact(input)
        

        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }

    function startGame() {
        animate(0)
        startBtn.removeEventListener("click", startGame)
    }

    startBtn.addEventListener("click", startGame)
    reset.addEventListener("click", () => {
        location.reload()
    })
})