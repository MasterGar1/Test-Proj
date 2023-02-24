const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const spawnBtn = document.getElementById("spawn");
const killBtn = document.getElementById("kill");
const powerBtn = document.getElementById("power");
const input = document.getElementById("input");
input.value = "Do you like the game?";

const tilesX = 24;
const tilesY = 18;
const tileSize = 32;
cvs.width = tilesX * tileSize;
cvs.height = tilesY * tileSize;
let clientX = 0;
let clientY = 0;
let powerupImages = [new Image(), new Image(), new Image(), new Image(), new Image()];
powerupImages[0].src = "powerups/aspeed.png";
powerupImages[1].src = "powerups/attack.png";
powerupImages[2].src = "powerups/health.png";
powerupImages[3].src = "powerups/length.png";
powerupImages[4].src = "powerups/width.png";

class Hero {
	constructor(x, y, speed) {
		this.x = x;
		this.y = y;
		this.size = tileSize;
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
		this.attackLength = 48;
		this.attackWidth = 32;
		this.attackCharge = 0;
		this.attackSpeed = 1;
		this.mousePressed = false;

	}
	// обновяване на всички събития, случили се на героя при всяко завъртане на играта
	update() {
		this.animate();
		this.move();
		if(this.mousePressed){
			this.hit();
		}
	}
	// рисуваме героя и неговото поле за атака
	draw(){
		let attackPolygon = hero.attackRange();

		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.moveTo(attackPolygon[0][0], attackPolygon[0][1]);
		ctx.lineTo(attackPolygon[1][0], attackPolygon[1][1]);
		ctx.lineTo(attackPolygon[4][0], attackPolygon[4][1]);
		ctx.lineTo(attackPolygon[5][0], attackPolygon[5][1]);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(attackPolygon[0][0], attackPolygon[0][1]);
		ctx.lineTo(attackPolygon[1][0], attackPolygon[1][1]);
		ctx.lineTo(attackPolygon[2][0], attackPolygon[2][1]);
		ctx.lineTo(attackPolygon[3][0], attackPolygon[3][1]);
		ctx.closePath();
		ctx.stroke();

		ctx.drawImage(this.img, this.x, this.y, tileSize, tileSize);
	}
	// движение според ъгъла, подаден чрез комбинация от клавиши
	move() {
		// според кои бутони са натиснати, намираме ъгъл, по който героят ще ходи
		// градусните мерки на ъглите са на обратно защото ординатната и абцисната ос на канваса са обърнати !!!
		let angle = 0;
		let keysPressed = 0;
		if (this.right) {
			angle += 0; // 0
			keysPressed++;
		}

		if (this.down) {
			angle += Math.PI / 2; // π/2
			keysPressed++;
		}

		if (this.left) {
			angle += Math.PI; // π
			keysPressed++;
		}

		if (this.up) {
			if (this.right) {
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
		if (this.x < -dx) {
			dx = 0;
		}

		if (this.x > cvs.width - tileSize - dx) {
			dx = 0;
		}

		if (this.y < -dy) {
			dy = 0;
		}

		if (this.y > cvs.height - tileSize - dy) {
			dy = 0;
		}
		// забрана за използване на противоположни посоки
		if ((this.up && this.down) || (this.right && this.left)) {
			dx = 0;
			dy = 0;
		}
		// добавяне на дистанцията
		if (this.left || this.right || this.up || this.down) {
			this.x += dx;
			this.y += dy;
		}
	}
	// сменяне на картинката на героя, в зависимост от какво действие прави
	animate() {
		if (this.left || this.right || this.up || this.down) {
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
	// смятаме точките на полето за атака
	attackRange() {
		let hx = this.x + tileSize / 2;
		let hy = this.y + tileSize / 2;
		let dx = hx - clientX;
		let dy = hy - clientY;
		let distance = Math.sqrt(dx ** 2 + dy ** 2);
		let sin = dy / distance;
		let cos = dx / distance;

		let ax = hx + sin * this.attackWidth / 2;
		let ay = hy - cos * this.attackWidth / 2;
		let bx = 2 * hx - ax;
		let by = 2 * hy - ay;

		let cx = ax - this.attackLength * cos;
		let cy = ay - this.attackLength * sin;
		let fx = bx - this.attackLength * cos;
		let fy = by - this.attackLength * sin;

		let px = ax - this.attackLength * cos * (this.attackCharge / 100);
		let py = ay - this.attackLength * sin * (this.attackCharge / 100);
		let qx = bx - this.attackLength * cos * (this.attackCharge / 100);
		let qy = by - this.attackLength * sin * (this.attackCharge / 100);

		let polygon = [ [ax, ay] , [bx, by] , [fx, fy] , [cx, cy] , [qx, qy] , [px , py]];
		return polygon;
	}
	// проверява дали има противник
	hit() {
		this.attackCharge += this.attackSpeed;
		if(this.attackCharge >= 100){
			for(let enemy in enemies){
				let hits = enemy.checkIntersection();
				if(hits){
					enemy.health -= this.damage;
					console.log(enemy.health);
				}
			}
			this.attackCharge = 0;
		}
	}
}

class Enemy {
	constructor(enemyNum) {
		this.x = 0;
		this.y = 0;
		this.speed = 2;
		this.img = new Image();
		this.img.src = "enemy/down0.png";
		this.generateStats(enemyNum);
		this.direction = "down";
		this.spriteCounter = 0;
		this.sprite = 0;
		this.size = tileSize;
	}
	// генерира статистики
	generateStats(enemyNum) {
		this.health = enemyNum * Math.random() * 1.5 + 20;
		this.damage = enemyNum * Math.random() + 2;
		this.x = Math.random() * tilesX * tileSize;
		this.y = Math.random() * tilesY * tileSize;
		this.speed += Math.random() * this.speed;
	}
	// обновяване на всички събития, случили се на противника при всяко завъртане на играта
	update() {
		this.animate();
		this.follow();
	}
	// рисуваме противника
	draw(){
		ctx.drawImage(this.img, this.x, this.y, tileSize, tileSize);
	}
	// преследва героя
	follow() {
		let dx = hero.x - this.x;
		let dy = hero.y - this.y;
		let distance = Math.sqrt(dx ** 2 + dy ** 2);
		let x = this.speed * (dx / distance);
		let y = this.speed * (dy / distance);

		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 0) {
				this.direction = "right";
			} else {
				this.direction = "left";
			}
		} else {
			if (dy > 0) {
				this.direction = "down";
			} else {
				this.direction = "up";
			}
		}

		this.x += x;
		this.y += y;
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
	// проверява дали противника е в обхвата на героя
	checkIntersection() {
		let a = [this.x, this.y];
		let b = [this.x + this.size, this.y];
		let c = [this.x, this.y + this.size];
		let d = [this.x + this.size, this.y + this.size];
		let range = hero.attackRange();
		let intersects = false;
	
		if(PointInPoly(a, range) || PointInPoly(b, range) || PointInPoly(c, range) || PointInPoly(d, range)) {
			intersects = !intersects;
		}
	
		return intersects;
	}
}

class PowerUp {
	constructor() {
		this.type = Math.floor(Math.random() * 5);
		this.x = Math.floor(Math.random() * tilesX);
		this.y = Math.floor(Math.random() * tilesY);
		this.size = tileSize;
		this.image = powerupImages[this.type];
	}
}

let hero = new Hero(10, 10, 5);

let enemies = [];

let powerups = [];

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

	for (let enemy of enemies) {
		enemy.update();
	}

	notoyes();

	draw();
	window.requestAnimationFrame(gameLoop);
}
// рисуване
function draw() {
	ctx.strokeStyle = "black";
	// изтриване на полето
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	// карта
	ctx.strokeRect(0, 0, cvs.width, cvs.height);

	// powers
	for (let power of powerups) {
		ctx.drawImage(power.image, power.x * tileSize, power.y * tileSize);
	}

	// противници
	for (let enemy of enemies) {
		enemy.draw();
	}

	// герой
	hero.draw();
}
// команди от клавиши
document.onkeydown = function (e) {
	let key = e.key.toLowerCase();

	switch (key) {
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
document.onkeyup = function (e) {
	let key = e.key.toLowerCase();

	switch (key) {
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
spawnBtn.onclick = function () {
	enemies.push(new Enemy(enemies.length - 1));
}
// поставя powerup на картата
powerBtn.onclick = function(){
	powerups.push(new PowerUp());
}
// премахва вдички противници
killBtn.onclick = function () {
	enemies = [];
}
// засича къде се намира мишката
document.onmousemove = function(e) {
	clientX = e.clientX;
	clientY = e.clientY;
}
// проверява дали два правоъгълника се пресичат
function intersectionRect(a, b) {
	if (b.x > a.x + a.width || a.x > b.x + b.width) {
		return false;
	}
	if (b.y > a.y + a.height || a.y > b.y + b.height) {
		return false;
	}

	return true;
}
// проверява дали дадена точка е в многоъгълник
function PointInPoly(point, poly) {
	let x = point[0];
	let y = point[1];

	let isInside = false;
	for(let i = 0, j = poly.length - 1; i < poly.length; j = i++){
		let xi = poly[i][0];
		let yi = poly[i][1];
		let xj = poly[j][0];
		let yj = poly[j][1];

		if(((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)){
			isInside = !isInside;
			break;
		}
	}

	return isInside;
}
// проверява натискане на мишката
cvs.onmousedown = function(e) {
	hero.mousePressed = true;
}
// проверява отпускане на мишката
cvs.onmouseup = function(e) {
	hero.mousePressed = false;
	hero.attackCharge = 0;
}

input.onmousedown = function(e){
	input.value = "";
}

function notoyes() {
	if(input.value.length >= 2){
		if(input.value[input.value.length - 2] == 'n' && input.value[input.value.length - 1] == 'o'){
			input.value = input.value.slice(0, input.value.length - 2);
			input.value += "yes";
		}
	}
}