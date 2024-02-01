
// Game Constants and Variables:-
let inputStepDirection = { x: 0, y: 0 };
let speed = 12;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 7, y: 10 };
let bgMusicAlreadyPlayed = false;
let score = 0;
let hiscoreval = 0;

const foodAppearMinCoordinateValue = 2;
const foodAppearMaxCoordinateValue = 18;
const grdMin = 1;
const grdMax = 20;
const foodSound = new Audio('Assets/food.mp3');
const gameOverSound = new Audio('Assets/gameover.mp3');
const moveSound = new Audio('Assets/move.mp3');
const musicSound = new Audio('Assets/music.mp3');


// Game Functions:-
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();

}


function Collides(snake) {
  // Into itself:-
  for (let index = 1; index < snakeArr.length; index++) {
    if (snake[index].x === snake[0].x && snake[index].y === snake[0].y) {
      return true;
    }
  }
  // Into wall:-
  if (snake[0].x > grdMax || snake[0].x < grdMin || snake[0].y > grdMax || snake[0].y < grdMin) {
    return true;
  }

}


function gameEngine() {

  // When food is eaten, increment the score and regenerate the food:-
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem('hiScore', JSON.stringify(hiscoreval));
      hiScore.innerHTML = 'Hi-Score: ' + hiscoreval;
    }
    scoreBox.innerHTML = 'Score: ' + score;
    snakeArr.unshift({ x: snakeArr[0].x + inputStepDirection.x, y: snakeArr[0].y + inputStepDirection.y });
    let xRandomCoordinateForFood = Math.round(foodAppearMinCoordinateValue + (foodAppearMaxCoordinateValue - foodAppearMinCoordinateValue) * Math.random());
    let yRAndomCoordinateForFood = Math.round(foodAppearMinCoordinateValue + (foodAppearMaxCoordinateValue - foodAppearMinCoordinateValue) * Math.random());
    food = { x: xRandomCoordinateForFood, y: yRAndomCoordinateForFood };
  }

  // Moving the snake:-
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputStepDirection.x;
  snakeArr[0].y += inputStepDirection.y;

  // Part 1: Updating the snake array:-
  if (Collides(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputStepDirection = { x: 0, y: 0 };
    alert('Game over, press any key to play again.');
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    bgMusicAlreadyPlayed = false;
    scoreBox.innerHTML = 'Score: ' + score;
  }

  // Part 2: Render the snake:-
  board.innerHTML = '';
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index == 0) {
      snakeElement.classList.add('snakeHead');
    }
    else {
      snakeElement.classList.add('snakeBody');
    }
    board.appendChild(snakeElement);
  })

  // Part 3: Render the food:-
  foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}


// Main Logic of the game:-
let hiscore = localStorage.getItem('hiScore');
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem('hiScore', JSON.stringify(hiscoreval));
}
else {
  hiscoreval = JSON.parse(hiscore);
  hiScore.innerHTML = 'Hi-Score: ' + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
  inputStepDirection = { x: 0, y: 1 }           // Start the game.
  if (bgMusicAlreadyPlayed === false) {
    bgMusicAlreadyPlayed = true;
    musicSound.play();
  }
  moveSound.play();

  switch (e.key) {
    case 'ArrowUp':
      inputStepDirection.x = 0;
      inputStepDirection.y = -1;
      break;

    case 'ArrowDown':
      inputStepDirection.x = 0;
      inputStepDirection.y = 1;
      break;

    case 'ArrowRight':
      inputStepDirection.x = 1;
      inputStepDirection.y = 0;
      break;

    case 'ArrowLeft':
      inputStepDirection.x = -1;
      inputStepDirection.y = 0;
      break;


    default:
      break;
  }
});