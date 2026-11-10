import "./App.css";
import { useSelector, useDispatch } from "react-redux";

export default function App() {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const showCounter = useSelector((state) => state.showCounter);
  const incrementHandler = () => {
    dispatch({ type: "increment" });
  };

  const decrementHandler = () => {
    dispatch({ type: "decrement" });
  };

  const toggleCounterHandler = () => {
    dispatch({ type: "togglecounter" });
  };
  const increaseHandler = () => {
    dispatch({ type: "increase", amount: 5 });
  };
  return (
    <main className="container">
      <h1>Counter</h1>
      {showCounter && <h2>{counter}</h2>}
      <button onClick={incrementHandler}>Increment</button>
      <button onClick={decrementHandler}>Decrement</button>
      <button onClick={increaseHandler}>Increase By 5</button>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
}
