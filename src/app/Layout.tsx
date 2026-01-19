import { useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../features/binary-tree/context/BinaryTreeProvider";
import BinaryTreeVisualization from "../features/binary-tree/components/BinaryTreeVisualization";
import { ChangeDepth } from "../features/binary-tree/components/DepthButtons";
import InfoContainer from "../features/binary-tree/components/InfoContainer";
import TreeMsg from "../features/binary-tree/components/TreeMsg";
import { ChangeRadius } from "../features/binary-tree/components/RadiusButtons";
import { SwipeLeftSharp, SwipeRightSharp } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Home } from "../features/binary-tree/components/Home";
import Links from "../components/Links";

export default function Layout() {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const incDepth = () => {
    dispatch({
      type: ActionTypes.IncDepth,
    });
  };
  const decDepth = () => {
    dispatch({
      type: ActionTypes.DecDepth,
    });
  };
  return (
    <div style={{ width: "100%" }}>
      {state.home ? (
        <Home />
      ) : (
        <>
          <BinaryTreeVisualization />
          <div>
            <InfoContainer />
          </div>
          <div className="tree-msg">
            <Box
              display={"flex"}
              style={{ width: "100%" }}
              justifyContent={"space-between"}
            >
              <Button
                variant="contained"
                color="info"
                disabled={state.depth < 1}
                onClick={decDepth}
                endIcon={<SwipeLeftSharp />}
              >
                Prev Tree
              </Button>
              <Button
                variant="contained"
                color="info"
                disabled={state.depth > 12}
                onClick={incDepth}
                startIcon={<SwipeRightSharp />}
              >
                Next Tree
              </Button>
            </Box>
            <TreeMsg />
          </div>
          <div
            style={{
              width: "100%",
              alignItems: "center",

              display: "flex",
              flexDirection: "column",
              position: "fixed",
              bottom: 15,
            }}
          >
            <ChangeDepth />
            {state.depth > 2 && <ChangeRadius />}
          </div>
        </>
      )}
      <Links />
    </div>
  );
}

