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
    this.horizontalSpeed = 3;

    this.movingLeft = false;
    this.movingRight = false;
    this.specialLeft = false;
    this.specialRight = false;

    this.inSquare = true;
    this.specialActivated = false;
    this.specialMovesLeft = 0;
    //this.setRank(3);
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
    var bc = this.board.User.column;
    // Valid Changes To Movement
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 22) || (frameInterval >= 37 && frameInterval <= 39) &&      // Within vertical space
        (this.separationLines[bc] < this.x - this.radius && this.x + this.radius < this.separationLines[bc + 1])) {  // Within horizontal space
        this.handleNewRank(bc);
        // If the player isn't in a state of moving, check to see if the player wants to move (ie has hit left or right) and handle appropriatly
        if (this.game.mouseX < this.x - this.radius && mouseEnabled) {
            this.game.left = true;
        } else if (this.game.mouseX > this.x + this.radius && mouseEnabled) {
            this.game.right = true;
        }


        if (this.game.left && this.specialMovesLeft === 0) {
            if ((this.rank === 1 && !this.movingLeft)) {
                this.specialMovesLeft = 1;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knightTransparent.png");
            }
            this.movingLeft = true;
            this.movingRight = false;
            this.game.right = false;
        } else if (this.game.right && this.specialMovesLeft === 0) {
            if ((this.rank === 1 && !this.movingRight)) {
                this.specialMovesLeft = 1;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knightTransparent.png");
            }
            this.movingRight = true;
            this.movingLeft = false;
            this.game.right = false;
        } else if (this.game.specialLeft && this.specialMovesLeft === 0) {
            this.game.specialLeft = false;
            this.movingRight = false;
            this.movingLeft = true;
            this.game.specialRight = false;
            this.specialLeft = true;
            this.specialRight = false;
            this.handleSpecialLeft(bc);
        } else if (this.game.specialRight && this.specialMovesLeft === 0) {
            this.movingRight = true;
            this.movingLeft = false;
            this.game.specialRight = false;
            this.specialLeft = false;
            this.specialRight = true;
            this.handleSpecialRight(bc);
        }
    }
    this.checkEdges(bc);
    // Move
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed;
        if (this.x - this.radius < this.separationLines[bc] + 10) {
            this.board.User.move("left");        
            this.newSquare = true;


        } else if (this.newSquare && this.x + this.radius < this.separationLines[bc + 1]) {// + this.radius + this.separationX[bc]) {
            this.handleNewSpace(bc);
            this.newSquare = false;
        }
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed;
        if (this.x + this.radius > this.separationLines[bc + 1] - 10) {
            this.board.User.move("right");      
            this.newSquare = true;


        } else if (this.newSquare && this.x - this.radius > this.separationLines[bc]) {// + this.radius + this.separationX[bc]) {
            this.handleNewSpace(bc);
            this.newSquare = false;
        }
    }
    Entity.prototype.update.call(this);
}

Player.prototype.handleNewRank = function (bc) {
    if (this.rank != this.newRank) {
        this.board.User.rank = this.newRank;
        this.rank = this.newRank;
        this.specialActivated = false;
        this.specialMovesLeft = 0;
        switch (this.rank) {
            case 0: // Pawn
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
                this.horizontalSpeed = 3;
                this.rank = 0;
                break;
            case 1: // Knight
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                this.specialActivated = false;
                this.horizontalSpeed = 5;
                this.rank = 1;
                break;
            case 2: // Bishop
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
                this.specialActivated = false;
                this.horizontalSpeed = 3;
                this.rank = 2;
                break;
            case 3: // Rook
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                this.rank = 3;
                this.horizontalSpeed = 3;
                break;
            case 4: // Queen
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                this.rank = 4;
                this.horizontalSpeed = 3;
                break;
            case 5: // King
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/king.png");
                this.rank = 5;
                this.horizontalSpeed = 3;
                break;
        }
    }
}

Player.prototype.handleNewSpace = function (bc) {
    switch (this.rank) {
        case 0: // Pawn
            this.movingLeft = false;
            this.movingRight = false;
            this.game.left = false;
            this.game.right = false;
            this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
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
                this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
            }
            break;
        case 2: // Bishop
            if (this.movingRight) {
                this.movingLeft = false;
                this.game.left = false;
                this.movingRight = false;
                this.game.right = true;
            } else if (this.movingLeft) {
                this.movingRight = false;
                this.game.right = false;
                this.movingLeft = false;
                this.game.left = true;
            }
            this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
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
                this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
                this.horizontalSpeed = 3;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
            }
            break;
        case 4: // Queen
            if (this.specialMovesLeft > 0) {
                this.specialMovesLeft--;
            } else {
                if (this.movingRight) {
                    this.game.right = true;
                    this.game.left = false;
                } else if (this.movingLeft) {
                    this.game.left = true;
                    this.game.right = false;
                }
                this.movingRight = false;
                this.movingLeft = false;
                this.game.specialLeft = false;
                this.game.specialRight = false;

                this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
                this.horizontalSpeed = 3;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
            }
            break;
        case 5: // King
            this.movingLeft = false;
            this.movingRight = false;
            this.game.left = false;
            this.game.right = false;
            this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
            break;
    }
}

Player.prototype.isTransitioning = function () {
    return this.specialMovesLeft > 0;
}

Player.prototype.handleSpecialLeft = function (bc) {
    switch (this.rank) {
        case 3: // Rook
            if (bc > 1) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 7;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rookTransparent.png");
            }
            break;
        case 4: // Queen
            if (bc > 1) {
                this.specialMovesLeft = 6;
                this.horizontalSpeed = 15;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queenTransparent.png");
            }
            break;
        }
}

Player.prototype.handleSpecialRight = function (bc) {
    switch (this.rank) {
        case 3: // Rook
            if (bc < 6) {
                this.specialMovesLeft = 2;
                this.horizontalSpeed = 7;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/rookTransparent.png");
            }
            break;
        case 4: // Queen
            if (bc < 6) {
                this.specialMovesLeft = 6;
                this.horizontalSpeed = 15;
                this.spriteSheet = ASSET_MANAGER.getAsset("./img/queenTransparent.png");
            }
            break;
    }
}

Player.prototype.checkEdges = function (bc) {
    // Edges
    if (this.x <= this.separationLines[0] + this.radius + this.separationX[0]) {
        switch (this.rank) {
            case 0: // Pawn
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 1: // Knight
                if (this.movingLeft && bc === 0) {
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                }                
                break;
            case 2: // Bishop
                this.game.right = true;
                break;
            case 3: // Rook
                if ((this.specialMovesLeft > 0 || this.specialLeft || this.movingLeft) && bc >= 0 && !this.movingRight) {
                    this.board.User.column = 0;
                    this.specialMovesLeft = 0;
                    this.specialLeft = false;
                    this.movingLeft = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    this.horizontalSpeed = 3;
                }
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 4: // Queen
                if ((this.specialMovesLeft > 0 || this.specialLeft || this.movingLeft) && bc >= 0 && !this.movingRight) {
                    this.board.User.column = 0;
                    this.specialMovesLeft = 0;
                    this.specialLeft = false;
                    this.movingLeft = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    this.horizontalSpeed = 3;
                }
                this.game.right = true;
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
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
                if (this.movingRight && bc === 7) {
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                }                
                break;
            case 2: // Bishop
                this.game.left = true;
                break;
            case 3: // Rook
                if ((this.specialMovesLeft > 0 || this.specialRight || this.movingRight) && bc >= 7 && !this.movingLeft) {
                    this.board.User.column = 7;
                    this.specialMovesLeft = 0;
                    this.specialRight = false;
                    this.movingRight = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    this.horizontalSpeed = 3;
                }
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 4: // Queen
                if ((this.specialMovesLeft > 0 || this.specialRight || this.movingRight) && bc >= 7 && !this.movingLeft) {
                    this.board.User.column = 7;
                    this.specialMovesLeft = 0;
                    this.specialRight = false;
                    this.movingRight = false;
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    this.horizontalSpeed = 3;
                }
                this.game.left = true;
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
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