// Setup du canevas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Interface utilisateur
const gameScreen = document.querySelector('.game-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const currentScoreDisplay= document.querySelector('.current-score');
const scoreElement = document.getElementById('currentScore');
const finalScore = document.getElementById('finalScore');
const bestScore = document.getElementById('bestScore');
const restartBtn = document.getElementById('restartButton');

// Etats de jeu (écran de début, en cours de jeu, écran de fin de partie)
const gameState = {
   DEBUT_DE_PARTIE: 'ready',
   EN_COURS: 1,
   GAME_OVER: 'game_over'
};

// Objets du jeu
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.6,
    jumpStrength: -10,
    color: 'yellow'
};

let pipes = [];
const pipeGap = 120;
const pipeWidth = 60;
const pipeSpeed = 2;

// Structure selon qui permet de passer d'un état à l'autre
let currentState = gameState.DEBUT_DE_PARTIE;

console.log("État initial :", currentState);

currentState = gameState.EN_COURS;

console.log("Nouvel état: ", currentState);

switch (currentState) {
    case gameState.DEBUT_DE_PARTIE :
        console.log("Affichage de l'écran du début...");
        break;
    case gameState.EN_COURS : 
        console.log("Chargement du jeu...");
        // ... appel d'une fonction pour montrer le visuel du jeu ...
        break;
    case gameState.GAME_OVER :
        console.log("Affichage de l'écran de fin de partie...");
        if(gameOverScreen.classList.contains('hidden')) {
            gameOverScreen.remove('hidden');
        }
        break;
};

// Pour gérer le lancement des parties
document.addEventListener("keydown", (e) => {
    console.log(`Touche pressée: ${e.key}`);
});

gameScreen.addEventListener("click", () => {
    console.log("1,2,3...Let's play !");
});

// Lorsque le joueur clique sur le bouton 'Recommencer', les éléments liés au Game Over sont cachés
restartBtn.addEventListener("click", () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.style.display = 'block';
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Dessiner le ciel
function drawSky () {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessiner les nuages 
function drawClouds () {

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    drawCloud(100, 80, 0.8);
    drawCloud(300, 120, 0.6);
    drawCloud(50, 200, 0.7);
    drawCloud(350, 250, 0.5);

    function drawCloud(x, y, scale) {
        // Formes des nuages avec des fonctions de trajet
    }
}



    



