var CANVAS_HEIGHT = 800;
var CANVAS_WIDTH = 800;
var GAME_SPEED = .05;
var BOARD_HEIGHT = 530;
var BOARD_FRAMES = 40;
var new_square = true;
var current_board_frame_index;
var TOTAL_FRAMES = 40;
var backgroundClock = new Image();
var logging = false;
var scoreclock;
var clockBounsCount = 0;


/**
*
* The view of the game board. This class handles the pieces, player, gameboard, and other animations
*
**/
function GameBoard(game, boardC) {

    // Game Board Sizes
    this.frameHeight = 530;
    this.frameWidth = 800;

    // Sets the game board position releative to canvas
    this.x = 0;
    this.y = CANVAS_HEIGHT - this.frameHeight;

    // Obtain img frames from asset manager
    this.frames = [];
    for (var i = 0; i < TOTAL_FRAMES; i++) {
        this.frames.push(ASSET_MANAGER.getAsset("./img/" + i + ".png"));
    }
    this.backgroundTable = ASSET_MANAGER.getAsset("./img/woodtable.png");
    this.backgroundPark = ASSET_MANAGER.getAsset("./img/lake.jpg");
    this.backgroundBoarder = ASSET_MANAGER.getAsset("./img/border.png");
    // This holds the frame interval the game board is within (i.e. what click between space changes the game boards stat is in)
    this.frameInterval = 0;
    //initialize the score display for the player. 
    this.userScoreOnBoard = new UserScore(game);


    this.totalTime = GAME_SPEED * TOTAL_FRAMES;
    this.elapsedTime = 0;
    this.boardC = boardC;
    this.halfTime = 0;
    Entity.call(this, game, this.x, this.y);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

//need this to use for increasing score for a gain in speed of game. 
GameBoard.prototype.getSpeed = function(){
	return this.GAME_SPEED;
}

//
//  Update game board, called by Entitiy in gameengine
//
GameBoard.prototype.update = function () {
    this.elapsedTime += this.game.clockTick;
    this.halfTime += this.game.clockTick;
    if (this.elapsedTime >= this.totalTime) {
        this.elapsedTime = 0;
        this.boardC.update(); // Updates every other row
    } else if (this.halfTime >= this.totalTime / 2) {
        this.halfTime = 0;
       // this.boardC.update(); // Updates every row
    }

    this.frameInterval = Math.floor(this.elapsedTime / GAME_SPEED);
    Entity.prototype.update.call(this);
}

//
//  Draw game board, called by Entitiy in gameengine
//
GameBoard.prototype.draw = function (ctx) {
    // Draw background pictures
    
	backgroundClock.src = "./img/chess_clock_frame.png";

    ctx.drawImage(this.backgroundTable, -500, 200); // We are on a table!
    ctx.drawImage(this.backgroundPark, 0, -400); // We are in a park!
    ctx.drawImage(backgroundClock, 260, 30); // Chess Clock on table!

    // Draw the board
    ctx.drawImage(this.frames[0],
              //this.frames[this.frameInterval],
              this.x, this.y,
              this.frameWidth, this.frameHeight);

    // Draw the Boards boarder
    ctx.drawImage(this.backgroundBoarder, 0, 250); // Chess boarder on table!
    Entity.prototype.draw.call(this);
    
    this.userScoreOnBoard.updateScore();
}

GameBoard.prototype.currentFrame = function () {
    return this.frameInterval;
}


/* 
 * This function will animate a clock after each time a player takes a piece or any 
 * other event deemed worthy of moving the clock. For now, it just spins and spins. 
 */ 
function ChessClockRight(game, spritesheet) {
	//TODO: Add multiplier for Game Speed with clock speed. 
    this.animation = new ChessClockAnimation(spritesheet, 100.1, 99.5, 0.11, 12, true, false);
    this.x = 422;  //ctx.drawImage(backgroundClock,260,30)
    this.y = 77;  //ctx.drawImage(backgroundClock,260,30)
    this.game = game;
    this.ctx = game.ctx;
    this.scoreClockRight = new ScoreEngine(game); 
    this.scoreBounsClockRight = clockBounsCount;
}

ChessClockRight.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

ChessClockRight.prototype.update = function() {
	Entity.prototype.update.call(this);	
	this.scoreBounsClockRight += 1;
	if (this.scoreBounsClockRight > 12)
	{
		this.scoreBounsClockRight = 0;
		this.scoreClockRight.IncreaseScore(12);
	}
}
//End ChessClock

/* 
 * This function will animate a clock after each time a player takes a piece or any 
 * other event deemed worthy of moving the clock. For now, it just spins and spins. 
 */ 
function ChessClockLeft(game, spritesheet) {
	//TODO: Add multiplier for Game Speed with clock speed. 
    this.animation = new ChessClockAnimation(spritesheet, 100.1, 99.5, 0.05, 12, true, false);
    this.x = 297;  //ctx.drawImage(backgroundClock,260,30)
    this.y = 77;  //ctx.drawImage(backgroundClock,260,30)
    this.game = game;
    this.ctx = game.ctx;
    this.scoreClockLeft = new ScoreEngine(game); 
    this.scoreBounsClockLeft = clockBounsCount;
}

ChessClockLeft.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

ChessClockLeft.prototype.update = function() {
	Entity.prototype.update.call(this);
	this.scoreBounsClockLeft += 1;
	if (this.scoreBounsClockLeft > 12)
	{
		this.scoreBounsClockLeft = 0;
		this.scoreClockLeft.IncreaseScore(12);
	}
}
//End ChessClock


//Begin ChessClockAnimation 
function ChessClockAnimation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.scoreclock = scoreclock; 
}

ChessClockAnimation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop){
        	this.elapsedTime = 0;
        } 
        	
    }
    
    var frame = this.currentFrame();
    if (frame > 12) {
        frame = 30 - frame;
    }
    
    xindex = frame % 4;
    yindex = Math.floor(frame / 4);
    
    if(logging)
    	console.log("ClockAnimation:prototype:drawFrame " + frame + " " + xindex + " " + yindex, + " " +
    			("./img/clock.png"));
    
	ctx.drawImage(ASSET_MANAGER.getAsset("./img/chess_clock.png"),
		    xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth,
            this.frameHeight);
	
}


ChessClockAnimation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

ChessClockAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}// end ChessClockAnimation

/*
 * This displays the user's score for the game. 
 */
function UserScore(game) {
    this.userScore = new ScoreEngine(game); 
    this.elapsedTime = 0;
    document.getElementById("highScoreOnPage").innerHTML = this.userScore.getHighScore();
}

/*
 * This will be used to grab the score and display on the game for the user. 
 */
UserScore.prototype.updateScore = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop){
        	this.elapsedTime = 0;
        } 
    }
    
    document.getElementById("scoreOnPage").innerHTML = this.userScore.getScore();
    
    	
}
/*
 * this is used to keep a running update of the score on the gameboard. 
 */
UserScore.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

UserScore.prototype.niceNumber = function(number){
	//Assumes we are working in whole numbers. 
		
}
