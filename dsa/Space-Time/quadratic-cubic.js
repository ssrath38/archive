// BigO(n^2) - Quadratic Time and Space Complexity

// Task: Find the pairs whose sum is = target (10)

const arr = [3, 4, 5, 10, 0, 5, 6, 25, 30];
const target = 10;

for (let i = 0; i < arr.length; i++) {
  // T.C -> O(n)
  for (let j = i + 1; j < arr.length; j++) {
    // T.C -> O(n)
    if (arr[i] + arr[j] === target) {
      console.log("Pair: " + arr[i] + " " + arr[j]);
    }
  }
}

// T.C -> O(n) * O(n) = O(n^2)
