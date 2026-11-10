// Sort an array in ascending order

const x = [1, 4, 6, 0, -9, -5];

x.sort();

console.log("ascending sort", x);

// Sort an array in descending order

x.sort((a, b) => b - a); // if b-a gives +ve then swap if -ve don't swap

console.log("descending sort", x);

// Reverse an array

x.reverse();

console.log("reverse", x);
