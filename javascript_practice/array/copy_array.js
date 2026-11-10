// Shallow copy of Array
// Points to the same memory location
const arr = [1, 2, 3, 4, 5, 6];
const newArr = arr;
newArr.splice(1, 4);

console.log("shallow copy", newArr, arr);

// Deep copy of Array
const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const newArr1 = [...arr1]; // Array destructuring
newArr1.splice(1, 4);

const newArr2 = Array.from(arr1); // Array.from
newArr2.splice(1, 4);

const newArr3 = arr1.concat(); // arr.concat()
newArr2.splice(1, 4);

console.log("deep copy array destructuring", arr1, newArr1);
console.log("deep copy Array.from()", arr1, newArr2);
console.log("deep copy arr.concat()", arr1, newArr3);

// Array.from() used to convert any array-like or iterable object

function addOne() {
	return Array.from(arguments, (x) => x + 1); // Array.from([1,2,3], (x)=> x+1); first the array like object then the mapping function
}

console.log("Array.from() with mapping function ", addOne(1, 2, 3));
console.log("Array.from()", Array.from("Subhransu"));

// How to add two array in javascript

const addArr = [...arr, ...arr1];
const addArr1 = arr.concat(arr1);
console.log("add arrays destructuring", addArr);
console.log("add arrays concat", addArr1);
