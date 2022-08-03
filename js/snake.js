class Game {
  constructor(width, height) {
    //attributes
    this.grid = [];
    this.snake = [];
    this.food = { x: false, y: false };

    //parameters
    this.height = width;
    this.width = height;

    this.snakeChar = "x";
    this.foodChar = "o";
    this.emptyChar = " ";
    this.headChar = "AV<>";

    //states
    this.direction = "up";
    this.score = 0;

    //initialization
    this.createGrid();
  }

  createGrid() {
    for (let indexH = 0; indexH < this.height; indexH++) {
      let row = [];
      for (let indexW = 0; indexW < this.width; indexW++) {
        row.push(" ");
      }
      this.grid.push(row);
    }
  }

  createSnake() {
    let pos = this.getRandomPos();
    this.snake.push({ x: pos[0], y: pos[1] });
    this.placeSnake();
  }

  createPos(x, y) {
    return { x, y };
  }

  placeSnake() {
    for (const [rowIndex, row] of this.grid.entries()) {
      for (const [index, value] of row.entries()) {
        if (value === this.snakeChar) {
          this.grid[rowIndex][index] = this.emptyChar;
        }
      }
    }
    for (const part of this.snake) {
      this.grid[part.x][part.y] = this.snakeChar;
    }
  }

  createFood() {
    let pos = this.getRandomPos();
    this.food = { x: pos[0], y: pos[1] };
    this.placeFood();
  }

  placeFood() {
    for (const [rowIndex, row] of this.grid.entries()) {
      for (const [index, value] of row.entries()) {
        if (value === this.foodChar) {
          this.grid[rowIndex][index] = this.emptyChar;
        }
      }
    }

    this.grid[this.food.x][this.food.y] = this.foodChar;
  }

  getRandomPos() {
    let rx = 0;
    let ry = 0;

    do {
      rx = Math.floor(Math.random() * this.width);
      ry = Math.floor(Math.random() * this.height);
    } while (this.grid[rx][ry] !== this.emptyChar);

    return [rx, ry];
  }

  goUp() {
    if (this.direction === "down") {
      return false;
    }
    this.direction = "up";
  }

  goRight() {
    if (this.direction === "left") {
      return false;
    }
    this.direction = "right";
  }

  goLeft() {
    if (this.direction === "right") {
      return false;
    }

    this.direction = "left";
  }

  goDown() {
    if (this.direction === "up") {
      return false;
    }
    this.direction = "down";
  }

  isDead() {
    for (let index = 1; index < this.snake.length; index++) {
      if (this.doCollide(this.snake[index], this.snake[0])) {
        return true;
      }
    }
  }

  isFoodEaten() {
    let pos = this.getNextHeadPos();
    return this.doCollide(pos, this.food);
  }

  doCollide(o1, o2) {
    if (o1.x === o2.x && o1.y === o2.y) {
      return true;
    }
    return false;
  }

  gameOver() {
    console.log("GAME OVER");
    return true;
  }

  moveSnake() {
    let pos = this.getNextHeadPos();

    let previousX = this.snake[0].x;
    let previousY = this.snake[0].y;

    this.snake[0].x = pos.x;
    this.snake[0].y = pos.y;

    //move the rest

    let copy = null;
    if (this.snake.length > 1) {
      for (let index = 1; index < this.snake.length; index++) {
        //swap px and part x
        copy = this.snake[index].x;
        this.snake[index].x = previousX;
        previousX = copy;

        //swap py and part y
        copy = this.snake[index].y;
        this.snake[index].y = previousY;
        previousY = copy;
      }
    }
  }

  getNextHeadPos() {
    let vx = 0;
    let vy = 0;
    switch (this.direction) {
      case "up":
        vx = -1;
        break;

      case "down":
        vx = 1;
        break;

      case "left":
        vy = -1;
        break;

      case "right":
        vy = 1;
        break;

      default:
        return false;
        break;
    }

    let x = this.snake[0].x + vx;
    let y = this.snake[0].y + vy;

    if (x < 0) {
      x = this.width - 1;
    } else if (x > this.width - 1) {
      x = 0;
    } else if (y < 0) {
      y = this.height - 1;
    } else if (y > this.height - 1) {
      y = 0;
    }

    return { x, y };
  }

  grow() {
    this.snake.unshift(this.createPos(this.food.x, this.food.y));
  }

  nextStep() {
    if (this.isFoodEaten()) {
      this.grow();
      this.createFood();
      this.score += 1;
    }
    this.moveSnake();

    this.placeFood();
    this.placeSnake();

    //check if the snake die

    if (this.isDead()) {
      //end the game
      return this.gameOver();
    }
  }

  init() {
    this.createFood();
    this.createSnake();

    this.placeFood();
    this.placeSnake();
  }

  log() {
    let text = "";
    for (const row of this.grid) {
      let rowText = `[${row.join("|")}]\n`;
      text += rowText;
    }
    console.log(text);
  }
}

function test() {
  let g = new Game();
  g.init();
  g.log();
  g.goRight();
  g.nextStep();
  g.log();
}

// test();

function moveTest() {
  let g = new Game();
  g.init();
  g.log();
  g.goLeft();

  setInterval(() => {
    g.nextStep();
    g.log();
  }, 250);
}

// moveTest();
function generateDom(width, height) {
  const body = document.body;
  //generate the checkbox

  let numberOfCheckbox = width * height;

  for (let i = 0; i < height; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < width; j++) {
      //create a checkbox
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.classList.add("checkbox", "empty");

      row.appendChild(checkbox);
    }
    body.appendChild(row);
  }
}

function updateDom(gameObj) {
  let rows = document.querySelectorAll(".row");

  for (let i = 0; i < gameObj.grid.length; i++) {
    for (let j = 0; j < gameObj.grid[i].length; j++) {
      let input = rows[i].children[j];
      let char = gameObj.grid[i][j];
      switch (char) {
        case gameObj.snakeChar:
          input.setAttribute("type", "checkbox");
          input.checked = true;
          break;

        case gameObj.foodChar:
          input.setAttribute("type", "radio");
          input.checked = true;
          break;

        default:
          input.setAttribute("type", "checkbox");
          input.checked = false;
          break;
      }
    }
  }
}

function playGame() {
  let g = new Game(50, 50);
  g.init();
  g.log();
  g.goLeft();

  let nextMove = "";

  generateDom(g.height, g.width);
  let speed = 1;
  let delay = 250;

  document.addEventListener("keydown", function (e) {
    nextMove = e;
  });

  let intervalID = setInterval(turn, delay);

  function turn() {
    let r = g.nextStep();
    g.log();
    updateDom(g);
    speed = 1 - g.score * 0.01;
    if (speed < 0.2) {
      speed = 0.2;
    }
    console.log(delay * speed);

    switch (nextMove.key) {
      case "ArrowUp":
        g.goUp();
        break;

      case "ArrowDown":
        g.goDown();
        break;

      case "ArrowLeft":
        g.goLeft();
        break;

      case "ArrowRight":
        g.goRight();
        break;

      default:
        break;
    }

    clearInterval(intervalID);
    intervalID = setInterval(turn, delay * speed);

    if (r) {
      clearInterval(intervalID);
    }
  }
}

playGame();
