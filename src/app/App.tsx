import "./App.css";
import Box from "@mui/material/Box";
import ErrorBoundary from "../components/ErrorBoundary";
import BinaryTreeProvider from "../features/binary-tree/context/BinaryTreeProvider";
import Layout from "./Layout";

function App() {
  return (
    <Box
      className="App"
      sx={{ minHeight: "100dvh", overflow: "hidden" }}
    >
      <ErrorBoundary>
        <BinaryTreeProvider>
          <Layout />
        </BinaryTreeProvider>
      </ErrorBoundary>
    </Box>
  );
}

export default App;
