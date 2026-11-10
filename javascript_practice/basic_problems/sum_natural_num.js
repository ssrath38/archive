// sum of all natural numbers from 1 to n

function sumOfNaturalNumber(num) {
	let sum = 0;
	for (let i = 1; i <= num; i++) {
		sum = sum + i;
	}
	return sum;
}

console.log(sumOfNaturalNumber(5));

// another method

// function sumOfNaturalNumber(num) {
// 	return (num * (num + 1)) / 2;
// }

// console.log(sumOfNaturalNumber(5));
