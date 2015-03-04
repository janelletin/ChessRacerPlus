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
    var canvasPartition = CANVAS_WIDTH / 8;
    this.separationLines = [canvasPartition + 15, canvasPartition * 2 + 15, canvasPartition * 3 + 9, canvasPartition * 4 + 5, canvasPartition * 5, canvasPartition * 6 - 5, CANVAS_WIDTH - this.frameWidth - 20, CANVAS_WIDTH];

    this.x = 15;// this.separationLines[15];//(CANVAS_WIDTH / 8) * 4 + 5;
    this.y = CANVAS_HEIGHT - this.frameHeight - 15;

    this.horizontalSpeed = 1.6300445;

    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    this.movingLeft = false;
    this.movingRight = false;
    this.speedIncreasedBy = 1;
    this.inSquare = true;
    this.specialActivated = false;
    this.specialMovesLeft = 0;
    this.newRank = 0;
    //this.setRank(1);
    this.column = STARTING_POSITION;
    Entity.call(this, game, this.x, this.y);

}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.setRank = function (the_rank) {
    if (the_rank >= 0 && the_rank < 6) {
        console.log("new rank" + the_rank);
        this.newRank = the_rank;
    }
}

Player.prototype.update = function () {
    // Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
    frameInterval = current_board_frame_index;
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 20)) {
        // Handle Player Ranking Up
        if (this.inSquare && this.rank != this.newRank) {
            console.log("new rank");
            this.specialActivated = false;
            this.specialMovesLeft = 0;
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
        }
 
        // Handle animation starting to move right or left
        if (this.game.left) {
            if (this.inSquare) {
                this.inSquare = false;
                this.game.left = false;
                this.movingLeft = true;
                this.game.right = false;
                this.movingRight = false;                 
            }
        } else if (this.game.right) {
            if (this.inSquare) {
                this.inSquare = false;
                this.game.right = false;      
                this.movingRight = true;
                this.game.left = false;
                this.movingLeft = false;                
            }
        }
    }
    switch (this.rank) {
        case 0: // Pawn
            this.updatePawn();
            break;
        case 1: // Knight
            this.updatePawn();
            break;
        case 2: // Bishop
            this.updatePawn();
            break;
        case 3: // Rook
            this.updatePawn();
            break;
        case 4: // Queen
            this.updatePawn();
            break;
    }

    Entity.prototype.update.call(this);
}


Player.prototype.updatePawn = function () {

    // Check Bounds
    this.checkLeftBounds();
    this.checkRightBounds();
    
    // Move Pawn
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed * this.speedIncreasedBy;
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed * this.speedIncreasedBy;
    }

    var retX = this.checkIfNewSpace();
    
    // Handle what happends when in a new space
    if (this.inSquare) {
        if (this.movingLeft) {
            this.movingLeft = false;
            this.game.left = false;
            this.movingRight = false;
            this.game.right = false;
            this.x = retX;
        } else if (this.movingRight) {
            this.movingRight = false;
            this.game.right = false;
            this.movingLeft = false;
            this.game.left = false;
            this.x = retX;
        }
    }
}

Player.prototype.updateKnight = function (wasStopped) {



    var b = this.board.User.column;
    // Handle animation starting to move right or left
    if (wasStopped) {
        if (this.game.left && b === 1) {
            this.speedIncreasedBy = .5;
            this.specialMovesLeft = 1;
        } else if (this.game.right && b === 6) {
            this.speedIncreasedBy = .5;
            this.specialMovesLeft = 1;
        }
    }
 
    // Check Bounds
    if (this.checkLeftBounds() || this.checkRightBounds()) {
        this.specialActivated = true;
        this.specialMovesLeft = 2;
        this.speedIncreasedBy = .5;
    }
    
    // Move Pawn
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed * this.speedIncreasedBy;
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed * this.speedIncreasedBy;
    }

    var ret = this.updateCheckIfNewSpace();

    if (ret.newSquare) {
        if (this.specialMovesLeft > 0) {
            if (this.movingLeft) {
                this.board.User.move("left");
                column--;
            } else if (this.movingRight) {
                this.board.User.move("Right");
                column++;
            }


            this.specialMovesLeft--;
        } else {
            this.specialActivated = false;
        }
    }


    // Handle what happends when in a new space
    if (this.inSquare) {
        if (this.movingLeft) {
            if (!this.specialActivated && this.specialMovesLeft === 0) {
                this.movingLeft = false;
                this.game.left = false;
                this.x = ret.returnX;
                this.specialActivated = true;
            } 
        } else if (this.movingRight) {
            if (!this.specialActivated && this.specialMovesLeft === 0) {
                this.movingRight = false;
                this.game.right = false;
                this.x = ret.returnX;
                this.specialActivated = true;
            }
        }
    }
}

Player.prototype.checkLeftBounds = function () {
    var isLeft = (this.x < 15 || (this.x === 15 && this.movingLeft));
    if (isLeft) {
        this.game.left = false;
        this.movingLeft = false;
        this.x = 15;
        this.inSquare = true;
    }
    return isLeft;

}

Player.prototype.checkRightBounds = function () {
    var isRight = (this.x > CANVAS_WIDTH - this.frameWidth - 20 || (this.x === CANVAS_WIDTH - this.frameWidth - 20 && this.movingRight));
    if (isRight) {
        this.game.right = false;
        this.movingRight = false;
        this.x = CANVAS_WIDTH - this.frameWidth - 20;
        this.inSquare = true;
    }
    return isRight;
}


Player.prototype.checkIfNewSpace = function () {
    var offset = 2;
    var bc = this.board.User.column;
    if (this.movingLeft) {
        if (bc > 0 && this.x >= this.separationLines[bc - 1] && this.x < this.separationLines[bc - 1] + offset) {
            this.inSquare = true;
        }
        if (bc > 0 && this.x < this.separationLines[bc - 1]) {
            this.board.User.move("left");
            this.inSquare = false;
        }
        return this.separationLines[bc - 1];
    } else if (this.movingRight) {
        if (bc < 7 && (this.x > this.separationLines[bc - 1] - offset && this.x <= this.separationLines[bc - 1])) {
            this.inSquare = true;
        }
        if (bc < 7 && this.x + this.frameWidth > this.separationLines[bc]) {
            this.board.User.move("right");
            this.inSquare = false;
        }
        return this.separationLines[bc - 1];
    }
}

Player.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet, this.x, this.y,
              this.frameWidth, this.frameHeight);
    Entity.prototype.draw.call(this);
}