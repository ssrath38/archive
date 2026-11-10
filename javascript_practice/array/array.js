// How do you create an empty array in JS
const arr = [1, 2, 3, 4, 5];
console.log("Original Array", arr);
const arr1 = new Array(3, 2, 3, 4, 5, 1);
console.log("type of array", typeof arr);

const arr2 = Array.of(3, 2, 2); // Similar to Array constructot but doesnt treat single numeric value special
console.log("Array.of()", arr2);

// How do you access the first and last elements of an array

const firstElement = arr[0];
const lastElement = arr[arr.length - 1];
const lastElement1 = arr[-1];

// Acess element of any index position

console.log("arr.at()", arr.at(3));

// Adding element to the array

arr.push(6); // to last position O(N)
console.log("push()", arr);
arr.unshift(7); // to first postion
console.log("unshift()", arr);
arr.splice(3, 0, 10); // to any position
console.log("splice() add", arr);

// Removing  element from the array
arr3 = [1, 2, 3, 4];
console.log("new array for delete using length", arr3);
arr3.length = 2; // Only first 2 elements remain elements are deleted
console.log("delete using length", arr3);
arr3.length = 10; // After all elements empty elements added upto the total elements counts 10
console.log("add empty element", arr3);
arr3.length = 0; // All elements are deleted
console.log("empty array", arr3);

let popedElement = arr.pop(); // from last position
console.log("popedElement", popedElement);
console.log("pop()", arr);
let shiftedElement = arr.shift(); // from first position
console.log("shiftedElement", shiftedElement);
console.log("shift()", arr);
const deletedElements = arr.splice(2, 3); // from any position
console.log("deletedElements", deletedElements); // returns deleted elements in an array if no element deleted then return empty array
console.log("splice() remove", arr);

// update array element

arr.splice(2, 3, 100, 200);
console.log("splice() update", arr);

// How do you loop through an array in Javascript

for (let i = 0; i < arr.length; i++) {
	console.log("for", arr[i]);
}

arr.forEach((ele) => {
	console.log("forEach()", ele);
});

for (let x of arr) {
	console.log("for of", x);
}

// slice vs splice
// slice = sub array
// splice = add, remove, update element of an array
const subArr = arr.slice(1, 4);
console.log("slice", subArr);

// arr.splice(start index, how many to delete, rest adding element)
