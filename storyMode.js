// storyMode.js

// Variables pour le mode histoire
let currentChapter = 1;
let storyProgress = 0;
let storyModeActive = false;

// Liste des chapitres de l'histoire
const storyChapters = [
				{ title: "Chapter 1: The Beginning", description: "You have just joined the battle..." },
				{ title: "Chapter 2: Rising Tension", description: "The enemies grow stronger as you push forward..." },
				{ title: "Chapter 3: The Final Showdown", description: "It's time to face the ultimate challenge..." }
];

// Fonction pour démarrer le mode histoire
function startStoryMode() {
				storyModeActive = true;
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
								resumeStoryMode();
				});
}

// Fonction pour reprendre le mode histoire
function resumeStoryMode() {
				if (storyModeActive) {
								gameLoop();  // Relance la boucle de jeu
								// Logique supplémentaire spécifique au mode histoire
				}
}

// Fonction pour passer au chapitre suivant
function nextChapter() {
				currentChapter++;
				if (currentChapter <= storyChapters.length) {
								displayChapter(currentChapter);
				} else {
								displayVictoryMessage();
				}
}
