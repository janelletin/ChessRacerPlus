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
    switch (this.rank) {
        case 'pawn':
            this.standardFrameHeight = 158;
            this.standardFrameWidth = 96;
            break;
        case 'bishop':
            this.standardFrameHeight = 220;
            this.standardFrameWidth = 90;
            break;
        case 'castle':
            this.standardFrameHeight = 174;
            this.standardFrameWidth = 90;
            break;
        case 'queen':
            this.standardFrameHeight = 228;
            this.standardFrameWidth = 90;
            break;
        case 'king':
            this.standardFrameHeight = 235;
            this.standardFrameWidth = 96;
            break;
    }

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
        
    this.animation = new PieceAnimation(ASSET_MANAGER.getAsset("./img/" + piece_rank + ".png"));

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
            this.scales = [0.5000, 0.5010, 0.5020, 0.5030, 0.5040, 0.5050, 0.5060, 0.5070, 0.5080, 0.5090, 0.5100, 0.5110, 0.5120, 0.5130, 0.5140, 0.5150, 0.5160, 0.5170, 0.5180, 0.5190];
            rowHeight = 13;
            break;
        case 1:
            this.yPositions = [282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301];
            this.scales = [0.5200, 0.5210, 0.5220, 0.5230, 0.5240, 0.5250, 0.5260, 0.5270, 0.5280, 0.5290, 0.5300, 0.5310, 0.5320, 0.5330, 0.5340, 0.5350, 0.5360, 0.5370, 0.5380, 0.5390];
            rowHeight = 18;
            break;
        case 2:
            this.yPositions = [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321];
            this.scales = [0.5400, 0.5415, 0.5430, 0.5445, 0.5460, 0.5475, 0.5490, 0.5505, 0.5520, 0.5535, 0.5550, 0.5565, 0.5580, 0.5595, 0.5610, 0.5625, 0.5640, 0.5655, 0.5670, 0.5685];
            rowHeight = 20;
            break;
        case 3:
            this.yPositions = [321, 322, 323, 324, 325, 326, 327, 329, 330, 331, 332, 333, 334, 335, 337, 338, 339, 340, 341, 342, 344];
            this.scales = [0.5700, 0.5715, 0.5730, 0.5745, 0.5760, 0.5775, 0.5790, 0.5805, 0.5820, 0.5835, 0.5850, 0.5865, 0.5880, 0.5895, 0.5910, 0.5925, 0.5940, 0.5955, 0.5970, 0.5985];
            rowHeight = 23;
            break;
        case 4:
            this.yPositions = [344, 345, 346, 347, 349, 350, 351, 353, 354, 355, 357, 358, 359, 360, 362, 363, 364, 366, 367, 368, 370];
            this.scales = [0.6000, 0.6015, 0.6030, 0.6045, 0.6060, 0.6075, 0.6090, 0.6105, 0.6120, 0.6135, 0.6150, 0.6165, 0.6180, 0.6195, 0.6210, 0.6225, 0.6240, 0.6255, 0.6270, 0.6285];
            rowHeight = 26;
            break;
        case 5:
            this.yPositions = [370, 371, 373, 374, 376, 377, 379, 380, 382, 383, 385, 386, 388, 389, 391, 392, 394, 395, 397, 398, 400];
            this.scales = [0.6300, 0.6315, 0.6330, 0.6345, 0.6360, 0.6375, 0.6390, 0.6405, 0.6420, 0.6435, 0.6450, 0.6465, 0.6480, 0.6495, 0.6510, 0.6525, 0.6540, 0.6555, 0.6570, 0.6585];
            rowHeight = 30;
            break;
        case 6:
            this.yPositions = [400, 401, 403, 404, 406, 407, 409, 410, 412, 413, 415, 416, 418, 419, 421, 422, 424, 425, 427, 428, 430]
            this.scales = [0.6600, 0.6610, 0.6620, 0.6630, 0.6640, 0.6650, 0.6660, 0.6670, 0.6680, 0.6690, 0.6700, 0.6710, 0.6720, 0.6730, 0.6740, 0.6750, 0.6760, 0.6770, 0.6780, 0.6790];
            rowHeight = 30;
            break;
        case 7:
            this.yPositions = [430, 431, 433, 435, 437, 439, 440, 442, 444, 446, 448, 449, 451, 453, 455, 457, 458, 460, 462, 464, 466];
            this.scales = [0.6800, 0.6810, 0.6820, 0.6830, 0.6840, 0.6850, 0.6860, 0.6870, 0.6880, 0.6890, 0.6900, 0.6910, 0.6920, 0.6930, 0.6940, 0.6950, 0.6960, 0.6970, 0.6980, 0.6990];
            rowHeight = 41;
            break;
        case 8:
            this.yPositions = [466, 468, 470, 472, 474, 476, 478, 480, 482, 484, 486, 488, 490, 492, 494, 496, 498, 500, 502, 504, 507];
            this.scales = [0.7000, 0.7020, 0.7040, 0.7060, 0.7080, 0.7100, 0.7120, 0.7140, 0.7160, 0.7180, 0.7200, 0.7220, 0.7240, 0.7260, 0.7280, 0.7300, 0.7320, 0.7340, 0.7360, 0.7380];
            rowHeight = 51;
            break;
        case 9:
            this.yPositions = [507, 509, 512, 514, 517, 519, 522, 524, 527, 529, 532, 535, 537, 540, 542, 545, 547, 550, 552, 555, 558];
            this.scales = [0.7400, 0.7420, 0.7440, 0.7460, 0.7480, 0.7500, 0.7520, 0.7540, 0.7560, 0.7580, 0.7600, 0.7620, 0.7640, 0.7660, 0.7680, 0.7700, 0.7720, 0.7740, 0.7760, 0.7780];
            rowHeight = 62;
            break;
        case 10:
            this.yPositions = [558, 561, 564, 567, 570, 573, 576, 579, 582, 585, 589, 592, 595, 598, 601, 604, 607, 610, 613, 616, 620];
            this.scales = [0.7800, 0.7845, 0.7890, 0.7935, 0.7980, 0.8025, 0.8070, 0.8115, 0.8160, 0.8205, 0.8250, 0.8295, 0.8340, 0.8385, 0.8430, 0.8475, 0.8520, 0.8565, 0.8610, 0.8655];
            rowHeight = 80;
            break;
        case 11:
            this.yPositions = [620, 624, 628, 632, 636, 640, 644, 648, 652, 656, 660, 664, 668, 672, 676, 680, 684, 688, 692, 696, 700];
            this.scales = [0.8700, 0.8730, 0.8760, 0.8790, 0.8820, 0.8850, 0.8880, 0.8910, 0.8940, 0.8970, 0.9000, 0.9030, 0.9060, 0.9090, 0.9120, 0.9150, 0.9180, 0.9210, 0.9240, 0.9270];
            rowHeight = 100;
            break;
        case 12:
            this.yPositions = [700, 705, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 765, 770, 775, 780, 785, 790, 795, 800];
            this.scales = [0.9300, 0.9325, 0.9350, 0.9375, 0.9400, 0.9425, 0.9450, 0.9475, 0.9500, 0.9525, 0.9550, 0.9575, 0.9600, 0.9625, 0.9650, 0.9675, 0.9700, 0.9725, 0.9750, 0.9775];
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
//  Player
//  Player
//  Player
//  Player
//
//
//
//
//
//
//
function Player(game, boardC) {
	this.board = boardC;
    this.frameHeight = 158;
    this.frameWidth = 96;
    var startX = CANVAS_WIDTH / 2 + 5;
    var startY = CANVAS_HEIGHT - this.frameHeight;
    this.x = startX;
    this.y = startY;
    this.horizontalSpeed = (GAME_SPEED * 20) * (1 - GAME_SPEED);
    this.animation = new PlayerAnimation(ASSET_MANAGER.getAsset("./img/pawn.png"), this.x, this.y, this.frameHeight, this.frameWidth);
    this.moveRight = false;
    this.moveLeft = false;
    this.state = 'pawn';
    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;
    Entity.call(this, game, this.x, this.y);
    //console.log(this.x, this.y); //(405,642) This is the gameboard starting point to draw. 
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {

    this.elapsedTime += this.game.clockTick;
    if (this.isDone()) {
        this.elapsedTime = 0;
    }

    var f = Math.floor(this.elapsedTime / GAME_SPEED);
    this.elapsedTime += this.game.clockTick;
    if (this.isDone()) {
        this.elapsedTime = 0;
        f = 0;
    }
    if (this.x < 15) {
        this.game.left = false;
        this.x = 15;
    } else if (this.x > CANVAS_WIDTH - this.frameWidth - 5) {
        this.game.right = false;
        this.x = CANVAS_WIDTH - this.frameWidth - 5;
        this.y -= 220 - this.frameHeight;
        this.frameHeight = 220;
        this.frameWidth = 90;
        this.state = 'bishop';
        this.animation.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
        alert("You are now a Bishop. Just because you went all the way to the right.");
    }

    switch (this.state) {
        case 'pawn':
        	if(this.isMoveable())
       		{ 
        		this.pawnUpdate();
       		}
            break;
        default:
            if (this.game.left) {
                this.x -= this.horizontalSpeed;
            } else if (this.game.right) {
                this.x += this.horizontalSpeed;
            }
            break;
    }
    Entity.prototype.update.call(this);
}

Player.prototype.isMoveable = function() {
	
	//console.log("Board stuff: " + this.y);
	if(moveable)
		return true;
	
	return true;
	
}


/*
 * This is to properly place the Pawn on the board for when the user moves left or right.  
 * It does not have anything to do with the board, only the canvas. 
 */
Player.prototype.pawnUpdate = function() {
    var canvasPartition = CANVAS_WIDTH / 8;
    if (this.game.left) {
        if (this.x > canvasPartition + 10 && this.x < canvasPartition + 15) {
            this.x = canvasPartition + 10;
            this.game.left = false;
			this.board.User.move("left");
        } else if (this.x > canvasPartition * 2 + 10 && this.x < canvasPartition * 2 + 15) {
            this.x = canvasPartition * 2 + 10;
            this.game.left = false;
			this.board.User.move("left");
        } else if (this.x > canvasPartition * 3 + 7 && this.x < canvasPartition * 3 + 12) {
            this.x = canvasPartition * 3 + 7;
            this.game.left = false;
			this.board.User.move("left");
        } else if (this.x > canvasPartition * 4 + 5 && this.x < canvasPartition * 4 + 10) {
            this.x = canvasPartition * 4 + 5;
            this.game.left = false;
			this.board.User.move("left");
        } else if (this.x > canvasPartition * 5 && this.x < canvasPartition * 5 + 5) {
            this.x = canvasPartition * 5;
            this.game.left = false;
			this.board.User.move("left");
        } else if (this.x > canvasPartition * 6 && this.x < canvasPartition * 6 + 5) {
            this.x = canvasPartition * 6;
            this.game.left = false;
			this.board.User.move("left");
        } else {
            this.x -= this.horizontalSpeed;
        }
    } else if (this.game.right) {
        if (this.x < canvasPartition + 10 && this.x > canvasPartition + 5) {
            this.x = canvasPartition + 10;
            this.game.right = false;
			this.board.User.move("right");
        } else if (this.x < canvasPartition * 2 + 10 && this.x > canvasPartition * 2 + 5) {
            this.x = canvasPartition * 2 + 10;
            this.game.right = false;
			this.board.User.move("right");
        } else if (this.x < canvasPartition * 3 + 7 && this.x > canvasPartition * 3 + 2) {
            this.x = canvasPartition * 3 + 7;
            this.game.right = false;
			this.board.User.move("right");
        } else if (this.x < canvasPartition * 4 + 5 && this.x > canvasPartition * 4) {
            this.x = canvasPartition * 4 + 5;
            this.game.right = false;
			this.board.User.move("right");
        } else if (this.x < canvasPartition * 5 && this.x > canvasPartition * 5 - 5) {
            this.x = canvasPartition * 5;
            this.game.right = false;
			this.board.User.move("right");
        } else if (this.x < canvasPartition * 6 && this.x > canvasPartition * 6 - 5) {
            this.x = canvasPartition * 6;
            this.game.right = false;
			this.board.User.move("right");
        } else {
            this.x += this.horizontalSpeed;
        }
    }
}

Player.prototype.currentFrame = function () {
	if (logging)
		console.log("Player CurrentFrame function " + Math.floor(this.elapsedTime / GAME_SPEED));
    return Math.floor(this.elapsedTime / GAME_SPEED);
}

Player.prototype.isDone = function () {
	if (logging)
		console.log("player isDone function " + (this.elapsedTime >= this.totalTime));
    return (this.elapsedTime >= this.totalTime);
}

Player.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .9, this.frameHeight, this.frameWidth);
    Entity.prototype.draw.call(this);
}

function PlayerAnimation(spriteSheet, startX, startY) {
    this.spriteSheet = spriteSheet;
    this.x = startX;
    this.y = startY;
}

PlayerAnimation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, frameHeight, frameWidth) {
    var scaleBy = scaleBy || 1;
    this.x = x;
    this.y = y;
    ctx.drawImage(this.spriteSheet, this.x, this.y,
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
}

GameBoardAnimation.prototype.drawFrame = function (tick, ctx) {
    // Calculate elapsed time and see if the frame needs to be started over
	var halftime = 0; // Halfway. When black/white changes
	this.elapsedTime += tick;
	this.halfTime += tick;
    if (this.isDone()) {
        this.elapsedTime = 0;
		this.boardC.update(); // Updates every other row
    } else if(this.isHalfway()){
		this.halfTime = 0;
		//this.boardC.update(); // Updates every row
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
       


    ctx.drawImage(//this.frames[0],
                  this.frames[Math.floor(this.elapsedTime / GAME_SPEED)],
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
