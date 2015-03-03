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
	//this.init();
	//console.log(this.Board);
}



BoardC.prototype.init = function(player) {
    // Creates and places the user
	this.User = new User(this,0,4, player);
	this.Board[0][4] = this.User; // User
	this.Pieces.push(this.User);
	//var test = new Pawn(this.game, "pawn", 3, 5, "white");
	//this.Pieces.push(test);
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
	// number of new pieces to add 1-3
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
			var color;
			var a = Math.round(Math.random()); // used to randomize black and white
			if( a == 0) {
				color = "white";
			} else {
				color = "black";
			}
			var type;
			var b = Math.floor(Math.random() * (6));
			//console.log(b);
			if(b == 0) {
				type = "pawn";
			} else if(b == 1) {
				type = "pawn"; /**CHANGE TO KNIGHT WHEN IMAGE IS READY **/
			} else if(b == 2) {
				type = "bishop";
			} else if(b == 3) {
				type = "rook";
			} else if(b == 4) {
				type = "queen";
			} else if(b == 5) {
				type = "king";
			}
			//console.log(color + " " + a);
			var temp = new Piece(this.game, type, piecesLoc[i], color);
			var p = new PieceC(this.game,this, 11, piecesLoc[i], type, color, temp)
			//var tempPawn = new Pawn(this.game, this, 11, piecesLoc[i], temp);
			//this.Board[11][piecesLoc[i]] = tempPawn;
	
			//this.game.addEntity(temp);
}

BoardC.prototype.update = function() {
	// Moves the pieces
	for(var p = 0; p < this.Pieces.length; p++) 
	{
		if(this.Pieces[p] != this.User) 
		{
			//this.Pieces[p].move();
		}
	}

	//console.log("number of pieces before update " + this.Pieces.length);
	// Checks the first row for collision and removes pieces
	for(j=0;j<this.columns;j++) 
	{
		//console.log("Piece " + this.Board[0][j] + " User " + this.User + " " + this.Board[0][j] != this.User);
		// Removes the pieces from row 0 except the user
		if(this.Board[0][j] != this.User) { // Pieces on row 0 that aren't the user
			var index = this.Pieces.indexOf(this.Board[0][j]);
			//console.log(this.Board[0][j] + " index = " + index);
			if (index > -1) 
			{
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
		} 
		else  
		{
			if(this.Board[1][j] != 0) 
			{ /** COLLIDED **/
				//console.log("COLLISION with " + this.Board[1][j]); /** NEEDS TO BE IMPLEMENTED **/
				if(this.Board[1][j].color == this.User.color) 
				{
					//alert("DEAD because collided with same color " + this.Board[1][j].color);
					//TODO: Add new modal window showing score and letting Player select to end or start again. 
				} 
				else 
				{
					if(this.Board[1][j].rank > this.User.rank) 
					{
						//alert("DEAD because higher rank");
						//TODO: Add new modal window showing score and letting Player select to end or start again. 
					alert("DEAD because collided with same color " + this.Board[1][j].color);
					} 
					else 
					{
						if(this.Board[1][j].rank > this.User.rank) 
						{
							alert("DEAD because higher rank");
						} 
						else 
						{
							var index = this.Pieces.indexOf(this.Board[1][j]);
							if (index > -1) 
							{
								var indexOfEnt = this.game.entities.indexOf(this.Board[1][j].ent);
								//console.log(indexOfEnt);
								if(indexOfEnt > -1) 
								{
									this.game.entities[indexOfEnt].removeFromWorld = true;
									this.User.eat(this.Board[1][j].rank);
									//alert(this.game.entities[indexOfEnt].removeFromWorld + " you have collided with a piece");
								}
								this.Pieces.splice(index, 1);
								//console.log("removing a collided piece");
								//this.Board[1][j].removeFromWorld = true;
							}
							//this.Board[1][j] = 0;
						}
					}
				this.Board[1][j] = 0;
				}
			}
			 else 
			 { // NO COLLISION
				//console.log("no collision");
			 }
		}
	}
	// Moves pieces down a row starting from the second row
	for (i=1;i<this.rows;i++) 
	{ 
		for (j=0;j<this.columns;j++) 
		{
			if(this.Board[i][j]!=0) 
			{
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
		this.letter = "K";
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
	return this.letter + "(" + this.row + ", " + this.column + ")";
}


/*
 * This creates the Players section of the game with their piece and board settings. 
 */
function User(board, row, column, player) {
	this.board = board.Board;
	this.letter = "U";
	this.player = player;
	this.rank = 0;
	this.row = row;
	this.column = column;
	this.score = score;
	this.count = 0;
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

User.prototype.eat = function(piece) {
	//console.log("piece: " + piece + " score: " + score + " rank: "+ this.rank);
	if(piece == this.rank) {
		this.count++;
		if(this.count == 1) {
			this.count = 0;
			this.player.setRank(this.rank++);
			// Giving Player a multipler from their rank for additional points when taking a piece. 
			//TODO: implement game speed multipler for taking a piece.  
			this.scoreBoard.IncreaseScore(50 * ((this.rank+1)*3) );
		}
	}
	this.score += piece + 1;
}

User.prototype.toString = function() {
//	return this.letter + "(" + this.row + ", " + this.column + ")";
}


/*
 * This function is to control the score of the game. 
 */
function ScoreEngine(game){
	this.game = gameEngine;
	var captured = 0;
}
// Get the score of the game currently running.
ScoreEngine.prototype.getScore = function(){
	return score;
}
// Increase the score of the game. 
ScoreEngine.prototype.IncreaseScore = function(points){
	score += points;
	if(score > highScore){
		//TODO: Notify the user in some fashion that they have passed the previous high score.
	}
		 
}

ScoreEngine.prototype.getHighScore = function(){
	/*
	 * TODO: Need to implenent DB or something to save a high score. 
	 * For now just hit keyboard for a high score.
	 */
	return 1;
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
}


//end ScoreEngine
