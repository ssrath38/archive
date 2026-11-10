import React from "react";
import ReactDOM from "react-dom/client"

const heading = React.createElement(
  "h2",
  { id: "head2", key: "1" },
  "Subhransu"
);
const para = React.createElement(
  "p",
  { id: "p1", key: "2" },
  "Subhransu Sekhar rath"
);
const container = React.createElement("div", { id: "container" }, [
  heading,
  para
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(container);
