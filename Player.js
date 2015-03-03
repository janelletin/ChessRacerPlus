function Player(game, boardC, visualBoard) {
    this.board = boardC;
    this.visualBoard = visualBoard;

    this.rank = 0;
    
    // Set frame and animation information for the player
    var scale = .9;
    this.frameHeight = 235 * scale;
    this.frameWidth = 95 * scale;
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
    // X Y coordinates of the player - center of the pawn for x
    this.x = (CANVAS_WIDTH / 8) * 4 + 5;
    this.y = CANVAS_HEIGHT - this.frameHeight - 15;

    this.horizontalSpeed = 1.6300445;

    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    this.movingLeft = false;
    this.movingRight = false;

    this.inSquare = true;
    this.specialActivated = false;
    this.specialMovesLeft = 0;
    this.newRank = 0;
  //  this.setRank(2);
    var canvasPartition = CANVAS_WIDTH / 8;
    this.separationLines = [canvasPartition + 15, canvasPartition * 2 + 15, canvasPartition * 3 + 9, canvasPartition * 4 + 5, canvasPartition * 5, canvasPartition * 6 - 5, CANVAS_WIDTH - this.frameWidth - 20, CANVAS_WIDTH];
    Entity.call(this, game, this.x, this.y);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    frameInterval = this.visualBoard.frameInterval;
    // Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 20)) {
        // Handle Plaer Ranking Up
        if (this.inSquare && this.rank != this.newRank) {
            this.rank = this.newRank;
            switch (this.rank) {
                case 0: // Pawn
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
                    break;
                case 1: // Knight
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                    break;
                case 2: // Bishop
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
                    break;
                case 3: // Rook
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    break;
                case 4: // Queen
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    break;
                case 5: // King
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/king.png");
                    break;
            }
            this.specialActivated = false;
            this.specialMovesLeft = 0;
        }

        // Handle animation starting to move right or left
        if (this.game.left) {
            if (this.inSquare) {
                this.inSquare = false;
                this.movingLeft = true;
                this.movingRight = false;
                this.game.right = false;
                this.game.left = false;
            }
        } else if (this.game.right) {
            if (this.inSquare) {
                this.inSquare = false;
                this.movingRight = true;
                this.movingLeft = false;
                this.game.right = false;
                this.game.left = false;
            }
        }

        // Handle Special Double Tap Activation
        if (this.game.doubleTap && this.specialMovesLeft === 0) {
            this.game.doubleTap = false;
            switch (this.rank) {
                case 0: // Pawn
                    break;
                case 1: // Knight
                    break;
                case 2: // Bishop
                    break;
                case 3: // Rook
                    if (!(this.board.User.column > 4 && this.movingRight) ||
                        !(this.board.User.column < 3 && this.movingLeft) || 
                        this.board.User.column == 4 || this.board.User.column == 5) {
                        this.specialActivated = true;
                        this.specialMovesLeft = 3;
                    }
                    break;
                case 4: // Queen
                    this.specialActivated = true;
                    this.specialMovesLeft = 3;
                    break;
            }
        }
    }
    // Handle edge boundries
    this.checkBounds();

    // Move the player left or right based on state of game ie this.game.left == true or this.game.right == true
    var speedIncreasedBy = 1;
    if (this.specialActivated) {
        switch (this.rank) {
            case 0: // Pawn
                break;
            case 1: // Knight
                break;
            case 2: // Bishop
                break;
            case 3: // Rook
                speedIncreasedBy = 3;
                break;
            case 4: // Queen
                break;
        }
    }
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed * speedIncreasedBy;
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed * speedIncreasedBy;
    }
    

    // Check to see if the player is in a new column
    var newX = this.checkIfNewSpace();

    // Handle what happends when in a new space
    if (this.movingLeft && this.inSquare) {
        switch (this.rank) {
            case 0: // Pawn
                this.movingLeft = false;
                this.game.left = false;
                this.movingRight = false;
                this.game.right = false;
                this.x = newX;
                break;
            case 1: // Knight
                this.movingLeft = false;
                this.game.left = false;
                this.movingRight = false;
                this.game.right = false;
                this.x = newX;
                break;
            case 2: // Bishop
                // Bishop nothing needs to Happen
                break;
            case 3: // Rook
                if (!this.specialActivated) {
                    this.movingLeft = false;
                    this.game.left = false;
                    this.movingRight = false;
                    this.game.right = false;
                    this.x = newX;
                }
                break;
            case 4: // Queen
                if (!this.specialActivated) {
                    this.movingLeft = false;
                    this.game.left = false;
                    this.movingRight = false;
                    this.game.right = false;
                    this.x = newX;
                }
                break;
        }
    } else if (this.movingRight && this.inSquare) {
        switch (this.rank) {
            case 0: // Pawn
                this.movingRight = false;
                this.game.right = false;
                this.movingLeft = false;
                this.game.left = false;
                this.x = newX;
                break;
            case 1: // Knight
                this.movingRight = false;
                this.game.right = false;
                this.movingLeft = false;
                this.game.left = false;
                this.x = newX;
                break;
            case 2: // Bishop
                // Bishop nothing needs to happen
                break;
            case 3: // Rook
                if (!this.specialActivated) {
                    this.movingRight = false;
                    this.game.right = false;
                    this.movingLeft = false;
                    this.game.left = false;
                    this.x = newX;
                }
                break;
            case 4: // Queen
                if (!this.specialActivated) {
                    this.movingRight = false;
                    this.game.right = false;
                    this.movingLeft = false;
                    this.game.left = false;
                    this.x = newX;
                }
                break;
        }
    }
    Entity.prototype.update.call(this);
}

Player.prototype.checkIfNewSpace = function () {
    var offset = 2;
    var bc = this.board.User.column;
    var newX = 0;
    var newSquare = false;
    // Moving Left
    if (this.movingLeft) {
        // Check if in the center of a space
        if (bc > 0 && (this.x >= this.separationLines[bc - 1] && this.x < this.separationLines[bc - 1] + offset)) {
            this.inSquare = true;
        }
        // Check if in new space and update board model
        if (bc > 0 && this.x < this.separationLines[bc - 1]) {
            this.board.User.move("left");
            newSquare = true;
        }
        newX = this.separationLines[bc - 1];
    // Moving Right
    } else if (this.movingRight) {
        // Check if in the center of a space
        if (bc < 7 && (this.x > this.separationLines[bc - 1] - offset && this.x <= this.separationLines[bc - 1])) {
            this.inSquare = true;
        }
        // Check if in new space and update board model
        if (bc < 7 && this.x + this.frameWidth > this.separationLines[bc]) {
            this.board.User.move("right");
            newSquare = true;
        }
        newX = this.separationLines[bc - 1];
    }

    // If in the center of the space update speical moves
    if (newSquare) {
        if (this.specialMovesLeft > 0) {
            this.specialMovesLeft--;
        } else {
            this.specialActivated = false;
        }
    }
    return newX;
   // console.log(this.board.User.column);

}

// Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
Player.prototype.checkBounds = function () {
    // Left Edge
    if (this.x < 15 || (this.x === 15 && this.movingLeft)) {
        switch (this.rank) {
            case 0: // Pawn
                break;
            case 1: // Knight
                break;
            case 2: // Bishop
                this.game.right = true;
                break;
            case 3: // Rook
                break;
            case 4: // Queen
                if (this.specialActivated) {
                    this.game.right = true;
                }                
                break;          
        }
        this.game.left = false;
        this.movingLeft = false;
        this.x = 15;
        this.inSquare = true;
    // Right Edge
    } else if (this.x > CANVAS_WIDTH - this.frameWidth - 20 || (this.x === CANVAS_WIDTH - this.frameWidth - 20 && this.movingRight)) {
        switch (this.rank) {
            case 0: // Pawn
                break;
            case 1: // Knight
                break;
            case 2: // Bishop
                this.game.left = true;
                break;
            case 3: // Rook
                break;
            case 4: // Queen
                if (this.specialActivated) {
                    this.game.left = true;
                }                         
                break;
        }
        this.game.right = false;
        this.movingRight = false;
        this.x = CANVAS_WIDTH - this.frameWidth - 20;
        this.inSquare = true;
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
* @the_rank 0 - 6 changes the rank. 0-pawn, 1-knight, 2-bishop, 3-rook, 4-queen, 5-king
**/
Player.prototype.setRank = function (the_rank) {
    if (the_rank >= 0 && the_rank < 6) {
        this.newRank = the_rank;
    }

/**
 * Returns the Players current rank. 
 * @returns {Number} a numerical representation of the Player's Rank.
 */
Player.prototype.getRank = function(){
	return this.rank;
}    
    
    
}