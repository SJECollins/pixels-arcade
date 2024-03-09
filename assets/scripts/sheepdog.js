const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const gameWidth = 320
const gameHeight = 320

let lastTime = 0

class Flock {
    constructor(numSheep) {
        this.sheeps = []
        for (let i = 0; i < numSheep; i++) {
            const posX = Math.random() * gameWidth
            const posY = Math.random() * gameHeight
            this.sheeps.push(new Sheep(posX, posY))
        }
    }
    draw(ctx) {
        this.sheeps.forEach(sheep => sheep.draw(ctx))
    }
    update() {
        this.sheeps.forEach(sheep => sheep.update(this.sheeps))
    }
}

class Sheep {
    constructor(posX, posY) {
        this.position = {posX, posY}
        this.velocity = {x: Math.random() * 2 -1, y: Math.random() * 2 -1}
        this.acceleration = {x: 0, y: 0}
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.posX, this.position.posY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
    }
    update() {
        // What to do here?
        // How to implement boid behaviour?
    }
}

class Sheepdog {
    constructor(posX, posY) {
        this.position = {posX, posY}
        this.maxSpeed = 5
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.posX, this.position.posY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.closePath()
    }
    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
    }
    moveSheep(sheeps) {
        const influenceRadius = 20

        sheeps.forEach(sheep => {
            const distanceX = sheep.position.x - this.position.x ** 2
            const distanceY = sheep.position.y - this.position.y ** 2
            const distance = Math.sqrt(distanceX + distanceY)

            if (distance < influenceRadius) {
                const desiredVelocity = {
                    x: sheep.position.x - this.position.x,
                    y: sheep.position.y - this.position.y
                }

                const magnitude = Math.sqrt(desiredVelocity.x ** 2 + desiredVelocity.y ** 2)
                desiredVelocity.x /= magnitude
                desiredVelocity.y /= magnitude

                desiredVelocity.x *= this.maxSpeed
                desiredVelocity.y *= this.maxSpeed

                const steer = {
                    x: desiredVelocity.x - sheep.velocity.x,
                    y: desiredVelocity.y - sheep.velocity.y
                }
                sheep.acceleration.x += steer.x
                sheep.acceleration.y += steer.y
            }
        })
    }
}

const startGame = () => {
    // Create the sheep, dog and pen
}

const runGame = () => {
    ctx.clearRect(0, 0, gameWidth, gameHeight)
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})