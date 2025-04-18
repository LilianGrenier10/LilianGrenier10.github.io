document.addEventListener("DOMContentLoaded", () => {
  // Canvas setup
  const canvas = document.getElementById("game-canvas")
  const ctx = canvas.getContext("2d")

  // Responsive canvas
  function resizeCanvas() {
    const container = canvas.parentElement
    const containerWidth = container.clientWidth

    // Set canvas display size (CSS)
    canvas.style.width = containerWidth + "px"
    canvas.style.height = containerWidth / 2 + "px"

    // Set canvas actual size in memory (scaled to account for extra pixel density)
    const scale = window.devicePixelRatio || 1
    canvas.width = containerWidth * scale
    canvas.height = (containerWidth / 2) * scale

    // Normalize coordinate system to use CSS pixels
    ctx.scale(scale, scale)
  }

  // Initial resize
  resizeCanvas()

  // Resize canvas when window size changes
  window.addEventListener("resize", resizeCanvas)

  // Game variables
  let gameRunning = false
  let gamePaused = false
  let score = 0
  let highScore = localStorage.getItem("turtleGameHighScore") || 0
  let gameSpeed = 2
  const gameSpeedIncrement = 0.0005

  // Update high score display
  document.getElementById("high-score").textContent = highScore

  // Turtle object
  const turtle = {
    x: canvas.clientWidth / 4, // Start at 1/4 of the canvas width
    y: canvas.clientHeight / 1.5, // Position at 2/3 down the canvas
    width: 60,
    height: 40,
    speed: 5,
    direction: "right", // Direction initiale (droite)
    moving: {
      left: false,
      right: false,
    },
    image: new Image(),
    loaded: false,
  }

  // Plastic waste objects - Uniquement des sacs plastiques
  const plasticTypes = [
    {
      type: "bag",
      width: 50,
      height: 60,
      image: new Image(),
      loaded: false,
    },
  ]

  // Array to store active plastic waste objects
  let plasticWaste = []

  // Game loop variables
  let animationId
  let lastPlasticTime = 0
  let plasticInterval = 1500 // milliseconds

  // Game controls
  const startButton = document.getElementById("start-button")
  const pauseButton = document.getElementById("pause-button")
  const leftButton = document.getElementById("left-button")
  const rightButton = document.getElementById("right-button")
  const startOverlay = document.getElementById("start-overlay")
  const startOverlayButton = document.getElementById("start-overlay-button")
  const gameOverOverlay = document.getElementById("game-over-overlay")
  const restartButton = document.getElementById("restart-button")

  // Event listeners for keyboard controls
  window.addEventListener("keydown", (e) => {
    if (gameRunning && !gamePaused) {
      if (e.key === "ArrowLeft") {
        turtle.moving.left = true
        turtle.direction = "left" // Mise à jour de la direction
      } else if (e.key === "ArrowRight") {
        turtle.moving.right = true
        turtle.direction = "right" // Mise à jour de la direction
      }
    }
  })

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") {
      turtle.moving.left = false
    } else if (e.key === "ArrowRight") {
      turtle.moving.right = false
    }
  })

  // Event listeners for touch controls
  leftButton.addEventListener("mousedown", () => {
    turtle.moving.left = true
    turtle.direction = "left" // Mise à jour de la direction
  })

  leftButton.addEventListener("mouseup", () => {
    turtle.moving.left = false
  })

  leftButton.addEventListener("touchstart", (e) => {
    e.preventDefault()
    turtle.moving.left = true
    turtle.direction = "left" // Mise à jour de la direction
  })

  leftButton.addEventListener("touchend", (e) => {
    e.preventDefault()
    turtle.moving.left = false
  })

  rightButton.addEventListener("mousedown", () => {
    turtle.moving.right = true
    turtle.direction = "right" // Mise à jour de la direction
  })

  rightButton.addEventListener("mouseup", () => {
    turtle.moving.right = false
  })

  rightButton.addEventListener("touchstart", (e) => {
    e.preventDefault()
    turtle.moving.right = true
    turtle.direction = "right" // Mise à jour de la direction
  })

  rightButton.addEventListener("touchend", (e) => {
    e.preventDefault()
    turtle.moving.right = false
  })

  // Start button event listener
  startButton.addEventListener("click", () => {
    if (!gameRunning) {
      startGame()
    } else if (gamePaused) {
      resumeGame()
    }
  })

  // Pause button event listener
  pauseButton.addEventListener("click", () => {
    if (gameRunning && !gamePaused) {
      pauseGame()
    }
  })

  // Start overlay button event listener
  startOverlayButton.addEventListener("click", () => {
    startOverlay.classList.add("hidden")
    startGame()
  })

  // Restart button event listener
  restartButton.addEventListener("click", () => {
    gameOverOverlay.classList.add("hidden")
    startGame()
  })

  // Function to start the game
  function startGame() {
    // Reset game variables
    gameRunning = true
    gamePaused = false
    score = 0
    gameSpeed = 2
    plasticWaste = []
    lastPlasticTime = Date.now()
    turtle.direction = "right" // Réinitialiser la direction de la tortue

    // Update UI
    document.getElementById("score").textContent = score
    startButton.textContent = "Recommencer"
    pauseButton.disabled = false

    // Start game loop
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    gameLoop()
  }

  // Function to pause the game
  function pauseGame() {
    gamePaused = true
    pauseButton.textContent = "Reprendre"
    cancelAnimationFrame(animationId)
  }

  // Function to resume the game
  function resumeGame() {
    gamePaused = false
    pauseButton.textContent = "Pause"
    gameLoop()
  }

  // Function to end the game
  function gameOver() {
    gameRunning = false
    cancelAnimationFrame(animationId)

    // Update high score if needed
    if (score > highScore) {
      highScore = score
      localStorage.setItem("turtleGameHighScore", highScore)
      document.getElementById("high-score").textContent = highScore
    }

    // Show game over overlay
    document.getElementById("final-score").textContent = score
    gameOverOverlay.classList.remove("hidden")

    // Reset UI
    startButton.textContent = "Commencer"
    pauseButton.disabled = true
  }

  // Function to create a new plastic waste object (uniquement des sacs)
  function createPlasticWaste() {
    // Toujours utiliser le sac plastique
    const plasticType = plasticTypes[0]

    // Create a new plastic waste object
    const plastic = {
      x: Math.random() * (canvas.clientWidth - plasticType.width),
      y: -plasticType.height,
      width: plasticType.width,
      height: plasticType.height,
      type: plasticType.type,
      image: plasticType.image,
      speed: gameSpeed + Math.random() * 2, // Random speed variation
    }

    // Add to the array
    plasticWaste.push(plastic)
  }

  // Function to update the game state
  function update() {
    // Update turtle position
    if (turtle.moving.left) {
      turtle.x -= turtle.speed
      turtle.direction = "left"
    }
    if (turtle.moving.right) {
      turtle.x += turtle.speed
      turtle.direction = "right"
    }

    // Keep turtle within canvas bounds
    if (turtle.x < 0) {
      turtle.x = 0
    }
    if (turtle.x > canvas.clientWidth - turtle.width) {
      turtle.x = canvas.clientWidth - turtle.width
    }

    // Check if it's time to create a new plastic waste
    const currentTime = Date.now()
    if (currentTime - lastPlasticTime > plasticInterval) {
      createPlasticWaste()
      lastPlasticTime = currentTime

      // Decrease interval over time to increase difficulty
      plasticInterval = Math.max(500, plasticInterval - 10)
    }

    // Update plastic waste positions and check for collisions
    for (let i = plasticWaste.length - 1; i >= 0; i--) {
      const plastic = plasticWaste[i]

      // Move plastic down
      plastic.y += plastic.speed

      // Remove plastic if it's off the bottom of the canvas
      if (plastic.y > canvas.clientHeight) {
        plasticWaste.splice(i, 1)
        score += 10 // Increase score for each avoided plastic
        document.getElementById("score").textContent = score
      }

      // Check for collision with turtle
      if (
        plastic.x < turtle.x + turtle.width * 0.8 &&
        plastic.x + plastic.width * 0.8 > turtle.x + turtle.width * 0.2 &&
        plastic.y < turtle.y + turtle.height * 0.8 &&
        plastic.y + plastic.height * 0.8 > turtle.y + turtle.height * 0.2
      ) {
        gameOver()
        return
      }
    }

    // Increase game speed over time
    gameSpeed += gameSpeedIncrement
  }

  // Function to draw the game
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  
    // Ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight)
    gradient.addColorStop(0, "#b3e0ff")
    gradient.addColorStop(1, "#0077be")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  
    // Bubbles
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    for (let i = 0; i < 20; i++) {
      const x = Math.sin(Date.now() / 1000 + i) * 50 + canvas.clientWidth / 2
      const y = (Date.now() / 20 + i * 50) % canvas.clientHeight
      const size = Math.random() * 5 + 2
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  
    // Draw turtle
    if (turtle.loaded) {
      ctx.save()
      if (turtle.direction === "left") {
        ctx.translate(turtle.x + turtle.width, turtle.y)
        ctx.scale(-1, 1)
        ctx.drawImage(turtle.image, 0, 0, turtle.width, turtle.height)
      } else {
        ctx.drawImage(turtle.image, turtle.x, turtle.y, turtle.width, turtle.height)
      }
      ctx.restore()
    } else {
      // Placeholder turtle
      ctx.fillStyle = "green"
      ctx.fillRect(turtle.x, turtle.y, turtle.width, turtle.height)
  
      // Direction indicator
      ctx.fillStyle = "darkgreen"
      ctx.beginPath()
      if (turtle.direction === "left") {
        ctx.moveTo(turtle.x, turtle.y + turtle.height / 2)
        ctx.lineTo(turtle.x + turtle.width / 3, turtle.y + turtle.height / 4)
        ctx.lineTo(turtle.x + turtle.width / 3, turtle.y + (3 * turtle.height) / 4)
      } else {
        ctx.moveTo(turtle.x + turtle.width, turtle.y + turtle.height / 2)
        ctx.lineTo(turtle.x + (2 * turtle.width) / 3, turtle.y + turtle.height / 4)
        ctx.lineTo(turtle.x + (2 * turtle.width) / 3, turtle.y + (3 * turtle.height) / 4)
      }
      ctx.fill()
    }
  
    // Draw plastic waste
    plasticWaste.forEach((plastic) => {
      if (plasticTypes[0].loaded) {
        ctx.drawImage(plastic.image, plastic.x, plastic.y, plastic.width, plastic.height)
      } else {
        ctx.fillStyle = "rgba(200, 230, 255, 0.7)"
        ctx.fillRect(plastic.x, plastic.y, plastic.width, plastic.height)
      }
    })
  }

  // Main game loop
  function gameLoop() {
    update()
    draw()

    if (gameRunning && !gamePaused) {
      animationId = requestAnimationFrame(gameLoop)
    }
  }

  // Load images with fallback
  function loadGameImages() {
    // Load turtle image
    turtle.image.onload = () => {
      console.log("Turtle image loaded")
      turtle.loaded = true
      checkAllImagesLoaded()
    }
    turtle.image.onerror = () => {
      console.error("Failed to load turtle image")
      checkAllImagesLoaded()
    }
    turtle.image.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tortue-Jzag7qAMeVY2mFwLYYTd43VPGoxUum.png"
    turtle.image.crossOrigin = "anonymous"

    // Load plastic bag image
    plasticTypes[0].image.onload = () => {
      console.log("Bag image loaded")
      plasticTypes[0].loaded = true
      checkAllImagesLoaded()
    }
    plasticTypes[0].image.onerror = () => {
      console.error("Failed to load bag image")
      checkAllImagesLoaded()
    }
    plasticTypes[0].image.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bag-0MZ4a36uGiK0Q36Nfia4xrR9LlDbwr.png"
    plasticTypes[0].image.crossOrigin = "anonymous"
  }

  // Check if all images are loaded
  let imagesChecked = 0
  const totalImages = plasticTypes.length + 1 // +1 for turtle

  function checkAllImagesLoaded() {
    imagesChecked++
    console.log(`Images checked: ${imagesChecked}/${totalImages}`)

    if (imagesChecked === totalImages) {
      console.log("All images processed, showing start overlay")
      // Show start overlay even if some images failed to load
      startOverlay.classList.remove("hidden")

      // Force a redraw to show placeholders for any images that didn't load
      draw()
    }
  }

  // Start loading images
  loadGameImages()

  // Show start overlay after a timeout in case images don't load
  setTimeout(() => {
    if (imagesChecked < totalImages) {
      console.log("Timeout reached, showing start overlay anyway")
      startOverlay.classList.remove("hidden")
    }
  }, 3000)
})
