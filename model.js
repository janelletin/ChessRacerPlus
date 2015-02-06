function BoardC(gameEngine) {
	this.game = gameEngine;
	this.User; // The user's piece
	this.rows = 12; // row
	this.columns = 8; // column
	this.Pieces = new Array(); // An array of the pieces in the board
	this.Board = new Array(); // A 2D array representing the board[row][column]
	//Creates 2D array of Board
	for (i=0;i<this.rows;i++) {
		this.Board[i]=new Array();
		for (j=0;j<this.columns;j++) {
			this.Board[i][j]=0;
		}
	}
	this.init();
	//console.log(this.Board);
}


BoardC.prototype.init = function() {
	// Creates and places the user
	this.User = new User(this,0,5);
	this.Board[0][5] = this.User; // User
	this.Pieces.push(this.User);
	console.log("initialized board model");
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
	// number of new pieces to add 
	var numOfPieces = Math.floor(Math.random() * (4 - 1)) + 1 // Mozilla math.random get Int
	//console.log("adding : " + numOfPieces);
	var piecesLoc = new Array(); // An array of the pieces location
	//console.log(pieces.indexOf(0));
	//console.log(pieces.indexOf(1));

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
	//console.log(piecesLoc);
	//put the pieces into the board
	for(var i = 0; i < piecesLoc.length; i++) {
		var temp = new Pawn(this.game, this, 11, piecesLoc[i]);
		this.Board[11][piecesLoc[i]] = temp;
		var temp = new Piece(this.game, "pawn", piecesLoc[i], 0, "white");
		this.game.addEntity(temp);
		
	}
	
}

BoardC.prototype.update = function() {
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
		if(this.Board[0][j] != this.User) {
			var index = this.Pieces.indexOf(this.Board[0][j]);
			//console.log(this.Board[0][j] + " index = " + index);
			if (index > -1) {
				this.Pieces.splice(index, 1);
				this.Board[0][j].removeFromWorld = true;
				console.log("removing a piece");
			}
			this.Board[0][j] = 0;
			// Checks row 1 for collisions with the User
		} else {
			if(this.Board[1][j] != 0) {
				console.log("COLLISION with " + this.Board[1][j]); /** NEEDS TO BE IMPLEMENTED **/
				var index = this.Pieces.indexOf(this.Board[1][j]);
				if (index > -1) {
					this.Pieces.splice(index, 1);
					console.log("removing a collided piece");
				}
				this.Board[1][j] = this.User;
			} else {
				console.log("no collision");
			}
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
}
PieceC.prototype = new Entity();
PieceC.prototype.constructor = PieceC;

function PieceC() {
	this.game;
	this.board;
	this.letter;
	this.row;
	this.column;
	this.removeFromWorld = false;
	this.secret = "hehe";
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
		console.log("Moving Piece " + dir + " from row " + this.row + " column " + this.column);
		if(dir == 0) {
			if(this.column < 1) {
				console.log("Can't move left anymore");
			} else {
				if(this.board[this.row][this.column-1] == 0) {
					this.board[this.row][this.column] = "0";
					this.board[this.row][this.column-1] = this;
					this.column -= 1;
				} else {
					console.log("collision"); /** NEEDS TO BE IMPLEMENTED **/
				}
			}
		} else if (dir == 1) {
			if(this.column > 7) {
				console.log("Can't move right anymore");
			} else {
				if(this.board[this.row][this.column+1] == 0) {
					this.board[this.row][this.column] = "0";
					this.board[this.row][this.column+1] = this;
					this.column += 1;
				} else {
					console.log("collision"); /** NEEDS TO BE IMPLEMENTED **/
				}
			}
		}
		console.log("Piece is now at row " + this.row + " column " + this.column);
	}

}

PieceC.prototype.toString = function() {
	return this.letter + "(" + this.row + ", " + this.column + ")";
}


function Knight(game, board, row, column) {
	this.game = game;
	this.board = board.Board;
	this.letter = "K";
	this.row = row;
	this.column = column;
	board.Pieces.push(this);
	this.board[row][column] = this;
}

function Castle(game, board, row, column){
	this.game = game;
	this.board = board.Board;
	this.letter = "C";
	this.row = row;
	this.column = column;
	board.Pieces.push(this);
	this.board[row][column] = this;
}

function Bishop(game, board, row, column){
	this.game = game;
	this.board = board.Board;
	this.letter = "B";
	this.row = row;
	this.column = column;
	board.Pieces.push(this); 
	this.board[row][column] = this;
}

function Queen(game, board, row, column){
	this.game = game;
	this.board = board.Board;
	this.letter = "Q";
	this.row = row;
	this.column = column;
	board.Pieces.push(this); 
	this.board[row][column] = this;
}

function Pawn(game, board, row, column) {
	this.game = game;
	this.board = board.Board;
	//console.log("The Board " + (board.Board)[1][3]);
	this.theObj = board;
	this.letter = "P";
	this.row = row;
	this.column = column;
	//console.log("before add" + board.Pieces.length);
	board.Pieces.push(this); // Adds to the pieces array of the board
	//console.log("after add" + board.Pieces.length);

	//console.log("Creating a pawn at row " + this.row + " column " + this.column);
	//this.move("left");

}

PieceC.prototype.constructor = PieceC;
Knight.prototype = new PieceC();
Knight.prototype.constructor = Knight;

Castle.prototype = new PieceC();
Castle.prototype.constructor = Castle;

Bishop.prototype = new PieceC();
Bishop.prototype.constructor = Bishop;

Queen.prototype = new PieceC();
Queen.prototype.constructor = Pawn;

Pawn.prototype = new PieceC();
Pawn.prototype.constructor = Pawn;

function User(board, row, column) {
	this.board = board.Board;
	this.letter = "U";
	this.rank = "P";
	this.row = row;
	this.column = column;
	this.score = 0;
}
// Moves the user piece left/right diagonal-left/right and the knight moves
// Doesn't check for valid ranking yet
User.prototype.move = function(direction) {
	
	console.log("Moving User " + direction + " from row " + this.row + " column " + this.column);
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
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row][this.column+1] = this;
			this.column += 1;
		}
	} else if(direction == "Knight-1Right") { 
		if(this.column > 6) {
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 2][this.column + 1] = this;
			this.row += 2;
			this.column += 1;
		}
	} else if(direction == "Knight-1Left") {
		if(this.column < 1) {
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 2][this.column - 1] = this;
			this.row += 2;
			this.column -= 1;
		}
	} else if(direction == "Knight-2Right") { 
		if(this.column > 5) {
			console.log("Can't move " + direction + " anymore");
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column + 2] = this;
			this.row += 1;
			this.column += 2;
		}
		
	} else if(direction == "Knight-2Left") {
		if(this.column < 2) {
			console.log("Can't move " + direction + " anymore");
		} else {
			console.log(this.board[this.row][this.column]);
			this.board[this.row][this.column] = "0";
			console.log(this.board[this.row][this.column]);
			this.board[this.row + 1][this.column - 2] = this;
			this.row += 1;
			this.column -2;
		}

	} else if(direction == "DLeft") {
		if(this.column < 1) {
			console.log("Can't move " + direction + " anymore");	
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column - 1] = this;
			this.row += 1;
			this.column -= 1;
		}
	} else if(direction =="DRight") {
		if(this.column > 6) {
			console.log("Can't move " + direction + " anymore");			
		} else {
			this.board[this.row][this.column] = "0";
			this.board[this.row + 1][this.column + 1] = this;
			this.row += 1;
			this.column += 1;
		}
	} else {
		console.log("invalid direction");
	}
	console.log("User is now at row " + this.row + " column " + this.column);
	console.log(this.board[this.row][this.column].letter);
	
	//
	
}

User.prototype.toString = function() {
	return this.letter + "(" + this.row + ", " + this.column + ")";
}
