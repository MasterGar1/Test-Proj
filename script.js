const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const result = document.getElementById("result");

const btnSum = document.getElementById("sum");
const btnDif = document.getElementById("dif");
const btnMul = document.getElementById("mul");
const btnDiv = document.getElementById("div");
const btnRoot = document.getElementById("root");
const btnPow = document.getElementById("pow");
const btnSin = document.getElementById("sin");
const btnCos = document.getElementById("cos");
const btnTg = document.getElementById("tg");

btnSum.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a + b;
}

btnDif.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a - b;
}

btnMul.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a * b;
}

btnDiv.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a / b;
}

btnPow.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a ** b;
}

btnRoot.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = a ** (1 / b);
}

btnSin.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = Math.sin(a / b * Math.PI);
}

btnCos.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = Math.cos(a / b * Math.PI);
}

btnTg.onclick = function() {
	a = Number(inputA.value);
	b = Number(inputB.value);
	result.innerText = Math.tan(a / b * Math.PI);
}