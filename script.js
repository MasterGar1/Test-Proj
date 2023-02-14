let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");
let sqs = 50;
let sx = 5;
let sy = 5;
let hx = 4;
let hy = 3;
cvs.width = sqs * sx;
cvs.height = sqs * sy;

for(let i = 0; i < sx; i++){
	for(let j = 0; j < sy; j++){
		ctx.strokeRect(i * sqs, j * sqs, sqs, sqs);
	}
}

let himg = new Image();
himg.src = "hero.png";
ctx.drawImage(himg, hx * sqs, hy * sqs, sqs, sqs);