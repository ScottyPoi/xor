import React from "react";
import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import BinaryTreeProvider from "./BinaryTreeProvider";
import BinaryTreeVisualization from "./BinaryTreeVisualization";
import "./BinaryTreeVisualization.css";

import Layout from "./Layout";

function App() {
  return (
    <div style={{height: '100%', overflow: 'hidden'}} className="App">
      <ErrorBoundary>
        <BinaryTreeProvider>
          <Layout />
        </BinaryTreeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
