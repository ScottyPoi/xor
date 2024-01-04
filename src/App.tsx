import React from "react";
import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import BinaryTreeProvider from "./BinaryTreeProvider";
import BinaryTreeVisualization from "./BinaryTreeVisualization";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <BinaryTreeProvider>
          <BinaryTreeVisualization />
        </BinaryTreeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
