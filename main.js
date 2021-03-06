//
//
//
//
//  main
//  main
//  main
//  main
//
//
//
//
//
//
//

var ASSET_MANAGER = new AssetManager();
var boardC; 
var gameEngine;


ASSET_MANAGER.queueDownload("./img/0.png");
ASSET_MANAGER.queueDownload("./img/1.png");
ASSET_MANAGER.queueDownload("./img/2.png");
ASSET_MANAGER.queueDownload("./img/3.png");
ASSET_MANAGER.queueDownload("./img/4.png");
ASSET_MANAGER.queueDownload("./img/5.png");
ASSET_MANAGER.queueDownload("./img/6.png");
ASSET_MANAGER.queueDownload("./img/7.png");
ASSET_MANAGER.queueDownload("./img/8.png");
ASSET_MANAGER.queueDownload("./img/9.png");
ASSET_MANAGER.queueDownload("./img/10.png");
ASSET_MANAGER.queueDownload("./img/11.png");
ASSET_MANAGER.queueDownload("./img/12.png");
ASSET_MANAGER.queueDownload("./img/13.png");
ASSET_MANAGER.queueDownload("./img/14.png");
ASSET_MANAGER.queueDownload("./img/15.png");
ASSET_MANAGER.queueDownload("./img/16.png");
ASSET_MANAGER.queueDownload("./img/17.png");
ASSET_MANAGER.queueDownload("./img/18.png");
ASSET_MANAGER.queueDownload("./img/19.png");
ASSET_MANAGER.queueDownload("./img/20.png");
ASSET_MANAGER.queueDownload("./img/21.png");
ASSET_MANAGER.queueDownload("./img/22.png");
ASSET_MANAGER.queueDownload("./img/23.png");
ASSET_MANAGER.queueDownload("./img/24.png");
ASSET_MANAGER.queueDownload("./img/25.png");
ASSET_MANAGER.queueDownload("./img/26.png");
ASSET_MANAGER.queueDownload("./img/27.png");
ASSET_MANAGER.queueDownload("./img/28.png");
ASSET_MANAGER.queueDownload("./img/29.png");
ASSET_MANAGER.queueDownload("./img/30.png");
ASSET_MANAGER.queueDownload("./img/31.png");
ASSET_MANAGER.queueDownload("./img/32.png");
ASSET_MANAGER.queueDownload("./img/33.png");
ASSET_MANAGER.queueDownload("./img/34.png");
ASSET_MANAGER.queueDownload("./img/35.png");
ASSET_MANAGER.queueDownload("./img/36.png");
ASSET_MANAGER.queueDownload("./img/37.png");
ASSET_MANAGER.queueDownload("./img/38.png");
ASSET_MANAGER.queueDownload("./img/39.png");
ASSET_MANAGER.queueDownload("./img/pawnRed.png");
ASSET_MANAGER.queueDownload("./img/bishopRed.png");
ASSET_MANAGER.queueDownload("./img/queenRed.png");
ASSET_MANAGER.queueDownload("./img/kingRed.png");
ASSET_MANAGER.queueDownload("./img/knightRed.png");
ASSET_MANAGER.queueDownload("./img/rookRed.png");
ASSET_MANAGER.queueDownload("./img/pawn.png");
ASSET_MANAGER.queueDownload("./img/bishop.png");
ASSET_MANAGER.queueDownload("./img/queen.png");
ASSET_MANAGER.queueDownload("./img/queenTransparent.png");
ASSET_MANAGER.queueDownload("./img/king.png");
ASSET_MANAGER.queueDownload("./img/knight.png");
ASSET_MANAGER.queueDownload("./img/knightTransparent.png");
ASSET_MANAGER.queueDownload("./img/rook.png");
ASSET_MANAGER.queueDownload("./img/rookTransparent.png");
ASSET_MANAGER.queueDownload("./img/blackpawn.png");
ASSET_MANAGER.queueDownload("./img/blackknight.png");
ASSET_MANAGER.queueDownload("./img/blackbishop.png");
ASSET_MANAGER.queueDownload("./img/blackqueen.png");
ASSET_MANAGER.queueDownload("./img/blackrook.png");
ASSET_MANAGER.queueDownload("./img/blackking.png");
ASSET_MANAGER.queueDownload("./img/woodtable.png");
ASSET_MANAGER.queueDownload("./img/chess_clock.png");
ASSET_MANAGER.queueDownload("./img/chess_clock_frame.png");
ASSET_MANAGER.queueDownload("./img/border.png");
ASSET_MANAGER.queueDownload("./img/lake.jpg");
window.onload = (function () {
ASSET_MANAGER.downloadAll(function () {
    //console.log("starting up da shield");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    gameEngine = new GameEngine();
	boardC = new BoardC(gameEngine);
	var gb = new GameBoard(gameEngine, boardC);
	var pl = new Player(gameEngine, boardC, gb);
	gameEngine.addEntity(gb);
	gameEngine.addEntity(pl);
	boardC.init(pl);
    gameEngine.init(ctx);
    gameEngine.start();
    
    
    gameEngine.addEntity(new ChessClockLeft(gameEngine, ASSET_MANAGER.getAsset("./img/chess_clock.png")));
    gameEngine.addEntity(new ChessClockRight(gameEngine, ASSET_MANAGER.getAsset("./img/chess_clock.png")));
    
    canvas.width="800";
    canvas.height="800";
       
	
	document.getElementById("PauseButton").onclick = function(){pause();}
	document.getElementById("MuteButton").onclick = function () { mute(); }
	document.getElementById("DebugButton").onclick = function () { debugging = !debugging; }
	document.getElementById("MouseButton").onclick = function () { enableMouse(); }
	document.getElementById("DebugButton").onclick = function () { debugging = !debugging; }
	document.getElementById("PawnButton").onclick = function () { pl.setRank(0); }
	document.getElementById("KnightButton").onclick = function () { pl.setRank(1); }
	document.getElementById("BishopButton").onclick = function () { pl.setRank(2); }
	document.getElementById("RookButton").onclick = function () { pl.setRank(3); }
	document.getElementById("QueenButton").onclick = function () { pl.setRank(4); }
	document.getElementById("KingButton").onclick = function () { pl.setRank(5); }
	document.getElementById("gameWorld").focus();

	ma = new Audio('FutureGladiator.mp3');
	ma.addEventListener('ended', function () {
	    this.currentTime = 0;
	    this.play();
	}, false);
	ma.play();
	ma.muted = false;

	//document.getElementById('mp3').play();
});
});

var ma;
var paused = false;

function pause() {
    gameEngine.stop();
    mute();
}

function enableMouse() {
    if (mouseEnabled) {
        document.getElementById("MouseButton").value = "A-Mouse (b)";
    } else {
        document.getElementById("MouseButton").value = "D-Mouse (b)";
    }
    mouseEnabled = !mouseEnabled;

}

function mute() {
    if (ma.muted) {
        document.getElementById("MuteButton").value = "Mute (M)";
        ma.muted = false;
    } else {
        document.getElementById("MuteButton").value = "Unmute (M)";
        ma.muted = true;
    }
}