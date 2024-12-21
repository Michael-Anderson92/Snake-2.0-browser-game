// Set game state on browser loading
const gameLoaded = document.addEventListener('DOMContentLoaded', function (){
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
});

// Define Constants here //
const startButton = document.querySelector('#start-button');
const leaderboardButton = document.querySelector('#leaderboard-button')
const homeButton = document.querySelector('#home-button');

const gridContainer = document.querySelector('.grid-container');
  const gridItems = [];
  const rows = 15;
  const cols = 20;

 
// Function to iterate through grid container matrix,
// create elements for each cell, andappend them to 'grid-item'
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  gridItem.dataset.index = row * cols + col;
  gridContainer.appendChild(gridItem);
  gridItems.push(gridItem);
}
}

//Function to generate a random starting position
function getRandomPosition() {
  const row = Math.floor(Math.random() * rows);
  const col = Math.floor(Math.random() * cols);
  return row * cols + col
}

// Initialize snake position
let snakePosition = [getRandomPosition()];

// const gameScreen = document.querySelector('game-screen');


// Define Variables here //

// Define Event Listeners here //
startButton.addEventListener('click', function () {
  console.log('You clicked start');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'none';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'flex';

  // Initialize snake
  function initializeSnake() {
    let snakeHead = [getRandomPosition()];
    return snakeHead;
  }

  let snakePosition = initializeSnake();
    console.log('Snake initialized at positions:', snakePosition);

    updateSnakePosition(snakePosition);

});

function updateSnakePosition(snakePosition) {
  gridItems.forEach(item => item.classList.remove('snake'));
  snakePosition.forEach(index => gridItems[index].classList.add('snake'));

}

const homeClicked = homeButton.addEventListener('click', function () {
  console.log('You clicked home');
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = 'flex';
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.display = 'none';
})

leaderboardClicked = leaderboardButton.addEventListener('click', function(e) {
  console.log('You clicked Leaderboard');
});

const snakeMovement = document.addEventListener('keydown', handleKeyDown);
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      console.log('Up pressed');
      // logic
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      console.log('Down pressed');
      // Logic
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      console.log('Left pressed');
      //Logic
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      console.log('Right pressed');
      // Logic
      break
    default:
      console.log('Unhandled key: ' + event.key);
      // Optional logic for unhandled keys
      break;
  }
}


// clickHomeButton = homeButton.addEventListener('click', function(e) {
//   console.log('You clicked Home button')
// })


// Define functions // 