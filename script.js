const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let container__lives = document.querySelector(".container__lives");
let container__over = document.querySelector(".container__over");
let container__restart = document.querySelector(".container__restart");

let roundsPlayed = 4;

const bricks = [];
let heart = 3;
const paddle = {
  x: 300,
  y: 480,
  width: 200,
  height: 10,
  color: "orange",
};

const ball = {
  x: paddle.width + paddle.width,
  y: canvas.height + 25,
  radius: 10,
  dx: 0,
  dy: 0,
  speed: -2,
  color: "red",
};

let gameStarted = false;

document.addEventListener("keydown", startPaddle);

function startPaddle(event) {
  if (event.keyCode === 32 || event.key === " ") {
    console.log(event.keyCode);
    if (!gameStarted) {
      const randomDirection = Math.random() >= 0.5 ? 1 : -1;
      ball.dx = ball.speed * randomDirection;
      ball.dy = ball.speed;
      gameStarted = true;
    }
  }
}
function drawPaddle() {
  context.fillStyle = paddle.color;
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
  context.closePath();
}

function drawBricks() {
  bricks.forEach((brick) => {
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  });

  if (bricks.length === 0) {
    container__restart.innerHTML = `
    <div class="container__winstart"> You win  </div>
    `;
    container__lives.remove();
  }
}

function collideRect(circle, rect) {
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;

  return (
    distanceX * distanceX + distanceY * distanceY <=
    circle.radius * circle.radius
  );
}

function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (
    ball.x + ball.radius >= canvas.width - ball.speed ||
    ball.x - ball.radius <= ball.speed
  ) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius <= 0) {
    ball.dy = -ball.dy;
  }

  if (
    ball.y + ball.radius + paddle.height >= canvas.height - paddle.height &&
    ball.x >= paddle.x + paddle.height &&
    ball.x <= paddle.x + paddle.width
  ) {
    ball.dy = -ball.dy;
  }

  if (
    ball.y + ball.radius >= canvas.height - paddle.height &&
    ball.x + ball.radius >= paddle.x &&
    ball.x + ball.radius <= paddle.x + paddle.width
  ) {
    ball.dy = -ball.dy;
    ball.dx = -ball.dx;
  }
  for (let index = 0; index < bricks.length; index++) {
    const brick = bricks[index];

    if (collideRect(ball, brick)) {
      bricks.splice(index, 1);

      if (
        ball.y + ball.radius + ball.speed <= brick.y ||
        ball.y >= brick.y + brick.height + ball.speed ||
        canvas.width - brick.x === ball.x + ball.radius
      ) {
        ball.dy *= -1;
      } else {
        ball.dx *= -1;
      }

      break;
    }
  }
}

function gameOver() {
  // if (roundsPlayed === 0) {
  container__over.innerHTML = `you lose`;
  gameStarted = false;
  container__restart.innerHTML = `you lost the game will start again soon`;
  // draw.reload()

  setTimeout(() => {
    document.location.reload();
  }, 2000);
  // }
}

function draw() {
  container__lives.innerHTML = `you have 3 attempts /${roundsPlayed}`;

  if (roundsPlayed === 0) {
    container__over.innerHTML = `you lose`;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  updateBallPosition();
  requestAnimationFrame(draw);

  if (ball.y + ball.radius >= canvas.height) {
    roundsPlayed--;
    container__heart.innerHTML = "";

    for (let index = 0; index < roundsPlayed; index++) {
      container__heart.innerHTML += `
        <img src="./img/heart.png" alt="">
      `;
    }

    resetBall();
    if (roundsPlayed === 0) {
      gameOver();
    }
  }
}

document.addEventListener("keydown", keydown);
function resetBall() {
  ball.x = paddle.x + 100;
  ball.y = canvas.height - 30;
  ball.dx = 0;
  ball.dy = 0;
  gameStarted = false;
}

function keydown(event) {
  if (event.key === "ArrowLeft" && paddle.x - 20 >= 0) {
    paddle.x -= 20;
    if (gameStarted === false) {
      ball.x -= 20;
    }
  } else if (
    event.key === "ArrowRight" &&
    paddle.x <= canvas.width - paddle.width - 10
  ) {
    paddle.x += 20;
    if (gameStarted === false) {
      ball.x += 20;
    }
  }
}

function generateBricks() {
  const rows = Math.floor(Math.random() * 6) + 3;
  const brickHeight = 20;

  for (let row = 0; row < rows * brickHeight; row += brickHeight) {
    const cols = Math.floor(Math.random() * 6) + 3;
    const brickWidth = canvas.width / cols;

    for (let col = 0; col < canvas.width; col += brickWidth) {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);
      const randomColor = `rgb(${red}, ${green}, ${blue})`;

      let brick = {
        x: col,
        y: row,
        width: brickWidth,
        height: brickHeight,
        color: randomColor,
      };
      bricks.push(brick);
    }
  }
}

function resetGame() {
  roundsPlayed = 3;
  bricks.length = 0;
  generateBricks();
  resetBall();
  draw();
}

generateBricks();
draw();
