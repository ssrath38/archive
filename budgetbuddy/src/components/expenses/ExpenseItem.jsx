import "./ExpenseItem.css";
import ExpenseDate from "./ExpenseDate";
import Card from "../ui/Card";

const ExpenseItem = ({ title, date, amount }) => {
  return (
    <li>
      <Card className="expense-item">
        <ExpenseDate date={date} />
        <div className="expense-item-description">
          <h2>{title}</h2>
          <div className="expense-item-price">₹{amount}</div>
        </div>
      </Card>
    </li>
  );
};

export default ExpenseItem;
