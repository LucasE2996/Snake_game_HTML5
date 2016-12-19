var canvas, ctx, WIDTH, HEIGHT, FPS, tileSize, playing;
var snake;
var globalTouch = [],
  offset = [];
var keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", touchMove);
window.addEventListener("touchend", touchEnd);
window.addEventListener("keydown", keyDown);

//resize window em tempo real
window.addEventListener("resize", resizeWindow);

function touchStart(e) {
  //zera as funcoes touch da tela
  e.preventDeafault();

  //pega o valor do primero touch na tela
  var touch = e.touches[0];

  //recebe o valor das COORDENADAS do touch
  globalTouch = [touch.pageX, touch.pageY];
  alert(globalTouch[0] + " " + globalTouch[1]);
}

function touchMove(e) {
  var touch = e.touches[0];

  //offset pega o valor do MOVIMENTO do touch em x e y
  offset = [touch.pageX - globalTouch[0],
    touch.pageY - globalTouch[1]
  ];

}

function touchEnd(e) {
  //se o movimento em x for maior do que em y
  if (Math.abs(offset[0]) > Math.abs(offset[1]))
    snake.direction = [offset[0] / Math.abs(offset[0]), 0];

  else
    snake.direction = [0, offset[1] / Math.abs(offset[1])];
}

function keyDown(e) {

  if (!playing && (e.keycode == keys.up || e.keycode == keys.down || e.keycode == keys.up || e.keycode == keys.down))
    playing = true;

  switch (e.keyCode) {
    case keys.left:
      snake.direction = [-1, 0];
      break;

    case keys.up:
      snake.direction = [0, -1];
      break;

    case keys.right:
      snake.direction = [1, 0];
      break;

    case keys.down:
      snake.direction = [0, 1];
  }
}

function resizeWindow() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  //divide a tela em blocos *inteiros*
  tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));
}

//inicializador
function init() {
  canvas = document.createElement("canvas");
  resizeWindow();
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  FPS = 30;

  newGame();
  run();
}

function newGame() {
  snake = new Snake();

  playing = false;
}

//personagem
function Snake() {
  //coordenadas do corpo
  this.body = [
    [10, 10],
    [10, 11],
    [10, 12]
  ];
  this.color = "#000";

  //faz a snake subir
  this.direction = [0, -1];

  this.update = function() {
    //try unshift later
    //nextPos = [vetor 0][posicao x] + [direcao em x]
    nextPos = [
      this.body[0][0] + this.direction[0],
      this.body[0][1] + this.direction[1]
    ];

    if (!playing) {
      //se estiver subindo e se chegar a 10% da altura
      if (this.direction[1] == -1 && nextPos[1] <= (HEIGHT * 0.1 / tileSize)) {
        //se movimenta para a direita
        this.direction = [1, 0];
      } else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH * 0.9 / tileSize)) {
        //se movimenta para baixo
        this.direction = [0, 1];
      } else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT * 0.9 / tileSize)) {
        //se movimenta para a esquerda
        this.direction = [-1, 0];
      } else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH * 0.1 / tileSize)) {
        //se movimenta para cima
        this.direction = [0, -1];
      }
    }

    if (nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1]) {
      this.body.reverse();
      nextPos = [
        this.body[0][0] + this.direction[0],
        this.body[0][1] + this.direction[1]
      ];
    }

    this.body.pop();
    this.body.splice(0, 0, nextPos);
  }
  this.draw = function() {
    ctx.fillStyle = this.color;

    for (var i = 0; i < this.body.length; i++) {
      //let declarate a variable the is limited only in this block of code
      //fillRect(posicao inicial, tamanho)
      ctx.fillRect(this.body[i][0] * tileSize,
                   this.body[i][1] * tileSize,
                   tileSize,
                   tileSize
      );
    }
  }
}

//atualiza
function update() {
  snake.update();
}

//roda
function run() {
  update();
  draw();

  //fazer teste com animationframe
  setTimeout(run, 1000 / FPS);
}

//desenha
function draw() {
  //limpa a tela
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  snake.draw();
}

//chama a função principal
init();