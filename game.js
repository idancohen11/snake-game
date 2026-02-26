// Game Constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

// Game State
let canvas, ctx;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameLoop = null;
let gameSpeed = INITIAL_SPEED;
let isGameRunning = false;

// Touch handling for swipe controls
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    // Load high score
    highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    document.getElementById('highscore').textContent = highScore;

    // Event listeners
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);

    // D-pad controls
    document.getElementById('btnUp').addEventListener('click', () => changeDirection(0, -1));
    document.getElementById('btnDown').addEventListener('click', () => changeDirection(0, 1));
    document.getElementById('btnLeft').addEventListener('click', () => changeDirection(-1, 0));
    document.getElementById('btnRight').addEventListener('click', () => changeDirection(1, 0));

    // Touch controls for swipe
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Prevent scroll on game canvas
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    resetGame();
}

// Start game
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    resetGame();
    isGameRunning = true;
    gameLoop = setInterval(update, gameSpeed);
}

// Reset game state
function resetGame() {
    // Initialize snake in the middle, heading right
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = INITIAL_SPEED;
    document.getElementById('score').textContent = score;
    placeFood();
    draw();
}

// Place food at random position
function placeFood() {
    do {
        food.x = Math.floor(Math.random() * GRID_SIZE);
        food.y = Math.floor(Math.random() * GRID_SIZE);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!isGameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            changeDirection(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            changeDirection(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            changeDirection(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            changeDirection(1, 0);
            e.preventDefault();
            break;
    }
}

// Change direction (prevent 180-degree turns)
function changeDirection(x, y) {
    if (direction.x === -x && direction.y === -y) return;
    nextDirection = { x, y };
}

// Touch handling
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (!isGameRunning) return;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        changeDirection(deltaX > 0 ? 1 : -1, 0);
    } else {
        // Vertical swipe
        changeDirection(0, deltaY > 0 ? 1 : -1);
    }
}

// Game update loop
function update() {
    direction = nextDirection;

    // Calculate new head position
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        placeFood();

        // Increase speed gradually
        if (gameSpeed > MIN_SPEED) {
            gameSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score * SPEED_INCREMENT));
            clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
        }

        // Celebration effect
        animateCelebration();
    } else {
        // Remove tail
        snake.pop();
    }

    draw();
}

// Draw game
function draw() {
    // Clear canvas with dark gradient
    ctx.fillStyle = '#0d0019';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(255, 20, 147, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw food (peach emoji style)
    ctx.save();
    ctx.translate(food.x * CELL_SIZE, food.y * CELL_SIZE);

    // Pulsating peach
    const pulse = Math.sin(Date.now() / 200) * 0.15 + 1;
    ctx.scale(pulse, pulse);

    // Peach gradient
    const peachGradient = ctx.createRadialGradient(CELL_SIZE / 2, CELL_SIZE / 2, 0, CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);
    peachGradient.addColorStop(0, '#FFB6C1');
    peachGradient.addColorStop(0.5, '#FFA07A');
    peachGradient.addColorStop(1, '#FF69B4');

    ctx.fillStyle = peachGradient;
    ctx.beginPath();
    ctx.arc(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(CELL_SIZE / 3, CELL_SIZE / 3, CELL_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.save();
        ctx.translate(segment.x * CELL_SIZE, segment.y * CELL_SIZE);

        if (index === 0) {
            // Head - mushroom tip
            const headGradient = ctx.createRadialGradient(CELL_SIZE / 2, CELL_SIZE / 2, 0, CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2);
            headGradient.addColorStop(0, '#FF1493');
            headGradient.addColorStop(0.6, '#C71585');
            headGradient.addColorStop(1, '#8B008B');

            ctx.fillStyle = headGradient;
            ctx.beginPath();
            ctx.arc(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
            ctx.fill();

            // Glans ridge
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(CELL_SIZE / 2, CELL_SIZE / 2, CELL_SIZE / 2 - 4, Math.PI * 0.8, Math.PI * 2.2);
            ctx.stroke();

            // Shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(CELL_SIZE / 2 - 3, CELL_SIZE / 2 - 3, 3, 0, Math.PI * 2);
            ctx.fill();

        } else {
            // Body - shaft
            const bodyGradient = ctx.createLinearGradient(0, 0, CELL_SIZE, CELL_SIZE);
            bodyGradient.addColorStop(0, '#E066A3');
            bodyGradient.addColorStop(0.5, '#C44E8A');
            bodyGradient.addColorStop(1, '#A03771');

            ctx.fillStyle = bodyGradient;
            ctx.fillRect(2, 2, CELL_SIZE - 4, CELL_SIZE - 4);

            // Vein detail (every few segments)
            if (index % 3 === 0) {
                ctx.strokeStyle = 'rgba(255, 105, 180, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(4, CELL_SIZE / 2);
                ctx.lineTo(CELL_SIZE - 4, CELL_SIZE / 2);
                ctx.stroke();
            }

            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(4, 4, CELL_SIZE - 8, 2);
        }

        ctx.restore();
    });
}

// Celebration animation when eating food
function animateCelebration() {
    const canvas = document.getElementById('gameCanvas');
    canvas.style.transform = 'scale(1.05)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 100);
}

// Game over
function gameOver() {
    isGameRunning = false;
    clearInterval(gameLoop);

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highscore').textContent = highScore;
    }

    // Show game over screen
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Start game on load
window.addEventListener('load', init);
