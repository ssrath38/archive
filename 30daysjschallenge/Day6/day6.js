const numArr = [1, 2, 3, 4, 5];

console.log(numArr);
console.log(numArr[0]);
console.log(numArr[numArr.length - 1]);

numArr.push(6);
console.log(numArr);
console.log(numArr.push(7));
numArr.pop();
console.log(numArr);
console.log(numArr.pop());
numArr.shift();
console.log(numArr);
numArr.unshift(0);
console.log(numArr);

const mapArr = numArr.map((num) => {
  return num * 2;
});
console.log(mapArr);

const filterArr = numArr.filter((num) => {
  return num % 2 === 0;
});
console.log(filterArr);

const initalValue = 0;
const sum = numArr.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, initalValue);

console.log(sum);

for (let i = 0; i < numArr.length; i++) {
  console.log(numArr[i]);
}

numArr.forEach((num) => {
  console.log(num);
});

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}

console.log(matrix[2][0]);
