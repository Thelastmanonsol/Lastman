
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the character image
const characterImage = new Image();
characterImage.src = 'character.png'; // Placeholder: Replace with your character image

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // Placeholder: Replace with your background image

// Character properties
let character = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    speed: 5
};

// Keyboard input
let keys = {};

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Obstacle properties
let obstacles = [];
let obstacleInterval = 2000; // Initial spawn interval for obstacles
let lastObstacleTime = Date.now();
let obstacleSpeedMultiplier = 1;

// Scoring
let startTime = Date.now();
let score = 0;

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Increase difficulty over time
    let elapsedTime = Date.now() - startTime;
    if (elapsedTime % 5000 < 50) { // Increase difficulty every 5 seconds
        obstacleSpeedMultiplier += 0.1; // Increase obstacle speed
        obstacleInterval = Math.max(500, obstacleInterval - 100); // Decrease obstacle spawn interval
    }

    // Move character
    if (keys['ArrowLeft'] && character.x > 0) {
        character.x -= character.speed;
    }
    if (keys['ArrowRight'] && character.x < canvas.width - character.width) {
        character.x += character.speed;
    }
    if (keys['ArrowUp'] && character.y > 0) {
        character.y -= character.speed;
    }
    if (keys['ArrowDown'] && character.y < canvas.height - character.height) {
        character.y += character.speed;
    }

    // Spawn obstacles
    if (Date.now() - lastObstacleTime > obstacleInterval) {
        let size = Math.random() * 50 + 20;
        obstacles.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: (Math.random() * 3 + 2) * obstacleSpeedMultiplier
        });
        lastObstacleTime = Date.now();
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacles[i].speed;
        
        // Check collision
        if (checkCollision(character, obstacles[i])) {
            alert('Game Over! Your score: ' + score);
            resetGame();
            break;
        }

        // Remove off-screen obstacles
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }

    // Update score based on time survived
    score = Math.floor((Date.now() - startTime) / 1000);
}

// Draw game state
function draw() {
    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw character
    ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);

    // Draw obstacles
    ctx.fillStyle = 'red';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Check collision between character and obstacle
function checkCollision(rect1, rect2) {
    return !(rect1.x > rect2.x + rect2.width ||
             rect1.x + rect1.width < rect2.x ||
             rect1.y > rect2.y + rect2.height ||
             rect1.y + rect1.height < rect2.y);
}

// Reset the game
function resetGame() {
    obstacles = [];
    character.x = canvas.width / 2 - 50;
    character.y = canvas.height - 100;
    startTime = Date.now();
    score = 0;
    obstacleSpeedMultiplier = 1;
    obstacleInterval = 2000;
}

// Start the game
backgroundImage.onload = function() {
    console.log('Background image loaded successfully.');
    characterImage.onload = function() {
        console.log('Character image loaded successfully.');
        gameLoop();
    };
};

backgroundImage.onerror = function() {
    console.error('Failed to load background image.');
};

characterImage.onerror = function() {
    console.error('Failed to load character image.');
};
