var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//CONSTANTS
//object values for grid
const EMPTY = 0;
const FRUIT = 1;
const SNAKE = 2;
//sizing
const NUM_ROWS = 26;
const NUM_COLS = 26;
const HEIGHT = 500; // in pixels
const WIDTH = 500;
//snake direction
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

//frame tracker
var frame = 0;

//grid
var grid  = {
	height: null,
	width: null,
	grid: null,

	init: function(_width, _height) {
		this.width = _width;
		this.height = _height;
		this.grid = [];
		for (var i = 0; i < this.width; i++) {
			this.grid.push([]);
			for (var j = 0; j < this.height; j++) {
				this.grid[i].push(EMPTY);
			}
		}
	},

	get: function(x, y) {
		if (x >= 0 && x < NUM_COLS && y >= 0 && y < NUM_ROWS) {
			return this.grid[x][y];
		}
	},

	set: function(val, x, y) {
		if (x >= 0 && x < NUM_COLS && y >= 0 && y < NUM_ROWS) {
			this.grid[x][y] = val;
		}
	}

};

var snake = {
	direction: null,
	snake: null,

	init: function(_x, _y, _direction) {
		this.snake = [];
		this.direction = _direction;
		this.enqueue(_x, _y);
	},

	enqueue: function(_x, _y) {
		this.snake.unshift({
			x: _x,
			y: _y
		});
	},

	dequeue: function() {
		var tail = this.snake.pop();
		return tail;
	},

	getHeadX: function() {
		return this.snake[0].x;
	},

	getHeadY: function() {
		return this.snake[0].y;
	}

}

//random fruit generator
function setFruit() {
	while (true) {
		var x = Math.floor(Math.random() * NUM_COLS);
		var y = Math.floor(Math.random() * NUM_ROWS);
		if (grid.get(x,y) === EMPTY) {
			grid.set(FRUIT, x, y);
			break;
		}
	}
}


function main() {

	document.addEventListener("keydown", function(e) {
		if (e.keyCode === 38 && snake.direction !== DOWN) {
			snake.direction = UP;
		}
		else if (e.keyCode === 39 && snake.direction !== LEFT) {
			snake.direction = RIGHT;
		}
		else if (e.keyCode === 40 && snake.direction !== UP) {
			snake.direction = DOWN;
		}
		else if (e.keyCode === 37 && snake.direction !== RIGHT) {
			snake.direction = LEFT;
		}
	});

	document.addEventListener("keyup", function(e) {
		//delete keystate[e.keyCode];
	});

	init();
	loop();
}

function init() {
	grid.init(NUM_COLS, NUM_ROWS);
	snake.init(20,20, UP);
	setFruit();
}

function loop() {
	frame++;
	if (frame % 5 === 0) {
		update();
		frame /= 5;
	}
	draw(); // move inside loop?
	window.requestAnimationFrame(loop, canvas);
}

function update() {
	var newX = snake.getHeadX();
	var newY = snake.getHeadY();
	switch(snake.direction) {
		case UP: 
			newY--;
			break;
		case RIGHT: 
			newX++;
			break;
		case DOWN: 
			newY++;
			break;
		case LEFT: 
			newX--;
			break;
	}

	if (newX < 0 || newX > NUM_COLS - 1 || newY < 0 || newY > NUM_ROWS - 1 || grid.get(newX, newY) === SNAKE) {
		init();
		return;
	}

	snake.enqueue(newX, newY);

	if (grid.get(newX, newY) === FRUIT) {
		setFruit();
	}
	else {
		var tail = snake.dequeue();
		grid.set(EMPTY, tail.x, tail.y);
	}

	grid.set(SNAKE, newX, newY);

}

function draw() {
	var cw = WIDTH / NUM_COLS;
	var ch = HEIGHT / NUM_ROWS

	for (var i = 0; i < NUM_COLS; i++) {
		for (var j = 0; j < NUM_ROWS; j++) {
			switch(grid.get(i,j)) {
				case FRUIT: 
					ctx.fillStyle = "red";
					break;
				case SNAKE:
					ctx.fillStyle = "green";
					break;
				default:
					ctx.fillStyle = "white";
					break;
			}
			ctx.fillRect(i * cw, j * ch, cw, ch);
		}
	}
}

main();