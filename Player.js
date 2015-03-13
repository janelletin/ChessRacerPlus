var STARTING_POSITION = 4;
var debugging = false;

function Player(game, boardC, visualBoard) {
    this.board = boardC;
    this.visualBoard = visualBoard;

    this.rank = 0;
    this.newRank = this.rank;

    // Set frame and animation information for the player
    var scale = .9;
    this.radius = 35;
    this.frameHeight = 235 * scale;
    this.frameWidth = 95 * scale;
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
    // X Y coordinates of the player - center of the pawn for x
    var canvasPartition = CANVAS_WIDTH / 8;
    this.separationX = [15,  // 0
                        15,  // 1
                        14,  // 2
                        14,  // 3
                        11,  // 4
                        13,  // 5
                        13,  // 6
                        9];  // 7
    this.separationLines = [14,                             // 0
                            canvasPartition + 10,           // 1
                            canvasPartition * 2 + 6,        // 2
                            canvasPartition * 3 + 4,        // 3
                            canvasPartition * 4 + 2,        // 4
                            canvasPartition * 5 - 6,        // 5
                            canvasPartition * 6 - 8,        // 6
                            canvasPartition * 7 - 12,       // 7
                            CANVAS_WIDTH - 20];             // 8

    this.x = this.separationLines[STARTING_POSITION] + this.radius + this.separationX[STARTING_POSITION];//(CANVAS_WIDTH / 8) * 4 + 5;
    this.y = CANVAS_HEIGHT - this.radius - 10;
    this.horizontalSpeed = 4.5;

    this.movingLeft = false;
    this.movingRight = false;
    this.specialLeft = false;
    this.specialRight = false;
    this.column = STARTING_POSITION;
    this.inSquare = true;
    this.specialActivated = false;
    this.specialMovesLeft = 0;
    this.invisible = false;
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
    // Valid Changes To Movement
    
    if (((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 22) || (frameInterval >= 37 && frameInterval <= 39)) &&      // Within vertical space
        (this.separationLines[this.column] < this.x - this.radius && this.x + this.radius < this.separationLines[this.column + 1])) {  // Within horizontal space
        this.handleNewRank(this.column);
        // If the player isn't in a state of moving, check to see if the player wants to move (ie has hit left or right) and handle appropriatly
        if (this.game.mouseX < this.x - this.radius && mouseEnabled) {
            this.game.left = true;
        } else if (this.game.mouseX > this.x + this.radius && mouseEnabled) {
            this.game.right = true;
        }


        if (this.game.specialLeft && !this.invisible) {
            if (this.rank === 3 || this.rank === 4) {
                this.board.User.move("left3");
                this.game.specialLeft = false;
                this.specialLeft = true;
                this.handleSpecialLeft(this.column);
                this.game.left = false;
                this.game.right = false;
                this.movingLeft = false;
                this.movingRight = false;
            }
        } else if (this.game.specialRight && !this.invisible) {
            if (this.rank === 3 || this.rank === 4) {
                this.board.User.move("right3");
                this.game.specialRight = false;
                this.specialRight = true;
                this.handleSpecialRight(this.column);
                this.game.left = false;
                this.game.right = false;
                this.movingLeft = false;
                this.movingRight = false;
            }
        } else if (this.game.left && this.specialMovesLeft === 0 && !this.movingLeft) {
            if (this.rank === 1) {
                this.specialMovesLeft = 1;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knightTransparent.png");
                this.board.User.move("left2");
            }
            this.movingLeft = true;
            this.movingRight = false;
            this.game.left = false;
        } else if (this.game.right && this.specialMovesLeft === 0 && !this.movingRight) {
            if ((this.rank === 1)) {
                this.specialMovesLeft = 1;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knightTransparent.png");
                this.board.User.move("right2");
            }
            this.movingRight = true;
            this.movingLeft = false;
            this.game.right = false;
        }
    }
    this.checkEdges(this.column);
    // Move
    if (this.movingLeft && !this.movingRight && !this.specialRight && !this.specialLeft) {
        this.x -= this.horizontalSpeed;
        if (this.x - this.radius < this.separationLines[this.column] + 10) {
            if (this.rank != 1) {
                this.board.User.move("left");
            }
            this.column--;
            this.newSquare = true;
        } else if (this.newSquare && this.x + this.radius < this.separationLines[this.column + 1]) {
            this.handleNewSpace(this.column);
            this.newSquare = false;
        }

    } else if (this.movingRight && !this.specialRight && !this.specialLeft) {
        this.x += this.horizontalSpeed;
        if (this.x + this.radius > this.separationLines[this.column + 1] - 10) {
            if (this.rank != 1) {
                this.board.User.move("right");
            }
            this.column++;
            this.newSquare = true;
        } else if (this.newSquare && this.x - this.radius > this.separationLines[this.column]) {
            this.handleNewSpace(this.column);
            this.newSquare = false;
        }

    } else if (this.specialLeft && !this.specialRight) {
        this.x -= this.horizontalSpeed;
        if (this.x - this.radius < this.separationLines[this.column] + 10) {
            this.column--;
            this.newSquare = true;
        } else if (this.newSquare && this.x + this.radius < this.separationLines[this.column + 1]) {
            this.handleNewSpace(this.column);
            this.newSquare = false;
        }

    } else if (this.specialRight) {
        this.x += this.horizontalSpeed;
        if (this.x + this.radius > this.separationLines[this.column + 1] - 10) {
            this.column++;
            this.newSquare = true;
        } else if (this.newSquare && this.x - this.radius > this.separationLines[this.column]) {
            this.handleNewSpace(this.column);
            this.newSquare = false;
        }
    }
    Entity.prototype.update.call(this);
}

Player.prototype.handleNewRank = function () {
    if (this.rank != this.newRank) {
        this.board.User.rank = this.newRank;
        this.rank = this.newRank;
        this.specialMovesLeft = 0;
        switch (this.rank) {
            case 0: // Pawn
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
                this.horizontalSpeed = 4.5;
                this.rank = 0;
                break;
            case 1: // Knight
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                this.specialActivated = false;
                this.horizontalSpeed = 7;
                this.rank = 1;
                break;
            case 2: // Bishop
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
                this.horizontalSpeed = 4.5;
                this.movingLeft = false;
                this.movingRight = false;
                this.rank = 2;
                break;
            case 3: // Rook
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                this.rank = 3;
                this.horizontalSpeed = 4.5;
                break;
            case 4: // Queen
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                this.rank = 4;
                this.horizontalSpeed = 4.5;
                this.movingLeft = false;
                this.movingRight = false;
                break;
            case 5: // King
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/king.png");
                this.rank = 5;
                this.horizontalSpeed = 4.5;
                break;
        }
    }
}

Player.prototype.handleNewSpace = function () {
    switch (this.rank) {
        case 0: // Pawn
            this.movingLeft = false;
            this.movingRight = false;
            this.game.left = false;
            this.game.right = false;
            this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
            break;
        case 1: // Knight
            if (this.specialMovesLeft > 0) {
                this.specialMovesLeft--;
            } else {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.right = false;
                this.game.left = false;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
            }
            break;
        case 2: // Bishop
            if (this.movingRight && !this.game.left && !this.game.right) {
                this.movingLeft = false;
                this.game.left = false;
                this.movingRight = false;
                this.game.right = true;
            } else if (this.movingLeft && !this.game.right && !this.game.left) {
                this.movingRight = false;
                this.game.right = false;
                this.movingLeft = false;
                this.game.left = true;
            } else if (this.game.left) {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.right = false;
            } else if (this.game.right) {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.left = false;
            }
            this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
            break;
        case 3: // Rook
            if (this.specialMovesLeft > 0) {
                this.specialMovesLeft--;
            } else {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.right = false;
                this.game.left = false;
                this.game.specialLeft = false;
                this.game.specialRight = false;
                this.specialLeft = false;
                this.specialRight = false;
                this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
                this.horizontalSpeed = 4.5;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                this.invisible = false;
            }
            break;
        case 4: // Queen
            if (this.specialMovesLeft > 0) {
                this.specialMovesLeft--;
            } else {
                if (this.movingLeft || this.specialLeft) {
                    this.movingRight = false;
                    this.game.right = false;
                    this.movingLeft = false;
                    this.game.left = true;
                } else if (this.movingRight || this.specialRight) {
                    this.movingLeft = false;
                    this.game.left = false;
                    this.movingRight = false;
                    this.game.right = true;
                }
                this.movingLeft = false;
                this.movingRight = false;
                this.game.specialLeft = false;
                this.game.specialRight = false;
                this.specialLeft = false;
                this.specialRight = false;
                this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
                this.horizontalSpeed = 4.5;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                this.invisible = false;
            }
            break;
        case 5: // King
            this.movingLeft = false;
            this.movingRight = false;
            this.game.left = false;
            this.game.right = false;
            this.x = this.separationLines[this.column] + this.radius + this.separationX[this.column];
            break;
    }
}

Player.prototype.isTransitioning = function () {
    if (this.rank === 1) {
        return this.movingLeft || this.movingRight;
    } else {
        return this.specialMovesLeft > 0;
    }
    
}

Player.prototype.handleSpecialLeft = function () {
    switch (this.rank) {
        case 3: // Rook
            if (this.column > 1) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 9;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rookTransparent.png");
                this.invisible = true;
            }
            break;
        case 4: // Queen
            if (this.column > 1) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 9;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queenTransparent.png");
                this.invisible = true;
            }
            break;
        }
}

Player.prototype.handleSpecialRight = function () {
    switch (this.rank) {
        case 3: // Rook
            if (this.column < 6) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 9;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rookTransparent.png");
                this.invisible = true;
            }
            break;
        case 4: // Queen
            if (this.column < 6) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 9;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queenTransparent.png");
                this.invisible = true;
            }
            break;
    }
}

Player.prototype.checkEdges = function () {
    // Edges
    if (this.x <= this.separationLines[0] + this.radius + this.separationX[0]) {
        switch (this.rank) {
            case 0: // Pawn
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 1: // Knight
                if (this.movingLeft && this.column === 0) {
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                }                
                break;
            case 2: // Bishop
                this.game.right = true;
                break;
            case 3: // Rook
                if (this.invisible && !this.specialRight) {
                    this.board.User.column = 0;
                    this.column = 0;
                    this.invisible = false;
                    this.specialMovesLeft = 0;
                    this.movingLeft = false;
                    this.specialLeft = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    this.horizontalSpeed = 4.5;
                }
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;

            case 4: // Queen
                if (this.invisible && !this.specialRight) {
                    this.board.User.column = 0;
                    this.column = 0;
                    this.invisible = false;
                    this.specialMovesLeft = 0;
                    this.movingLeft = false;
                    this.specialLeft = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    this.horizontalSpeed = 4.5;
                    this.game.right = true;
                    this.x = this.separationLines[0] + this.radius + this.separationX[0];
                } else if (!this.specialRight) {
                    this.x = this.separationLines[0] + this.radius + this.separationX[0];
                }
                this.game.right = true;
                break;
            case 5:
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
        }
        this.game.left = false;
        this.movingLeft = false;
    } else if (this.x >= this.separationLines[7] + this.radius + this.separationX[7] - 1) {
        switch (this.rank) {
            case 0: // Pawn
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 1: // Knight
                if (this.movingRight && this.column === 7) {
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                }                
                break;
            case 2: // Bishop
                this.game.left = true;
                break;
            case 3: // Rook
                if (this.invisible && !this.specialLeft) {
                    this.board.User.column = 7;
                    this.invisible = false;
                    this.specialMovesLeft = 0;
                    this.movingRight = false;
                    this.specialRight = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    this.horizontalSpeed = 4.5;                    
                }
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 4: // Queen
                if (this.invisible && !this.specialLeft) {
                    this.board.User.column = 7;
                    this.invisible = false;
                    this.specialMovesLeft = 0;
                    this.movingRight = false;
                    this.specialRight = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    this.horizontalSpeed = 4.5;
                    this.game.left = true;
                    this.x = this.separationLines[7] + this.radius + this.separationX[7];
                }
                this.game.left = true;
                break;
            case 5:
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
        }
        this.movingRight = false;
        this.game.right = false;
    }
}

Player.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet, this.x - (this.frameWidth / 2), this.y - 150 - this.radius, this.frameWidth, this.frameHeight);
    if (debugging) {        
        ctx.beginPath();
        ctx.strokeStyle = "Red";
        for (var i = 0; i < this.separationLines.length; i++) {
            ctx.moveTo(this.separationLines[i], CANVAS_HEIGHT);
            ctx.lineTo(this.separationLines[i], this.y - this.radius);
            ctx.fill();
            ctx.stroke();
        }
        if (this.movingLeft) {
            ctx.moveTo(this.x - this.radius, this.y - this.radius);
            ctx.lineTo(this.x - this.radius, this.y + 50);
            ctx.stroke();
        } else if (this.movingRight) {
            ctx.moveTo(this.x + this.radius, this.y - this.radius);
            ctx.lineTo(this.x + this.radius, this.y + 50);
            ctx.stroke();
        }

        ctx.moveTo(0, this.y - this.radius);
        ctx.lineTo(CANVAS_WIDTH, this.y - this.radius);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "Red";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();       
    }

    Entity.prototype.draw.call(this);
}