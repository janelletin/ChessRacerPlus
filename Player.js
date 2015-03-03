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

    this.x = this.separationLines[6];//(CANVAS_WIDTH / 8) * 4 + 5;
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
    this.newRank = 1;
    this.setRank(1);
    this.column = 7;
    Entity.call(this, game, this.x, this.y);

}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.setRank = function (the_rank) {
    if (the_rank >= 0 && the_rank < 6) {
        this.newRank = the_rank;
    }
}

Player.prototype.update = function () {
    frameInterval = this.visualBoard.frameInterval;
    var newFrame = false;
    // Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 20)) {
        newFrame = true;
        // Handle Player Ranking Up
        if (this.inSquare && this.rank != this.newRank) {
            this.specialActivated = false;
            this.specialMovesLeft = 0;
            this.rank = this.newRank;
            switch (this.rank) {
                case 0: // Pawn
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
                    break;
                case 1: // Knight
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                    this.specialActivated = true;
                    this.specialMovesLeft = 2;
                    this.speedIncreasedBy = .5;
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
 
        var wasStopped = false;
        // Handle animation starting to move right or left
        if (this.game.left) {
            if (this.inSquare) {
                this.inSquare = false;
                this.movingLeft = true;
                this.movingRight = false;
                this.game.right = false;
                this.game.left = false;
                wasStopped = true;
            }
        } else if (this.game.right) {
            if (this.inSquare) {
                this.inSquare = false;
                this.movingRight = true;
                this.movingLeft = false;
                this.game.right = false;
                this.game.left = false;
                wasStopped = true;
            }
        }
    }
    switch (this.rank) {
        case 0: // Pawn
            this.updatePawn();
            break;
        case 1: // Knight
            this.updateKnight(wasStopped);
            break;
        case 2: // Bishop
            break;
        case 3: // Rook
            break;
        case 4: // Queen
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

    var newX = this.updateCheckIfNewSpace();
    
    // Handle what happends when in a new space
    if (this.inSquare) {
        if (this.movingLeft) {
            this.movingLeft = false;
            this.game.left = false;
            this.movingRight = false;
            this.game.right = false;
            this.x = newX;
        } else if (this.movingRight) {
            this.movingRight = false;
            this.game.right = false;
            this.movingLeft = false;
            this.game.left = false;
            this.x = newX;
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
                this.x = newX;
                this.specialActivated = true;
                this.specialMovesLeft = 2;
                this.speedIncreasedBy = .5;
            } 
        } else if (this.movingRight) {
            if (!this.specialActivated && this.specialMovesLeft === 0) {
                this.movingRight = false;
                this.game.right = false;
                this.x = newX;
                this.specialActivated = true;
                this.specialMovesLeft = 2;
                this.speedIncreasedBy = .5;
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


Player.prototype.updateCheckIfNewSpace = function () {
    var bc = this.board.User.column;
    var ret = { returnX: 0,
        newSquare: false
    }
    // Moving Left
    if (this.movingLeft) {
        // Check if in the center of a space
        if (bc > 0 && (this.x >= this.separationLines[bc - 1] && this.x < this.separationLines[bc - 1] + 2)) {
            this.inSquare = true;
        }
        // Check if in new space and update board model
        if (bc > 0 && this.x < this.separationLines[bc - 1] && bc === this.column) {
            ret.newSquare = true;
        }
        returnX = this.separationLines[bc - 1] + 1;
        // Moving Right
    } else if (this.movingRight) {
        // Check if in the center of a space
        if (bc < 7 && (this.x > this.separationLines[bc - 1] - 2 && this.x <= this.separationLines[bc - 1])) {
            this.inSquare = true;
        }
        // Check if in new space and update board model
        if (bc < 7 && this.x + this.frameWidth > this.separationLines[bc] && bc === this.column) {
            ret.newSquare = true;
        }
        returnX = this.separationLines[bc - 1];
    }
    // If in the center of the space update speical moves
    return ret;
}



























Player.prototype.updateNewFrameInterval = function (frameInterval) {
    // Check to see if the player needs to stop due to reaching the edge, left or edge right of the board
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 20)) {

        // Handle Player Ranking Up
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
        if (this.game.doubleTap && this.specialMovesLeft === 0 && !this.specialActivated) {
            this.game.doubleTap = false;
            switch (this.rank) {
                case 2: // Bishop
                    break;
                case 3: // Rook
                    var c = this.board.User.column;
                    if ((c <= 7 && this.movingLeft) || (c >= 0 && this.movingRight)) {
                        this.specialActivated = true;
                        this.specialMovesLeft = 3;
                        this.speedIncreasedBy = 3;
                        this.game.doubleTap = false;
                    } else if ((c === 2 && this.movingLeft) || (c === 5 && this.movingRight)) {
                        this.specialActivated = true;
                        this.specialMovesLeft = 2;
                        this.speedIncreasedBy = 2;
                        this.game.doubleTap = false;
                    }
                    break;
                case 4: // Queen
                    this.specialActivated = true;
                    this.specialMovesLeft = 3;
                    break;
            }
        }
    }
}

Player.prototype.updateCheckBounds = function () {
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
                this.specialActivated = false;
                this.specialMovesLeft = 0;
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
                this.specialActivated = false;
                this.specialMovesLeft = 0;
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

Player.prototype.updateMovePlayer = function () {
    // Move the player left or right based on state of game ie this.game.left == true or this.game.right == true
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed * this.speedIncreasedBy;
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed * this.speedIncreasedBy;
    }
}



Player.prototype.updateNewSpace = function (newX) {
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
}

Player.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet, this.x, this.y,
              this.frameWidth, this.frameHeight);
    Entity.prototype.draw.call(this);
}