// Bitwise Operators -> & | ^ ~

let a = 3;
let b = 4;

console.log("a & b: " + (a & b));
console.log("a | b: " + (a | b));
console.log("~a: " + ~a);
console.log("a ^ b: " + (a ^ b));

// Odd or Even Appraoch -> 1
console.time("old method");
let number = 11;
if (number % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}
console.timeEnd("old method");

// Odd or Even Approach -> 2
console.time("bitwise method");
let number1 = 11;
if ((number1 & 1) === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}
console.timeEnd("bitwise method");
