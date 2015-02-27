function Player(game, boardC) {
    this.board = boardC;

    this.rank = 1;
    
    // Set frame and animation information for the player
    var scale = .9;
    this.frameHeight = 235 * scale;
    this.frameWidth = 95 * scale;
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");

    // X Y coordinates of the player - center of the pawn for x
    this.x = (CANVAS_WIDTH / 2);// + (this.frameWidth / 2);
    this.y = CANVAS_HEIGHT - this.frameHeight - 15;

    this.horizontalSpeed = 1.60001;

    this.columnLocation = 4;

    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    this.movingLeft = false;
    this.movingRight = false;

    Entity.call(this, game, this.x, this.y);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function (frameInterval) {

    // Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
    if (frameInterval >= 0 && frameInterval <= 5) {
        if (this.game.left) {
            this.movingLeft = true;
            this.movingRight = false;
            this.game.right = false;
        } else if (this.game.right) {
            this.movingRight = true;
            this.movingLeft = false;
            this.game.left = false;
        }
    }

    this.checkBounds();
    // Move the player left or right based on state of game ie this.game.left == true or this.game.right == true

    if (this.movingLeft) {
        this.x -= this.horizontalSpeed;
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed;
    }

    this.checkSpace();

    Entity.prototype.update.call(this);
}






/*
 * This is to properly place the Pawn on the board for when the user moves left or right.  
 * It does not have anything to do with the board, only the canvas. 
 */
Player.prototype.checkSpace = function () {
    var canvasPartition = CANVAS_WIDTH / 8;



    if (this.movingLeft) {

        if (this.x > canvasPartition + 10 && this.x < canvasPartition + 15) {
            this.x = canvasPartition + 10;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 2 + 10 && this.x < canvasPartition * 2 + 15) {
            this.x = canvasPartition * 2 + 10;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 3 + 7 && this.x < canvasPartition * 3 + 12) {
            this.x = canvasPartition * 3 + 7;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 4 + 5 && this.x < canvasPartition * 4 + 10) {
            this.x = canvasPartition * 4 + 5;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 5 && this.x < canvasPartition * 5 + 5) {
            this.x = canvasPartition * 5;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        } else if (this.x > canvasPartition * 6 && this.x < canvasPartition * 6 + 5) {
            this.x = canvasPartition * 6;
            this.movingLeft = false;
            this.game.left = false;
			//this.board.User.move("left");
        }
  
    } else if (this.movingRight) {

        if (canvasPartition + 5 < this.x && this.x < canvasPartition + 10) {
            this.x = canvasPartition + 10;
            this.movingRight = false;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 2 + 10 && this.x > canvasPartition * 2 + 5) {
            this.x = canvasPartition * 2 + 10;
            this.movingRight = false;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 3 + 7 && this.x > canvasPartition * 3 + 2) {
            this.x = canvasPartition * 3 + 7;
            this.movingRight = false;
            this.game.right = false;
			//this.board.User.move("right");
        } else if (this.x < canvasPartition * 4 + 5 && this.x > canvasPartition * 4) {
            this.x = canvasPartition * 4 + 5;
            this.movingRight = false;
            this.game.right = false;
			//this.board.User.move("right");



        } else if (canvasPartition * 5 - 5 < this.x && this.x < canvasPartition * 5) {
            this.x = canvasPartition * 5;
            this.movingRight = false;
            this.game.right = false;
            


        } else if (this.x < canvasPartition * 6 && this.x > canvasPartition * 6 - 5) {
            this.x = canvasPartition * 6;
            this.movingRight = false;
            this.game.right = false;
			//this.board.User.move("right");
        }

    }
}


// Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
Player.prototype.checkBounds = function () {
    if (this.x < 25 || (this.x === 25 && this.movingLeft)) {
        this.game.left = false;
        this.movingLeft = false;
        this.x = 25;
    } else if (this.x > CANVAS_WIDTH - this.frameWidth - 15 || (this.x === CANVAS_WIDTH - this.frameWidth - 15 && this.movingRight)) {
        this.game.right = false;
        this.movingRight = false;
        this.x = CANVAS_WIDTH - this.frameWidth - 15;
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

















/**
* Handles drawing the player
*
* @ctx The context of the canvas 
**/
Player.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet, this.x, this.y,
              this.frameWidth, this.frameHeight);
    Entity.prototype.draw.call(this);
}

/**
* Change the rank of the player
*
* @the_rank 0 - 6 changes the rank. 0-pawn, 1-knight, 2-bishop, 3-rook, 4-castle, 5-queen, 6-king
**/
Player.prototype.setRank = function (the_rank) {
    switch (the_rank) {
        case 0: // Pawn
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
            this.rank = 0;
            break;
        case 1: // Knight
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
            this.rank = 1;
            break;
        case 2: // Bishop
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
            this.rank = 2;
            break;
        case 3: // Rook
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
            this.rank = 3;
            break;
        case 4: // Castle
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/castle.png");
            this.rank = 4;
            break;
        case 5: // Queen
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
            this.rank = 5;
            break;
        case 6: // King
            this.spriteSheet = ASSET_MANAGER.getAsset("./img/king.png");
            this.rank = 6;
            break;
    }
}