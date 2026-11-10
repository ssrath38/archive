x = [1, 4, 6, -9, -7, 3, 0];

// Map
const newMapArray = x.map((element, index, currArr) => element + 2);
console.log("map", newMapArray);

// Filter

const positiveNumbers = x.filter((element, index, currArr) => element >= 0);
console.log("filter", positiveNumbers);

// Reduce

const sumOfArray = x.reduce((accumulator, element, index, currArr) => {
	return accumulator + element;
}, 0);
// Here 0 is the intial value of accumulator
// if initial value is not specified accumulator = firstvalue and function starts from 2nd value
console.log("reduce", sumOfArray);

// reduceRight()

// it works same as reduce() but in the opposite direction.
// the method starts at the last element and travels backwords to the first element

// every
// caution: every method on empty array will result always true for any condition
const checksEvery = x.every((element, index, currArr) => element > 0);
console.log("every", checksEvery);

// some

const checksSome = x.some((element, index, currArr) => element > 0);
console.log("some", checksSome);

// Flat

const y = [1, 2, [4, 6, [5, 9]], 8, 9];
const flatArr = y.flat(2);
// inside flat we need to specify the depth. if we dont specify any falue it will take depth as 1
console.log("flat", flatArr);

// flatMap

const z = ["my", " ", "name", " ", "is", " ", "Subhransu Sekhar Rath"];
const flatMapArr = z.flatMap((element) => element.split(" "));
console.log("flatMap", flatMapArr);

// filter vs find
// find returns the first element which pass the condition
// filter returns an array containg all elements which are passed in the condition

const findElement = x.find((element, index, currArr) => element > 3);
console.log("find", findElement);

// findIndex

const findElementIndex = x.findIndex(
	(element, index, currArr) => element === -7
);
console.log("findIndex", findElementIndex);
