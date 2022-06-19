const canvas = document.getElementById('canvas');
const contex = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const blockSize = 10;

const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;


// const intervalId = setInterval(function () {
const intervalId = setInterval(function() { 
  contex.clearRect(0, 0, width, height);
  
  drawScore();

  snake.move();
  snake.draw();
  apple.draw();

  drawBorder();

}, 100);

const drawBorder = function () {
  contex.fillStyle = 'Gray';
  contex.fillRect(0, 0, width, blockSize);
  contex.fillRect(0, height - blockSize, width, blockSize);
  contex.fillRect(0, 0, width, blockSize);
  contex.fillRect(width - blockSize, 0, blockSize, height);
};

const drawScore = function () {
  contex.font = '20px Courier';
  contex.fillStyle = 'Black';
  contex.textAlign = 'left';
  contex.textBaseLine = 'top';
  contex.fillText('Score: ' + score, blockSize, blockSize);
};

const endGame = function() { 
  clearInterval(intervalId); // call inbuilt fxn: clearInterval
  contex.font = '60px Courier';
  contex.fillStyle = 'Black';
  contex.textAlign = 'center';
  contex.textBaseLine = 'middle';
  contex.fillText('Game Over', width / 2, height / 2);
};

// Draw a Circle for some reason (see: Ch 14 JS for Kids)
const circle = (x, y, radius, fillCircle) => { 
  contex.beginPath(); 
  contex.arc(x, y, radius, 0, Math.PI * 2, false);
  //fillCircle ? contex.fill() : contex.stroke(); 
  if (fillCircle) { 
    contex.fill();
  } else { 
    contex.stroke();
  }
};



//#region Block
// Block Constructor
const Block = function(col, row) { 
  this.col = col;
  this.row = row; 
};

// Block Methods
Block.prototype.drawSquare = function (color) {
  // Draw a square at Block's location to illustrate it in the DOM
  let x = this.col * blockSize;
  let y = this.row * blockSize;

  contex.fillStyle = color;

  contex.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  // Draw a circle at Block's location
  let centerX = this.col * blockSize + blockSize / 2;
  let centerY = this.row * blockSize + blockSize / 2;

  contex.fillStyle = color;

  circle(centerX, centerY, blockSize / 2, true); // Fxn call
};

Block.prototype.equal = function (block) {
  return this.col === block.col && this.row === block.row; // Validate placement
};

//#endregion Block


//#region Snake

// Snake Constructor
const Snake = function() { 
  // Snake's body is composed of individual 'blocks' on the `segments` array
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5), 
  ];

  this.direction = 'right'; // directionent direction of travel
  this.nextDirection = 'right'; // Subsequent direction of travel
};

// Snake Methods
Snake.prototype.draw = function() { 
  for (let i = 0; i < this.segments.length; i++) { 
    this.segments[i].drawSquare('Blue'); 
  }
};

Snake.prototype.move = function() {
  let head = this.segments[0];
  // Do we ever reassign the head for any reason?
  // If not, use `const` instead of `let`
  let newHead;
  // Take the directionent state of travel and update it to the nextDirection
  this.direction = this.nextDirection;

  if (this.direction === 'right') {
    // Snake grows from the head, not the tail
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === 'top') {
    newHead = new Block(head.col, head.row - 1);
  }
  
  if (this.bump(newHead)) {
    endGame();
    return;
  }

  this.segments.unshift(newHead);
  // Validate the apple's directionent position, then update score, and move apple
  if (newHead.equal(apple.posit)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
  // -Note-> Do I want to change the conditions for when the apple is re-placed?
  // Why or why not?
  //newHead.equal(apple.posit) ? score++ : this.segments.pop();
};

// Snake method `bump` handles collisions
Snake.prototype.bump = head => { 
  let topBump;
  let downBump;
  let rightBump;
  let leftBump;

  const wallBump = topBump || downBump || rightBump || leftBump; 
  let selfBump = false; // Start with `selfBump` state set to false

  // Traverse `segments` array and verify position of the head
  for (let i = 0; i < this.segments.length; i++) { 
    if (head.equal(this.segments[i])) {
      selfBump = true; // Ouch. :(
    }
  }

  return wallBump || selfBump; 
};

Snake.prototype.tack = (newDirection) => {
  if (this.direction === 'top' && newDirection === 'down') { 
    return;
  } else if (this.direction === 'right' && newDirection === 'left') { 
    return;
  } else if (this.direction === 'down' && newDirection === 'top') { 
    return;
  } else if (this.direction === 'left' && newDirection === 'right') {
    return;
  }

  this.nextDirection = newDirection; 
}; 
//#endregion Snake
const snake = new Snake();

// Directions Assigned to Keys
const directions = {
  38: 'top',
  40: 'down',
  39: 'right',
  37: 'left',
};

// Event Handler
$('body').keydown((keystroke) => { 
  const newDirection = directions[keystroke.keyCode];

  if (newDirection !== 'undefined') { 
    snake.tack(newDirection);
  }
});

//#region Apple
// Apple Constructor && Methods
const Apple = function() { 
  this.posit = new Block(10, 10);
};

Apple.prototype.draw = function () {
  this.posit.drawCircle('Red');
};

Apple.prototype.move = function() { 
  let randoCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  let randoRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
  this.posit = new Block(randoCol, randoRow);
};

//#endregion Apple
const apple = new Apple(); 

// // Use `Snake` && `Apple` constructors to create their respective objects


apple.draw(); 
snake.draw(); 