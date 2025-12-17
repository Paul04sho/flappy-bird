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

// Objets de jeu
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

document.body.addEventListener("keydown", (e) => {
    console.log(`Touche pressée: ${e.key}`);
})

    



