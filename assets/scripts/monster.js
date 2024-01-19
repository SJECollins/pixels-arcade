window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Images
    const bgImg = new Image()
    bgImg.src = "../assets/images/monster/maptwo.png"
    const houseImg = new Image()
    houseImg.src = "../assets/images/monster/housetwo.png"
    const labImg = new Image()
    labImg.src = "../assets/images/monster/labtwo.png"
    const waterImg = new Image()
    waterImg.src = "../assets/images/monster/watertwo.png"
    const postImg = new Image()
    postImg.src = "../assets/images/monster/posttwo.png"
    const signImg = new Image()
    signImg.src = "../assets/images/monster/signtwo.png"
    const grassImg = new Image()
    grassImg.src = "../assets/images/monster/grass.png"
    const playerImg = new Image()
    playerImg.src = "../assets/images/monster/trainer.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 16
    const obstacleArray = []
    const grassArray = []
    let lastTime = 0

    // Map
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

    // Objects that don't move
    class StaticObject{
        constructor(objImage, posX, posY, objWidth, objHeight) {
            this.img = objImage
            this.x = posX
            this.y = posY
            this.width = objWidth
            this.height = objHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    class Player{
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 80
            this.y = 96
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.moveX = 0
            this.moveY = 0
            this.movingUp = false
            this.movingDown = false
            this.movingLeft = false
            this.movingRight = false
            this.moving = false
        }
        draw(context, deltaTime) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                if (this.moving) {
                    this.frameTimer += deltaTime
                } else {
                    this.frameX = 0
                }
            }
        }
        update(input) {
            this.x += this.moveX
            this.y += this.moveY
            if (input.keys.indexOf("KeyD") > -1 && this.x < gameWidth - 32) {
                if (this.movingRight && obstacleArray.some(checkCollisions)) {
                    this.moveX = 0
                    this.moving = false
                } else {
                this.frameY = 48
                this.moveX = 1
                this.moveY = 0
                this.moving = true
                this.movingRight = true
                this.movingUp = false
                this.movingLeft = false
                this.movingDown = false            
                }
            } else if (input.keys.indexOf("KeyA") > -1 && this.x > 16) {
                if (this.movingLeft && obstacleArray.some(checkCollisions)) {
                    this.moveX = 0
                } else {
                this.frameY = 32
                this.moveX = -1
                this.moveY = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = false
                this.movingLeft = true
                this.movingDown = false 
                }
            } else if (input.keys.indexOf("KeyW") > -1 && this.y > 32) {
                if (this.movingUp && obstacleArray.some(checkCollisions)) {
                    this.moveY = 0
                } else {
                this.frameY = 16
                this.moveY = -1
                this.moveX = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = true
                this.movingLeft = false
                this.movingDown = false 
                }
            } else if (input.keys.indexOf("KeyS") > -1 && this.y < gameHeight - 32) {
                if (this.movingDown && obstacleArray.some(checkCollisions)) {
                    this.moveY = 0
                } else {
                this.frameY = 0
                this.moveY = 1
                this.moveX = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = false
                this.movingLeft = false
                this.movingDown = true
                } 
            } else {
                this.moveX = 0
                this.moveY = 0
                this.moving = false
            }
        }
    }

    const checkCollisions = (obstacle) => {

        if (obstacle.img == houseImg || obstacle.img == labImg) {
            if (player.x < obstacle.x + obstacle.width && 
                player.x + player.width > obstacle.x && 
                player.y < obstacle.y + obstacle.height - 2 && 
                player.y + player.height > obstacle.y + tileSize) {
                return true
            } else {
                return false
            }
        } else {
            if (player.x < obstacle.x + obstacle.width - 2 && 
                player.x + player.width > obstacle.x - 2 && 
                player.y < obstacle.y + obstacle.height - 2 && 
                player.y + player.height > obstacle.y + 4) {
                return true
            } else {
                return false
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
                     e.code == "KeyA")
                     && this.keys.indexOf(e.code) === -1) {
                        this.keys.push(e.code)
                     }
            })
            window.addEventListener("keyup", (e) => {
                if (e.code == "KeyW" ||
                    e.code == "KeyD" ||
                    e.code == "KeyS" ||
                    e.code == "KeyA") {
                    this.keys.splice(this.keys.indexOf(e.code), 1)
                    }
            })      
        }
    }

    // const handleInputs = (e) => {
    //     if (e.code == "KeyA") {
    //         player.update(e.code)
    //     } else if (e.code == "KeyD") {
    //         player.update(e.code)
    //     } else if (e.code == "KeyS") {
    //         player.update(e.code)
    //     } else if (e.code == "KeyW") {
    //         player.update(e.code)
    //     }
    // }

    const createObjects = () => {
        // Create Buildings
        const firstHouse = new StaticObject(houseImg, 64, 48, 64, 48)
        obstacleArray.push(firstHouse)
        const secondHouse = new StaticObject(houseImg, 192, 48, 64, 48)
        obstacleArray.push(secondHouse)
        const lab = new StaticObject(labImg, 160, 128, 96, 64)
        obstacleArray.push(lab)
        const water = new StaticObject(waterImg, 64, 224, 64, 64)
        obstacleArray.push(water)
        const firstSign = new StaticObject(signImg, 48, 80, tileSize, tileSize)
        obstacleArray.push(firstSign)
        const secondSign = new StaticObject(signImg, 176, 80, tileSize, tileSize)
        obstacleArray.push(secondSign)
        const thirdSign = new StaticObject(signImg, 112, 144, tileSize, tileSize)
        obstacleArray.push(thirdSign)
        const fourthSign = new StaticObject(signImg, 208, 208, tileSize, tileSize)
        obstacleArray.push(fourthSign)
        for (let i = 0; i < 3; i++) {
            const post = new StaticObject(postImg, 64 + (16 * i), 144, tileSize, tileSize)
            obstacleArray.push(post)
            const otherPost = new StaticObject(postImg, 160 + (16 * i), 208, tileSize, tileSize)
            obstacleArray.push(otherPost)
        }
        const onePost = new StaticObject(postImg, 224, 208, tileSize, tileSize)
        obstacleArray.push(onePost)
        const secondPost = new StaticObject(postImg, 240, 208, tileSize, tileSize)
        obstacleArray.push(secondPost)
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const grass = new StaticObject(grassImg, 160 + (j * 16), 0 + (i * 16), tileSize, tileSize)
                obstacleArray.push(grass)
            }
        }
    }

    const handleObjects = (ctx) => {
        obstacleArray.forEach(object => object.draw(ctx))
    }


    const startGame = () => {
        // window.addEventListener("keydown", handleInputs)
        createObjects()
        runGame()
    }

    const background = new Background()
    const player = new Player()
    const input = new InputHandler()

    function runGame(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        
        player.draw(ctx, deltaTime)
        player.update(input)
        handleObjects(ctx)
        requestAnimationFrame(runGame)

    }

    startBtn.addEventListener("click", startGame)

})