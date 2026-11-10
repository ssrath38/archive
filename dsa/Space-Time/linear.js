// BigO(n) - Linear Time and Space Complexity

// Increase input increase time and space
// Decrease input decrease time and space

const arr = [1, 2, 3, 4, 5];

// Task: Add 10 to the first element of an array

arr[0] += 10; // T.C -> O(1) S.C -> O(1)

// Task: Print the elements of an array

for (let i = 0; i < arr.length; i++) {
  // T.C -> O(n) S.C -> O(1)
  console.log(arr[i]);
}

// Copy the elements of one array to another

const newArr = new Array(arr.length); // T.C -> O(1) S.C -> O(n)
for (let i = 0; i < newArr.length; i++) {
  // T.C -> O(n) S.C -> O(1)
  newArr[i] = arr[i];
}

for (let num of newArr) {
  // T.C -> O(n) S.C -> O(1)
  console.log(num);
}

// T.C -> O(1) + O(n) + O(1) + O(n) + O(n) = O(2+3n) == O(n)
// S.C -> O(1) + O(1) + O(n) + O(1) + O(1) = O(4+n) == O(n)
