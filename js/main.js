window.onload = init;

var map;
var ctxMap;

var pl;
var ctxPl;

var enemyCvs;
var cxtEnemy;

var stats;
var ctxStats;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 500;

var player;
var enemies = [];

var spawnInterval;
var spawnTime = 7000;
var spawnAmount = 50;

var isPlaying;

var health;

var background = new Image();
background.src = "image/bg.jpeg"

var background1 = new Image();
background1.src = "image/bg.jpeg"

var tiles = new Image();
tiles.src = "./image/titles.png"

var requestAnimatFrame = window.requestAnimationFrame ||
						 window.webkitRequestAnimationFrame ||
						 window.mozRequestAnimationFrame ||
						 window.oRequestAnimationFrame ||
						 window.msRequestAnimationFrame;

function init(){

	map = document.getElementById("map");
	ctxMap = map.getContext("2d");

    pl = document.getElementById("player");
	ctxPl = map.getContext("2d");

	enemyCvs = document.getElementById("enemy");
	cxtEnemy = map.getContext("2d");

	stats = document.getElementById("stats");
	ctxStats = stats.getContext("2d");

	map.width = gameWidth;
	map.height = gameHeight
	pl.width = gameWidth;
	pl.height = gameHeight
	enemyCvs.width = gameWidth;
	enemyCvs.height = gameHeight;
	stats.width = gameWidth;
	stats.height = gameHeight;

	ctxStats.fillStyle = "#3D3D3D";
	ctxStats.font = "bold 13pt Arial"

	drawBtn = document.getElementById("drawBtn");
	clearBtn = document.getElementById("clearBtn");

	resetHealth();

	drawBtn.addEventListener('click', drawRect, false);
	clearBtn.addEventListener('click', clearRect, false);

	player = new Player();
	
	startLoop();
	
	document.addEventListener("keydown", checkKeyDown, false); 
	document.addEventListener("keyup", checkKeyUp, false);
}
function resetHealth(){
	health = 100;
}
function spawnEnemies(count){
	for(var i = 0; i < count; i++){
		enemies[i] = new Enemy();
	}
}
function startCreatingEnemis(){
	stopCreatingEnemis();
	spawnInterval = setInterval(function(){spawnEnemies(spawnAmount);}, spawnTime);
}
function stopCreatingEnemis(){
	clearInterval(spawnInterval);
}
function loop(){

	drawBg();
	if(isPlaying){

		draw();
		update();
		requestAnimatFrame(loop);
	}
}
function startLoop(){

	isPlaying = true;
	loop();
	startCreatingEnemis();
}
function stopLoop(){
	isPlaying = false;
}
function update(){

	updateStats();
	player.update();
	for(var i = 0; i < enemies.length; i++){
		enemies[i].update();
	}

}
function draw(){
	clearCtxEnemy();
	player.draw();
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
	}
}
function Player(){
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = 0;
	this.drawY = 0;
	this.width = 130;
	this.height = 70;
	this.speed =5;

	// For key

	this.isUp = false;
	this.isDown = false;
	this.isRight = false;
	this.isLeft = false;
	this.speed = 5;
}
function Enemy(){
	this.srcX = 0;
	this.srcY = 70;
	this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
	this.width = 46;
	this.height = 46;

	this.speed = 18;
}
Player.prototype.draw = function(){
	drawBg();

	ctxPl.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, 
	 this.drawX, this.drawY, this.width, this.height);

}
Player.prototype.update = function(){
	if(health < 0) resetHealth();
	if(this.drawX < 0) this.drawX = 0;
	if(this.drawX > gameWidth - this.width) this.drawX = gameWidth - this.width;
	if (this.drawY < 0) this.drawY = 0;
	if(this.drawY > gameHeight - this.height) this.drawY = gameHeight -this.height;  

	for(var i = 0; i < enemies.length; i++){
		if (this.drawX >= enemies[i].drawX &&
			this.drawY >= enemies[i].drawY &&
			this.drawX <= enemies[i].drawX + enemies[i].width &&
			this.drawY <= enemies[i].drawY + enemies[i].height) {
			health --;
		};
	}

	this.chooseDir();
}
Player.prototype.chooseDir = function(){
	if(this.isUp)
		this.drawY -= this.speed;
	if(this.isDown)
		this.drawY += this.speed;
	if(this.isRight)
		this.drawX += this.speed;
	if (this.isLeft)
		this.drawX -= this.speed;
}
function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if (keyChar == "W") 
		player.isUp = true;
		e.preventDefault();
	if (keyChar == "S") 
		player.isDown = true;
		e.preventDefault();
	if (keyChar == "D") 
		player.isRight = true;
		e.preventDefault();
	if (keyChar == "A") 
		player.isLeft = true;
		e.preventDefault();
}
function checkKeyUp(e){
	var keyId = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyId);

	if (keyChar == "W")
		player.isUp = false;
		e.preventDefault();
	if (keyChar == "S") 
		player.isDown = false;
		e.preventDefault();
	if (keyChar == "D") 
		player.isRight = false;
		e.preventDefault();
	if (keyChar == "A") 
		player.isLeft = false;
		e.preventDefault();
}
Enemy.prototype.draw = function(){

	cxtEnemy.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, 
	 this.drawX, this.drawY, this.width, this.height);
}
Enemy.prototype.update = function(){
	this.drawX -= 4;
	if(this.drawX + this.width < 0){
		this.destroy();
	}
}
Enemy.prototype.destroy = function(){
	enemies.splice(enemies.indexOf(this), 1);
}
function drawRect(){
	ctxMap.fillStyle= "#ccc";
	ctxMap.fillRect(10, 10, 100, 100);
}

function clearRect(){
	ctxMap.clearRect(0, 0, 800, 500);
}
function clearCtxPlayer(){
	ctxPl.clearRect(0, 0, gameWidth, gameHeight);
}
function clearCtxEnemy(){
	cxtEnemy.clearRect(0, 0, gameWidth, gameHeight);
}
function updateStats(){
	ctxStats.clearRect(0, 0, gameWidth, gameHeight);
	ctxStats.fillText("Health  " + health, 10, 20);
}
function drawBg(){
	ctxMap.clearRect(0, 0, gameWidth, gameHeight);
	ctxMap.drawImage(background, 0, 0, 800, 480, 0, 0, gameWidth, gameHeight);
}

