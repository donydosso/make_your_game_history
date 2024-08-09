// Récupération des éléments HTML
const playerElement = document.getElementById("player");
const gameContainer = document.getElementById("gameContainer");
const overlay = document.getElementById("Overlay");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const pauseMenuElement = document.getElementById("pauseMenu");
const startMenuElement = document.getElementById("startMenu");
const startButtonElement = document.getElementById("startButton");
const resumeButtonElement = document.getElementById("resumeButton");
const restartButtonElement = document.getElementById("restartButton");
const restart = document.getElementById("restart");
const quitButtonElement = document.getElementById("quitButton");
const finalScoreElement = document.getElementById("finalScore");
const pauseButtonElement = document.getElementById("pauseButton");

// Variables pour le joueur, les ennemis, les balles, etc.
let playerX = 0;
let playerY = 0;
const enemies = [];
const bullets = [];
const enemyBullets = [];
let score = 0;
let lives = 5;
let isGameRunning = false;
let enemyDirection = 1;
let enemyMoveDown = false;
let level = 1;

// Constantes pour la configuration du jeu
const playerSpeed = 15;
const bulletSpeed = 20;
const enemyBulletSpeed = 2;
const baseEnemySpeed = 1;
const baseEnemyFireRate = 0.001;
const baseEnemySpawnRows = 1;
const baseEnemySpawnCols = 4;
const enemySpacingX = 60;
const enemySpacingY = 60;

// Calcul des perfs de jeu
let lastFrameTime = performance.now();
let fpsCounter = 0;
let fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'absolute';
fpsDisplay.style.top = '10px';
fpsDisplay.style.left = '5px';
fpsDisplay.style.color = 'white';
fpsDisplay.style.backgroundColor = 'black';
fpsDisplay.style.padding = '15px';
fpsDisplay.style.zIndex = '1000';
fpsDisplay.style.fontSize = "25px";
document.body.appendChild(fpsDisplay);

// Update les FPS
function updateFPS() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    const fps = 1000 / delta;
    fpsCounter++;
    if (fpsCounter % 50 === 0) { // Mise à jour tous les 50 frames pour lisser la valeur affichée
        fpsDisplay.textContent = `FPS: ${fps.toFixed(2)}`;
    }
    requestAnimationFrame(updateFPS);
}

// Compteur de temps de jeu
let lastTime = Date.now();
let DisplayTimeplay = document.createElement('div');
DisplayTimeplay.style.position = 'absolute';
DisplayTimeplay.style.top = '10px';
DisplayTimeplay.style.right = '5px';
DisplayTimeplay.style.color = 'white';
DisplayTimeplay.style.backgroundColor = 'black';
DisplayTimeplay.style.padding = '15px';
DisplayTimeplay.style.zIndex = '1000';
DisplayTimeplay.style.fontSize = "25px";
document.body.appendChild(DisplayTimeplay);
DisplayTimeplay.textContent = `Time: 0.00 minutes`;

function updateTimePlay() {
    if (isGameRunning) {
        const now = Date.now();
        const delta = now - lastTime;
        DisplayTimeplay.textContent = `Time: ${(delta / 60000).toFixed(2)} minutes`;
        requestAnimationFrame(updateTimePlay);
    }
}

// Fonction pour adapter la taille du jeu à l'écran
function resizeGameContainer() {
    playerX = gameContainer.offsetWidth / 2 - 25;
    playerY = gameContainer.offsetHeight - 75;
    playerElement.style.left = playerX + "px";
    playerElement.style.top = playerY + "px";
}

// Fonction pour déplacer le joueur
function movePlayer(direction) {
    if (direction === "left" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (direction === "right" && playerX < gameContainer.offsetWidth - 50) {
        playerX += playerSpeed;
    }
    playerElement.style.left = playerX + "px";
}

// Fonction pour tirer une balle
function fireBullet() {
    const bulletElement = document.createElement("div");
    bulletElement.classList.add("bullet");
    bulletElement.style.left = playerX + 22 + "px";
    bulletElement.style.top = playerY - 20 + "px";
    gameContainer.appendChild(bulletElement);
    bullets.push({ element: bulletElement, x: playerX + 22, y: playerY - 20 });
}

// Fonction pour créer une grille d'ennemis
function createEnemies() {
    const enemySpeed = baseEnemySpeed + level * 0.5;
    const enemyFireRate = baseEnemyFireRate + level * 0.0005;
    const enemySpawnRows = baseEnemySpawnRows + Math.floor(level / 2);
    const enemySpawnCols = baseEnemySpawnCols + Math.floor(level / 2);
    for (let row = 0; row < enemySpawnRows; row++) {
        for (let col = 0; col < enemySpawnCols; col++) {
            const enemyElement = document.createElement("div");
            enemyElement.classList.add("enemy");
            enemyElement.style.left = col * enemySpacingX + "px";
            enemyElement.style.top = row * enemySpacingY + "px";
            gameContainer.appendChild(enemyElement);
            enemies.push({
                element: enemyElement,
                x: col * enemySpacingX,
                y: row * enemySpacingY,
                speed: enemySpeed,
                fireRate: enemyFireRate,
            });
        }
    }
}

// Fonction pour déplacer les ennemis
function moveEnemies() {
    let leftmostEnemy = gameContainer.offsetWidth;
    let rightmostEnemy = 0;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.x += enemy.speed * enemyDirection;
        enemy.element.style.left = enemy.x + "px";
        if (enemy.x < leftmostEnemy) {
            leftmostEnemy = enemy.x;
        }
        if (enemy.x > rightmostEnemy) {
            rightmostEnemy = enemy.x;
        }
    }
    if (rightmostEnemy > gameContainer.offsetWidth - 50 || leftmostEnemy < 0) {
        enemyDirection *= -1;
        enemyMoveDown = true;
    }
    if (enemyMoveDown) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            enemy.y += enemySpacingY / 2.5;
            enemy.element.style.top = enemy.y + "px";

            if (enemy.y >= gameContainer.offsetHeight) {
                enemy.element.remove();
                enemies.splice(i, 1);
                i--;
                lives--;
                updateGameState();
            }
        }
        enemyMoveDown = false;
    }

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (Math.random() < enemy.fireRate) {
            fireEnemyBullet(enemy);
        }
    }
}

// Fonction pour tirer une balle ennemie
function fireEnemyBullet(enemy) {
    const bulletElement = document.createElement("div");
    bulletElement.classList.add("enemy-bullet");
    bulletElement.style.left = enemy.x + 22 + "px";
    bulletElement.style.top = enemy.y + 20 + "px";
    gameContainer.appendChild(bulletElement);
    enemyBullets.push({ element: bulletElement, x: enemy.x + 22, y: enemy.y + 20 });
}

// Fonction pour déplacer les balles
function moveBullets() {
    // Déplacement des balles du joueur
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y -= bulletSpeed;
        bullet.element.style.top = bullet.y + "px";
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (isCollision(bullet, enemy)) {
                bullet.element.remove();
                bullets.splice(i, 1);
                i--;
                enemy.element.remove();
                enemies.splice(j, 1);
                j--;
                score++;
                updateGameState();
                break;
            }
        }
        if (bullet.y < 0) {
            bullet.element.remove();
            bullets.splice(i, 1);
            i--;
        }
    }

    // Déplacement des balles des ennemis
    for (let i = 0; i < enemyBullets.length; i++) {
        const bullet = enemyBullets[i];
        bullet.y += enemyBulletSpeed;
        bullet.element.style.top = bullet.y + "px";
        if (isCollisionWithPlayer(bullet)) {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
            i--;
            lives--;
            updateGameState();
        }
        if (bullet.y > gameContainer.offsetHeight) {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
            i--;
        }
    }

    // Vérification des collisions entre les balles du joueur et les balles ennemies
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        for (let j = 0; j < enemyBullets.length; j++) {
            const enemyBullet = enemyBullets[j];
            if (isBulletCollision(bullet, enemyBullet)) {
                bullet.element.remove();
                bullets.splice(i, 1);
                i--;
                enemyBullet.element.remove();
                enemyBullets.splice(j, 1);
                j--;
                break;
            }
        }
    }
}

// Vérifie la collision entre une balle et un ennemi
function isCollision(bullet, enemy) {
    return bullet.y <= enemy.y + 50 && bullet.y >= enemy.y && bullet.x >= enemy.x && bullet.x <= enemy.x + 50;
}

// Vérifie la collision entre une balle ennemie et le joueur
function isCollisionWithPlayer(bullet) {
    return bullet.y + 10 >= playerY && bullet.y <= playerY + 50 && bullet.x >= playerX && bullet.x <= playerX + 50;
}

// Vérifie la collision entre une balle du joueur et une balle ennemie
function isBulletCollision(bullet, enemyBullet) {
    return bullet.x < enemyBullet.x + 10 && bullet.x + 10 > enemyBullet.x && bullet.y < enemyBullet.y + 20 && bullet.y + 20 > enemyBullet.y;
}

// Fonction pour mettre à jour l'état du jeu
function updateGameState() {
    if (lives === 0) {
        isGameRunning = false;
        gameOverElement.style.display = "block";
        overlay.style.display = "block";
        finalScoreElement.textContent = `Final Score: ${score} - Level: ${level}`;
    }
    if (enemies.length === 0 && lives > 0) {
        level++;
        if (level === 15) {
            displayVictoryMessage();
        } else {
            createEnemies();
        }
    }
    scoreElement.textContent = `Score: ${score} - Lives: ${lives} - Level: ${level}`;
}

// Fonction pour afficher le message de victoire
function displayVictoryMessage() {
    const victoryMessage = document.getElementById("victoryMessage");
    victoryMessage.classList.add("show");
    setTimeout(() => {
        victoryMessage.classList.remove("show");
        resetGame();
        isGameRunning = false;
        startMenuElement.style.display = "block";
        overlay.style.display = "block";
    }, 5000); // Laisser le message affiché pendant 2 secondes
}

// Fonction pour la boucle de jeu
function gameLoop() {
    if (isGameRunning) {
        moveEnemies();
        moveBullets();
        requestAnimationFrame(gameLoop);
    }
}

// Gestion des événements clavier
document.addEventListener("keydown", (event) => {
    if (isGameRunning) {
        if (event.key === "ArrowLeft") {
            movePlayer("left");
        } else if (event.key === "ArrowRight") {
            movePlayer("right");
        } else if (event.key === " ") {
            fireBullet();
        }
    }
});

// Gestion du bouton de démarrage
startButtonElement.addEventListener("click", () => {
    isGameRunning = true;
    startMenuElement.style.display = "none";
    overlay.style.display = "none";
    createEnemies();
    gameLoop();
    lastTime = Date.now();
    updateTimePlay();
});

// Gestion du bouton de pause
let pausetime = Date.now();
pauseButtonElement.addEventListener("click", () => {
    pausetime = Date.now();
    isGameRunning = false;
    pauseMenuElement.style.display = "block";
    overlay.style.display = "block";
});

// Gestion du bouton de reprise
resumeButtonElement.addEventListener("click", () => {
    let resumetime = Date.now();
    isGameRunning = true;
    pauseMenuElement.style.display = "none";
    overlay.style.display = "none";
    lastTime = lastTime + (resumetime - pausetime);
    gameLoop();
    updateTimePlay();
});

// Gestion du bouton de redémarrage
restart.addEventListener("click", () => {
    resetGame();
    isGameRunning = true;
    pauseMenuElement.style.display = "none";
    createEnemies();
    gameLoop();
    updateTimePlay();
});

// Gestion du bouton de redémarrage
restartButtonElement.addEventListener("click", () => {
    resetGame();
    isGameRunning = true;
    gameOverElement.style.display = "none";
    createEnemies();
    gameLoop();
    updateTimePlay();
});

// Gestion du bouton de quitter
quitButtonElement.addEventListener("click", () => {
    resetGame();
    isGameRunning = false;
    startMenuElement.style.display = "block";
    pauseMenuElement.style.display = "none";
    gameOverElement.style.display = "none";
    overlay.style.display = "block";
});

// Fonction pour réinitialiser le jeu
function resetGame() {
    for (const enemy of enemies) {
        enemy.element.remove();
    }
    for (const bullet of bullets) {
        bullet.element.remove();
    }
    for (const bullet of enemyBullets) {
        bullet.element.remove();
    }
    enemies.length = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    score = 0;
    lives = 5;
    level = 1;
    lastTime = Date.now();
    DisplayTimeplay.textContent = `Time: 0.00 minutes`;
    playerX = gameContainer.offsetWidth / 2 - 25;
    playerY = gameContainer.offsetHeight - 75;
    playerElement.style.left = playerX + "px";
    playerElement.style.top = playerY + "px";
    scoreElement.textContent = `Score: ${score} - Lives: ${lives} - Level: ${level}`;
    gameOverElement.style.display = "none";
    overlay.style.display = "none";
}

// Initialisation du jeu
resizeGameContainer();
window.addEventListener("resize", resizeGameContainer);
updateFPS();
