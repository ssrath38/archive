for (let i = 1; i <= 10; i++) {
  console.log(i);
}

for (let i = 1; i <= 10; i++) {
  console.log(`5 X ${i} = ${5 * i}`);
}

let num = 1;
let sum = 0;
while (num <= 10) {
  sum += num;
  num++;
}
console.log(sum);

let num1 = 10;
while (num1 > 0) {
  console.log(num1);
  num1--;
}

let num3 = 1;
do {
  console.log(num3);
  num3++;
} while (num3 <= 5);

let i = 1;
let fact = 1;
let num4 = 5;
do {
  fact = fact * i;
  i++;
} while (i <= num4);

let str = "";
for (let i = 0; i < 5; i++) {
  for (let j = 0; j <= i; j++) {
    str += "*";
  }
  str += "\n";
}
console.log(str);

for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    continue;
  }
  console.log(i);
}

for (let i = 1; i <= 10; i++) {
  if (i === 7) {
    break;
  }
  console.log(i);
}
