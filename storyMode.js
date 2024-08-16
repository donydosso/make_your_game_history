// storyMode.js

// Variables pour le mode histoire
let currentChapter = 1;
let storyProgress = 0;
let storyModeActive = false;
let storyMode = false;

// Ajout des variables du Boss
let boss = null;
let bossLives = 0;
let bossSpawnLevel = 6; // Niveau auquel le boss apparaît

// Liste des chapitres de l'histoire
const storyChapters = [
				{ title: "Episode 1: Prélude", description: "Votre monde et tout ce que vous avez toujours connu est sur le point de disparaitre !!\nLa terre est en proie aux envahisseurs venus d'une nébuleuse de lointaine.\nVous êtes l'un des seigneurs de guerre qui ont été choisi pour la défendre et repoussez cette menace imminente."},
				{ title: "Chapter 2: Rising Tension", description: "The enemies grow stronger as you push forward..." },
				{ title: "Chapter 3: The Final Showdown", description: "It's time to face the ultimate challenge..." }
];

// Fonction pour démarrer le mode histoire
function startStoryMode() {
				resetGame()
				storyModeActive = true;
				storyMode = true;
				currentChapter = 1;
				storyProgress = 0;
				displayChapter(currentChapter);
}

// Fonction pour afficher un chapitre de l'histoire
function displayChapter(chapterNumber) {
				const chapter = storyChapters[chapterNumber - 1];
				if (chapter) {
								overlay.style.display = "block";
								pauseMenuElement.style.display = "none";
								gameOverElement.style.display = "none";
								startMenuElement.style.display = "none";
								displayStoryOverlay(chapter.title, chapter.description);
				} else {
								// Si tous les chapitres sont terminés, afficher le message de victoire
								displayVictoryMessage();
								storyModeActive = false;
				}
}

// Fonction pour afficher une superposition avec le texte du chapitre
function displayStoryOverlay(title, description) {
				const storyOverlay = document.createElement("div");
				storyOverlay.classList.add("story-overlay");
				storyOverlay.innerHTML = `<h2>${title}</h2><p>${description}</p><button id="continueButton">Continue</button>`;
				overlay.appendChild(storyOverlay);

				document.getElementById("continueButton").addEventListener("click", () => {
								storyOverlay.remove();
								overlay.style.display = "none";
								storyModeActive = true;
								resumeStoryMode();
				});
}

// Fonction pour reprendre le mode histoire
function resumeStoryMode() {
				if (storyModeActive) {
					createEnemies();
					gameLoop();
					lastTime = Date.now();
					updateTimePlay();
				}
}

// Fonction pour passer au chapitre suivant
function nextChapter() {
	storyModeActive = false;
				currentChapter++;
				if (currentChapter <= storyChapters.length) {
								displayChapter(currentChapter);
				} else {
								displayVictoryMessage();
				}
}

// Fonction pour créer le boss
function createBoss() {
				bossLives = 10 + level; // Le nombre de vies du boss dépend du niveau actuel
				const bossElement = document.createElement("div");
				bossElement.classList.add("boss");
				bossElement.style.left = gameContainer.offsetWidth / 2 - 75 + "px"; // Centré horizontalement
				bossElement.style.top = "50px"; // Positionné en haut de l'écran
				gameContainer.appendChild(bossElement);
				boss = { element: bossElement, x: gameContainer.offsetWidth / 2 - 75, y: 50, speed: 2 + level * 0.5 };
}

// Fonction pour déplacer le boss :
function moveBoss() {
				if (boss) {
								boss.x += boss.speed * enemyDirection;
								if (boss.x <= 0 || boss.x >= gameContainer.offsetWidth - 150) {
												enemyDirection *= -1; // Inverse la direction si le boss touche les bords
								}
								boss.element.style.left = boss.x + "px";

								// Possibilité d'ajouter des tirs du boss ici
								if (Math.random() < 0.05) {
												fireEnemyBullet(boss); // Utilise la même fonction de tir que les ennemis
								}
				}
}
