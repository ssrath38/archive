let binaryNum = 1010;
let decimal = 0;
for (let i = 0; binaryNum !== 0; i++) {
  if (binaryNum % 10 === 1) {
    decimal = decimal + Math.pow(2, i);
  }
  binaryNum = Math.floor(binaryNum / 10);
}
console.log(decimal);
