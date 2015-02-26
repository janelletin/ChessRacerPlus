function Player(game, boardC) {
    this.board = boardC;
    // Initialize Starting Space
    this.frameHeight = 235;
    this.frameWidth = 95;
    this.x = CANVAS_WIDTH / 2 + 5;
    this.y = CANVAS_HEIGHT - this.frameHeight;

    this.horizontalSpeed = 1.60001;

    this.animation = new PlayerAnimation(ASSET_MANAGER.getAsset("./img/pawn.png"), this.x, this.y, this.frameHeight, this.frameWidth);
    this.moveRight = false;
    this.moveLeft = false;
    this.state = 'pawn';

    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    Entity.call(this, game, this.x, this.y);
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
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 2 + 10 && this.x < canvasPartition * 2 + 15) {
            this.x = canvasPartition * 2 + 10;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 3 + 7 && this.x < canvasPartition * 3 + 12) {
            this.x = canvasPartition * 3 + 7;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 4 + 5 && this.x < canvasPartition * 4 + 10) {
            this.x = canvasPartition * 4 + 5;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 5 && this.x < canvasPartition * 5 + 5) {
            this.x = canvasPartition * 5;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 6 && this.x < canvasPartition * 6 + 5) {
            this.x = canvasPartition * 6;
            this.game.left = false;
			//this.board.User.move("left");
        } else {
            this.x -= this.horizontalSpeed;
			//this.board.User.move("left");
        }
  
    } else if (this.game.right) {

        if (this.x < canvasPartition + 10 && this.x > canvasPartition + 5) {
            this.x = canvasPartition + 10;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 2 + 10 && this.x > canvasPartition * 2 + 5) {
            this.x = canvasPartition * 2 + 10;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 3 + 7 && this.x > canvasPartition * 3 + 2) {
            this.x = canvasPartition * 3 + 7;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 4 + 5 && this.x > canvasPartition * 4) {
            this.x = canvasPartition * 4 + 5;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 5 && this.x > canvasPartition * 5 - 5) {
            this.x = canvasPartition * 5;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 6 && this.x > canvasPartition * 6 - 5) {
            this.x = canvasPartition * 6;
            this.game.right = false;
			//this.board.User.move("right");
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