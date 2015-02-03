function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

















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
var GAME_SPEED = .025; //.04
var BOARD_HEIGHT = 530;
var BOARD_FRAMES = 40;
var new_square = true;
var current_board_frame_index;



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
function Piece(game, piece_rank, starting_position, color) {
    
    switch (piece_rank) {
        case 'pawn':
            this.frameHeight = 158;
            this.frameWidth = 96;
            break;
        case 'bishop':
            this.frameHeight = 220;
            this.frameWidth = 90;
            break;
        case 'castle':
            this.frameHeight = 174;
            this.frameWidth = 90;
            break;
        case 'queen':
            this.frameHeight = 228;
            this.frameWidth = 90;
            break;
        case 'king':
            this.frameHeight = 235;
            this.frameWidth = 96;
            break;
    }
    this.scale = .5;
    this.SCALE_INCREASED_BY = .36;
    this.frameHeight = Math.floor(this.frameHeight * this.scale);
    this.frameWidth = Math.floor(this.frameWidth * this.scale);
    this.rank = piece_rank;
    this.y = CANVAS_HEIGHT - BOARD_HEIGHT - this.frameHeight / 3;
    this.column = 4;
    this.row = 0;
    this.rowDepth = current_board_frame_index;
    this.rowPrevDepth = 0;
    this.color = color;
    this.finishedSet = false;
    this.TOTAL = 0;
    this.animation = new PieceAnimation(ASSET_MANAGER.getAsset("./img/" + piece_rank + ".png"));
    Entity.call(this, game, this.x, this.y);
}

Piece.prototype = new Entity();
Piece.prototype.constructor = Piece;

Piece.prototype.update = function () {

    if (this.row > 6) {
        return;
    }

    this.yPositions = [];

    var rowHeight = 0;
    // Attempt to
    // Calculate y position based on pixel size of boxes
    switch (this.row) {
        case 0:
            this.yPositions = [270, 270, 271, 271, 272, 273, 273, 274, 275, 275, 276, 277, 277, 278, 279, 279, 280, 281, 281, 282, 283];
            rowHeight = 13;
            break;
        case 1:
            this.yPositions = [283, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301];
            rowHeight = 18;
            break;
        case 2:
            this.yPositions = [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321];
            rowHeight = 20;
            break;
        case 3:
            this.yPositions = [321, 322, 323, 324, 325, 326, 327, 329, 330, 331, 332, 333, 334, 335, 337, 338, 339, 340, 341, 342, 344];
            rowHeight = 23;
            break;
        case 4:
            this.yPositions = [344, 345, 346, 347, 349, 350, 351, 353, 354, 355, 357, 358, 359, 360, 362, 363, 364, 366, 367, 368, 370];
            rowHeight = 26;
            break;
        case 5:
            this.yPositions = [370, 371, 373, 374, 376, 377, 379, 380, 382, 383, 385, 386, 388, 389, 391, 392, 394, 395, 397, 398, 400];
            rowHeight = 30;
            break;
        case 6:
            this.yPositions = [400, 401, 403, 404, 406, 407, 409, 410, 412, 413, 415, 416, 418, 419, 421, 422, 424, 425, 427, 428, 430, ]
            rowHeight = 30;
            break;
        case 7:
            rowHeight = 41;
            break;
        case 8:
            rowHeight = 51;
            break;
        case 9:
            rowHeight = 62;
            break;
        case 10:
            rowHeight = 80;
            break;
        case 11:
            rowHeight = 100;
            break;
        case 12:
            break;            
    }

    this.y = this.yPositions[current_board_frame_index];

    // Calculate x position based on linear equation
    switch (this.column) {
        case 0:
            this.x = Math.floor((31270 - 51 * this.y) / 106) + 105;
            break;
        case 1:
            this.x = Math.floor((34980 - 37 * this.y) / 106) + 70;
            break;
        case 2:
            this.x = Math.floor((38160 - 23 * this.y) / 106) + 45;
            break;
        case 3:
            this.x = Math.floor((41870 - 9 * this.y) / 106) + 9;
            break;
        case 4:
            this.x = Math.floor((45050 + 5 * this.y) / 106) - 20;
            break;
        case 5:
            this.x = Math.floor((24380 + 9 * this.y) / 53) - 53;
            break;
        case 6:
            this.x = Math.floor((51940 + 33 * this.y) / 106) - 85;
            break;
        case 7:
            this.x = Math.floor((55650 + 45 * this.y) / 106) - 110;
            break;
    }

    if (new_square) {
        this.row++;
    }


    Entity.prototype.update.call(this);
}

Piece.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale, this.frameHeight, this.frameWidth);
    Entity.prototype.draw.call(this);
}


function PieceAnimation(spriteSheet, startX, startY) {
    this.spriteSheet = spriteSheet;
}

PieceAnimation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy, frameHeight, frameWidth) {
    var scaleBy = scaleBy || 1;
    ctx.drawImage(this.spriteSheet, x, y,
                  frameWidth * scaleBy, frameHeight * scaleBy);
    ctx
}




PieceAnimation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

PieceAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
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
function Player(game) {
    this.frameHeight = 158;
    this.frameWidth = 96;
    var startX = CANVAS_WIDTH / 2 + 5;
    var startY = CANVAS_HEIGHT - this.frameHeight + 15;
    this.x = startX;
    this.y = startY;
    this.horizontalSpeed = 2;
    this.animation = new PlayerAnimation(ASSET_MANAGER.getAsset("./img/pawn.png"), this.x, this.y, this.frameHeight, this.frameWidth);
    this.moveRight = false;
    this.moveLeft = false;
    this.state = 'pawn';
    Entity.call(this, game, this.x, this.y);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
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
        this.animation.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png")
    }

    switch (this.state) {
        case 'pawn':
            this.pawnUpdate();
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

Player.prototype.pawnUpdate = function() {
    var canvasPartition = CANVAS_WIDTH / 8;
    if (this.game.left) {
        if (this.x > canvasPartition + 10 && this.x < canvasPartition + 15) {
            this.x = canvasPartition + 10;
            this.game.left = false;
        } else if (this.x > canvasPartition * 2 + 10 && this.x < canvasPartition * 2 + 15) {
            this.x = canvasPartition * 2 + 10;
            this.game.left = false;
        } else if (this.x > canvasPartition * 3 + 7 && this.x < canvasPartition * 3 + 12) {
            this.x = canvasPartition * 3 + 7;
            this.game.left = false;
        } else if (this.x > canvasPartition * 4 + 5 && this.x < canvasPartition * 4 + 10) {
            this.x = canvasPartition * 4 + 5;
            this.game.left = false;
        } else if (this.x > canvasPartition * 5 && this.x < canvasPartition * 5 + 5) {
            this.x = canvasPartition * 5;
            this.game.left = false;
        } else if (this.x > canvasPartition * 6 && this.x < canvasPartition * 6 + 5) {
            this.x = canvasPartition * 6;
            this.game.left = false;
        } else {
            this.x -= this.horizontalSpeed;
        }
    } else if (this.game.right) {
        if (this.x < canvasPartition + 10 && this.x > canvasPartition + 5) {
            this.x = canvasPartition + 10;
            this.game.right = false;
        } else if (this.x < canvasPartition * 2 + 10 && this.x > canvasPartition * 2 + 5) {
            this.x = canvasPartition * 2 + 10;
            this.game.right = false;
        } else if (this.x < canvasPartition * 3 + 7 && this.x > canvasPartition * 3 + 2) {
            this.x = canvasPartition * 3 + 7;
            this.game.right = false;
        } else if (this.x < canvasPartition * 4 + 5 && this.x > canvasPartition * 4) {
            this.x = canvasPartition * 4 + 5;
            this.game.right = false;
        } else if (this.x < canvasPartition * 5 && this.x > canvasPartition * 5 - 5) {
            this.x = canvasPartition * 5;
            this.game.right = false;
        } else if (this.x < canvasPartition * 6 && this.x > canvasPartition * 6 - 5) {
            this.x = canvasPartition * 6;
            this.game.right = false;
        } else {
            this.x += this.horizontalSpeed;
        }
    }
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
//
function GameBoardAnimation(frames, x, y, frameHeight, frameWidth, frameDuration, total_frames, scaleBy) {
    this.frames = frames;
    this.x = x;
    this.y = y;
    this.scaleBy = scaleBy || 1;
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    this.totalFrames = total_frames;
    this.frameDuration = frameDuration;
    this.totalTime = this.frameDuration * this.totalFrames;
    this.elapsedTime = 0;
}

GameBoardAnimation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        this.elapsedTime = 0;
        new_square = true;
    } else {
        new_spare = false;
    }

    var index = this.currentFrame();
  
    current_board_frame_index = Math.floor(this.elapsedTime / this.frameDuration / 2) + Math.floor(this.elapsedTime / this.frameDuration) % 2;
   
    ctx.drawImage(//this.frames[0],
                this.frames[Math.floor(this.elapsedTime / this.frameDuration)],
                  this.x, this.y,
                  this.frameWidth * this.scaleBy, this.frameHeight * this.scaleBy);
}

GameBoardAnimation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

GameBoardAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function GameBoard(game) {
    this.frameDuration = GAME_SPEED;
    var totalFrames = 40;
    var animationFrames = [];
    for (var i = 0; i < totalFrames; i++) {
        animationFrames.push(ASSET_MANAGER.getAsset("./img/" + i + ".png"));
    }

    var frameHeight = 530;
    var frameWidth = 800;
    this.x = 0;
    this.y = CANVAS_HEIGHT - frameHeight;
    this.animation = new GameBoardAnimation(animationFrames, this.x, this.y, frameHeight, frameWidth, this.frameDuration, totalFrames);
    Entity.call(this, game, 0, 400);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.update = function () {

    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}




//
//
//
//
//  main
//  main
//  main
//  main
//
//
//
//
//
//
//

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/0.png");
ASSET_MANAGER.queueDownload("./img/1.png");
ASSET_MANAGER.queueDownload("./img/2.png");
ASSET_MANAGER.queueDownload("./img/3.png");
ASSET_MANAGER.queueDownload("./img/4.png");
ASSET_MANAGER.queueDownload("./img/5.png");
ASSET_MANAGER.queueDownload("./img/6.png");
ASSET_MANAGER.queueDownload("./img/7.png");
ASSET_MANAGER.queueDownload("./img/8.png");
ASSET_MANAGER.queueDownload("./img/9.png");
ASSET_MANAGER.queueDownload("./img/10.png");
ASSET_MANAGER.queueDownload("./img/11.png");
ASSET_MANAGER.queueDownload("./img/12.png");
ASSET_MANAGER.queueDownload("./img/13.png");
ASSET_MANAGER.queueDownload("./img/14.png");
ASSET_MANAGER.queueDownload("./img/15.png");
ASSET_MANAGER.queueDownload("./img/16.png");
ASSET_MANAGER.queueDownload("./img/17.png");
ASSET_MANAGER.queueDownload("./img/18.png");
ASSET_MANAGER.queueDownload("./img/19.png");
ASSET_MANAGER.queueDownload("./img/20.png");
ASSET_MANAGER.queueDownload("./img/21.png");
ASSET_MANAGER.queueDownload("./img/22.png");
ASSET_MANAGER.queueDownload("./img/23.png");
ASSET_MANAGER.queueDownload("./img/24.png");
ASSET_MANAGER.queueDownload("./img/25.png");
ASSET_MANAGER.queueDownload("./img/26.png");
ASSET_MANAGER.queueDownload("./img/27.png");
ASSET_MANAGER.queueDownload("./img/28.png");
ASSET_MANAGER.queueDownload("./img/29.png");
ASSET_MANAGER.queueDownload("./img/30.png");
ASSET_MANAGER.queueDownload("./img/31.png");
ASSET_MANAGER.queueDownload("./img/32.png");
ASSET_MANAGER.queueDownload("./img/33.png");
ASSET_MANAGER.queueDownload("./img/34.png");
ASSET_MANAGER.queueDownload("./img/35.png");
ASSET_MANAGER.queueDownload("./img/36.png");
ASSET_MANAGER.queueDownload("./img/37.png");
ASSET_MANAGER.queueDownload("./img/38.png");
ASSET_MANAGER.queueDownload("./img/39.png");
ASSET_MANAGER.queueDownload("./img/pawn.png");
ASSET_MANAGER.queueDownload("./img/bishop.png");
ASSET_MANAGER.queueDownload("./img/queen.png");
ASSET_MANAGER.queueDownload("./img/king.png");
ASSET_MANAGER.queueDownload("./img/castle.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var gb = new GameBoard(gameEngine);
    var pl = new Player(gameEngine);
    var pwn = new Piece(gameEngine, "pawn", 0, "white");
    

    gameEngine.addEntity(gb);
    gameEngine.addEntity(pl);
    gameEngine.addEntity(pwn);

    gameEngine.init(ctx);
    gameEngine.start();
});
