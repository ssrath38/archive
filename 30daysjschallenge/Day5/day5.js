function isEvenOrOdd(num) {
  if (num) {
    if (num & 1) {
      console.log("Odd");
    } else {
      console.log("Even");
    }
  } else {
    console.log("Enter a correct Number");
  }
}

function square(num) {
  return num ** 2;
}

const max = function (num1, num2) {
  if (num1 > num2) {
    console.log(`${num1} is the maximum`);
  } else {
    console.log(`${num2} is the maximum`);
  }
};

const strConcat = function (str1, str2) {
  return str1 + str2;
};

const sunOfTwoNum = (num1, num2) => {
  return num1 + num2;
};

const searchChar = (str) => {
  return str.includes("b");
};

function product(num1, num2 = 5) {
  return num1 * num2;
}

function greet(name, age = 25) {
  return `Hello ${name} you are ${age}`;
}

function hof(num, fn) {
  while (num > 0) {
    fn(num);
    num--;
  }
}

function hof1(fn1, fn2, value) {
  let result = fn1(value);
  fn2(result);
}

isEvenOrOdd(1);
let result = square(5);
console.log(result);
max(1, 2);
console.log(strConcat("Hello", "World"));
console.log(sunOfTwoNum(38, 67));
console.log(searchChar("Suhransu"));
console.log(product(6, 7));
console.log(product(6));
console.log(greet("Subhransu"));
console.log(greet("Subhransu", 21));
hof(5, function (num) {
  console.log(`Hello ${num}`);
});
// hof(5, () => {
//   console.log("Hello");
// });

hof1(
  (num) => {
    return num + 10;
  },
  (num) => {
    console.log(`The result is ${num}`);
  },
  10
);
