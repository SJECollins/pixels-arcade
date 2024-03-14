const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const gameWidth = 320
const gameHeight = 320

let flock = {}
let lastTime = 0

class Flock {
    constructor(numSheep) {
        this.sheeps = []
        for (let i = 0 ; i < numSheep ; i++) {
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
        this.position = { x: posX, y: posY }
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
        this.acceleration = { x: 0, y: 0 }
        this.maxSpeed = 0.4
        this.maxForce = 0.05
        this.neighborRadius = 50
        this.avoidRadius = 20
        this.alignmentFactor = 0.5
        this.cohesionFactor = 0.05
        this.separationFactor = 2.0
        this.isStopped = false
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
    }

    update(flock) {
        this.acceleration = { x: 0, y: 0 }
        this.separation(flock)
        this.alignment(flock)
        this.cohesion(flock)

        if (!this.isStopped) {
            const speedVariationFactor = Math.random() * 0.2 + 0.9
            this.velocity.x *= speedVariationFactor
            this.velocity.y *= speedVariationFactor
        }

        const stopProbability = 0.01
        if (!this.isStopped && Math.random() < stopProbability) {
            this.isStopped = true
        }

        if (this.isStopped) {
            const startProbability = 0.1
            if (Math.random() < startProbability) {
                this.isStopped = false
                this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
            }
        }

        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x *= -1
        } else if (this.position.x > canvas.width) {
            this.position.x = canvas.width
            this.velocity.x *= -1
        }
    
        if (this.position.y < 0) {
            this.position.y = 0
            this.velocity.y *= -1
        } else if (this.position.y > canvas.height) {
            this.position.y = canvas.height
            this.velocity.y *= -1
        }
    }

    separation(flock) {
        let moveX = 0
        let moveY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.avoidRadius ** 2) {
                moveX -= distanceX
                moveY -= distanceY
                count++
            }
        }

        if (count > 0) {
            moveX /= count
            moveY /= count
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY)
            this.applyForce(moveX / magnitude, moveY / magnitude, this.separationFactor)
        }
    }

    alignment(flock) {
        let avgVelocityX = 0
        let avgVelocityY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.neighborRadius ** 2) {
                avgVelocityX += otherSheep.velocity.x
                avgVelocityY += otherSheep.velocity.y
                count++
            }
        }

        if (count > 0) {
            avgVelocityX /= count
            avgVelocityY /= count
            const magnitude = Math.sqrt(avgVelocityX * avgVelocityX + avgVelocityY * avgVelocityY)
            this.applyForce(avgVelocityX / magnitude, avgVelocityY / magnitude, this.alignmentFactor)
        }
    }

    cohesion(flock) {
        let avgPosX = 0
        let avgPosY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.neighborRadius ** 2) {
                avgPosX += otherSheep.position.x
                avgPosY += otherSheep.position.y
                count++
            }
        }

        if (count > 0) {
            avgPosX /= count
            avgPosY /= count
            const steerX = avgPosX - this.position.x
            const steerY = avgPosY - this.position.y
            const magnitude = Math.sqrt(steerX * steerX + steerY * steerY)
            this.applyForce(steerX / magnitude, steerY / magnitude, this.cohesionFactor)
        }
    }

    applyForce(forceX, forceY, factor) {
        const magnitude = Math.sqrt(forceX * forceX + forceY * forceY)
        if (magnitude > 0) {
            forceX /= magnitude
            forceY /= magnitude
            forceX *= this.maxForce * factor
            forceY *= this.maxForce * factor
            this.acceleration.x += forceX
            this.acceleration.y += forceY
        }
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
    flock = new Flock(8)
    runGame()
}

const runGame = () => {
    ctx.clearRect(0, 0, gameWidth, gameHeight)

    flock.update()
    flock.draw(ctx)

    requestAnimationFrame(runGame)
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})