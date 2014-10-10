// Screen Size
var WIDTH = 800;
var HEIGHT = 480;
var GRIDSIZE = 40;
granularity = {"x": [Math.floor(WIDTH/GRIDSIZE)], "y": [Math.floor(HEIGHT/GRIDSIZE)]};
var row = 12;
var column = 20;
var grid = [];

var MathHelper = {
	clamp: function(value, min, max){
		if(value <= min) return min;
		if(value >= max) return max;
		return value;
	}
};


// GRID
// ------------------------------------
var Grid = function()
{
	var myself = this;
	this.rows = 12;
	this.columns = 20;
	this.rowSpace = HEIGHT/this.rows;
	this.columnSpace = WIDTH/this.columns;
};



var gridArray = function()
{
	self = this;
	self.rows = granularity.x;
	self.columns = granularity.y;
	//gotta love js arrays!
	arr = new Array(self.rows);
	for(i = 0; i < self.columns; i++)
	{
		arr[i] = new Array(self.rows);
		for(j = 0; j < self.rows; j++)
		{
			arr[i][j] = new Array(0);
		}
	}
	return arr;
};

Grid:prototype = 
{
	
	
	//add an asteroid to the grid
	add: function(id)
	{
	
	},
	
	//remove an asteroid from the grid
	remove: function(id)
	{
	
	},
	
	// move asteroid from one part of the grid to another
	move: function(id)
	{
	
	},
	
	
	
};

// RESOURCES
// ----------------------------------
var Resource = { img: {}, sfx: {}}

Resource.img.background = new Image();
Resource.img.background.src = "outer_space.jpg";
Resource.sfx.collide = new Audio();
Resource.sfx.collide.src = "collide.wav";

// ASTEROID
//---------------------------
var Asteroid = function(velocity, angle, mass) {
	if(velocity !== undefined) this.velocity = velocity;
	if(angle !== undefined) this.angle = angle;
	if(mass !== undefined) this.radius = mass;
	this.x = Math.random() * WIDTH;
	this.y = Math.random() * HEIGHT;
};

Asteroid.prototype = {
	x: 0,
	y: 0,
	radius: 10,
	velocity: 10,
	angle: 0,
	
	render: function(context) {
		context.save();
		context.strokeStyle = "#000000";
		context.fillStyle = "#aaaaaa";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		context.fill();
		context.stroke();
		context.restore();

	},
	
	update: function(elapsedTime) {
		this.x += elapsedTime * this.velocity * Math.sin(this.angle);
		this.y += elapsedTime * this.velocity * Math.cos(this.angle);
		
		// Wrap asteroid when going off-screen
		if(this.x < - this.radius) this.x += WIDTH + this.radius;
		if(this.x > WIDTH + this.radius) this.x -= WIDTH + this.radius;
		if(this.y < - this.radius) this.y += HEIGHT + this.radius;
		if(this.y > HEIGHT + this.radius) this.y -= HEIGHT + this.radius;
		
		// TODO: Rotate the asteroid
		
	}
};

var Asteroids = function (canvasId) {
  var myself = this;
  
  // Rendering variables
	this.frontBuffer = document.getElementById(canvasId);
	this.frontBufferContext = this.frontBuffer.getContext('2d');
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.frontBuffer.width;
	this.backBuffer.height = this.frontBuffer.height;
	this.backBufferContext = this.backBuffer.getContext('2d');
	
	
	this.Grid = new Grid();
  
  // Game variables
	this.asteroids = [];
	this.level = 1;
	this.gameOver = false;
	
  // Timing variables
	this.startTime = 0;
	this.lastTime = 0;
	this.gameTime = 0;
	this.fps = 0;
	this.STARTING_FPS = 60;

   // Pausing variables
	this.paused = false;
	this.startedPauseAt = 0;
	this.PAUSE_TIMEOUT = 100;
  
  window.addEventListener("blur", function( event) {
    myself.paused = true;
  });
}
	
Asteroids.prototype = {

	update: function(elapsedTime) {
		
		// Update asteroids
		this.asteroids.forEach( function(asteroid) {
			asteroid.update(elapsedTime);
		});
		
		// TODO: handle asteroid collisions
		
	},
	
	render: function(elapsedTime) 
	{
		var self = this;
		
	  // Clear screen
		this.backBufferContext.fillStyle = "#000";
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(Resource.img.background, 0, 0);
		
		// Render asteroids
		this.asteroids.forEach( function(asteroid) {
			asteroid.render(self.backBufferContext);
		});
		
		//calls render grid so we can see our spatial background
		this.renderGrid('white');
		
		// Render GUI
		if(this.gameOver)
		{
			this.renderGuiText("Game Over", 380, 220);
			this.renderGuiText("Press [enter] for new game", 300, 260);
		}
		else if(this.paused) 
		{
			this.renderGuiText("Paused", 380, 220);
			this.renderGuiText("Press [space] to continue", 300, 260);
		}
		if(this.displayLevel) 
		{
			this.renderGuiText("Level " + this.level, 380, 220);
		}
		this.frontBufferContext.drawImage(this.backBuffer, 0, 0);
		
		
	},
	
	
	
	//show grid lines to help visualize spatial data structure
	renderGrid: function(stroke)
	{
		this.backBufferContext.save();
		this.backBufferContext.lineWidth = 0.5;
		this.backBufferContext.strokeStyle = stroke;
		
		for(i = 1; i < this.Grid.rows; i++)
		{
			this.backBufferContext.beginPath();
			this.backBufferContext.moveTo(0, i * this.Grid.rowSpace);
			this.backBufferContext.lineTo(WIDTH, i * this.Grid.rowSpace);
			this.backBufferContext.stroke();
		}
		
		for(i = 1; i < this.Grid.columns; i++)
		{
			this.backBufferContext.beginPath();
			this.backBufferContext.moveTo(i * this.Grid.columnSpace, 0);
			this.backBufferContext.lineTo(i * this.Grid.columnSpace, HEIGHT);
			this.backBufferContext.stroke();
		}
		
		this.backBufferContext.restore();
	},
	
	
	//Render GUI Text
	renderGuiText: function(message, x, y)
	{
		this.backBufferContext.save();
		this.backBufferContext.font = "20px Arial";
		this.backBufferContext.fillStyle = "#ffffff";
		this.backBufferContext.fillText(message, x, y);
		this.backBufferContext.fillText(message, x, y);
		this.backBufferContext.restore();
	},
	
	//Begin Level
	beginLevel: function()
	{
	  var self = this;
		// Create asteroids
		for(i = 0; i < this.level * 10; i++) {
		  this.asteroids.push( new Asteroid(
		    Math.random() * 0.1 * this.level,
				Math.random() * 2 * Math.PI
			));
		}
		
		// Display level in GUI temporarily
		this.displayLevel = true;
		setTimeout(function(){self.displayLevel = false;}, 3000);
	},
	
	keyDown: function(e)
	{
		switch(e.keyCode){
		  case 13: // ENTER
			  if(game.gameOver) {
					this.level = 1;
					this.score = 0;
					this.beginLevel();
					this.gameOver = false;
				}
				break;
			case 32: // SPACE
				this.paused = !this.paused;
				break;
		}
	},
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		
		this.beginLevel();
		this.gameOver = false;
		this.startTime = Date();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},
	
	loop: function(time) {
		var self = this;
		
		if(this.paused || this.gameOver) this.lastTime = time;
		var elapsedTime = time - this.lastTime; 
		this.lastTime = time;
		
		self.update(elapsedTime);
		self.render(elapsedTime);
			
		if (this.paused || this.gameOver) {
			 // In PAUSE_TIMEOUT (100) ms, call this method again to see if the game
			 // is still paused. There's no need to check more frequently.
			 
			 setTimeout( function () {
					window.requestNextAnimationFrame(
						 function (time) {
								self.loop.call(self, time);
						 });
			 }, this.PAUSE_TIMEOUT);
             
		}	else {
			
			window.requestNextAnimationFrame(
				function(time){
					self.loop.call(self, time);
				}
			);
		}
	}
}

var game = new Asteroids('myCanvas');
console.log(game);
game.start();