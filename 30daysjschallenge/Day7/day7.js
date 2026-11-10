const book = {
  title: "abc",
  author: "Subhransu",
  year: 1999,
};

const book1 = {
  title: "cde",
  author: "SSR",
  year: 2018,
};
const book2 = {
  title: "fgh",
  author: "SSRath",
  year: 2024,
};

console.log(book);

console.log(book.title);
console.log(book.author);

book.detail = function () {
  return this.title + this.author;
};

console.log(book.detail());

book.updateYear = function (year) {
  this.year = year;
};
book.updateYear(2000);
console.log(book);

const library = { name: "abc-lib", books: [book, book1, book2] };

console.log(library);
console.log(library.name);
library.books.forEach((book) => {
  console.log(book.title);
});

book.bookDetail = function () {
  return this.title + this.year;
};

console.log(book.bookDetail());

for (let property in book) {
  console.log(`${property}: ${book[property]}`);
}

console.log(Object.keys(book));
console.log(Object.values(book));
