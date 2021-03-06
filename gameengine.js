// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}



function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.on = true;
	this.timer;
	this.rightClockRunning = false;
	this.removedEntities = [];
	this.mouseX = 0;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
}

GameEngine.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.stop = function() {
	//console.log(this.on);
	this.on = !this.on;
	//console.log(this.on);
}

GameEngine.prototype.startInput = function () {
    var that = this;

    that.doubleTap = false;
    this.ctx.canvas.addEventListener("keydown", function (e) {
        switch (String.fromCharCode(e.which)) {
            case 'A':
                that.left = true;
                that.right = false;
                that.specialLeft = false;
                that.specialRight = false;
                break;
            case 'D':
                that.left = false;
                that.right = true;
                that.specialLeft = false;
                that.specialRight = false;
                break;
            case 'Q':
                that.left = false;
                that.right = false;
                that.specialLeft = true;
                that.specialRight = false;
                break;
            case 'E':
                that.specialLeft = false;
                that.specialRight = true;
                that.left = false;
                that.right = false;
                break;
            case 'M':
                mute();
                break;
            case 'B':
                enableMouse();
                break;
            case 'P':
                pause();
                break;
            case 'V':
                debugging = !debugging;
                break;
        }
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouseX = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        if (mouseEnabled) {
            switch (e.which) {
                case 1:
                    that.left = false;
                    that.right = false;
                    that.specialLeft = true;
                    that.specialRight = false;
                    break;
                case 3:
                    that.specialLeft = false;
                    that.specialRight = true;
                    that.left = false;
                    that.right = false;
                    break;
            }
        }

    }, false);

}

GameEngine.prototype.addEntity = function (entity) {
    //console.log('before ' + this.entities.length);
    this.entities.push(entity);
	//console.log("after " + this.entities.length + " at position " + this.entities.indexOf(entity));
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.entities[0].draw(this.ctx);
    var piecesAfterPlayer = [];
    var playerY = this.entities[1].y - 150 - this.entities[1].radius;
    for (var i = this.entities.length - 1; i > 1; i--) {

        this.y - 150 - this.radius
        if (this.entities[i].y <= playerY) {
            this.entities[i].draw(this.ctx);
        } else {
            piecesAfterPlayer.push(this.entities[i]);
        }
    }
    this.entities[1].draw(this.ctx);
    for (var i = piecesAfterPlayer.length - 1; i > 1; i--) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
	if(this.removedEntities.length > 0) {
		//console.log(this.removedEntities.length);
	}
    //console.log("number of entities = " + entitiesCount);
	for (var i = entitiesCount - 1; i >= 0; i--) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
	 }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
			//console.log("removing " + this.entities[i]);
			this.removedEntities.push(this.entities[i]);
            this.entities.splice(i, 1);
        }
    }
}
GameEngine.prototype.loop = function () {
	if(this.on) {
		this.clockTick = this.timer.tick();
		this.update();
		this.draw();
		this.space = null;
	} else {
		//console.log("game is paused");
	}

	GameEngine.prototype.rightClockRunning = function () {
		if(this.rightClockRunning) {
			this.clockTick = this.timer.tick();
			this.update();
			this.draw();
			this.space = null;
		} else {
			//console.log("game is paused");
		}
	}

}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}


Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
