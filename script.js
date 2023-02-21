const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const spawnBtn = document.getElementById("spawn");
const killBtn = document.getElementById("kill");

const tilesX = 18;
const tilesY = 18;
const tileSize = 32;
cvs.width = tilesX * tileSize;
cvs.height = tilesY * tileSize;
// http://kidscanjavascript.com/TUTORIAL/Collisions%20on%20the%20Canvas.php
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
		this.hitbox = {x: this.x, y: this.y, width: tileSize, height: tileSize};
	}
	
	// обновяване на всички събития, случили се на героя при всяко завъртане на играта
	update(){
		this.animate();
		this.move();
	}
	// движение според ъгъла, подаден чрез комбинация от клавиши
	move(){
		// според кои бутони са натиснати, намираме ъгъл, по който героят ще ходи
		// градусните мерки на ъглите са на обратно защото ординатната и абцисната ос на канваса са обърнати !!!
		let angle = 0;
		let keysPressed = 0;
		if(this.right){
			angle += 0; // 0
			keysPressed++;
		}

		if(this.down){
			angle += Math.PI / 2; // π/2
			keysPressed++;
		}

		if(this.left){
			angle += Math.PI; // π
			keysPressed++;
		}

		if(this.up){
			if(this.right){
				angle += Math.PI / -2; // -π/2
			}
			else {
				angle += 3 * Math.PI / 2; // 3π/2
			}
			keysPressed++;
		}

		angle /= keysPressed;
		// като използваме дефиницията за тригономентичните функции, разбираме, че крайната точка в която ще е героя е с координати D(cos(angle);sin(angle))
		let dx = Math.cos(angle) * this.speed;
		let dy = Math.sin(angle) * this.speed;
		// проверка за краищата на картата
		if(this.x < -dx){
			dx = 0;
		}

		if(this.x > cvs.width - tileSize - dx){
			dx = 0;
		}

		if(this.y < -dy){
			dy = 0;
		}
		
		if(this.y > cvs.height - tileSize - dy){
			dy = 0;
		}
		// забрана за използване на противоположни посоки
		if((this.up && this.down) || (this.right && this.left)){
			dx = 0;
			dy = 0;
		}
		// добавяне на дистанцията
		if(this.left || this.right || this.up || this.down){
			this.x += dx;
			this.y += dy;
			this.hitbox.x = this.x;
			this.hitbox.y = this.y;
		}
	}
	// сменяне на картинката на героя, в зависимост от какво действие прави
	animate(){
		if(this.left || this.right || this.up || this.down){
			this.spriteCounter++;
			if (this.spriteCounter > 10) {
				if (this.sprite == 1 || this.sprite == 0) {
					this.sprite = 2;
				} else if (this.sprite == 2 || this.sprite == 0) {
					this.sprite = 1;
				}
				this.spriteCounter = 0;
			}
		} else {
			this.sprite = 0;
			this.spriteCounter = 0;
		}
		// TODO: по бърз начин за зареждане на снимки
		let path = "hero/" + this.direction + this.sprite + ".png";
		this.img.src = path;
	}
}

class Enemy {
	constructor(enemyNum){
		this.speed = 2;
		this.img = new Image();
		this.img.src = "enemy/down0.png";
		this.generateStats(enemyNum);
		this.direction = "down";
		this.spriteCounter = 0;
		this.sprite = 0;
		this.hitbox = {x: this.x, y: this.y, width: tileSize, height: tileSize};
	}
	// генерира статистики
	generateStats(enemyNum){
		this.health = enemyNum * Math.random() * 1.5 + 20;
		this.damage = enemyNum * Math.random() + 2;
		this.x = Math.random() * tilesX * tileSize;
		this.y = Math.random() * tilesY * tileSize;
		this.speed += Math.random() * this.speed;
	}
	// обновяване на всички събития, случили се на противника при всяко завъртане на играта
	update(){
		this.animate();
		this.follow();
	}
	// преследва героя
	follow() {
		let dx = hero.x - this.x;
		let dy = hero.y - this.y;
		let distance = Math.sqrt(dx ** 2 + dy ** 2);
		let x = this.speed * (dx / distance);
		let y = this.speed * (dy / distance);

		if(Math.abs(dx) > Math.abs(dy)){
			if(dx > 0){
				this.direction = "right";
			} else {
				this.direction = "left";
			}
		} else {
			if(dy > 0){
				this.direction = "down";
			} else {
				this.direction = "up";
			}
		}

		this.x += x;
		this.y += y;
		this.hitbox.x = this.x;
		this.hitbox.y = this.y;
	}
	// сменяне на картинката на противника, в зависимост от какво действие прави
	animate() {
		this.spriteCounter++;
		if (this.spriteCounter > 10) {
			if (this.sprite == 1 || this.sprite == 0) {
				this.sprite = 2;
			} else if (this.sprite == 2 || this.sprite == 0) {
				this.sprite = 1;
			}
			this.spriteCounter = 0;
		}
		// TODO: по бърз начин за зареждане на снимки
		let path = "enemy/" + this.direction + this.sprite + ".png";
		this.img.src = path;
	}
}

let hero = new Hero(10, 10, 5);

let enemies = [];

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
	
	for(let enemy of enemies){
		enemy.update();
		if(intersects(enemy.hitbox, hero.hitbox)){
			console.log("bonk");
		}
	}
	
	draw();
	window.requestAnimationFrame(gameLoop);
}
// рисуване
function draw(){
	// изтриване на полето
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	// карта
	ctx.strokeRect(0, 0, cvs.width, cvs.height);
	
	// противници
	for(let enemy of enemies){
		ctx.drawImage(enemy.img, enemy.x, enemy.y, tileSize, tileSize);
	}

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
// призовава противник
spawnBtn.onclick = function() {
	enemies.push(new Enemy(enemies.length - 1));
}
// премахва вдички противници
killBtn.onclick = function() {
	enemies = [];
}

function intersects(a, b){
	let x1 = a.x;
	let y1 = a.y;
	let x2 = b.x;
	let y2 = b.y;
	let h1 = a.height;
	let w1 = a.width;
	let h2 = b.height;
	let w2 = b.width;

	if (x2 > x1 + w1 || x1 > x2 + w2) {
		return false;
	} 
	if (y2 > y1 + h1 || y1 > y2 + h2) {
		return false;
	} 

	return true;
}
