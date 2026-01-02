// Pour controler les rotations de l'oiseau 
const angleInRadians = Math.PI / 180;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Permet d'utiliser les touches du clavier pour jouer
canvas.tabIndex = 1

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
    if (e.code === "Space" || e.code === "w" || e.code === "ArrowUp") {
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

let frames = 0;

// Changement de coordonnée x : les tuyaux et l'arrière-plan se déplacent de 2 pixels vers la gauche à chaque frame
let deltaX = 2;

const state = {
    current: 0,
    getReady: 0,
    Play: 1,
    gameOver: 2,
};

// Joue un son différent selon l'état de jeu 
const SFX = {
    start: new Audio(),
    flap:  new Audio(),
    score: new Audio(),
    hit:  new Audio(),
    die:  new Audio(),
    played: false,
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

// Pour dessiner l'oiseau et lui appliquer des propriétés 
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
        // Calcule le rayon de l'oiseau (en forme de cercle) afin de faciliter la détection de collision
       let radius = parseFloat(this.animations[0].sprite.width) / 2;
       switch (state.current) {
        case state.getReady:
            this.rotation = 0;
            this.y += frames % 10 == 0 ? Math.sin(frames * angleInRadians) : 0;
            break;
        case state.Play:
            this.frame += frames % 5 == 0 ? 1 : 0;
            this.y += this.speed;
            this.setRotation();
            this.speed += this.gravity;
            if (this.y + radius >= ground.y || this.collisioned()) {
                state.current = state.gameOver;
            }

            break;
       }
       this.frame = this.frame % this.animations.length;
    },
    flap: function () {
        if (this.y > 0) {
            SFX.flap.play();
            this.speed = -this.thrust;
        }
    },
    setRotation: function () {
        if (this.speed <= 0) {
            this.rotation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
        } else if (this.speed > 0) {
            this.rotation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
        }
    },
    collisioned: function () {
        if (!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let radius = bird.height / 4 + bird.width / 4;
        let roof = y + parseFloat(pipe.top.sprite.height);
        let floor = roof + pipe.gap;
        let topPipeWidth = parseFloat(pipe.top.sprite.width);
        if (this.x + radius >= x) {
            if (this.x + radius < x + topPipeWidth) {
                if (this.y - radius <= roof || this.y + radius >= floor) {
                    SFX.hit.play();
                    return true;
                }
            } else if (pipe.moved) {
                UI.score.current++;
                SFX.score.play();
                pipe.moved.false;
            }
        }
    },
};

// Pour gérer l'affichage du score et des états de jeu
const UI = {
    getReady: { sprite: new Image() },
    gameOver:  { sprite: new Image() },
    tap: [{ sprite: new Image() }, { sprite: new Image() }],
    score: {
        current: 0,
        best: 0,
    },
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    frame: 0,
    draw: function () {
        switch (state.current) {
            case state.getReady:
                this.y = parseFloat(canvas.height - this.getReady.sprite.height) / 2;
                this.x = parseFloat(canvas.width - this.getReady.sprite.width) / 2;
                this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
                this.ty = this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
                ctx.drawImage(this.getReady.sprite, this.x, this.y);
                ctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
                break;
            case state.gameOver: 
            this.y = parseFloat(canvas.height - this.gameOver.sprite.height) / 2;
            this.x = parseFloat(canvas.width - this.gameOver.sprite.width) / 2;
            this.tx = parseFloat(canvas.width - this.tap[0].sprite.width) / 2;
            this.ty = this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
            ctx.drawImage(this.gameOver.sprite, this.x, this.y);
            ctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
            break;
        }
        this.drawScore();
    },
    drawScore: function () {
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        switch(state.current) {
            case state.Play:
                ctx.lineWidth = "2";
                ctx.font = "35px Squada One";
                ctx.fillText(this.score.current, canvas.width / 2 - 5, 50);
                ctx.strokeText(this.score.current, canvas.width / 2 - 5, 50);
                break;
            case state.gameOver:
                ctx.lineWidth = "2";
                ctx.font = "40px Squada One";
                let score = `SCORE : ${this.score.current}`;
                try {
                    this.score.best = Math.max(
                        this.score.current,
                        localStorage.getItem("best")
                    );
                    localStorage.setItem("best", this.score.best);
                    let bestscore = `BEST: ${this.score.best}`;
                    ctx.fillText(score, canvas.width / 2 - 80, canvas.height / 2 + 0);
                    ctx.strokeText(score, canvas.width / 2 - 80, canvas.height / 2 + 0);
                    ctx.fillText(bestscore, canvas.width / 2 - 80, canvas.height / 2 + 30);
                    ctx.strokeText(bestscore, canvas.width / 2 - 80, canvas.height / 2 + 30);
                } catch (e) {
                    ctx.fillText(score, canvas.width / 2 - 85, canvas.height / 2 + 15);
                    ctx.strokeText(score, canvas.width / 2 - 85, canvas.height / 2 + 15);
                }

                break;
        }
    },
    update: function () {
        if (state.current == state.Play) return;
        this.frame += frames % 10 == 0 ? 1 : 0;
        this.frame = this.frame % this.tap.length;
    },
};

// Chemin d'accès aux images et aux sons utilisé dans le jeu 
ground.sprite.src = "img/ground.png";
bg.sprite.src = "img/BG.png";
pipe.top.sprite.src = "img/toppipe.png";
pipe.bottom.sprite.src = "img/botpipe.png";
UI.getReady.sprite.src = "img/getready.png";
UI.gameOver.sprite.src = "img/go.png";
UI.tap[0].sprite.src = "img/tap/t0.png";
UI.tap[1].sprite.src = "img/tap/t1.png";
bird.animations[0].sprite.src = "img/bird/b0.png";
bird.animations[1].sprite.src = "img/bird/b1.png";
bird.animations[2].sprite.src = "img/bird/b2.png";
bird.animations[3].sprite.src = "img/bird/b0.png";
SFX.start.src = "sfx/sfx_start.wav";
SFX.flap.src = "sfx/sfx_flap.wav";
SFX.score.src = "sfx/sfx_score.wav";
SFX.hit.src = "sfx/sfx_hit.wav";
SFX.die.src = "sfx/sfx_die.wav";

// Boucle de jeu
function gameLoop() {
    update();
    draw();
    frames++;
}

// Ajuste la position des éléments du jeu en fonction de l'état
function update() {
    bird.update();
    ground.update();
    pipe.update();
    UI.update();
}

// Rend visible le jeu et ses composants sur le canevas
function draw() {
    ctx.fillStyle = "#30c0df";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bg.draw();
    pipe.draw();

    bird.draw();
    ground.draw();
    UI.draw();
}

setInterval(gameLoop, 20);




