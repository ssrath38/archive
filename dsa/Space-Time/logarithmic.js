// BigO(logn) - Logarithmic Time and Space Complexity
// Increase input increase time and space, Decrease input decrease time and space but after some time it starts to get constant

// Task: Binary search
// Task: Find 40 in the given array

// Linear Search
const arr1 = [2, 5, 10, 20, 40, 60];
console.time("Linear Search");
for (let i = 0; i < arr1.length; i++) {
  // T.C -> O(n) S.C -> O(1)
  if (arr1[i] == 40) {
    console.log("Found 40 at index " + i);
  }
}
console.timeEnd("Linear Search");

// Binary Search // O(logn)
const arr = [2, 5, 10, 20, 40, 60];
let start = 0;
let end = arr.length - 1;
console.time("Binary Search");
while (start <= end) {
  let mid = Math.floor((start + end) / 2);
  if (arr[mid] === 40) {
    console.log("Found 40 at index " + mid);
    break;
  } else if (arr[mid] < 40) {
    start = mid + 1;
  } else {
    end = mid - 1;
  }
}
console.timeEnd("Binary Search");
