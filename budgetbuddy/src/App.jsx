import Expenses from "./components/expenses/Expenses";
import NewExpense from "./components/newexpense/NewExpense";
import { useState } from "react";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "Television",
    amount: "35000",
    date: new Date(2021, 2, 28)
  },
  {
    id: "e2",
    title: "Bike",
    amount: "112000",
    date: new Date(2022, 9, 15)
  },
  {
    id: "e3",
    title: "Mobile",
    amount: "20000",
    date: new Date(2022, 2, 28)
  },
  {
    id: "e4",
    title: "House",
    amount: "3000000",
    date: new Date(2023, 1, 25)
  }
];

const App = () => {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);
  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => {
      return [expense, ...prevExpenses];
    });
  };
  return (
    <>
      <main>
        <NewExpense onAddExpense={addExpenseHandler} />
        <Expenses items={expenses} />
      </main>
    </>
  );
};

export default App;
