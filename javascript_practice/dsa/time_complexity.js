// What is time complexity

// Time complexity tell us how much time it will take to execute a certain algorithm.

function sumOfArray(nums) {
	let sum = 0; // 1 time
	for (let i = 0; i < nums.length; i++) {
		sum = sum + nums[i];
	} // n time
	return sum; // 1 time
}

// time complexity O(n+2) = O(n)

function sumOfMatrix(nums) {
	let sum = 0; // 1 time
	for (let i = 0; i < nums.length; i++) {
		for (let j = 0; j < nums.length; j++) {
			sum = sum + nums[i][j];
		} // times
	} // n times
	return sum; // 1 time
}

// inner loop - n times     outer loop - n times
// time complexity O(n x n) = O(n2)

function fn(num) {
	let arr = [];
	for (let i = 1; i < num; i = i * 2) {
		arr.push(i);
	}
	return arr;
}
// if num = 16, arr will be [1, 2, 4, 8] - 2^4
// if num = 1024, arr will be [1, 2, 4, 8, 16, 32, 64, 128, 256, 512] - 2^10

// time complexity O(log2n)

// if i = i*3 then time complexity will be O(log3n)

function sumOfDigits(num) {
	let sum = 0;
	while (num > 0) {
		sum = sum + (num % 10);
		num = Math.floor(num / 10);
	}
	return sum;
}

// time complexity O(log10n)
