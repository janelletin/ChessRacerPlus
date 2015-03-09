var score;
var scoreBoard;
var highScore;

function BoardC(gameEngine) {
	this.game = gameEngine;
	this.User; // The user's piece
	this.rows = 12; // row
	this.columns = 8; // column
	this.Pieces = new Array(); // An array of the pieces in the board
	this.Board = new Array(); // A 2D array representing the board[row][column]
	score = 0;
	this.scoreBoard = new ScoreEngine(gameEngine);
	//Creates 2D array of Board
	for (i=0;i<this.rows;i++) {
		this.Board[i]=new Array();
		for (j=0;j<this.columns;j++) {
			this.Board[i][j]=0;
		}
	}
	this.count = 0;
	this.chance = ["pawn", "queen", "rook", "rook" , "pawn", "pawn", "bishop", "bishop", "knight", "knight"];
	//this.init();
	//console.log(this.Board);
	this.kingChance = 30;
}



BoardC.prototype.init = function(player) {
	// Creates and places the user
    this.User = new User(this.game, this, 0, STARTING_POSITION, player);
    this.Board[0][STARTING_POSITION] = this.User; // User
	this.Pieces.push(this.User);
	//var test = new Pawn(this.game, "pawn", 3, 5, "white");
	//this.Pieces.push(test);
	console.log("initialized board model");
	//this.test();
}

BoardC.prototype.rand = function() {
	var test = [0,0,0,0,0,0,0,0,0,0];
	for(var i = 0; i < 1000; i++) {
		//var temp = Math.floor(Math.random() * (11 - 1)) + 1;
		var temp = Math.round(Math.random()); 
		test[temp-1]+= 1;
	}
	console.log(test);
}

/** Used to test the eat function **/
BoardC.prototype.test = function() {
	var pass = 0;
	var failed = 0;
	//var p = new PieceC(this.game, this, 1, 1, "pawn", "white", null);
	var type = ["pawn", "knight", "bishop", "rook", "queen"];
	console.log(type);
	console.log(this.assert);
	for(var j = 0; j < 5; j++) {
		this.User.rank = j;
		
		for(var i = 0; i < type.length; i++) {
			var p = new PieceC(this.game, this, 1, 1, type[i], "white", null);
			//console.log(p + " " + p.rank);
			if(assert(boardC.User.eat(p), false,  "can't eat white pieces")){ // Checks White pieces
				pass++;
			} else {
				failed++;
				console.log("Failed on: User " + this.User + " Piece: " + p.rank + p.color);
			}
			p.color = "black";
			if(i <= type.indexOf(type[j])) {
				if(assert(boardC.User.eat(p), true, "Can eat " + p.color + type[i])){
					pass++;
				} else {
					failed++;
					console.log("Failed on: User " + this.User + " Piece: " + p.rank + p.color);
				}
			} else {
				if(assert(boardC.User.eat(p), false, "Can't eat " + p.color + type[i])) {
					pass++;
				} else {
					failed++;
					console.log("Failed on: User " + this.User + " Piece: " + p.rank + p.color);
				}
			}
			
		}
	}
	// Test Rook
	/* 	this.User.rank = 3;
	this.User.letter = "R";
	for(var i = 0; i < type.length; i++) {
	var p = new PieceC(this.game, this, 1, 1, type[i], "white", null);
	//console.log(p + " " + p.rank);
	console.log(assert(boardC.User.eat(p), false,  "can't eat white pieces")); // Checking white pieces
	p.color = "black";
	if(i <= type.indexOf("rook")) {
	console.log(assert(boardC.User.eat(p), true, "Can eat " + p.color + type[i]));
	} else {
	console.log(assert(boardC.User.eat(p), false, "Can't eat " + p.color + type[i]));
	}
	
	} */
	
	console.log("Passed: " + pass + " Failed: " + failed);
	//assert.equals(board.User.eat(p), false, "can't eat white pawn");
	
}
/** an assertion method**/
var assert = function(actual, expected, message) {
	if(actual === expected) {
		return true;
	} else {
		return false;
	}
	
}

BoardC.prototype.print = function() {
	// prints out the board row by row
	for(var i = this.rows-1; i >= 0; i--) {
		var row = "Row " + i + " contains: ";
		for(var j = 0; j < this.columns; j++) {
			row += this.Board[i][j] + ", ";
			//console.log("Row " + i + " Column " + j + " = " + Board[i][j]);
		}
		console.log(row);
	}
	//console.log(this.Board[1][3]);
}

BoardC.prototype.newLine = function() { // Adds a new line
	// number of new pieces to add 1-3
	var numOfPieces = Math.floor(Math.random() * (4 - 1)) + 1 // Mozilla math.random get Int
	console.log("adding : " + numOfPieces);
	var piecesLoc = new Array(); // An array of the pieces location
	//console.log(pieces.indexOf(0));
	//console.log(pieces.indexOf(1));
	
	if(this.count == this.kingChance) {
		numOfPieces++; // finds a location for King
	}
	
	// Randomly assigns locations for the pieces
	for(var i = 0; i < numOfPieces; i++) {
		var contains = 0;
		var tempLoc;
		while(contains != -1) { // Checks if the location is already used
			tempLoc = Math.floor(Math.random() * (this.columns));
			contains = piecesLoc.indexOf(tempLoc);
		}
		piecesLoc.push(tempLoc);
	}
	if(this.count == this.kingChance) {
		numOfPieces--; // subtracts so it won't randomize the king
	}
	//console.log(piecesLoc);
	//put the pieces into the board
	for(var i = 0; i < numOfPieces; i++) {
		var color;
		if(this.User.rank == 4) {
			color = this.getColor(30,70);
		}else if(this.User.rank == 3) {
			color = this.getColor(40,60);
		} else {
			color = this.getColor(50,50);
		}
		var b = this.getRandInt(10,1);
		var type = this.chance[b-1];
		//console.log("model " + type);
		//console.log(color + " " + a);
		var temp = new Piece(this.game, type, piecesLoc[i], color);
		var p = new PieceC(this.game,this, 11, piecesLoc[i], type, color, temp)
		//var tempPawn = new Pawn(this.game, this, 11, piecesLoc[i], temp);
		//this.Board[11][piecesLoc[i]] = tempPawn;
		
		//this.game.addEntity(temp);
		
	}
	//insert king and reset count
	if(this.count == this.kingChance) {
		console.log(piecesLoc);
		var temp = new Piece(this.game, "king", piecesLoc[numOfPieces], "black");
		var p = new PieceC(this.game, this, 11, piecesLoc[numOfPieces], "king", "black", temp);
		this.count = 0;
	}
	
}

// Returns a color taking into account the percent of black and white (adding up to 100)
BoardC.prototype.getColor = function (black, white) {
	var temp = this.getRandInt(10, 1); // Gets a random int from 1-10
	if(temp <= white/10) { // if 1-white/10 then white
		return "white";
	} else { // else white/10 to 10 then black
		return("black");
	}
}

//Code from Mozilla
// Returns a random integer between min (included) and max (included)
BoardC.prototype.getRandInt = function (min, max) {
	return Math.round(Math.random() * (max+1 - min)) + min;
}

BoardC.prototype.update = function() {
	this.count++; // Adds to row count
	// Moves the pieces
	for(var p = 0; p < this.Pieces.length; p++) {
		if(this.Pieces[p] != this.User) {
			//this.Pieces[p].move();
		}
	}
	
	//console.log("number of pieces before update " + this.Pieces.length);
	// Checks the first row for collision and removes pieces
	for(j=0;j<this.columns;j++) {
		//console.log("Piece " + this.Board[0][j] + " User " + this.User + " " + this.Board[0][j] != this.User);
		// Removes the pieces from row 0 except the user
		if(this.Board[0][j] != this.User) { // Pieces on row 0 that aren't the user
			var index = this.Pieces.indexOf(this.Board[0][j]);
			//console.log(this.Board[0][j] + " index = " + index);
			if (index > -1) {
				
				var indexOfEnt = this.game.entities.indexOf(this.Board[0][j].ent);
				//console.log(indexOfEnt);
				if(indexOfEnt > -1) {
					this.game.entities[indexOfEnt].removeFromWorld = true;
					//console.log(this.game.entities[indexOfEnt].removeFromWorld);
				}
				this.Pieces.splice(index, 1);
				//console.log("changed removeFromWorld");
			}
			this.Board[0][j] = 0;
			// Checks row 1 for collisions with the User
		} else {
			if(this.Board[1][j] != 0) { /** COLLIDED **/
				
				var index = this.Pieces.indexOf(this.Board[1][j]);
				if (index > -1) {
				//	console.log(this.Board[1][j].color + this.Board[1][j].rank + " trying to eat");
					var indexOfEnt = this.game.entities.indexOf(this.Board[1][j].ent);
					//console.log(indexOfEnt);
					if(indexOfEnt > -1) {
						this.game.entities[indexOfEnt].removeFromWorld = true;
						this.User.eat(this.Board[1][j]);
						//alert(this.game.entities[indexOfEnt].removeFromWorld + " you have collided with a piece");
						//TODO: Add new modal window showing score and letting Player select to end or start again. 
					}
					this.Pieces.splice(index, 1);
					//console.log("removing a collided piece");
					//this.Board[1][j].removeFromWorld = true;
				}
				//this.Board[1][j] = 0;
				//}
			}
			this.Board[1][j] = 0;
			/* } else { // NO COLLISION
			//console.log("no collision");
			} */
		}
	}
	// Moves pieces down a row starting from the second row
	for (i=1;i<this.rows;i++) {
		for (j=0;j<this.columns;j++) {
			if(this.Board[i][j]!=0) {
				this.Board[i][j].row -= 1;
				this.Board[i-1][j] = this.Board[i][j];
				this.Board[i][j] = 0;
			}
		}
	}
	//console.log("number of pieces middle " + this.Pieces.length);
	this.newLine(); // adds a new line
	//console.log("number of pieces after " + this.Pieces.length);
	//console.log(this.Pieces);
	//this.print();
	/*
	* Add a score to the game for staying alive!
	*/
	this.scoreBoard.IncreaseScore(50);
	
} // end of BoardC

PieceC.prototype = new Entity();
PieceC.prototype.constructor = PieceC;

function PieceC(game, board, row, column, type, color, thePiece) {
	this.game = game; // the game engine
	this.board = board.Board; // the 2D Array
	this.row = row;
	this.column = column;
	this.ent = thePiece; // the piece entity in the game engine
	this.color = color;
	this.letter;
	this.rank;
	if(type == "pawn") {
		this.letter = "P";
		this.rank = 0;
	} else if(type == "knight") {
		this.letter = "K";
		this.rank = 1;
	} else if(type == "bishop") {
		this.letter = "B";
		this.rank = 2;
	} else if(type == "rook") {
		this.letter = "R";
		this.rank = 3;
	} else if(type == "queen") {
		this.letter = "Q";
		this.rank = 4;
	} else if(type == "king") {
		this.letter = "KING";
		this.rank = 5;
	}
	this.board[row][column] = this; // adds to 2d array of board
	this.game.addEntity(thePiece); // adds to game engine
	board.Pieces.push(this); // Adds to the pieces array of the board
	//this.removeFromWorld = false;
	this.secret = "hehe";
	//this.test();
}
PieceC.prototype.test = function() {
	console.log(this.secret);
}

PieceC.prototype.move = function(){
	
	
	// 0.25 chance to move
	var poss = Math.floor(Math.random() * (4)); // Mozilla math.random
	console.log(poss);
	if(poss == 0) { // 0 means move
		var dir = Math.floor(Math.random() * (2)); // 0 means left 1 means right
		//	console.log("Moving Piece " + dir + " from row " + this.row + " column " + this.column);
		if(dir == 0) {
			if(this.column < 1) {
				//			console.log("Can't move left anymore");
			} else {
				if(this.board[this.row][this.column-1] == 0) {
					this.board[this.row][this.column] = "0";
					this.board[this.row][this.column-1] = this;
					this.column -= 1;
				} else {
					//			console.log("collision"); /** NEEDS TO BE IMPLEMENTED **/
				}
			}
		} else if (dir == 1) {
			if(this.column > 7) {
				//			console.log("Can't move right anymore");
			} else {
				if(this.board[this.row][this.column+1] == 0) {
					this.board[this.row][this.column] = "0";
					this.board[this.row][this.column+1] = this;
					this.column += 1;
				} else {
					//			console.log("collision"); /** NEEDS TO BE IMPLEMENTED **/
				}
			}
		}
		//	console.log("Piece is now at row " + this.row + " column " + this.column);
	}
	
}

PieceC.prototype.toString = function() {
	return this.color[0] + this.letter + "(" + this.row + ", " + this.column + ")";
}


/*
* This creates the Players section of the game with their piece and board settings.
*/
function User(game, board, row, column, player) {
	this.game = game;
	this.board = board.Board;
	this.boardC = board;
	this.letter = "U";
	this.type = "pawn";
	this.player = player;
	this.rank = 0;
	this.row = row;
	this.column = column;
	this.score = score;
	this.count = 0;
	this.color = "white";
	this.scoreBoard = new ScoreEngine(gameEngine);
	
}

// Moves the user piece left/right diagonal-left/right and the knight moves
// Doesn't check for valid ranking yet
User.prototype.move = function(direction) {
	
	//	console.log("Moving User " + direction + " from row " + this.row + " column " + this.column +
	//			" with the rank of " + this.rank);
	if(direction == "left") {
		if(this.column < 1) {
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column-1] = this;
			this.column -= 1;
		}
	} else if (direction == "right") {
		if(this.column > 7) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column+1] = this;
			this.column += 1;
		}
		
	} else if (direction == "left2"){
		if(this.column < 2 ){
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column-2] = this;
			this.column -= 2;
		}
	} else if (direction == "right2"){
		if(this.column > 6) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column+2] = this;
			this.column += 2;
		}
	} else if (direction == "left3"){
		if(this.column < 3 ){
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column-3] = this;
			this.column -= 3;
		}
	} else if (direction == "right3"){
		if(this.column > 5) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column+3] = this;
			this.column += 3 ;
		}
	} else if(direction == "Knight-1Right") {
		if(this.column > 6) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 2][this.column + 1] = this;
			this.row += 2;
			this.column += 1;
		}
	} else if(direction == "Knight-1Left") {
		if(this.column < 1) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 2][this.column - 1] = this;
			this.row += 2;
			this.column -= 1;
		}
	} else if(direction == "Knight-2Right") {
		if(this.column > 5) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column + 2] = this;
			this.row += 1;
			this.column += 2;
		}
		
	} else if(direction == "Knight-2Left") {
		if(this.column < 2) {
			//		console.log("Can't move " + direction + " anymore");
		} else {
			//	console.log(this.board[this.row][this.column]);
			this.board[this.row][this.column] = "0";
			//		console.log(this.board[this.row][this.column]);
			this.board[this.row + 1][this.column - 2] = this;
			this.row += 1;
			this.column -2;
		}
		
	} else if(direction == "DLeft") {
		if(this.column < 1) {
			//			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column - 1] = this;
			this.row += 1;
			this.column -= 1;
		}
	} else if(direction =="DRight") {
		if(this.column > 6) {
			//		console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column + 1] = this;
			this.row += 1;
			this.column += 1;
		}
	} else {
		//	console.log("invalid direction");
	}
	return this.column;
	console.log("User is now at row " + this.row + " column " + this.column);
	//console.log(this.board[this.row][this.column].letter);
	
	//
	
}
/** Checks if piece can be eaten **/
User.prototype.eat = function(piece) {
	//console.log("user: " + this.rank + " color: " + this.color);
	//console.log("piece: "  + " rank: "+ piece.rank + " color: " + piece.color);
	//console.log(this.color + " " + piece.color);
	if(piece.color == this.color) {
		//this.print();
		//console.log("same color");
		//return false;
		alert("DEAD because collided with same color " + piece.color);
		//TODO: Add new modal window showing score and letting Player select to end or start again. 
		this.game.stop();
	} else if(piece.rank > this.rank) {
		//this.print();
		//return false;
		alert("DEAD because higher rank " + piece.letter);
		//TODO: Add new modal window showing score and letting Player select to end or start again. 
		this.game.stop();
	} else {
		console.log("eat success");
		if(piece.rank == this.rank) {
			this.count++;
			if(this.count == 10) {
			    //		alert("Rank Up");                
			    this.count = 0;
			    this.rank++;
				this.type = this.rankToType(this.rank); // changes the user rank
				this.boardC.chance[0] = this.type; // changes the change percentage
				this.player.setRank(this.rank);
				// Giving Player a multipler from their rank for additional points when taking a piece.
				//TODO: implement game speed multipler for taking a piece.
				//this.scoreBoard.IncreaseScore(50 * ((this.rank+1)*3) );
			}
		}
		//return true;
		this.score += piece + 1;
	}
}


User.prototype.toString = function() {
	return this.letter + "(" + this.row + ", " + this.column + ")";
}

//Returns a string of the type from the int rank
User.prototype.rankToType = function (rank) {
	if(rank == 0) {
		return "pawn";
	} else if(rank == 1) {
		return "knight";
	} else if(rank == 2) {
		return "bishop";
	} else if(rank == 3) {
		return "rook";
	} else if(rank == 4) {
		return "queen";
	} else if(rank == 5) {
		return "king";	
	}
}

/*
* This function is to control the score of the game.
*/
function ScoreEngine(game){
	this.game = gameEngine;
}
// Get the score of the game currently running.
ScoreEngine.prototype.getScore = function(){
	return score;
}
// Increase the score of the game.
ScoreEngine.prototype.IncreaseScore = function(points){
	score += points;
}

//Increase the score of the game.
ScoreEngine.prototype.setSpeed = function(gameSpeed){
	this.gameSpeed = gameSpeed;	
}

ScoreEngine.prototype.getHighScore = function(){
	/*
	* TODO: Need to implenent DB or something to save a high score.
	* For now just hit keyboard for a high score.
	*/
	if(score > highScore){
		//TODO: Notify the user in some fashion that they have passed the previous high score.
	}
	return 2000;
}

ScoreEngine.prototype.captures = function(captured){
	this.captured += captured;
}

ScoreEngine.prototype.getCaptures = function(){
	return this.captured;
}

ScoreEngine.prototype.captures = function(captured){
	this.captured += captured;
}

ScoreEngine.prototype.getCaptures = function(){
	return this.captured;
}


//end ScoreEngine

