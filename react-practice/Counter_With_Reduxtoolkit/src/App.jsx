import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { counterActions } from "./store/store";

export default function App() {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const showCounter = useSelector((state) => state.showCounter);
  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggleCounter());
  };
  const increaseHandler = () => {
    dispatch(counterActions.increase(10));
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
