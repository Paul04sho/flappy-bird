// Setup du canevas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Interface utilisateur
const gameScreen = document.querySelector('.game-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const currentScoreDisplay= document.querySelector('current-score');
const scoreElement = document.getElementById('currentScore');
const finalScore = document.getElementById('finalScore');
const bestScore = document.getElementById('bestScore');
const restartBtn = document.getElementById('restartButton');

// Image de notre oiseau
const bird = new Image();
bird.src = "images/bird2.png";

// Coordonnées de l'oiseau
let bX = 10;
let bY = 150;
let gravity = 1.5;

function drawBird() {
    ctx.drawImage(bird, bX, bY, 40, 30);

    bY += gravity;

    requestAnimationFrame(drawBird);
};

drawBird();

