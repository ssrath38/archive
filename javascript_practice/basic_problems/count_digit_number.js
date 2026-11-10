// Count the number of digits of a number

function countDigits(num) {
	let count = 0;
	num = Math.abs(num);
	do {
		count++;
		num = Math.floor(num / 10);
	} while (num > 0);
	return count;
}

console.log(countDigits(0));
