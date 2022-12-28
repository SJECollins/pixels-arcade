window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const startBtn = document.getElementById("start")
    const reset = document.getElementById("reset")
    const timer = document.getElementById("time")
    const scoreDisplay = document.getElementById("score")
    const openInstructions = document.getElementById("instructions")
    const closeInstructions = document.getElementById("close-pop-up")
    const endScore = document.getElementById("result")

    const monkeyImg = new Image()
    monkeyImg.src = "../assets/images/monkeyrun/monk.png"
    const spiderImg = new Image()
    spiderImg.src = "../assets/images/monkeyrun/spider.png"
    const waspImg = new Image()
    waspImg.src = "../assets/images/monkeyrun/wasp.png"
    const bananaImg = new Image()
    bananaImg.src = "../assets/images/monkeyrun/banana.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/monkeyrun/background.png"
    const branchImg = new Image()
    branchImg.src = "../assets/images/monkeyrun/branch.png"
    const treebigImg = new Image()
    treebigImg.src = "../assets/images/monkeyrun/treebig.png"
    const treesmImg = new Image()
    treesmImg.src = "../assets/images/monkeyrun/treesm.png"
    const treebigbgImg = new Image()
    treebigbgImg.src = "../assets/images/monkeyrun/treebigbg.png"
    const treebigbgtwoImg = new Image()
    treebigbgtwoImg.src = "../assets/images/monkeyrun/treebigbgtwo.png"

    const gameWidth = 320
    const gameHeight = 256
    const tileSize = 32
    let score = 0
    let enemies = []
    let bananas = []
    let bgTrees = []
    let trees = []
    let lastTime = 0
    let enemyTimer = 0
    let enemyInterval = 1000
    let bananaTimer = 0
    let bananaInterval = 800
    let randomEnemyInterval = Math.random() * 1000 + 400
    let randomBananaInterval = Math.random() * 1000 + 2000
    let bgTreeTimer = 0
    let treeTimer = 0
    let bgTreeInterval = 500
    let treeInterval = 800
    let randomBgTreeInterval = Math.random() * 800 + 800
    let randomTreeInterval = Math.random() * 1000 + 2000
    let gameOver = false

    canvas.width = gameWidth
    canvas.height = gameHeight

    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 32
            this.y = 164
            this.img = monkeyImg
            this.frameX = 0
            this.frameCount = 3
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.yvelocity = 0
            this.gravity = 0.5
        }
        draw(context, deltaTime, enemies) {
            console.log(this.y)
            // Collision detection
            enemies.forEach(enemy => {
                const distanceX = enemy.x - this.x
                const distanceY = enemy.y - this.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < enemy.width / 2 + this.width / 2) {
                    gameOver = true
                }
            })
            bananas.forEach(banana => {
                const distanceX = banana.x - this.x
                const distanceY = banana.y - this.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < banana.width / 4 + this.width / 4) {
                    banana.collected = true
                    score++
                }
            })
            // Animation
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
                this.yvelocity -= 10
            }
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
            this.img = bgImg
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

    class Branch {
        constructor() {
            this.img = branchImg
            this.x = 0
            this.y = 192
            this.width = gameWidth
            this.height = tileSize
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

    class BackgroundTree {
        constructor(gameWidth, gameHeight, treeImg) {
            this.gameWidth = gameWidth
            this.img = treeImg
            this.x = this.gameWidth
            this.y = gameHeight - 202
            this.width = 128
            this.height = 202
            this.speed = 2
            this.markedForDeletion = false
        }
        draw(context) {
            context.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)                            
        }
        update() {
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    class Tree {
        constructor(gameWidth, gameHeight, treeImg) {
            this.gameWidth = gameWidth
            this.img = treeImg
            this.x = this.gameWidth
            this.y = gameHeight - 202
            this.width = 128
            this.height = 202
            this.speed = 4
            this.markedForDeletion = false
        }
        draw(context) {
            context.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)                    
        }
        update() {
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    class Enemy {
        constructor(gameWidth, enemyY, enemyImg) {
            this.gameWidth = gameWidth
            this.width = tileSize
            this.height = tileSize
            this.img = enemyImg
            this.x = this.gameWidth
            this.y = enemyY
            this.frameX = 0
            this.speed = 5
            this.frameCount = 3
            this.fps = 15
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.markedForDeletion = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
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

    class Banana {
        constructor(gameWidth) {
            this.gameWidth = gameWidth
            this.width = tileSize
            this.height = tileSize
            this.img = bananaImg
            this.x = this.gameWidth
            this.y = 166
            this.markedForDeletion = false
            this.collected = false
            this.speed = 4
        }
        draw(context) {
            if (!this.collected) {
                context.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)                
            }
        }
        update() {
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    function handleBananas(deltaTime) {
        if (bananaTimer > bananaInterval + randomBananaInterval) {
            bananas.push(new Banana(gameWidth))
            randomBananaInterval = Math.random() * 1000 + 200
            bananaTimer = 0
        } else {
            bananaTimer += deltaTime
        }
        bananas.forEach(banana => {
            banana.draw(ctx)
            banana.update()
        })
        bananas = bananas.filter(banana => !banana.markedForDeletion)
    }

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            let newEnemy = Math.random() >= 0.5 ? "spider" : "wasp"
            if (newEnemy == "spider") {
                enemies.push(new Enemy(gameWidth, 170, spiderImg))
            } else {
                enemies.push(new Enemy(gameWidth, 90, waspImg))
            }
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

    function handleBgTrees(deltaTime) {
        if (bgTreeTimer > bgTreeInterval + randomBgTreeInterval) {
            let newTree = Math.random() >= 0.5 ? "treeOne" : "treeTwo"
            if (newTree == "treeOne") {
                bgTrees.push(new BackgroundTree(gameWidth, gameHeight, treebigbgImg))
            } else {
                bgTrees.push(new BackgroundTree(gameWidth, gameHeight, treebigbgtwoImg))
            }
            randomBgTreeInterval = Math.random() * 800 + 800
            bgTreeTimer = 0
        } else {
            bgTreeTimer += deltaTime
        }
        bgTrees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        bgTrees = bgTrees.filter(tree => !tree.markedForDeletion)
    }

    function handleTrees(deltaTime) {
        if (treeTimer > treeInterval + randomTreeInterval) {
            let newTree = Math.random() < 0.5 ? "treeOne" : "treeTwo"
            if (newTree = "treeOne") {
                trees.push(new Tree(gameWidth, gameHeight, treebigImg))
            } else {
                trees.push(new Tree(gameWidth, gameHeight, treesmImg))
            }
            randomTreeInterval = Math.random() * 1000 + 2000
            treeTimer = 0
        } else {
            treeTimer += deltaTime
        }
        trees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        trees = trees.filter(tree => !tree.markedForDeletion)
    }

    function handleScore() {
        let time = 0
        let startTime = setInterval(() => {
            time++
            score++
            timer.innerHTML = time
            scoreDisplay.innerHTML = score 
            if (gameOver) {
                clearInterval(startTime)
                timer.innerHTML = "GAME OVER!"
                endScore.innerHTML = score
                document.querySelector("#game-over").style.display="block"
                startBtn.addEventListener("click", startGame)
            }
        }, 1000)
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
    const branch = new Branch()
    const player = new Player()

    function animate(timeStamp) {
        // timeStamp value autogenerated by requestAnimationFrame which generates timeStamp and passes to function it calls
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        background.update()
        handleBgTrees(deltaTime)
        handleTrees(deltaTime)
        branch.draw(ctx)
        branch.update()
        player.draw(ctx, deltaTime, enemies)
        player.jump()
        handleEnemies(deltaTime)
        handleBananas(deltaTime)
        displayStatus(ctx)
        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }
    
    function startGame() {
        handleScore()
        animate(0)
        startBtn.removeEventListener("click", startGame)
    }

    startBtn.addEventListener("click", startGame)
    reset.addEventListener("click", () => {
    location.reload() 
    })
    openInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="block"
    })
    closeInstructions.addEventListener("click", () => {
    document.querySelector("#intro").style.display="none"
    })   
})
 
