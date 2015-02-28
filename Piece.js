var PIECE_FRAME_HEIGHT = 235;
var PIECE_FRAME_WIDTH = 95;

var SCALES = [[.2, 0.20125, 0.2025, 0.20375, 0.205, 0.20625, 0.2075, 0.20875, 0.21, 0.21125, 0.2125, 0.21375, 0.215, 0.21625, 0.2175, 0.21875, 0.22, 0.22125, 0.2225, 0.22375],
                [.225, 0.22625, 0.2275, 0.22875, 0.23, 0.23125, 0.2325, 0.23375, 0.235, 0.23625, 0.2375, 0.23875, 0.24, 0.24125, 0.2425, 0.24375, 0.245, 0.24625, 0.2475, 0.24875],
                [.25, 0.25125, 0.2525, 0.25375, 0.255, 0.25625, 0.2575, 0.25875, 0.26, 0.26125, 0.2625, 0.26375, 0.265, 0.26625, 0.2675, 0.26875, 0.27, 0.27125, 0.2725, 0.27375],
                [.275, 0.27625, 0.2775, 0.27875, 0.28, 0.28125, 0.2825, 0.28375, 0.285, 0.28625, 0.2875, 0.28875, 0.29, 0.29125, 0.2925, 0.29375, 0.295, 0.29625, 0.2975, 0.29875],
                [.3, 0.30125, 0.3025, 0.30375, 0.305, 0.30625, 0.3075, 0.30875, 0.31, 0.31125, 0.3125, 0.31375, 0.315, 0.31625, 0.3175, 0.31875, 0.32, 0.32125, 0.3225, 0.32375],
                [.325, 0.32625, 0.3275, 0.32875, 0.33, 0.33125, 0.3325, 0.33375, 0.335, 0.33625, 0.3375, 0.33875, 0.34, 0.34125, 0.3425, 0.34375, 0.345, 0.34625, 0.3475, 0.34875],
                [.35, 0.3525, 0.355, 0.3575, 0.36, 0.3625, 0.365, 0.3675, 0.37, 0.3725, 0.375, 0.3775, 0.38, 0.3825, 0.385, 0.3875, 0.39, 0.3925, 0.395, 0.3975],
                [.4, 0.4025, 0.405, 0.4075, 0.41, 0.4125, 0.415, 0.4175, 0.42, 0.4225, 0.425, 0.4275, 0.43, 0.4325, 0.435, 0.4375, 0.44, 0.4425, 0.445, 0.4475],
                [.45, 0.455, 0.46, 0.465, 0.47, 0.475, 0.48, 0.485, 0.49, 0.495, 0.5, 0.505, 0.51, 0.515, 0.52, 0.525, 0.53, 0.535, 0.54, 0.545],
                [.55, 0.555, 0.56, 0.565, 0.57, 0.575, 0.58, 0.585, 0.59, 0.595, 0.6, 0.605, 0.61, 0.615, 0.62, 0.625, 0.63, 0.635, 0.64, 0.645],
                [.65, 0.65625, 0.6625, 0.66875, 0.675, 0.68125, 0.6875, 0.69375, 0.7, 0.70625, 0.7125, 0.71875, 0.725, 0.73125, 0.7375, 0.74375, 0.75, 0.75625, 0.7625, 0.76875],
                [.775, 0.78125, 0.7875, 0.79375, 0.8, 0.80625, 0.8125, 0.81875, 0.825, 0.83125, 0.8375, 0.84375, 0.85, 0.85625, 0.8625, 0.86875, 0.875, 0.88125, 0.8875, 0.89375],
                [.9, 0.90625, 0.9125, 0.91875, 0.925, 0.93125, 0.9375, 0.94375, 0.95, 0.95625, 0.9625, 0.96875, 0.975, 0.98125, 0.9875, 0.99375, 1, 1.00625, 1.0125, 1.01875],
                [1.025, 1.03125, 1.0375, 1.04375, 1.05, 1.05625, 1.0625, 1.06875, 1.075, 1.08125, 1.0875, 1.09375, 1.1, 1.10625, 1.1125, 1.11875, 1.125, 1.13125, 1.1375, 1.14375],
                [0]];

var Y_POSITIONS = [[11, 11.8, 12.6, 13.4, 14.2, 15, 15.8, 16.6, 17.4, 18.2, 19, 19.8, 20.6, 21.4, 22.2, 23, 23.8, 24.6, 25.4, 26.2],
                    [27, 28.1, 29.2, 30.3, 31.4, 32.5, 33.6, 34.7, 35.8, 36.9, 38, 39.1, 40.2, 41.3, 42.4, 43.5, 44.6, 45.7, 46.8, 47.9],
                    [49, 50.15, 51.3, 52.45, 53.6, 54.75, 55.9, 57.05, 58.2, 59.35, 60.5, 61.65, 62.8, 63.95, 65.1, 66.25, 67.4, 68.55, 69.7, 70.85],
                    [72, 73.25, 74.5, 75.75, 77, 78.25, 79.5, 80.75, 82, 83.25, 84.5, 85.75, 87, 88.25, 89.5, 90.75, 92, 93.25, 94.5, 95.75],
                    [97, 98.5, 100, 101.5, 103, 104.5, 106, 107.5, 109, 110.5, 112, 113.5, 115, 116.5, 118, 119.5, 121, 122.5, 124, 125.5],
                    [127, 128.5, 130, 131.5, 133, 134.5, 136, 137.5, 139, 140.5, 142, 143.5, 145, 146.5, 148, 149.5, 151, 152.5, 154, 155.5],
                    [157, 158.75, 160.5, 162.25, 164, 165.75, 167.5, 169.25, 171, 172.75, 174.5, 176.25, 178, 179.75, 181.5, 183.25, 185, 186.75, 188.5, 190.25],
                    [192, 193.9, 195.8, 197.7, 199.6, 201.5, 203.4, 205.3, 207.2, 209.1, 211, 212.9, 214.8, 216.7, 218.6, 220.5, 222.4, 224.3, 226.2, 228.1],
                    [230, 232.6, 235.2, 237.8, 240.4, 243, 245.6, 248.2, 250.8, 253.4, 256, 258.6, 261.2, 263.8, 266.4, 269, 271.6, 274.2, 276.8, 279.4],
                    [282, 285.05, 288.1, 291.15, 294.2, 297.25, 300.3, 303.35, 306.4, 309.45, 312.5, 315.55, 318.6, 321.65, 324.7, 327.75, 330.8, 333.85, 336.9, 339.95],
                    [343, 346.8, 350.6, 354.4, 358.2, 362, 365.8, 369.6, 373.4, 377.2, 381, 384.8, 388.6, 392.4, 396.2, 400, 403.8, 407.6, 411.4, 415.2],
                    [419, 423.8, 428.6, 433.4, 438.2, 443, 447.8, 452.6, 457.4, 462.2, 467, 471.8, 476.6, 481.4, 486.2, 491, 495.8, 500.6, 505.4, 510.2],
                    [515, 521.75, 528.5, 535.25, 542, 548.75, 555.5, 562.25, 569, 575.75, 582.5, 589.25, 596, 602.75, 609.5, 616.25, 623, 629.75, 636.5, 643.25],
                    [650, 655, 660, 665, 670, 675, 685, 690, 695, 700, 705, 710, 715, 720, 725, 740, 760, 780, 820, 900],
                    [0]];

function Piece(game, piece_rank, starting_column, color) {

    // Piece Information Initialization
    this.rank = piece_rank;
    this.color = color;
    if (color === "black") {
        this.spriteSheet = ASSET_MANAGER.getAsset("./img/black" + this.rank + ".png");
    } else {
        this.spriteSheet = ASSET_MANAGER.getAsset("./img/" + this.rank + ".png");
    }
    this.column = starting_column;
    this.row = 0;
    this.scale = 1;
    // Piece - size information
    this.frameHeight = PIECE_FRAME_HEIGHT;
    this.frameWidth = PIECE_FRAME_WIDTH;
    
    // Used to keep track of the frame the board is in
    this.totalTime = GAME_SPEED * TOTAL_FRAMES / 2;
    this.elapsedTime = 0;

    Entity.call(this, game, this.x, this.y);
}

Piece.prototype = new Entity();
Piece.prototype.constructor = Piece;


Piece.prototype.update = function () {
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

    this.scale = SCALES[this.row][f];

    this.frameHeight = PIECE_FRAME_HEIGHT * this.scale;
    this.frameWidth = PIECE_FRAME_WIDTH * this.scale;
    this.y = 270 - this.frameHeight + Y_POSITIONS[this.row][f];

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

    //    this.scales = [.2, .25, .3, .35, .45, .65, .9];
    //    
    /**
    var s = .2;
    var x1 = 418.5;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 11;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .25;
    x1 = 418.5;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 49;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .3;
    x1 = 416.125;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 97;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .35;
    x1 = 416.75;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 157;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .45;
    x1 = 415.375;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 230;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .65;
    x1 = 414.2;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 343;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);

    s = .9;
    x1 = 405;
    var fH = PIECE_FRAME_HEIGHT * s;
    var fW = PIECE_FRAME_WIDTH * s;
    var yadd = 515;
    var y1 = CANVAS_HEIGHT - BOARD_HEIGHT - fH;
    ctx.drawImage(this.spriteSheet, x1, y1 + yadd, fW, fH);
    **/

    if (this.row > 13) {
        return;
    }

    ctx.drawImage(this.spriteSheet, this.x, this.y,
                  this.frameWidth, this.frameHeight);
    Entity.prototype.draw.call(this);
}

Piece.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / GAME_SPEED);
}

Piece.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Piece.prototype.toString = function() {
	return this.color + this.rank + "(" + this.row + ", " + this.column + ")";
}