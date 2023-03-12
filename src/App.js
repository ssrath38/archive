import React from "react";
import Expenses from "./components/Expenses";

function App() {
  let expenses = [
    {
      id: "e1",
      title: "Scholl Fee",
      amount: "₹1000",
      date: new Date(2022, 5, 12)
    },
    {
      id: "e2",
      title: "Books",
      amount: "₹1500",
      date: new Date(2022, 6, 12)
    },
    {
      id: "e3",
      title: "Car",
      amount: "₹2000000",
      date: new Date(2022, 7, 12)
    },
    {
      id: "e4",
      title: "Bike",
      amount: "₹150000",
      date: new Date(2022, 8, 12)
    }
  ];

  return (
    <div className="App">
      <Expenses item={expenses} />
    </div>
  );
}

export default App;
