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
      sx={{
        opacity: 0.4,
        fontSize: "xx-large",
        outlineWidth: 4,
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
      sx={{
        opacity: 0.4,
        fontSize: "xx-large",
        fontFamily: "monospace",
        outlineWidth: 4,
      }}
      onClick={close}
      startIcon={<ArrowBack />}
      endIcon={<Home />}
    >
      Home
    </Button>
  );
};

export default OpenVisualizer;
