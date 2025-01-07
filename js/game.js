// Set game state on browser loading
document.addEventListener('DOMContentLoaded', function () {
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
});

const gameTracks = [
  "media/01 - Title Screen.mp3",
  "media/04 - Overworld Day.mp3",
  "media/11 - Mushrooms.mp3",
  "media/15 - Underground Snow.mp3",
  "media/24 - Jungle.mp3",
  "media/30 - Dungeon.mp3",
  "media/31 - Underworld.mp3"
];

const colors = ['lightgreen', 'purple', 'blue', 'pink', 'white', 'gold', 'yellow', 'orange', 'silver'];

const gameMusic = document.getElementById('game-music');
gameMusic.volume = 1.0;

function getRandomGameTrack() {
  const randomIndex = Math.floor(Math.random() * gameTracks.length);
  return gameTracks[randomIndex];
}

function playRandomGameTrack() {
  const track = getRandomGameTrack();
  gameMusic.src = track;
  gameMusic.muted = false;
  gameMusic.play();
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Play music when the start button is clicked
document.getElementById('start-button').addEventListener('click', function () {
  playRandomGameTrack();
});

// Define Constants here
const startButton = document.querySelector('#start-button');
const newGameButton = document.querySelector('#new-game-button');
const leaderboardButton = document.querySelector('#leaderboard-button');
const homeButton = document.querySelector('#home-button');

homeButton.addEventListener('click', function () {
  console.log('You clicked home');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'flex';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
  endMovement();
});

const snakePosition = [];
const cherryPosition = [];
const gridContainer = document.querySelector('.grid-container');
const gridItems = [];
const rows = 10;
const cols = 20;
let score = 0;
let cherryCount = 0;

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

function initializeCherry() {
  let startPosition;
  do {
    startPosition = getRandomPosition();
  } while (snakePosition.includes(startPosition.index));

  cherryPosition.length = 0;
  cherryPosition.push(startPosition.index);
  updateCherryPosition(cherryPosition);
}

function startMovement() {
  if (movementInterval) clearInterval(movementInterval);

  let interval = 250; // Default interval

  if (cherryCount >= 100) {
    interval = 10;
  } else if (cherryCount >= 95) {
    interval = 20;
  } else if (cherryCount >= 90) {
    interval = 30;
  } else if (cherryCount >= 85) {
    interval = 40;
  } else if (cherryCount >= 80) {
    interval = 50;
  } else if (cherryCount >= 75) {
    interval = 60;
  } else if (cherryCount >= 70) {
    interval = 70;
  } else if (cherryCount >= 65) {
    interval = 80;
  } else if (cherryCount >= 60) {
    interval = 90;
  } else if (cherryCount >= 55) {
    interval = 100;
  } else if (cherryCount >= 50) {
    interval = 110;
  } else if (cherryCount >= 45) {
    interval = 120;
  } else if (cherryCount >= 40) {
    interval = 130;
  } else if (cherryCount >= 35) {
    interval = 140;
  } else if (cherryCount >= 30) {
    interval = 150;
  } else if (cherryCount >= 25) {
    interval = 175;
  } else if (cherryCount >= 20) {
    interval = 200;
  } else if (cherryCount >= 15) {
    interval = 225;
  } else if (cherryCount >= 10) {
    interval = 250;
  } else if (cherryCount >= 5) {
    interval = 275;
  }
  movementInterval = setInterval(() => moveSnake(currentDirection), interval);
}



function endMovement() {
  if (movementInterval) clearInterval(movementInterval);
  document.removeEventListener('keydown', handleKeyDown);
}

// Function to update the grid display to show the snake
function updateSnakePosition(snakePosition) {
  gridItems.forEach(item => {
    if (item.classList.contains('snake')) {
      item.classList.remove('snake');
      item.style.backgroundColor = ''; // Reset background color
    }
  });
  snakePosition.forEach(index => {
    const item = gridItems[index];
    item.classList.add('snake');
    item.style.backgroundColor = currentSnakeColor; // Apply current color
  });
  eatCherry();
}


function updateCherryPosition(cherryPosition) {
  gridItems.forEach(item => item.classList.remove('cherry'));
  cherryPosition.forEach(index => gridItems[index].classList.add('cherry'));
}

function eatCherry() {
  if (snakePosition[0] === cherryPosition[0]) {
    console.log('The snake and cherry are in the same position');

    // Grow the snake by adding a new segment
    let newSegment;
    switch (currentDirection) {
      case 'up':
        newSegment = snakePosition[snakePosition.length - 1] + cols;
        break;
      case 'down':
        newSegment = snakePosition[snakePosition.length - 1] - cols;
        break;
      case 'left':
        newSegment = snakePosition[snakePosition.length - 1] + 1;
        break;
      case 'right':
        newSegment = snakePosition[snakePosition.length - 1] - 1;
        break;
    }
    snakePosition.push(newSegment);

    // Play cherry sound effect
    cherrySoundEffect();
    cherryCount++; 
    console.log(`The cherry count is ${cherryCount}`)

    // Increase score when the snake eats a cherry
    score += 50;
    console.log(`Score: ${score}`);

    // Generate a new cherry position
    initializeCherry();

    // Change snake color
    const newColor = getRandomColor();
    changeSnakeColor(newColor);
  }
  }


let currentSnakeColor = 'green';

function changeSnakeColor(color) {
  currentSnakeColor = color;
  gridItems.forEach(item => {
    if (item.classList.contains('snake')) {
      item.style.backgroundColor = color;
    }
  });
}

const soundEffects = {
  cherry: new Audio('media/cherry-sound-effect.wav')
};


function cherrySoundEffect() { 
  soundEffects.cherry.play(); }

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
      // Check for left wall collision
      if (snakePosition[0] % cols === 0) {
        console.log('Hit the left wall!');
        clearInterval(movementInterval);
        showGameOverMessage(`Game Over! Your score is ${score}`);
        endMovement();
        return;
      }
      break;
    case 'right':
      newPosition = snakePosition[0] + 1;
      // Check for right wall collision
      if (snakePosition[0] % cols === cols - 1) {
        console.log('Hit the right wall!');
        clearInterval(movementInterval);
        showGameOverMessage(`Game Over! Your score is ${score}`);
        endMovement();
        return;
      }
      break;
  }

  // Check for top and bottom wall collision
  if (newPosition < 0 || newPosition >= rows * cols) {
    console.log('Hit the top or bottom wall!');
    clearInterval(movementInterval);
    showGameOverMessage(`Game Over! Your score is ${score}`);
    endMovement();
    return;
  }

  // Check for self-collision
  if (snakePosition.includes(newPosition)) {
    console.log('You ran into yourself!');
    clearInterval(movementInterval);
    showGameOverMessage(`Game Over! Your score is ${score}`);
    endMovement();
    return;
  }

  // Move the snake
  snakePosition.unshift(newPosition);
  snakePosition.pop();
  updateSnakePosition(snakePosition);
}


// Function to reset the game when game over
function resetGame() {
  score = 0;
  cherryCount = 0;
  snakePosition.length = 0;
  hideGameOverMessage();
  initializeSnake();
  initializeCherry();
}

// Function to handle key down events for changing direction
function handleKeyDown(event) {
  let newDirection;
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (currentDirection === 'down') {
        newDirection = null
      } else {
      newDirection = 'up';
      }
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (currentDirection === 'up') {
        newDirection = null
      } else {
      newDirection = 'down';
      }
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (currentDirection === 'right') {
        newDirection = null
      } else {
      newDirection = 'left';
      }
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (currentDirection === 'left') {
        newDirection = null
      } else {
      newDirection = 'right';
      }
      break;
    default:
      console.log('Unhandled key: ' + event.key);
      return;
  }

  if (newDirection !== null && newDirection !== currentDirection) {
    currentDirection = newDirection;
    startMovement();
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
  document.addEventListener('keydown', handleKeyDown);

  initializeSnake();
  initializeCherry();
});

newGameButton.addEventListener('click', function() {
  console.log('You clicked new game');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'none';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'flex';
  document.addEventListener('keydown', handleKeyDown);

  resetGame();
});


function showGameOverMessage(message) {
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.textContent = message;
  gameOverMessage.classList.remove('hidden');
  gameOverMessage.classList.add('visible');
}

// function showScoreboard(message) {
//   const scoreboardMessage = document.getElementById('scoreboard-message');
//   scoreboardMessage.textContent = message;
//   scoreboardMessage.classList.remove('hidden');
//   scoreboardMessage.classList.add('visible');
// }

function hideGameOverMessage(message) {
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.textContent = message;
  gameOverMessage.classList.add('hidden');
  gameOverMessage.classList.remove('visible');
}

// function hideScoreboard(message) {
//   const scoreboardMessage = document.getElementById('scoreboard-message');
//   scoreboardMessage.textContent = message;
//   scoreboardMessage.classList.add('hidden');
//   scoreboardMessage.classList.remove('visible');
// }

