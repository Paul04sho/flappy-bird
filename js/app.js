const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Permet d'utiliser les touches du clavier pour jouer
canvas.tabIndex = 1

// Pour controler les rotations de l'oiseau 
const angleInRadians = Math.PI / 180;

const state = {
    current: 0,
    getReady: 0,
    Play: 1,
    gameOver: 2,
};

let frames = 0;
// Changement de coordonnée x : les tuyaux et l'arrière-plan se déplacent de 2 pixels vers la gauche à chaque frame
let deltaX = 2;

// Joue un son différent selon l'état de jeu 
const SFX = {
    start: new Audio(),
    flap:  new Audio(),
    hit:  new Audio(),
    die:  new Audio(),
    played: false,
};

// Permet de switcher entre les états de jeu (Début de partie, En cours, Fin de partie)
canvas.addEventListener("click", () => {
    switch (state.current) {
        case state.getReady :
            state.current = state.Play;
            SFX.start.play();
            break;
        case state.Play :
           bird.flap();
           break;
        case state.gameOver :
            state.current = state.getReady;
            bird.speed = 0;
            bird.y = 100;
            pipe.pipes = [];
            UI.score.current = 0;
            SFX.played = false;
            break;
    }
});

