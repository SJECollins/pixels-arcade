const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const playerImg = new Image()
playerImg.src = "../assets/images/pirate/player.png"
const shipImg = new Image()
shipImg.src = "../assets/images/pirate/ship.png"
const compassImg = new Image()
compassImg.src = "../assets/images/pirate/compass.png"
const arrowImg = new Image()
arrowImg.src = "../assets/images/pirate/arrow.png"
const bgImg = new Image()
bgImg.src = "../assets/images/pirate/sea.png"

const gameWidth = 320
const gameHeight = 320
const tileSize = 32
let enemyTimer = 0
let enemyInterval = Math.random() * 10000 + 5000
let wind = {}
let playerShip = {}
let enemyShips = []
let playerBalls = []
let enemyBalls = []
let lastTime = 0

class Background {
    constructor() {
        this.img = bgImg
        this.x = 0
        this.y = 0
        this.width = gameWidth
        this.height = gameHeight
        this.speed = 0.5
        this.windDirection = 0
    }
    draw(context) {
        context.drawImage(this.img, this.x, this.y, this.width, this.height)
        
        if (this.x < 0 && this.y < 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y + this.height - 1, this.width, this.height);
        } else if (this.x < 0 && this.y > 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y - this.height + 1, this.width, this.height);
        } else if (this.x > 0 && this.y < 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y + this.height - 1, this.width, this.height);
        } else if (this.x > 0 && this.y > 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y - this.height + 1, this.width, this.height);
        }
    
        if (this.x < 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y, this.width, this.height);
        } else if (this.x > 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y, this.width, this.height);
        }
    
        if (this.y < 0) {
            context.drawImage(this.img, this.x, this.y + this.height - 1, this.width, this.height);
        } else if (this.y > 0) {
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height);
        }
    
        if (this.x + this.width < this.width) {
            context.drawImage(this.img, this.x + this.width - 1, this.y, this.width, this.height);
        } else if (this.x + this.width > this.width) {
            context.drawImage(this.img, this.x - this.width + 1, this.y, this.width, this.height);
        }
    
        if (this.y + this.height < this.height) {
            context.drawImage(this.img, this.x, this.y + this.height - 1, this.width, this.height);
        } else if (this.y + this.height > this.height) {
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height);
        }
    }
    update(player, wind) {
        if (player.sails > 0) {
            let speed = this.speed * player.sails
            let playerFacingRadians = player.angle

            let windDirectionObject = wind.directions.find(obj => Object.keys(obj)[0] === wind.direction)
            let windDirectionRadians = windDirectionObject ? Object.values(windDirectionObject)[0] : 0

            let angleDifference = playerFacingRadians - windDirectionRadians
    
            if (angleDifference > Math.PI) {
                angleDifference -= 2 * Math.PI
            } else if (angleDifference < -Math.PI) {
                angleDifference += 2 * Math.PI
            }

            let thresholdAngle = Math.PI / 4

            if (Math.abs(angleDifference) < thresholdAngle) {
                let backgroundMovementRadians = playerFacingRadians + Math.PI / 2
                let dx = speed * Math.cos(backgroundMovementRadians)
                let dy = speed * Math.sin(backgroundMovementRadians)

                this.x += dx
                this.y += dy

                if (this.x > this.width) {
                    this.x -= this.width
                } else if (this.x < -this.width) {
                    this.x += this.width
                }

                if (this.y > this.height) {
                    this.y -= this.height
                } else if (this.y < -this.height) {
                    this.y += this.height
                }
            }
        }
    }               
}

class Player {
    constructor() {
        this.img = playerImg
        this.x = gameWidth / 2
        this.y = gameHeight / 2
        this.width = tileSize * 2
        this.frameX = 0
        this.speed = 0
        this.sails = 0
        this.angle = 0
        this.sailsChangeTimer = 0
        this.sailsChangeInterval = 1000
        this.cannonTimer = 0
        this.cannonInterval = 1000
        this.health = 100
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(gameWidth / 2, gameHeight / 2)
        ctx.rotate(this.angle)
        ctx.drawImage(this.img, this.frameX, 0, this.width, this.width, -this.width / 2, -this.width / 2, this.width, this.width)
        ctx.restore()
    }
    update(deltaTime) {
        if (input.keys.includes("KeyA")) {
            this.angle -= Math.PI / 180
        }
        if (input.keys.includes("KeyD")) {
            this.angle += Math.PI / 180
        }

        if (this.sailsChangeTimer > this.sailsChangeInterval) {
            if (input.keys.includes("KeyS") && this.sails > 0) {
                this.sails--
                this.frameX -= 64
                this.sailsChangeTimer = 0
            }
            if (input.keys.includes("KeyW") && this.sails < 2) {
                this.sails++
                this.frameX += 64
                this.sailsChangeTimer = 0
            }            
        } else {
            this.sailsChangeTimer += deltaTime
        }

        if (this.cannonTimer > this.cannonInterval) {
            if (input.keys.includes("KeyE")) {
                fireCannon(this, "right")
            }
            if (input.keys.includes("KeyQ")) {
                fireCannon(this, "left")
            }
            this.cannonTimer = 0
        } else {
            this.cannonTimer += deltaTime
        }
    }
}

class EnemyShip {
    constructor(posX, posY) {
        this.img = shipImg
        this.x = posX
        this.y = posY
        this.width = tileSize * 2
        this.frameX = 0
        this.speed = 0
        this.sails = 0
        this.angle = 0
        this.sailsChangeTimer = 0
        this.sailsChangeInterval = 1000
        this.cannonTimer = 0
        this.cannonInterval = 1000
        this.health = 100
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(gameWidth / 2, gameHeight / 2)
        ctx.rotate(this.angle)
        ctx.drawImage(this.img, this.frameX, 0, this.width, this.width, -this.width / 2, -this.width / 2, this.width, this.width)
        ctx.restore()
    }
    update() {}
}

class Wind {
    constructor() {
        this.compass = compassImg
        this.arrow = arrowImg
        this.width = tileSize
        this.x = gameWidth - tileSize
        this.y = 0
        this.changeDirectionTimer = 0
        this.changeDirectionInterval = Math.random() * 10000 + 10000
        this.directions = [{"N": 0}, {"NE": Math.PI/4}, 
            {"E": Math.PI/2}, {"SE": 3*Math.PI/4}, {"S": Math.PI}, 
            {"SW": -3*Math.PI/4}, {"W": -Math.PI/2}, {"NW": -Math.PI/4}]
        this.direction = "N"
    }
    draw(ctx) {
        ctx.drawImage(this.compass, this.x, this.y)
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2)
        let directionObj = this.directions.find(obj => Object.keys(obj)[0] === this.direction)
        let angle = directionObj ? Object.values(directionObj)[0] : 0
        ctx.rotate(angle)
        ctx.drawImage(this.arrow, -this.width / 2, -this.width / 2)
        ctx.rotate(-angle)
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.width / 2))
    }
    update(deltaTime) {
        if (this.changeDirectionTimer > this.changeDirectionInterval) {
            let randomDirection = this.directions[Math.floor(Math.random() * this.directions.length)]
            this.direction = Object.keys(randomDirection)[0]
            this.changeDirectionTimer = 0
            this.changeDirectionInterval = Math.random() * 10000 + 10000
        } else {
            this.changeDirectionTimer += deltaTime
        }
    }
}

class CannonBall {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = 1
        this.radius = 2
        this.color = "black"
        this.dx = Math.cos(this.angle) * this.speed
        this.dy = Math.sin(this.angle) * this.speed
        this.markedForDeletion = false
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    move() {
        this.x += this.dx
        this.y += this.dy

        if (this.x > gameWidth || this.x < 0 || this.y > gameHeight || this.y < 0) {
            this.markForDeletion = true
        }
    }
}

class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener("keydown", (e) => {
            if ((e.code == "KeyW" ||
                 e.code == "KeyD" ||
                 e.code == "KeyS" ||
                 e.code == "KeyA" ||
                 e.code == "KeyE" ||
                 e.code == "KeyQ")
                 && this.keys.indexOf(e.code) === -1) {
                    this.keys.push(e.code)
                 }
        })
        window.addEventListener("keyup", (e) => {
            if (e.code == "KeyW" ||
                e.code == "KeyD" ||
                e.code == "KeyS" ||
                e.code == "KeyA" ||
                e.code == "KeyE" ||
                e.code == "KeyQ") {
                this.keys.splice(this.keys.indexOf(e.code), 1)
                }
        })
    }
}

const fireCannon = (ship, direction) => {
    const ballOffset = (direction == "left") ? -20 : 20
    const ballPositions = [-8, 4, 16]
    const angleAdjusted = (direction == "left") ? Math.PI : 0

    for (let i = 0; i < ballPositions.length; i++) {
        const cannonX = ship.x + ballOffset * Math.cos(ship.angle) - ballPositions[i] * Math.sin(ship.angle)
        const cannonY = ship.y + ballOffset * Math.sin(ship.angle) + ballPositions[i] * Math.cos(ship.angle)
        
        const firingAngle = ship.angle + angleAdjusted
        
        const cannonBall = new CannonBall(cannonX, cannonY, firingAngle)
        if (ship == playerShip) {
            playerBalls.push(cannonBall)
        } else {
            enemyBalls.push(cannonBall)
        }
    }
}

const handleBalls = (ctx) => {
    playerBalls.forEach(ball => {
        ball.draw(ctx)
        ball.move()
    })
    playerBalls = playerBalls.filter(ball => !ball.markedForDeletion)
    enemyBalls.forEach(ball => {
        ball.draw(ctx)
        ball.move()
    })
    enemyBalls = enemyBalls.filter(ball => !ball.markedForDeletion)
}

const handleEnemies = (deltaTime) => {
    let spawnX = 0
    let spawnY = 0
    if (enemyTimer > enemyInterval) {
        let spawn = Math.random() < 0.5 ? "x" : "y"
        let position = Math.random() < 0.5 ? 0 : 320
        if (spawn == "x") {
            spawnX = position
            spawnY = Math.floor(Math.random() * 320)
            enemyShips.push(new EnemyShip(spawnX, spawnY))
        } else {
            spawnY = position
            spawnX = Math.floor(Math.random() * 320)
            enemyShips.push(new EnemyShip(spawnX, spawnY))
        }
        enemyInterval = Math.random() * 10000 + 5000
        enemyTimer = 0
    } else {
        enemyTimer += deltaTime
    }

    enemyShips.forEach(ship => {
        ship.draw(ctx)
        ship.update(deltaTime)
    })
    enemyShips = enemyShips.filter(ship => !ship.markedForDeletion)
}

const startGame = () => {
    // Spawn the map and player boat
    wind = new Wind()
    playerShip = new Player()
    startBtn.removeEventListener("click", startGame)
    runGame(0)
}

const input = new InputHandler()
const background = new Background()

const runGame = (timeStamp) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, gameWidth, gameWidth)
    // draw and update stuff
    background.draw(ctx)
    background.update(playerShip, wind)
    wind.draw(ctx)
    wind.update(deltaTime)

    playerShip.draw(ctx)
    playerShip.update(deltaTime)

    handleBalls(ctx)
    requestAnimationFrame(runGame)
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})