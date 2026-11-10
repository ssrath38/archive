let decimalNum = 10;
// Approach -> 1
// const binaryArr = [];

// while (decimalNum !== 0) {
//   binaryArr.push(decimalNum % 2);
//   decimalNum = Math.floor(decimalNum / 2);
// }

// let binaryNum = Number(binaryArr.reverse().join(""));
// console.log(binaryNum);

// Approach -> 2

// let binaryNum = "";
// while (decimalNum !== 0) {
//   let rem = decimalNum % 2;
//   decimalNum = Math.floor(decimalNum / 2);
//   binaryNum = rem + binaryNum;
// }

// console.log(+binaryNum);

// Approach -> 3
let binaryNum = "";
while (decimalNum !== 0) {
  binaryNum = (decimalNum & 1) + binaryNum;
  decimalNum = decimalNum >> 1;
}
console.log(binaryNum);
