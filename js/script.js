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
  "media/30 - Dungeon.mp3",
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


// Random color generator for snake
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Define Constants
const startButton = document.querySelector('#start-button');
const newGameButton = document.querySelector('#new-game-button');
const leaderboardMenu = document.getElementById('leaderboard-menu');
const leaderboardButton = document.getElementById('leaderboard-button');
const topScoresEl = document.getElementById('top-scores')
const scoreboardSection = document.querySelector('#scoreboard-section');
const homeButton = document.querySelector('#home-button');
const snakePosition = [];
const cherryPosition = [];
const gridContainer = document.querySelector('.grid-container');
const gridItems = [];
const rows = 10;
const cols = 20;
let score = 0;
let finalScore = 0
let cherryCount = 0;
// let highScores = [0,0,0,0,0];
let highScores = [
  { initials: '', score: 0 },
  { initials: '', score: 0 },
  { initials: '', score: 0 },
  { initials: '', score: 0 },
  { initials: '', score: 0 },
];
let gameOver = false;

homeButton.addEventListener('click', function () {
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'flex';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
  endMovement();
  gameMusic.pause();
});

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

// Event listener for key down events
document.addEventListener('keydown', handleKeyDown);

// Event listener for start button
startButton.addEventListener('click', function () {
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'none';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'flex';
  document.addEventListener('keydown', handleKeyDown);
  if (gameScreen.style.backgroundImage === 'url("../images/purple-vibrant-fog.jpg")') {
    gameScreen.style.backgroundImage = 'url("../images/blue-vibrant-fog.jpg")'
  } else {
    gameScreen.style.backgroundImage = 'url("../images/purple-vibrant-fog.jpg")'
  }
  playRandomGameTrack();
  resetGame();
});

// Event Listener for new game button
newGameButton.addEventListener('click', function() {
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'none';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'flex';
  document.addEventListener('keydown', handleKeyDown);
  if (gameScreen.style.backgroundImage === 'url("../images/purple-vibrant-fog.jpg")') {
    gameScreen.style.backgroundImage = 'url("../images/blue-vibrant-fog.jpg")'
  } else {
    gameScreen.style.backgroundImage = 'url("../images/purple-vibrant-fog.jpg")'
  }
  playRandomGameTrack();
  resetGame();
});

// Event listener for leaderboard button
leaderboardButton.addEventListener('click', function() {
  if (leaderboardMenu.style.display === 'none' || leaderboardMenu.style.display === '') {
  leaderboardMenu.style.display = 'flex' }
  else {
    leaderboardMenu.style.display ='none'
  }
})

// Function to generate a random starting position
function getRandomPosition() {
  const row = Math.floor(Math.random() * rows);
  const col = Math.floor(Math.random() * cols);
  return { row, col, index: row * cols + col };
}

function adjustLeaderboard(newInitials, newScore) {
  if (typeof newInitials === 'string' && typeof newScore === 'number') {
    highScores.push({initials: newInitials, score: newScore});
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 5) {
      highScores.splice(5, 1);
    }
    // Update leaderboard display
    topScoresEl.innerHTML = highScores.map((entry, index) => {
      return `${index + 1}. ${entry.initials} - ${entry.score}<br>`;
    }).join('');
  } 
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

  startMovement();
}

// Initialize cherry position
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

  let interval = 250; 

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

    // Increase score when the snake eats a cherry
    score += 50;

    // Generate a new cherry position
    initializeCherry();

    // Change snake color
    const newColor = getRandomColor();
    changeSnakeColor(newColor);
    scoreboardSection.innerText = `Score: ${score}\nCherries: ${cherryCount}`;
  }
  }

let currentSnakeColor = 'lawngreen';

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


  function handleGameOver() {
  let finalScore = score;
  gameOver = true;
  let isHighScore = false;

  for (let i = 0; i < highScores.length; i++) {
    if (finalScore > highScores[i].score) {
      isHighScore = true;
      showGameOverMessage('High score! Enter initials here.', true);
      return;
    }
  }

  if (!isHighScore && highScores.length < 5) {
    isHighScore = true;
    showGameOverMessage('Congratulations! High score! Enter initials here.', true);
    return;
  }

  showGameOverMessage(`Game Over! Your score is ${score}`, false);
  endMovement();
}

function showGameOverMessage(message, isHighScore) {
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.innerHTML = message;

  if (isHighScore) {
    gameOverMessage.innerHTML += `
      <div>
        <label for="initials-input">Enter your initials: </label>
        <input type="text" id="initials-input" maxlength="3" oninput="validateInitialsInput(this)">
        <button onclick="submitInitials(${score})">Submit</button>
      </div>
    `;
  }

  gameOverMessage.classList.remove('hidden');
  gameOverMessage.classList.add('visible');
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
      // Check for left wall collision
      if (snakePosition[0] % cols === 0) {
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
        clearInterval(movementInterval);
        showGameOverMessage(`Game Over! Your score is ${score}`);
        handleGameOver();
        adjustLeaderboard();
        return;
      }
      break;
  }
  

  // Check for top and bottom wall collision
  if (newPosition < 0 || newPosition >= rows * cols) {
    clearInterval(movementInterval);
    handleGameOver(); 
    adjustLeaderboard();
    
    // Clear and reinitialize cherry position
    cherryPosition.forEach(index => {
      const item = gridItems[index];
      item.classList.remove('cherry');
      item.style.backgroundColor = '';
    });
  
    return;
  }
  
  // Check for self-collision
  if (snakePosition.includes(newPosition)) {
    clearInterval(movementInterval);
    showGameOverMessage(`Game Over! Your score is ${score}`);
    handleGameOver();
    adjustLeaderboard();
    return;
  }

  // Move the snake
  snakePosition.unshift(newPosition);
  snakePosition.pop();
  updateSnakePosition(snakePosition);
}


// Function to reset the game when game over
function resetGame() {
  gameOver = false;
  score = 0;
  cherryCount = 0;
  snakePosition.length = 0;
  hideGameOverMessage();
  initializeSnake();
  initializeCherry();
  currentSnakeColor = 'black';
  currentSnakeColor = 'lawngreen';
  scoreboardSection.innerText = `Score: 0\nCherries: 0`;
}

// Function to handle key down events for changing direction
function handleKeyDown(event) {

if (gameOver) {
  return;
}

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
      return;
  }

  if (newDirection !== null && newDirection !== currentDirection) {
    currentDirection = newDirection;
    startMovement();
  }
}

function hideGameOverMessage(message) {
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.textContent = message;
  gameOverMessage.classList.add('hidden');
  gameOverMessage.classList.remove('visible');
}

function showGameOverMessage(message, highScores) {
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.innerHTML = message;

  if (highScores) {
    gameOverMessage.innerHTML += `
      <div>
        <label for="initials-input">Enter your initials: </label>
        <input type="text" id="initials-input" maxlength="3" oninput="validateInitialsInput(this)">
        <button onclick="submitInitials()">Submit</button>
      </div>
    `;
  }

  gameOverMessage.classList.remove('hidden');
  gameOverMessage.classList.add('visible');
}

function validateInitialsInput(input) {
  input.value = input.value.toUpperCase().slice(0, 3);
}

function submitInitials() {
  const initials = document.getElementById('initials-input').value.toUpperCase();

  if (initials.length <= 3) {
    adjustLeaderboard(initials, score);
    hideGameOverMessage();
  } else {
    alert('Please enter no more than 3 characters for your initials.');
  }
}






