// Set game state on browser loading
document.addEventListener('DOMContentLoaded', function () {
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
});

// Define Constants here
const startButton = document.querySelector('#start-button');
const leaderboardButton = document.querySelector('#leaderboard-button');
const homeButton = document.querySelector('#home-button');

homeButton.addEventListener('click', function () {
  console.log('You clicked home');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'flex';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
});

const snakePosition = [];
const gridContainer = document.querySelector('.grid-container');
const gridItems = [];
const rows = 15;
const cols = 20;

// Function to iterate through grid container matrix,
// create elements for each cell, and append them to 'grid-item'
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.dataset.index = row * cols + col;
    gridContainer.appendChild(gridItem);
    gridItems.push(gridItem);
  }
}

// Function to generate a random starting position
function getRandomPosition() {
  const row = Math.floor(Math.random() * rows);
  const col = Math.floor(Math.random() * cols);
  return { row, col, index: row * cols + col };
}

// Function to determine the initial movement direction based on the quadrant
function getInitialDirection(position) {
  const { row, col } = position;
  if (row < rows / 2 && col < cols / 2) {
    return Math.random() < 0.5 ? 'right' : 'down';
  } else if (row < rows / 2 && col >= cols / 2) {
    return Math.random() < 0.5 ? 'left' : 'down';
  } else if (row >= rows / 2 && col < cols / 2) {
    return Math.random() < 0.5 ? 'right' : 'up';
  } else {
    return Math.random() < 0.5 ? 'left' : 'up';
  }
}

// Global movement variables
let currentDirection;
let movementInterval;

// Initialize snake position
function initializeSnake() {
  const startPosition = getRandomPosition();
  snakePosition.length = 0;
  snakePosition.push(startPosition.index);
  updateSnakePosition(snakePosition);

  // Get initial direction based on starting position
  currentDirection = getInitialDirection(startPosition);
  console.log(`Initial direction: ${currentDirection}`);

  startMovement();
}

function startMovement() {
  if (movementInterval) clearInterval(movementInterval);

  movementInterval = setInterval(() => moveSnake(currentDirection), 500);
}

// Function to update the grid display to show the snake
function updateSnakePosition(snakePosition) {
  gridItems.forEach(item => item.classList.remove('snake'));
  snakePosition.forEach(index => gridItems[index].classList.add('snake'));
}

// Function to move the snake
function moveSnake(direction) {
  let newPosition;
  switch (direction) {
    case 'up':
      newPosition = snakePosition[0] - cols;
      break;
    case 'down':
      newPosition = snakePosition[0] + cols;
      break;
    case 'left':
      newPosition = snakePosition[0] - 1;
      break;
    case 'right':
      newPosition = snakePosition[0] + 1;
      break;
  }
  if (newPosition >= 0 && newPosition < rows * cols) {
    snakePosition.unshift(newPosition);
    snakePosition.pop();
    updateSnakePosition(snakePosition);
    console.log('Updated snake position:', snakePosition);
  } else {
    console.log('Not a valid location');
    clearInterval(movementInterval); // Stop movement if new position is invalid
  }
}

// Function to handle key down events for changing direction
function handleKeyDown(event) {
  let newDirection;
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      newDirection = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      newDirection = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      newDirection = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      newDirection = 'right';
      break;
    default:
      console.log('Unhandled key: ' + event.key);
      return;
  }

  if (newDirection !== currentDirection) {
    currentDirection = newDirection;
    startMovement(); // Restart movement in the new direction
  }
}

// Event listener for key down events
document.addEventListener('keydown', handleKeyDown);

// Event listener for start button
startButton.addEventListener('click', function () {
  console.log('You clicked start');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'none';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'flex';

  initializeSnake();
});
