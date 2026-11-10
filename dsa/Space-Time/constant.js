// BigO(1) - Constant Time and Space Complexity

// No matter the length of arrays gone to one million items or reduced the time complexity still be the same.

const arr = [1, 2, 3, 4, 5];

// Task: Add 10 to the first element of an array

arr[0] += 10; // T.C -> O(1)

// Task: Store the last element of the array to a variable

let num = arr[arr.length - 1]; // S.C -> int(4 bytes) O(4)
console.log(arr[0]); // T.C -> O(1)
