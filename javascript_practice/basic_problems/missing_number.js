// Given an array containing n distinct numbers in the range [0,n]. return the only number in thr range that is missing from the array.

function missingNumber(nums) {
	let sum = 0;
	for (let i = 0; i < nums.length; i++) {
		sum = sum + nums[i];
	}
	return (nums.length * (nums.length + 1)) / 2 - sum;
}

console.log(missingNumber([1, 0, 3]));

// another solution

// function missingNumber(nums) {
// 	return (
// 		(nums.length * (nums.length + 1)) / 2 - nums.reduce((acc, num) => acc + num)
// 	);
// }

// console.log(missingNumber([1, 0, 3]));
