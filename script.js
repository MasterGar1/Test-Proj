const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const tilesX = 18;
const tilesY = 18;
const tileSize = 32;
cvs.width = tilesX * tileSize;
cvs.height = tilesY * tileSize;

class Hero {
	constructor(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.img = new Image();
		this.img.src = "hero/down0.png";

		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.direction = "down";
		this.spriteCounter = 0;
		this.sprite = 0;
		
		this.health = 50;
		this.damage = 5;
	}
}

class Enemy {
	constructor(enemyNum){
		this.speed = 3;
		this.img = new Image();
		this.img.src = "hero/down0.png";
		this.generateStats(enemyNum);
	}
	// генерира статистики
	generateStats(enemyNum){
		this.health = enemyNum * Math.random() * 1.5 + 20;
		this.damage = enemyNum * Math.random() + 2;
		this.x = Math.random() * tilesX * tileSize;
		this.y = Math.random() * tilesY * tileSize;
	}
}

let hero = new Hero(10, 10, 5);

let enemy = new Enemy(0);

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

	hero.update();
	draw();
	window.requestAnimationFrame(gameLoop);
}
// рисуване
function draw(){
	// изтриване на полето
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	// карта
	ctx.strokeRect(0, 0, cvs.width, cvs.height);
	
	// противник
	ctx.drawImage(enemy.img, enemy.x, enemy.y, tileSize, tileSize);

	// герой
	ctx.drawImage(hero.img, hero.x, hero.y, tileSize, tileSize);
}
// команди от клавиши
document.onkeydown = function(e) {
	let key = e.key.toLowerCase();

	switch(key){
		case 'w':
			hero.up = true;
			hero.direction = "up";
			break;
		case 's':
			hero.down = true;
			hero.direction = "down";
			break;
		case 'a':
			hero.left = true;
			hero.direction = "left";
			break;
		case 'd':
			hero.right = true;
			hero.direction = "right";
			break;
	}
}
// спиране на движение
document.onkeyup = function(e) {
	let key = e.key.toLowerCase();

	switch(key){
		case 'a':
			hero.left = false;
			break;
		case 'd':
			hero.right = false;
			break;
		case 'w':
			hero.up = false;
			break;
		case 's':
			hero.down = false;
			break;
	}
}

// обновяване на всички събития, случили се на героя при всяко завъртане на играта
hero.update = function(){
	hero.animate();
	hero.move();
}
// движение според ъгъла, подаден чрез комбинация от клавиши
hero.move = function(){
	// според кои бутони са натиснати, намираме ъгъл, по който героят ще ходи
	// градусните мерки на ъглите са на обратно защото ординатната и абцисната ос на канваса са обърнати !!!
	let angle = 0;
	let keysPressed = 0;
	if(hero.right){
		angle += 0; // 0
		keysPressed++;
	}

	if(hero.down){
		angle += Math.PI / 2; // π/2
		keysPressed++;
	}

	if(hero.left){
		angle += Math.PI; // π
		keysPressed++;
	}

	if(hero.up){
		if(hero.right){
			angle += Math.PI / -2; // -π/2
		}
		else {
			angle += 3 * Math.PI / 2; // 3π/2
		}
		keysPressed++;
	}

	angle /= keysPressed;
	// като използваме дефиницията за тригономентичните функции, разбираме, че крайната точка в която ще е героя е с координати D(cos(angle);sin(angle))
	let dx = Math.cos(angle) * hero.speed;
	let dy = Math.sin(angle) * hero.speed;
	// проверка за краищата на картата
	if(hero.x < -dx){
		dx = 0;
	}

	if(hero.x > cvs.width - tileSize - dx){
		dx = 0;
	}

	if(hero.y < -dy){
		dy = 0;
	}
	
	if(hero.y > cvs.height - tileSize - dy){
		dy = 0;
	}
	// забрана за използване на противоположни посоки
	if((hero.up && hero.down) || (hero.right && hero.left)){
		dx = 0;
		dy = 0;
	}
	// добавяне на дистанцията
	if(hero.left || hero.right || hero.up || hero.down){
		hero.x += dx;
		hero.y += dy;
	}
}
// сменяне на картинката на героя, в зависимост от какво действие прави
hero.animate = function(){
	if(hero.left || hero.right || hero.up || hero.down){
		hero.spriteCounter++;
		if (hero.spriteCounter > 10) {
			if (hero.sprite == 1 || hero.sprite == 0) {
				hero.sprite = 2;
			} else if (hero.sprite == 2 || hero.sprite == 0) {
				hero.sprite = 1;
			}
			hero.spriteCounter = 0;
		}
	} else {
		hero.sprite = 0;
		hero.spriteCounter = 0;
	}
	// TODO: по бърз начин за зареждане на снимки
	let path = "hero/" + hero.direction + hero.sprite + ".png";
	hero.img.src = path;
}
// преследва героя
enemy.follow = function(){
	let dist = Math.sqrt((hero.x - enemy.x) ** 2 + (hero.y - enemy.y) ** 2);
	
	let dx = Math.cos(angle) * hero.speed;
	let dy = Math.sin(angle) * hero.speed;
}

