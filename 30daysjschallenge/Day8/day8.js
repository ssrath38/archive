let name = "Subhransu";
let age = 25;
// String Template Literals
let person = `Hi I am ${name} and I am ${age} years old`;
console.log(person);

let multiLineStr = `This is a multiline string
This line is created using template literals`;
console.log(multiLineStr);

// Array Destructing
const arr = [1, 2, 3, 4, 5];
const [num1, num2] = arr;
console.log(num1, num2);

// Object Destructuring
const book = {
  title: "Rich dad poor dad",
  author: "Robert Kiyosaki",
};
const { title, author } = book;
console.log(title, author);

// Spread Operator
const newArr = [...arr, 6, 7, 8, 9];
console.log(newArr);

// Rest Operator
function sum(...num) {
  let sum = 0;
  for (let arg of num) {
    sum = sum + arg;
  }
  return sum;
}
console.log(sum(1, 2, 3));

// Default parameter
function product(num1, num2 = 1) {
  return num1 * num2;
}
console.log(product(3, 4));
console.log(product(3));

// Enhanched Object Literals
const obj = { name, age, sum };
//same as
// const obj = {
//   name: name,
//   age: age,
//   sum: sum,
// };
console.log(obj);

// Compound Property Name
const obj1 = {
  [name]: "SSR",
};
console.log(obj1);
