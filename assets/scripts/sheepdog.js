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
        this.position = { posX, posY }
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
        this.acceleration = { x: 0, y: 0 }
        this.maxSpeed = 0.5
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.posX, this.position.posY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
    }

    update(flock) {
        const alignmentDistance = 20
        const separationDistance = 20
        const cohesionDistance = 12

        const alignmentForce = this.align(flock, alignmentDistance);
        const separationForce = this.separate(flock, separationDistance);        
        const cohesionForce = this.cohesion(flock, cohesionDistance);
    
        this.acceleration.x += separationForce.x + alignmentForce.x + cohesionForce.x;
        this.acceleration.y += separationForce.y + alignmentForce.y + cohesionForce.y;
    
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
    
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
    
        this.position.posX += this.velocity.x;
        this.position.posY += this.velocity.y;
    
        this.acceleration.x = 0;
        this.acceleration.y = 0;

        if (this.position.posX < 0) {
            this.position.posX = 0
            this.velocity.x *= -1
        } else if (this.position.posX > gameWidth) {
            this.position.posX = gameWidth
            this.velocity.x *= -1
        }
    
        if (this.position.posY < 0) {
            this.position.posY = 0
            this.velocity.y *= -1
        } else if (this.position.posY > gameHeight) {
            this.position.posY = gameHeight
            this.velocity.y *= -1
        }
    }

    align(flock, alignmentDistance) {
        let totalVelX = 0;
        let totalVelY = 0;
        let totalNeighbors = 0;
    
        flock.forEach(sheep => {
            if (sheep !== this) {
                const distance = Math.sqrt(
                    (sheep.position.posX - this.position.posX) ** 2 +
                    (sheep.position.posY - this.position.posY) ** 2
                );
    
                if (distance < alignmentDistance) {
                    totalVelX += sheep.velocity.x;
                    totalVelY += sheep.velocity.y;
                    totalNeighbors++;
                }
            }
        });
    
        if (totalNeighbors > 0) {
            const avgVelX = totalVelX / totalNeighbors;
            const avgVelY = totalVelY / totalNeighbors;
    
            return { x: avgVelX, y: avgVelY };
        } else {
            return { x: 0, y: 0 };
        }
    }
    
    cohesion(flock, cohesionDistance) {
        let centerX = 0;
        let centerY = 0;
        let totalNeighbors = 0;
    
        flock.forEach(sheep => {
            if (sheep !== this) {
                const distance = Math.sqrt(
                    (sheep.position.posX - this.position.posX) ** 2 +
                    (sheep.position.posY - this.position.posY) ** 2
                );
    
                if (distance < cohesionDistance) {
                    centerX += sheep.position.posX;
                    centerY += sheep.position.posY;
                    totalNeighbors++;
                }
            }
        });
    
        if (totalNeighbors > 0) {
            centerX /= totalNeighbors;
            centerY /= totalNeighbors;
    
            const cohesionVectorX = centerX - this.position.posX;
            const cohesionVectorY = centerY - this.position.posY;
    
            return { x: cohesionVectorX, y: cohesionVectorY };
        } else {
            return { x: 0, y: 0 };
        }
    }
    
    separate(flock, separationDistance) {
        let separationVectorX = 0;
        let separationVectorY = 0;
    
        flock.forEach(sheep => {
            if (sheep !== this) {
                const distance = Math.sqrt(
                    (sheep.position.posX - this.position.posX) ** 2 +
                    (sheep.position.posY - this.position.posY) ** 2
                );
    
                if (distance < separationDistance) {
                    separationVectorX += (this.position.posX - sheep.position.posX) / distance;
                    separationVectorY += (this.position.posY - sheep.position.posY) / distance;
                }
            }
        });
    
        return { x: separationVectorX, y: separationVectorY };
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