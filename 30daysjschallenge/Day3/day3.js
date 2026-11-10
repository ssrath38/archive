function isPositive(num) {
  if (num < 0) {
    console.log(`${num} is negative`);
  } else if (num >= 0) {
    console.log(`${num} is positive`);
  } else {
    console.log(`${num} is zero`);
  }
}

function canVote(age) {
  if (age >= 18) {
    console.log(`Person is Eligible to vote`);
  } else {
    console.log(`Person is not Eligible to vote`);
  }
}

function largestNumber(a, b, c) {
  if (a > b) {
    if (a > c) {
      console.log(`${a} is the largest number`);
    } else {
      console.log(`${c} is the largest number`);
    }
  } else if (b > c) {
    console.log(`${b} is the largest number`);
  } else {
    console.log(`${c} is the largest number`);
  }
}

function whichDay(day) {
  let dayName = "";
  switch (day) {
    case 1:
      dayName = "Sunday";
      break;
    case 2:
      dayName = "Monday";
      break;
    case 3:
      dayName = "Tuesday";
      break;
    case 4:
      dayName = "Wednesday";
      break;
    case 5:
      dayName = "Thursday";
      break;
    case 6:
      dayName = "Friday";
      break;
    case 7:
      dayName = "Saturday";
      break;
    default:
      console.log("Give numbers between 1 to 7");
      return;
  }

  console.log(`The Day is ${dayName}`);
}

function whichGrade(score) {
  let grade = "";
  switch (true) {
    case score >= 90:
      grade = "A";
      break;
    case score >= 80:
      grade = "B";
      break;
    case score >= 70:
      grade = "C";
      break;
    case score >= 60:
      grade = "D";
      break;
    case score >= 50:
      grade = "E";
      break;
    default:
      grade = "F";
  }

  console.log(`Your grade is ${grade}`);
}

function isEven(num) {
  let result = num & 1 ? "odd" : "even";

  console.log(result);
}
function isLeapYear(year) {
  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    console.log(`${year} is a leap year`);
  } else {
    console.log(`${year} is not a leap year`);
  }
}

isPositive(-7);
canVote(17);
largestNumber(1, 89, 3);
whichDay(8);
whichGrade(77);
isEven(3);
isLeapYear(2016);
