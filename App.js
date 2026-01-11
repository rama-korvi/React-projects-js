import React from "react";
import { createRoot } from "react-dom/client";


const element = React.createElement(
    "div",
    { id: 'parentNode' },
    React.createElement(
      "h1",
      {},
      "Starting the build the super cool app with React library!!!"
    )
  );

  const root = createRoot(document.getElementById("root"));
  root.render(element);
