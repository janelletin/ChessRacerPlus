function Player(game, boardC, visualBoard) {
    this.board = boardC;
    this.visualBoard = visualBoard;

    this.rank = 0;
    
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
                        9]; // 7
    this.separationLines = [14,                             // 0
                            canvasPartition + 10,           // 1
                            canvasPartition * 2 + 6,        // 2
                            canvasPartition * 3 + 4,        // 3
                            canvasPartition * 4 + 2,        // 4
                            canvasPartition * 5 - 6,        // 5
                            canvasPartition * 6 - 8,        // 6
                            canvasPartition * 7 - 12,        // 7
                            CANVAS_WIDTH - 20];             // 8

    var xs = 4;
//    console.log(this.separationLines[xs]);
    this.x = this.separationLines[xs] + this.radius + this.separationX[xs];//(CANVAS_WIDTH / 8) * 4 + 5;
 //   console.log(this.x);

    this.y = CANVAS_HEIGHT - this.radius - 10;

    this.horizontalSpeed = 3;//1.6300445;

    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    this.movingLeft = false;
    this.movingRight = false;
    this.speedIncreasedBy = 1;
    this.inSquare = true;
    this.specialActivated = false;
    this.specialMovesLeft = 0;
    this.newRank = 0;
    this.column = STARTING_POSITION;
    Entity.call(this, game, this.x, this.y);

}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.setRank = function (the_rank) {
    if (the_rank >= 0 && the_rank < 6) {
    //    console.log("new rank" + the_rank);
        this.newRank = the_rank;
    }
}


Player.prototype.update = function () {
    frameInterval = this.visualBoard.frameInterval;
    var bc = this.board.User.column;
    // Valid Changes To Movement
    if ((frameInterval >= 0 && frameInterval <= 2) || (frameInterval >= 18 && frameInterval <= 20) &&      // Within vertical space
        (this.separationLines[bc] < this.x - this.radius && this.x + this.radius < this.separationLines[bc + 1])) {  // Within horizontal space
        if (this.inSquare && this.rank != this.newRank) {
            this.board.User.rank = this.newRank;
            this.rank = this.newRank;
            this.specialActivated = false;
            this.specialMovesLeft = 0;
            switch (this.rank) {
                case 0: // Pawn
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/pawn.png");
                    this.rank = 0;
                    break;
                case 1: // Knight
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/knight.png");
                    this.specialActivated = false;
                    this.horizontalSpeed = 3;//1.6300445;
                    this.rank = 1;
                    break;
                case 2: // Bishop
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/bishop.png");
                    this.specialActivated = false;
                    this.horizontalSpeed = 3;//1.6300445;
                    this.rank = 2;
                    break;
                case 3: // Rook
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/rook.png");
                    this.rank = 3;
                    this.horizontalSpeed = 2;
                    break;
                case 4: // Queen
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/queen.png");
                    this.rank = 4;
                    this.horizontalSpeed = 2;
                    break;
                case 5: // King
                    this.spriteSheet = ASSET_MANAGER.getAsset("./img/king.png");
                    this.rank = 5;
                    break;
            }
        }

        if (this.game.left) {            
            if ((this.rank === 1 && !this.movingLeft)) {
                this.specialMovesLeft = 1;
            }
            this.movingLeft = true;
            this.movingRight = false;
            this.game.right = false;

        } else if (this.game.right) {
            if ((this.rank === 1 && !this.movingRight)) {
                this.specialMovesLeft = 1;
            }
            this.movingRight = true;
            this.movingLeft = false;
            this.game.right = false;
        }

        if (this.game.doubleTap && !this.specialActivated) {
            this.specialActivated = true;
            this.game.doubleTap = false;
            switch (this.rank) {
                case 3: // Rook
                    if ((bc > 1 && this.movingLeft) || (bc < 6 && this.movingRight)) {
                        this.specialMovesLeft = 3;
                        this.horizontalSpeed = 7;
                    } else {
                        this.specialActivated = false;
                    }
                    break;
                case 4: // Queen
                    if ((bc > 1 && this.movingLeft) || (bc < 6 && this.movingRight)) {
                        this.specialMovesLeft = 3;
                        this.horizontalSpeed = 7;
                    } else {
                        this.specialActivated = false;
                    }
                    break;
            }
        }
    }

    // Edges
    if (this.x <= this.separationLines[0] + this.radius + this.separationX[0]) {        
        this.game.left = false;
        this.movingLeft = false;        
        switch (this.rank) {
            case 0: // Pawn
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 1: // Knight
                if (this.specialMovesLeft > 0) {
                    this.game.right = true;
                }
                break;
            case 2: // Bishop
                this.game.right = true;
                break;
            case 3: // Rook
                if (this.specialActivated) {
                    this.specialMovesLeft = 0;
                    this.specialActivated = false;
                    this.horizontalSpeed = 2;
                }
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 4: // Queen
                if (this.specialActivated) {
                    this.specialMovesLeft = 0;
                    this.specialActivated = false;
                    this.horizontalSpeed = 2;
                }
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
            case 5:
                this.x = this.separationLines[0] + this.radius + this.separationX[0];
                break;
        }
    } else if (this.x >=  this.separationLines[7] + this.radius + this.separationX[7] - 1) {
        this.movingRight = false;
        this.game.right = false;
        switch (this.rank) {
            case 0: // Pawn
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 1: // Knight
                if (this.specialMovesLeft > 0) {
                    this.game.left = true;
                }
                break;
            case 2: // Bishop
                this.game.left = true;
                break;
            case 3: // Rook
                if (this.specialActivated) {
                    this.specialMovesLeft = 0;
                    this.specialActivated = false;
                    this.horizontalSpeed = 2;
                }
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 4: // Queen
                if (this.specialActivated) {
                    this.specialMovesLeft = 0;
                    this.specialActivated = false;
                    this.horizontalSpeed = 2;
                }
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
            case 5:
                this.x = this.separationLines[7] + this.radius + this.separationX[7];
                break;
        }
    }
    // Move
    if (this.movingLeft) {
        this.x -= this.horizontalSpeed * this.speedIncreasedBy;
        if (this.x - this.radius < this.separationLines[bc]) {
            this.board.User.move("left");
            this.newSquare = true;
        } else if (this.newSquare && this.x < this.separationLines[bc] + 2 + this.radius + this.separationX[bc]) {
            this.handleNewSpace(bc);
            this.newSquare = false;
        }
    } else if (this.movingRight) {
        this.x += this.horizontalSpeed * this.speedIncreasedBy;
        if (this.x + this.radius > this.separationLines[bc + 1]) {           
            this.board.User.move("right");
            this.newSquare = true;
        } else if (this.newSquare && this.x > this.separationLines[bc] + this.radius + this.separationX[bc]) {
            this.handleNewSpace(bc);
            this.newSquare = false;
        }
    }
    Entity.prototype.update.call(this);
}

Player.prototype.handleNewSpace = function (bc) {
  //  console.log(this.specialActivated + " " + this.specialMovesLeft);
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
            if (this.specialActivated) {
                if (this.specialMovesLeft > 0) {
                    this.specialMovesLeft--;
                } else {
                    this.movingLeft = false;
                    this.movingRight = false;
                    this.game.right = false;
                    this.game.left = false;
                    this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
                    this.horizontalSpeed = 2;
                    this.specialActivated = false;
                }
            } else {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.left = false;
                this.game.right = false;
                this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
            }
            break;
        case 4: // Queen
            if (this.specialActivated) {
                if (this.specialMovesLeft > 0) {
                    this.specialMovesLeft--;
                } else {
                    this.movingLeft = false;
                    this.movingRight = false;
                    this.game.right = false;
                    this.game.left = false;
                    this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
                    this.horizontalSpeed = 2;
                    this.specialActivated = false;
                }
            } else {
                this.movingLeft = false;
                this.movingRight = false;
                this.game.left = false;
                this.game.right = false;
                this.x = this.separationLines[bc] + this.radius + this.separationX[bc];
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

var debugging = false;

Player.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet, this.x - (this.frameWidth / 2), this.y - 150 - this.radius, this.frameWidth, this.frameHeight);
    if (debugging) {


        ctx.beginPath();
        ctx.strokeStyle = "Red";
        for (var i = 0; i < this.separationLines.length; i++) {
            ctx.moveTo(this.separationLines[i], CANVAS_HEIGHT);
            ctx.lineTo(this.separationLines[i], 0);
            ctx.fill();
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