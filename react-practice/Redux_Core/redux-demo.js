const redux = require("redux");

const counterReducer = (state = { counter: 0 }, action) => {
  // if state has no inital value then the script will throw error.
  return {
    counter: state.counter + 1,
  };
};

const store = redux.createStore(counterReducer);
// When this line is executed, the Redux store calls the counterReducer with undefined state and an internal action to initialize the state. In your case, since you provided a default value for the state ({ counter: 0 }), the state is set to { counter: 0 }. Then, the reducer returns { counter: 1 } because of the increment logic:

console.log(store.getState()); // Here the console will print {counter:1}

const counterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState); // No value will print in console. if there will be no action dispatched
};

store.subscribe(counterSubscriber);
// This line sets up the counterSubscriber to be called whenever an action is dispatched that results in a state change. However, this subscription is registered after the initial state setup.
// During the store creation, the initial state is set to { counter: 1 } due to the increment logic in the reducer. However, no subscription callback is called during this initialization phase. This is why the counterSubscriber is not called initially.

store.dispatch({ type: "increment" });
// When this action is dispatched, the counterReducer is called with the current state ({ counter: 1 }) and the action { type: "increment" }. The state becomes { counter: 2 } due to the increment logic:
// Since the state has changed, the subscribed counterSubscriber is called: and the console.log(latestState) will print the current state which is {counter:2}
