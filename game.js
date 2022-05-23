//makes all the variables that we need to make the functions
var height;
var width;
var GREEN = "#349b4e";
var P1score = 0;
var P2score = 0;
var dx = 2;
var dy = 2;
var ball;
var number1, number2;
var p1paddle, p2paddle;
var p1dy = 0;
var p2dy = 0;
var numHits = 0;
var refresh = false;
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 50;
var homescreen = true;

function start() {
    drawInstructions();
    mouseClickMethod(click);
}

function drawInstructions() {
    var instructions = new Text("W(up) S(down)");
    instructions.setPosition((getWidth() - instructions.getWidth()) / 2, getHeight() / 2);
    add(instructions);

    var instruction = new Text("Arrow(up) Arrow(down)");
    instruction.setPosition((getWidth() - instructions.getWidth()) / 2, 300);
    add(instruction);

    var instructions = new Text("Math Pong");
    instructions.setPosition((getWidth() - instructions.getWidth()) / 2, 150);
    add(instructions);

    var instructions = new Text("(Click to start)");
    instructions.setPosition((getWidth() - instructions.getWidth()) / 2, 400);
    add(instructions);
}

/* Starts the program */
function setupGame() {

    // Sets the width and the height to the size of the canvas
    height = getHeight();
    width = getWidth();

    // Calls setup methods for graphics
    background();
    scoreboard();
    P1Paddle();
    P2Paddle();

    // Creates the ball
    ball = new Circle(10);
    ball.setPosition(width / 2, (height + 100) / 2);
    ball.setColor(Color.BLACK);
    add(ball);

    // Starts the game
    setTimer(endGame, 180);
}

function click(e) {
    if (homescreen) {
        removeAll();
        setupGame();
        homescreen = false;
    } else {
        setTimer(draw, 20);
    }
}

/* Runs the game
 * At every 20 ms the animation continues
 */
function draw() {
    collision();
    ball.move(dx, dy);
    p1paddle.move(0, p1dy);
    p2paddle.move(0, p2dy);
    scoreboard();
    scoreCounter();
}

function colorCanvas() {
    var rect = new Rectangle(width, height);
    rect.setPosition(0, 0);
    rect.setColor(GREEN);
    add(rect);
}

function background() {
    // Sets the spacing to be 4 pixels
    var spacing = 4;
    // draws a rectangle that is Green, the whole size of the canvas
    colorCanvas();

    var line = new Line(0, 100, width, 100);
    line.setColor(Color.BLACK);
    line.setLineWidth(2);
    add(line);
    for (var i = 0; i <= 30; i++) {
        var grid = new Rectangle(5, height / 60);
        grid.setPosition(width / 2, spacing);
        grid.setColor(Color.BLACK);
        add(grid);
        spacing += 16;
    }
}
//Asks math question after missing the ball
function doMath() {
    var divisor = Randomizer.nextInt(6, 12);
    var answer = Randomizer.nextInt(4, 12);
    var dividend = divisor * answer;

    var response = parseInt(prompt("What is " + dividend + "/" + divisor));
    while (response != answer) {
        response = parseInt(prompt("Try again: what is " + dividend + "/" + divisor));
    }
}

// Draws the scoreboard
function scoreboard() {
    remove(number1);
    number1 = new Text(P1score);
    number1.setFont("50pt Impact");
    number1.setColor(Color.BLACK);
    number1.setPosition(width / 5, height / 8);
    add(number1);

    remove(number2);
    number2 = new Text(P2score);
    number2.setFont("50pt Impact");
    number2.setColor(Color.BLACK);
    number2.setPosition(width / 5 * 3.5, height / 8);
    add(number2);
}

function collision() {
    // Bounce off right wall
    if (ball.getX() + ball.getRadius() > getWidth()) {
        dx = -dx;
        dy = 2;
        ball.setPosition(width / 2, height / 2);
        doMath();
    }
    // Bounce off left wall
    if (ball.getX() - ball.getRadius() < 0) {
        dx = -dx;
        dy = 2;
        ball.setPosition(width / 2, height / 2);
        doMath();
    }

    if (p1paddle.getY() - 5 <= ball.getY()) {
        if (p1paddle.getY() + PADDLE_HEIGHT >= ball.getY()) {
            if (p1paddle.getX() + 20 >= ball.getX()) {
                if (ball.getY() < p1paddle.getY() + (1 / 3) * PADDLE_HEIGHT) {
                    dy -= 1;
                }
                if (ball.getY() > p1paddle.getY() + (2 / 3 * PADDLE_HEIGHT)) {
                    dy += 1;
                }
                dx = Math.abs(dx);
                numHits++;
                refresh = true;
            }
        }
    }
    if (p2paddle.getY() - 5 <= ball.getY()) {
        if (p2paddle.getY() + PADDLE_HEIGHT >= ball.getY()) {
            if (p2paddle.getX() == ball.getX()) {
                if (ball.getY() < p2paddle.getY() + (1 / 3) * PADDLE_HEIGHT) {
                    dy -= 1;
                }
                if (ball.getY() > p2paddle.getY() + (2 / 3 * PADDLE_HEIGHT)) {
                    dy += 1;
                }
                dx = -Math.abs(dx);
                numHits++;
                refresh = true;
            }
        }
    }

    // If the paddle reaches the bottom, stop moving the paddle
    if (p1paddle.getY() + PADDLE_HEIGHT >= height) {
        p1paddle.setPosition(40, height - 50);
    }
    if (p2paddle.getY() + PADDLE_HEIGHT >= height) {
        p2paddle.setPosition(width - 40, height - 50);
    }

    // If either paddle reaches the top, stop moving the paddle
    if (p1paddle.getY() <= 100) {
        p1paddle.setPosition(40, 100);
    }
    if (p2paddle.getY() <= 100) {
        p2paddle.setPosition(width - 40, 100);
    }

    // Bounce off bottom wall
    if (ball.getY() + ball.getRadius() > getHeight()) {
        dy = -dy;
    }

    // Bounce off top wall
    if (ball.getY() - ball.getRadius() < 100) {
        dy = -dy;
    }

    if (numHits % 10 == 0 && refresh) {
        if (dx > 0) {
            dx++;
        } else {
            dx--;
        }
        if (dy > 0) {
            dy++;
        } else {
            dy--;
        }
        refresh = false;
    }
}
function scoreCounter() {
    if (ball.getX() + ball.getRadius() > getWidth()) {
        P1score++;
        remove(number1);

    }
    if (ball.getX() - ball.getRadius() < 0) {
        P2score++;
        remove(number2);
    }
}
function endGame() {
    var winner = "";
    if (P1score == 5) {
        winner = "P1";
    } else if (P2score == 5) {
        winner = "P2";
    }
    if (winner != "") {
        stopTimer(draw);
        stopTimer(scoreCounter);
        stopTimer(scoreboard);
        colorCanvas();
        var number = new Text(winner);
        number.setFont("50pt Impact");
        number.setColor(Color.WHITE);
        number.setPosition(width / 2 - 30, height / 2 - 20);
        add(number);
        var number = new Text("WINS!");
        number.setFont("100pt Impact");
        number.setColor(Color.WHITE);
        number.setPosition(width / 2 - 150, height / 2 + 100);
        add(number);
    }
}


function paddleDown(e) {
    if (e.keyCode == Keyboard.letter('S')) {
        p1dy = 5;
    }
    if (e.keyCode == Keyboard.DOWN) {
        p2dy = 5;
    }
    if (e.keyCode == Keyboard.letter('W')) {
        p1dy = -5;
    }
    if (e.keyCode == Keyboard.UP) {
        p2dy = -5;
    }
}

function paddleUp(e) {
    if (e.keyCode == Keyboard.letter('S')) {
        p1dy = 0;
    }
    if (e.keyCode == Keyboard.DOWN) {
        p2dy = 0;
    }
    if (e.keyCode == Keyboard.letter('W')) {
        p1dy = 0;
    }
    if (e.keyCode == Keyboard.UP) {
        p2dy = 0;
    }
}

// Adds player 1 paddle and registers the key down method
function P1Paddle() {
    p1paddle = new Rectangle(PADDLE_WIDTH, PADDLE_HEIGHT);
    p1paddle.setColor(Color.BLACK);
    p1paddle.setPosition(40, (height + PADDLE_HEIGHT) / 2);
    add(p1paddle);
    keyDownMethod(paddleDown);
    keyUpMethod(paddleUp);
}

// Adds player 2 paddle and registers the key down method
function P2Paddle() {
    p2paddle = new Rectangle(10, PADDLE_HEIGHT);
    p2paddle.setColor(Color.BLACK);
    p2paddle.setPosition(width - 40, (height + PADDLE_HEIGHT) / 2);
    add(p2paddle);
    keyDownMethod(paddleDown);
    keyUpMethod(paddleUp);
}
