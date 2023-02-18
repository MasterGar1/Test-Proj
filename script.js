const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

function GameMap(tilesX, tilesY, tileSize) {
	this.tilesX = tilesX;
	this.tilesY = tilesY;
	this.tileSize = tileSize;
	this.width = tilesX * tileSize;
	this.height = tilesY * tileSize;
	cvs.width = tileSize * tilesX;
	cvs.height = tileSize * tilesY;
}

function Hero(x, y, speed, src){
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.img = new Image();
	this.img.src = src;
	up = false;
	down = false;
	left = false;
	right = false;
}

let gameMap = new GameMap(10, 10, 48);
let hero = new Hero(0, 0, 4, "hero.png");

window.requestAnimationFrame(gameLoop);

let secondsPassed;
let oldTimeStamp;
let fps;

// върти играта (game loop)
function gameLoop(timeStamp) {
	// сметки за fps
	secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
	fps = Math.round(1 / secondsPassed);

	// console.log(fps);

    draw();
    window.requestAnimationFrame(gameLoop);
}
// рисуване
function draw(){
	// изтриване на полето
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	// карта
	ctx.strokeRect(0, 0, cvs.width, cvs.height);

	// герой
	ctx.drawImage(hero.img, hero.x, hero.y, gameMap.tileSize, gameMap.tileSize);
}
// команди от клавиши
document.onkeydown = function(e) {
	let key = e.key.toLowerCase();
	console.log(key);

	if(key == 'a'){
		hero.left = true;
	}

	if(key == 'd'){
		hero.right = true;
	}

	if(key == 'w'){
		hero.up = true;
	}

	if(key == 's'){
		hero.down = true;
	}

	move();
	// console.log(hero.x + " " + hero.y);
}
// спиране на движение
document.onkeyup = function(e) {
	hero.up = false;
	hero.down = false;
	hero.left = false;
	hero.right = false;
}

function move(){
	if(hero.left){
		if(hero.x > 0){
			hero.x -= hero.speed;
		}
	}

	if(hero.right){
		if(hero.x < gameMap.width - hero.speed){
			hero.x += hero.speed;
		}
	}

	if(hero.up){
		if(hero.y > 0){
			hero.y -= hero.speed;
		}
	}

	if(hero.down){
		if(hero.y < gameMap.height - hero.speed){
			hero.y += hero.speed;
		}
	}
}

