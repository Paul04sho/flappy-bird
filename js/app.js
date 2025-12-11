// Canevas de base (grille de jeux)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elements du jeu
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameUI = document.getElementById('gameUI');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const bestScoreDisplay = document.getElementById('bestScore');
const restartBtn = document.getElementById('restartBtn');

// Variables de jeu
const bird = {
    x: 50, 
    y: canvas.height / 2,
    with: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -8,
    color: '#ffd700'
};

let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

let pipes = [];
const pipeGap = 150;
const pipeWidth = 60;
const pipeSpeed = 2;

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état du jeu
function updateUI() {
   startScreen.classList.toggle('hidden', gameState !== 'start');
   gameOverScreen.classList.toggle('hidden', gameState !== 'gameover');
   gameUI.classList.toggle('hidden', gameState !== 'playing');

    if (gameState === 'gameover') {
        finalScoreDisplay.textContent = `Score: ${score}`;
        bestScoreDisplay.textContent = `Meilleur Score: ${bestScore}`;
    }

    if (gameState === 'playing') {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

function startGame() {
    gameState = 'playing';
    score = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    updateUI();
}

function gameOver() {
    gameState = 'gameover';

    // Mettre à jour le meilleur score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    updateUI();
}

// Fonction pour effacer le contenu du canevas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}