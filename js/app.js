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
        case state.getReady:
            state.current = state.Play;
            SFX.start.play();
            break;
        case state.Play:
           bird.flap();
           break;
        case state.gameOver:
            state.current = state.getReady;
            bird.speed = 0;
            bird.y = 100;
            pipe.pipes = [];
            UI.score.current = 0;
            SFX.played = false;
            break;
    }
});

canvas.onkeydown = function keyDown(e) {
    if (e.key === ' ' || e.key === 'w' || e.key === 'ArrowUp') {
        // A exécuter lorsque l'utilisateur presse la touche Espace, w ou la flèche du haut
        switch (state.current) {
            case state.getReady:
                state.current = state.Play;
                SFX.start.play();
                break;
            case state.Play:
                bird.flap();
                break;
            case state.gameOver:
                state.current = state.getReady;
                bird.speed = 0;
                bird.y = 100;
                pipe.pipes = [];
                UI.score.current = 0;
                SFX.played = false;
                break;
        }
    }
};

// Pour dessiner le sol 
const ground = {
    sprite: new Image(),
    x: 0,
    y: 0,
    draw: function () {
        this.y = parseFloat(canvas.height - this.sprite.height);
        ctx.drawImage(this.sprite, this.x, this.y);
    },
    update: function () {
        if (state.current != state.Play) return;
        this.x -= deltaX;
        this.x = this.x % (this.sprite.width / 2)
    },
};

// Pour dessiner l'arrière-plan
const bg = {
    sprite: new Image(),
    x: 0,
    y: 0,
    draw: function () {
        this.y = parseFloat(canvas.height - this.sprite.height);
        ctx.drawImage(this.sprite, this.x, this.y);
    },
};

// Pour dessiner les tuyaux
const pipe = {
    top: { sprite: new Image() },
    bottom: { sprite: new Image() },
    gap: 85,
    moved: true,
    pipes: [],
    draw: function () {
        for (let i = 0; i < this.pipes.length; i++) {
            let p = this.pipes[i];
            ctx.drawImage(this.top.sprite, p.x, p.y);
            ctx.drawImage(
                this.bottom.sprite,
                p.x,
                p.y + parseFloat(this.top.sprite.height) + this.gap
            );
        }
    },
    update: function () {
        if (state.current !== state.Play) return;
        if (frames % 100 == 0) {
            this.pipes.push ({
                x: parseFloat(canvas.width),
                y: -210 * Math.min(Math.random() + 1, 1.8),
            });
        }
        this.pipes.forEach((pipe) => {
            pipe.x -= deltaX;
        });

        if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
            this.pipes.shift();
            this.moved = true;
        }
    },
};

const bird = {
    animations: [
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
    ],
    rotation: 0,
    x: 50,
    y: 100,
    speed: 0,
    gravity: 0.125,
    thrust: 3.6,
    frame: 0,
    draw: function () {
        let birdHeight = this.animations[this.frame].sprite.height;
        let birdWidth = this.animations[this.frame].sprite.width;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * angleInRadians);
        ctx.drawImage(this.animations[this.frame].sprite, -birdWidth / 2, -birdHeight / 2);
        ctx.restore();
    },
    update: function () {
        // Bloc de code servant à mettre à jour la position de l'oiseau après chaque déplacement
    }
}

// Chemin d'accès aux images et aux sons utilisé dans le jeu 
ground.sprite.src = "img/ground.png";
bg.sprite.src = "img/BG.png";
pipe.top.sprite.src = "img/toppipe.png";
pipe.bottom.sprite.src = "img/botpipe.png";
SFX.start.src = "sfx/sfx_start.wav";
SFX.flap.src = "sfx/sfx_flap.wav";
SFX.score.src = "sfx/sfx_score.wav";
SFX.hit.src = "sfx/sfx_hit.wav";
SFX.die.src = "sfx/sfx_die.wav";



