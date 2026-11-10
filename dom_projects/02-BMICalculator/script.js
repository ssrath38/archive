const result = document.getElementById("result");

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  if (weight && height) {
    const bmi = (weight / height / height) * 10000;
    const roundedBMI = bmi.toFixed(2);
    if (bmi < 18.6) {
      result.innerText = `Your BMI is ${roundedBMI} and You are underweight`;
    } else if (bmi < 25) {
      result.innerText = `Your BMI is ${roundedBMI} and You have a normal weight`;
    } else if (bmi < 30) {
      result.innerText = `Your BMI is ${roundedBMI} and You are overweight`;
    } else {
      result.innerText = `Your BMI is ${roundedBMI} and You are obese`;
    }
  } else {
    result.innerText = "Please enter both height and weight";
  }
});
