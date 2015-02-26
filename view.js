//
//
//
//
//  Global Variables
//  Global Variables
//  Global Variables
//  Global Variables
//
//
//
//
//
//
//
var CANVAS_HEIGHT = 800;
var CANVAS_WIDTH = 800;
var GAME_SPEED = .05; //.04
var BOARD_HEIGHT = 530;
var BOARD_FRAMES = 40;
var new_square = true;
var current_board_frame_index;
var TOTAL_FRAMES = 40;
var backgroundTable = new Image();
var backgroundPark = new Image();
var backgroundClock = new Image();
var backgroundBoarder = new Image();
var moveable = false;
var logging = false;

//
//
//
//
//  Pieces
//  Pieces
//  Pieces
//  Pieces
//
//
//
//
//
//
//
function Piece(game, piece_rank, starting_column, starting_row, color) {

    // Obtain piece information based on rank provided
    this.rank = piece_rank;

    this.standardFrameHeight = 235;
    this.standardFrameWidth = 95;

    // Starting scale pieces / constant increase to scale each frame
    this.scale = .5;
    this.SCALE_INCREASED_BY = .0035;

    // calculate current frame height based on the scale of the piece at the given time
    this.frameHeight = this.standardFrameHeight;
    this.frameWidth = this.standardFrameWidth;


    this.y = CANVAS_HEIGHT - BOARD_HEIGHT - this.frameHeight;

    this.column = starting_column;
    this.row = starting_row;

    this.rowFrame = 0;
    this.rowPrevDepth = 0;

    this.color = color;
    if(color == "black") {
		this.animation = new PieceAnimation(ASSET_MANAGER.getAsset("./img/black" + piece_rank + ".png"));

	} else {
		this.animation = new PieceAnimation(ASSET_MANAGER.getAsset("./img/" + piece_rank + ".png"));

	}
    
    // Used to keep track of the frame the board is in
    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    Entity.call(this, game, this.x, this.y);
}

Piece.prototype = new Entity();
Piece.prototype.constructor = Piece;


Piece.prototype.update = function () {
	
	// Remove piece after it moves off the board
    if (this.row > 13) {
        return;
    }

    // Calculate the current frame the game board is residing within
    var f = Math.floor(this.elapsedTime / GAME_SPEED);
    this.elapsedTime += this.game.clockTick;
    if (this.isDone()) {
        this.elapsedTime = 0;
        this.row++;
        f = 0;
    }
  

    // Obtain position piece should be in and height of row based off of the current row they reside within
    this.yPositions = [];
    this.scales = [];
    var rowHeight;
    switch (this.row) {
        case 0:

            
            
            
            
            
            
            
            
            
           
            
           



            this.yPositions = [270, 270, 271, 271, 272, 273, 273, 274, 275, 275, 276, 277, 277, 278, 278, 279, 279, 280, 280, 281, 282];
            this.scales = [0.505, 0.506333333, 0.507666667, 0.509, 0.510333333, 0.511666667, 0.513, 0.514333333, 0.515666667, 0.517, 0.518333333, 0.519666667, 0.521, 0.522333333, 0.523666667, 0.525, 0.526333333, 0.527666667, 0.529, 0.530333333];
            rowHeight = 13;
            break;
        case 1:
            this.yPositions = [282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301];
            this.scales = [0.531666667, 0.533, 0.534333333, 0.535666667, 0.537, 0.538333333, 0.539666667, 0.541, 0.542333333, 0.543666667, 0.545, 0.546333333, 0.547666667, 0.549, 0.550333333, 0.551666667, 0.553, 0.554333333, 0.555666667, 0.557];
            rowHeight = 18;
            break;
        case 2:
            this.yPositions = [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321];
            this.scales = [0.558333333, 0.559666667, 0.561, 0.562333333, 0.563666667, 0.565, 0.566333333, 0.567666667, 0.569, 0.570333333, 0.571666667, 0.573, 0.574333333, 0.575666667, 0.577, 0.578333333, 0.579666667, 0.581, 0.582333333, 0.583666667];
            rowHeight = 20;
            break;
        case 3:
            this.yPositions = [321, 322, 323, 324, 325, 326, 327, 329, 330, 331, 332, 333, 334, 335, 337, 338, 339, 340, 341, 342, 344];
            this.scales = [0.585, 0.586583333, 0.588166667, 0.58975, 0.591333333, 0.592916667, 0.5945, 0.596083333, 0.597666667, 0.59925, 0.600833333, 0.602416667, 0.604, 0.605583333, 0.607166667, 0.60875, 0.610333333, 0.611916667, 0.6135, 0.615083333];
            rowHeight = 23;
            break;
        case 4:
            this.yPositions = [344, 345, 346, 347, 349, 350, 351, 353, 354, 355, 357, 358, 359, 360, 362, 363, 364, 366, 367, 368, 370];
            this.scales = [0.616666667, 0.61825, 0.619833333, 0.621416667, 0.623, 0.624583333, 0.626166667, 0.62775, 0.629333333, 0.630916667, 0.6325, 0.634083333, 0.635666667, 0.63725, 0.638833333, 0.640416667, 0.642, 0.643583333, 0.645166667, 0.64675];
            rowHeight = 26;
            break;
        case 5:
            this.yPositions = [370, 371, 373, 374, 376, 377, 379, 380, 382, 383, 385, 386, 388, 389, 391, 392, 394, 395, 397, 398, 400];
            this.scales = [0.648333333, 0.649916667, 0.6515, 0.653083333, 0.654666667, 0.65625, 0.657833333, 0.659416667, 0.661, 0.662583333, 0.664166667, 0.66575, 0.667333333, 0.668916667, 0.6705, 0.672083333, 0.673666667, 0.67525, 0.676833333, 0.678416667];
            rowHeight = 30;
            break;
        case 6:
            this.yPositions = [400, 401, 403, 404, 406, 407, 409, 410, 412, 413, 415, 416, 418, 419, 421, 422, 424, 425, 427, 428, 430]
            this.scales = [0.68, 0.682, 0.684, 0.686, 0.688, 0.69, 0.692, 0.694, 0.696, 0.698, 0.7, 0.702, 0.704, 0.706, 0.708, 0.71, 0.712, 0.714, 0.716, 0.718];
            rowHeight = 30;
            break;
        case 7:
            this.yPositions = [430, 431, 433, 435, 437, 439, 440, 442, 444, 446, 448, 449, 451, 453, 455, 457, 458, 460, 462, 464, 466];
            this.scales = [0.72, 0.722, 0.724, 0.726, 0.728, 0.73, 0.732, 0.734, 0.736, 0.738, 0.74, 0.742, 0.744, 0.746, 0.748, 0.75, 0.752, 0.754, 0.756, 0.758];
            rowHeight = 41;
            break;
        case 8:
            this.yPositions = [466, 468, 470, 472, 474, 476, 478, 480, 482, 484, 486, 488, 490, 492, 494, 496, 498, 500, 502, 504, 507];
            this.scales = [0.76, 0.762, 0.764, 0.766, 0.768, 0.77, 0.772, 0.774, 0.776, 0.778, 0.78, 0.782, 0.784, 0.786, 0.788, 0.79, 0.792, 0.794, 0.796, 0.798];
            rowHeight = 51;
            break;
        case 9:
            this.yPositions = [507, 509, 512, 514, 517, 519, 522, 524, 527, 529, 532, 535, 537, 540, 542, 545, 547, 550, 552, 555, 558];
            this.scales = [0.8, 0.8025, 0.805, 0.8075, 0.81, 0.8125, 0.815, 0.8175, 0.82, 0.8225, 0.825, 0.8275, 0.83, 0.8325, 0.835, 0.8375, 0.84, 0.8425, 0.845, 0.8475];
            rowHeight = 62;
            break;
        case 10:
            this.yPositions = [558, 561, 564, 567, 570, 573, 576, 579, 582, 585, 589, 592, 595, 598, 601, 604, 607, 610, 613, 616, 620];
            this.scales = [0.85, 0.8525, 0.855, 0.8575, 0.86, 0.8625, 0.865, 0.8675, 0.87, 0.8725, 0.875, 0.8775, 0.88, 0.8825, 0.885, 0.8875, 0.89, 0.8925, 0.895, 0.8975];
            rowHeight = 80;
            break;
        case 11:
            this.yPositions = [620, 624, 628, 632, 636, 640, 644, 648, 652, 656, 660, 664, 668, 672, 676, 680, 684, 688, 692, 696, 700];
            this.scales = [0.9, 0.9025, 0.905, 0.9075, 0.91, 0.9125, 0.915, 0.9175, 0.92, 0.9225, 0.925, 0.9275, 0.93, 0.9325, 0.935, 0.9375, 0.94, 0.9425, 0.945, 0.9475];
            rowHeight = 100;
            break;
        case 12:
            this.yPositions = [700, 705, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 765, 770, 775, 780, 785, 790, 795, 800];
            this.scales = [0.9025, 0.905, 0.9075, 0.91, 0.9125, 0.915, 0.9175, 0.92, 0.9225, 0.925, 0.9275, 0.93, 0.9325, 0.935, 0.9375, 0.94, 0.9425, 0.945, 0.9475, 0.95];

            


            break;
        case 13:
            this.yPositions = [800, 806, 812, 818, 824, 830, 836, 842, 848, 854, 860, 866, 872, 878, 884, 890, 896, 902, 908, 914, 920];
            this.scales = [0.9800, 0.9910, 1.0020, 1.0130, 1.0240, 1.0350, 1.0460, 1.0570, 1.0680, 1.0790, 1.0900, 1.1010, 1.1120, 1.1230, 1.1340, 1.1450, 1.1560, 1.1670, 1.1780, 1.1890];
            break;
    }



    // Move the piece to the y position based on the     
    this.frameHeight = this.standardFrameHeight * this.scale;
    this.frameWidth = this.standardFrameWidth * this.scale;
    this.scale = this.scales[f];
    this.y = this.yPositions[f] - this.frameHeight / 2 + 13;
 //   console.log("Row: " + this.row + " Col: " + this.column + "   Frame: " + f + "  Scale: " + this.scale + "   FrameHeight: " + this.frameHeight + " Y: " + this.y);

    // Calculate x position based on linear equation
    switch (this.column) {
        case 0:
            this.x = Math.floor((76492 - 127 * this.y) / 194 + 52);
            break;
        case 1:
            this.x = Math.floor((38690 - 45 * this.y) / 97) + 57 - this.frameWidth / 2;
            break;
        case 2:
            this.x = Math.floor((155350 - 115 * this.y) / 388) + 48 - this.frameWidth / 2;
            break;
        case 3:
            this.x = Math.floor((78698 - 27 * this.y) / 194) + 37 - this.frameWidth / 2;
            break;
        case 4:
            this.x = Math.floor((40012 + 2 * this.y) / 97) + 24 - this.frameWidth / 2;
            break;
        case 5:
            this.x = Math.floor((161850 + 75 * this.y) / 388) + 7 - this.frameWidth / 2;
            break;d
        case 6:
            this.x = Math.floor((82070 + 65 * this.y) / 194) + 3 - this.frameWidth / 2;
            break;
        case 7:
            this.x = Math.floor((82790 + 95 * this.y) / 194) - 3 - this.frameWidth / 2;
            break;
    }

    Entity.prototype.update.call(this);
}



Piece.prototype.draw = function (ctx) {
    this.animation.drawFrame(ctx, this.x, this.y, this.scale, this.frameHeight, this.frameWidth);
    Entity.prototype.draw.call(this);
}

Piece.prototype.currentFrame = function () {
	console.log("Piece CurrentFrame function " + Math.floor(this.elapsedTime / GAME_SPEED));
    return Math.floor(this.elapsedTime / GAME_SPEED);
}

Piece.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Piece.prototype.toString = function() {
	return "(" + this.row + ", " + this.column + ")";
}

function PieceAnimation(spriteSheet) {
    this.spriteSheet = spriteSheet;
}

PieceAnimation.prototype.drawFrame = function (ctx, x, y, scaleBy, frameHeight, frameWidth) {
    ctx.drawImage(this.spriteSheet, x, y,
                  frameWidth * scaleBy, frameHeight * scaleBy);
    
}


//
//
//
//
//  Game Board
//  Game Board
//  Game Board
//  Game Board
//
//
//
//
// 
//
//      Here is the gameboard animations
function GameBoardAnimation(frames, x, y, frameHeight, frameWidth, boardC) {
    this.frames = frames;
    this.x = x;
    this.y = y;
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    this.totalTime = GAME_SPEED * TOTAL_FRAMES;
    this.elapsedTime = 0;
	this.boardC = boardC;
	this.halfTime = 0;
}

GameBoardAnimation.prototype.drawFrame = function (tick, ctx) {
    // Calculate elapsed time and see if the frame needs to be started over
	// NO var halftime = 0; // Halfway. When black/white changes
	this.elapsedTime += tick;
	this.halfTime += tick;
    if (this.isDone()) {
        this.elapsedTime = 0;
		//this.boardC.update(); // Updates every other row
    } else if(this.isHalfway()){
		this.halfTime = 0;
		this.boardC.update(); // Updates every row
    }
    
    backgroundTable.src = "./img/woodtable.png";
    backgroundClock.src = "./img/chess_clock_frame.png";
    backgroundPark.src = "./img/lake.jpg";
    backgroundBoarder.src = "./img/border.png";

    //Static background images. Now need to make the table move. 
    ctx.drawImage(backgroundTable,-500,200); // We are on a table!
    ctx.drawImage(backgroundPark,0,-400); // We are in a park!
    ctx.drawImage(backgroundClock,260,30); // Chess Clock on table!
    
   // current_board_frame_index = Math.floor(this.elapsedTime / GAME_SPEED / 2) + Math.floor(this.elapsedTime / GAME_SPEED) % 2;
    
    // Draw the image of the current frame
       


    ctx.drawImage(this.frames[0],
                  //this.frames[Math.floor(this.elapsedTime / GAME_SPEED)],
                  this.x, this.y,
                  this.frameWidth, this.frameHeight);

    ctx.drawImage(backgroundBoarder, 0, 250); // Chess boarder on table!

    if(logging)
    	{
    	console.log(this.frames[Math.floor(this.elapsedTime / GAME_SPEED)], this.x, this.y,
    		    this.frameWidth, this.frameHeight);
    	}
}


GameBoardAnimation.prototype.currentFrame = function () {
	if(logging)
		console.log("GameBoardAnimation CurrentFrame function " + Math.floor(this.elapsedTime / GAME_SPEED));
    return Math.floor(this.elapsedTime / GAME_SPEED);
}

GameBoardAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

GameBoardAnimation.prototype.isHalfway = function () {
	return (this.halfTime >= this.totalTime/2);
}



/* 
 * This function will animate a clock after each time a player takes a piece or any 
 * other event deemed worthy of moving the clock. For now, it just spins and spins. 
 */ 
function ChessClockRight(game, spritesheet) {
    this.animation = new ChessClockAnimation(spritesheet, 100.1, 99.5, 0.05, 12, true, false);
    this.x = 422;  //ctx.drawImage(backgroundClock,260,30)
    this.y = 77;  //ctx.drawImage(backgroundClock,260,30)
    this.game = game;
    this.ctx = game.ctx;
}

ChessClockRight.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

ChessClockRight.prototype.update = function() {
	Entity.prototype.update.call(this);	
}
//End ChessClock

/* 
 * This function will animate a clock after each time a player takes a piece or any 
 * other event deemed worthy of moving the clock. For now, it just spins and spins. 
 */ 
function ChessClockLeft(game, spritesheet) {
    this.animation = new ChessClockAnimation(spritesheet, 100.1, 99.5, 0.05, 12, true, false);
    this.x = 297;  //ctx.drawImage(backgroundClock,260,30)
    this.y = 77;  //ctx.drawImage(backgroundClock,260,30)
    this.game = game;
    this.ctx = game.ctx;
}

ChessClockLeft.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

ChessClockLeft.prototype.update = function() {
	Entity.prototype.update.call(this);	
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
}

ChessClockAnimation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
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
}
// End Animation


//
//      The Game Board Object
//
function GameBoard(game, boardC) {
    // Game Board Sizes
    var frameHeight = 530;
    var frameWidth = 800;
    // Obtain imgs from asset manager to send to GameBoardAnimations
    var animationFrames = [];
    for (var i = 0; i < TOTAL_FRAMES; i++) {
        animationFrames.push(ASSET_MANAGER.getAsset("./img/" + i + ".png"));
    }
    // Sets the game board position releative to canvs
    this.x = 0;
    this.y = CANVAS_HEIGHT - frameHeight;
    this.animation = new GameBoardAnimation(animationFrames, this.x, this.y, frameHeight, frameWidth, boardC);
    Entity.call(this, game, this.x, this.y);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

//
//  Update game board, called by Entitiy in gameengine
//
GameBoard.prototype.update = function () {
    Entity.prototype.update.call(this);
}

//
//  Draw game board, called by Entitiy in gameengine
//
GameBoard.prototype.draw = function (ctx) {
    // Draw Game Board animation

    this.animation.drawFrame(this.game.clockTick, ctx);
    Entity.prototype.draw.call(this);
}
