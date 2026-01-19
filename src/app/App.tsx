import "./App.css";
import ErrorBoundary from "../components/ErrorBoundary";
import BinaryTreeProvider from "../features/binary-tree/context/BinaryTreeProvider";
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
