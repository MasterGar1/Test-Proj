let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let map = {
	sqSize: 50,
	width: 10, 
	height: 10
};

let hero = {
	x: 4, 
	y: 3,
};

let img = new Image();
img.src = "hero.png";

cvs.width = map.sqSize * map.width;
cvs.height = map.sqSize * map.height;

redrawCanvas();

cvs.onmousedown = function(e) {
	let clickX = e.x - cvs.offsetLeft;
	let clickY = e.y - cvs.offsetTop;
	let sqX = Math.floor(clickX / map.sqSize);
	let sqY = Math.floor(clickY / map.sqSize);
	moveTo(sqX, sqY);
}

cvs.onkeypress = function(e) {
	redrawCanvas();
}

function redrawCanvas(){
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	for(let i = 0; i < map.width; i++){
		for(let j = 0; j < map.height; j++){
			ctx.strokeRect(i * map.sqSize, j * map.sqSize, map.sqSize, map.sqSize);
		}
	}
	ctx.drawImage(img, hero.x * map.sqSize, hero.y * map.sqSize, map.sqSize, map.sqSize);
}

function moveTo(x, y) {
	hero.x = x;
	hero.y = y;
	redrawCanvas();
}