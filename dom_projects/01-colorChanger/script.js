const grayBtn = document.getElementById("gray");
const whiteBtn = document.getElementById("white");
const blueBtn = document.getElementById("blue");
const yellowBtn = document.getElementById("yellow");

grayBtn.addEventListener("click", () => {
  document.getElementsByTagName("body")[0].style.backgroundColor = "gray";
});
whiteBtn.addEventListener("click", () => {
  document.getElementsByTagName("body")[0].style.backgroundColor = "white";
});
blueBtn.addEventListener("click", () => {
  document.getElementsByTagName("body")[0].style.backgroundColor = "blue";
});
yellowBtn.addEventListener("click", () => {
  document.getElementsByTagName("body")[0].style.backgroundColor = "yellow";
});
