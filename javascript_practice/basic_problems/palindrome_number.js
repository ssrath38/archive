// Given an integer num, return if num is a palindrome, and false otherwise

function palindrome_number(num) {
	let newNumber = num;
	let reverseNumber = 0;
	while (newNumber > 0) {
		reverseNumber = reverseNumber * 10 + (newNumber % 10);
		newNumber = Math.floor(newNumber / 10);
	}
	return num === reverseNumber;
}

console.log(palindrome_number(121));
