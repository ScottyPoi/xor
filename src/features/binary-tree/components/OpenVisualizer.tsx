import React, { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../context/BinaryTreeProvider";
import Button from "@mui/material/Button";
import { ArrowBack, Home } from "@mui/icons-material";

const OpenVisualizer: React.FC = () => {
  const { dispatch } = useContext(BinaryTreeContext);
  // Component logic here
  const open = () => {
    dispatch({ type: ActionTypes.OpenApp });
  };

  return (
    <Button
      size="large"
      variant="contained"
      style={{
        opacity: "0.4",
        fontSize: "xx-large",
        outlineWidth: "4px",
      }}
      onClick={open}
    >
      Network Distance Visualizer
    </Button>
  );
};

export const CloseVisualizer: React.FC = () => {
  const { dispatch } = useContext(BinaryTreeContext);
  // Component logic here
  const close = () => {
    dispatch({ type: ActionTypes.CloseApp });
  };

  return (
    <Button
      variant="contained"
      style={{
        opacity: "0.4",
        fontSize: "xx-large",
        fontFamily: "monospace",
        outlineWidth: "4px",
      }}
      
      onClick={close}
      startIcon={<ArrowBack/>}
      endIcon={<Home />}
    >Home</Button>
  );
};

export default OpenVisualizer;
