import React from "react";
import "./App.css";
import ErrorBoundary from "./ErrorBoundary";

import BinaryTreeVisualization from "./BinaryTreeVisualization";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <BinaryTreeVisualization />
      </ErrorBoundary>
    </div>
  );
}

export default App;
