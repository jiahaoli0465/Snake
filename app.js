const ROWS = 20;
const COLS = 30;
const MAX_APPLES = 5;

const board = document.getElementById('board');
let cells = [];

let snake = [
  [15, 6],
  [15, 7],
  [15, 8],
];

let apples = [[10, 10]];

//'up', 'down', 'left', 'right'
let currentDirection = 'right';

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
};

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'w') input.up = true;
  if (key === 's') input.down = true;
  if (key === 'a') input.left = true;
  if (key === 'd') input.right = true;
});

document.addEventListener('keyup', (event) => {
  const key = event.key;

  if (key === 'w') input.up = false;
  if (key === 's') input.down = false;
  if (key === 'a') input.left = false;
  if (key === 'd') input.right = false;
});

const init = () => {
  for (let row = 0; row < ROWS; row++) {
    const tr = document.createElement('tr');
    const rowCells = [];
    for (let col = 0; col < COLS; col++) {
      const td = document.createElement('td');
      tr.appendChild(td);
      rowCells.push(td);
    }
    board.appendChild(tr);
    cells.push(rowCells);
  }
};

const resetBoard = () => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells[row][col].className = '';
    }
  }
};

const drawSnake = () => {
  snake.forEach(([r, c]) => {
    cells[r][c].classList.add('snake');
  });
  const head = getHead();
  cells[head[0]][head[1]].classList.add('snake-head');
};

const drawApples = () => {
  for (let i = 0; i < apples.length; i++) {
    const [r, c] = apples[i];
    cells[r][c].classList.add('apple');
  }
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Return the [row, col] of the snake's head
const getHead = () => {
  return snake[snake.length - 1];
};

const updateDirection = () => {
  if (input.up && currentDirection !== 'down') {
    currentDirection = 'up';
  } else if (input.down && currentDirection !== 'up') {
    currentDirection = 'down';
  } else if (input.left && currentDirection !== 'right') {
    currentDirection = 'left';
  } else if (input.right && currentDirection !== 'left') {
    currentDirection = 'right';
  }
};

const isAtAnApple = (head) => {
  for (let i = 0; i < apples.length; i++) {
    const [r, c] = apples[i];
    if (r === head[0] && c === head[1]) {
      return true;
    }
  }
  return false;
};

const moveSnake = () => {
  const head = getHead();
  let newHead;

  const [row, col] = head;

  if (currentDirection === 'up') {
    newHead = [row - 1, col];
  } else if (currentDirection === 'down') {
    newHead = [row + 1, col];
  } else if (currentDirection === 'left') {
    newHead = [row, col - 1];
  } else if (currentDirection === 'right') {
    newHead = [row, col + 1];
  }

  // Check boundary collision
  if (
    newHead[0] < 0 ||
    newHead[0] >= ROWS ||
    newHead[1] < 0 ||
    newHead[1] >= COLS
  ) {
    return false;
  }

  for (let i = 0; i < snake.length; i++) {
    const [r, c] = snake[i];
    if (r === newHead[0] && c === newHead[1]) {
      // Self-collision
      return false;
    }
  }

  // Move the snake:
  snake.push(newHead);

  if (isAtAnApple(newHead)) {
    apples = apples.filter(([r, c]) => r !== newHead[0] || c !== newHead[1]);

    let numberOfApples = Math.floor(Math.random() * 3) + 1;
    if (apples.length + numberOfApples > MAX_APPLES) {
      numberOfApples = MAX_APPLES - apples.length;
    }

    for (let i = 0; i < numberOfApples; i++) {
      let r = Math.floor(Math.random() * ROWS);
      let c = Math.floor(Math.random() * COLS);

      if (snake.some(([sr, sc]) => sr === r && sc === c)) {
        // Apple is on the snake, try again
        i--;
      } else {
        apples.push([r, c]);
      }
    }
  } else {
    // Remove the tail
    snake.shift();
  }

  return true;
};

let gameState = 'on';

const start = async () => {
  init();

  while (gameState === 'on') {
    updateDirection();

    const success = moveSnake();
    if (!success) {
      // Collision happened
      gameState = 'off';
      break;
    }

    resetBoard();
    drawSnake();
    drawApples();

    await wait(50);
  }

  console.log('Game Over!');
};

start();

const reset = () => {
  resetBoard();
  cells = [];
  board.innerHTML = '';

  snake = [
    [15, 6],
    [15, 7],
    [15, 8],
  ];

  apples = [[10, 10]];

  currentDirection = 'right';
  gameState = 'on';

  start();
};

document.querySelector('button').addEventListener('click', reset);
