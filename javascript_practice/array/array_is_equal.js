// Check if 2 arrays are equal

function isArrayEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

console.log("isArrayEqual", isArrayEqual([1, 2, 3, 4], [1, 2, 3]));

// Another way

function isArrayEqual1(arr1, arr2) {
	return (
		arr1.length === arr2.length && arr1.every((ele, i) => arr1[i] === arr2[i])
	);
}

console.log("isArrayEqual1", isArrayEqual1([1, 2, 3], [1, 2, 3]));
