const haeding = document.getElementById("heading");
haeding.textContent = "Hi this is the day 9 of the 30 day JS challenge";

const header = document.getElementsByClassName("header")[0];
header.style.backgroundColor = "gray";

const divElement = document.createElement("div");
divElement.innerText = "Hi this is a div";
document.body.appendChild(divElement);

const navul = document.getElementById("nav-ul");
const li = document.createElement("li");
li.innerText = "Home";
navul.appendChild(li);

li.remove();
navul.removeChild(navul.lastElementChild);

const banner = document.getElementById("banner");

banner.setAttribute(
  "src",
  "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
);

banner.classList.add("hidden");

navul.classList.remove("text-blue");

const btn = document.getElementById("btn");
const para = document.getElementById("para");

btn.addEventListener("click", () => {
  para.innerText = "Hi i am ssr";
});

btn.addEventListener("mouseover", () => {
  btn.style.border = "2px solid red";
});
