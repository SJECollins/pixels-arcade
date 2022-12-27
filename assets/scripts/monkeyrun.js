window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const gameWidth = 320
    const gameHeight = 256
    const tileSize = 32
    let score = 0
    let enemies = []
    let lastTime = 0
    let enemyTimer = 0
    let enemyInterval = 1000
    let randomEnemyInterval = Math.random() * 1000 + 500
    let gameOver = false

    canvas.width = gameWidth
    canvas.height = gameHeight

    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 32
            this.y = 164
            this.img = document.getElementById("player")
            this.frameX = 0
            this.frameCount = 3
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.yvelocity = 0
            this.gravity = 0.5
        }
        draw(context, deltaTime, enemies) {
            // Collision detection
            enemies.forEach(enemy => {
                const distanceX = enemy.x - this.x
                const distanceY = enemy.y - this.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < enemy.width / 2 + this.width / 2) {
                    gameOver = true
                }
            })
            // Animation
            context.strokeStyle = "black"
            context.beginPath()
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2)
            context.stroke()
            if (this.frameTimer > this.frameInterval && this.y == 164) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            context.drawImage(this.img, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        jump(e) {
            if (e && this.y == 164) {
                // Only jump if even AND player on ground to prevent double jump
                this.yvelocity -= 12
            }
            console.log("fuck you")
            this.y += this.yvelocity
            if (this.y !== 164) {
                // If player is not on ground
                this.yvelocity += this.gravity
                console.log(this.y)
                this.frameX = 1
            } else if (this.y == 164) {
                this.yvelocity = 0
            }
            if (this.y > 164) {
                // Set a vertical boundary to prevent player dropping off screen
                this.y = 164
            }
        }
    }

    document.addEventListener("keydown", monkeyJump)

    function monkeyJump(e) {
        console.log(e.code)
        if (e.code !== "Space" && e.code !== "ArrowUp") {
            console.log("hit other button")
            return
        } else {
            console.log("hit button")
            player.jump(e)            
        }

    }

    class Background {
        constructor() {
            this.img = document.getElementById("background")
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 4
        }
        draw(context) {
            // Draw bg twice to create illusion of endlessly scrolling background
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed
            // Reset image when scrolled off screen
            if (this.x < 0 - this.width) {
                this.x = 0
            }
        }

    }

    class Enemy {
        constructor(gameWidth) {
            this.gameWidth = gameWidth
            this.width = tileSize
            this.height = tileSize
            this.img = document.getElementById("spider")
            this.x = this.gameWidth
            this.y = 146
            this.frameX = 0
            this.speed = 3
            this.frameCount = 3
            this.fps = 15
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.scale = 2
            this.markedForDeletion = false
        }
        draw(context) {
            context.strokeStyle = "black"
            context.beginPath()
            context.arc(this.x + this.width, this.y + this.height / 0.9, this.width * 0.75, 0, Math.PI * 2)
            context.stroke()
            context.strokeRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width * this.scale, this.height * this.scale)
        }
        update(deltaTime) {
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
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(gameWidth))
            randomEnemyInterval = Math.random() * 1000 + 500
            enemyTimer = 0
        } else {
            enemyTimer += deltaTime
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx)
            enemy.update(deltaTime)
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    }

    function displayStatus(context) {
        if (gameOver) {
            context.font = "32px Verdana"
            context.textAlign = "center"
            context.fillStyle = "black"
            context.fillText("GAME OVER", gameWidth / 2, gameHeight / 2)
        }
    }
    
    const background = new Background()
    const player = new Player()

    function animate(timeStamp) {
        // timeStamp value autogenerated by requestAnimationFrame which generates timeStamp and passes to function it calls
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        // background.update()
        player.draw(ctx, deltaTime, enemies)
        player.jump()
        handleEnemies(deltaTime)
        displayStatus(ctx)
        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }
    animate(0)
})