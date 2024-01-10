// filename: BinaryTreeVisualization.tsx
import React, { useRef, useMemo, useEffect, useCallback } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";
import { generateTreeData } from "./treeUtils";
import { ITreeNode } from "./types";
import { useWindowSize } from "./useWindowSize";
import TreeNode, { HexaryLink, HexaryLink2, NodeLink } from "./TreeNode";
import InfoContainer from "./InfoContainer";
import HeatMap from "./HeatMap";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import TreeMsg from "./TreeMsg";
import { isVisible } from "@testing-library/user-event/dist/utils";
import { ChangeDepth } from "./DepthButtons";
import { Button } from "@mui/material";
import { CloseVisualizer } from "./OpenVisualizer";

const BinaryTreeVisualization: React.FC = () => {
  const { state, dispatch } = React.useContext(BinaryTreeContext);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = React.useState(0); // Use our custom hook
  const [leftVisible, setLeftVisible] = React.useState(true);
  const [rightVisible, setRightVisible] = React.useState(true);
  const toggleLeftVisibility = () => setLeftVisible(!leftVisible);
  const toggleRightVisibility = () => setRightVisible(!rightVisible);
  const toggleBinaryNodes = () => {
    dispatch({
      type: state.binaryNodesVisible
        ? ActionTypes.HideBinaryNodes
        : ActionTypes.ShowBinaryNodes,
    });
  };
  const toggleBinaryLinks = () => {
    dispatch({
      type: state.binaryLinksVisible
        ? ActionTypes.HideBinaryLinks
        : ActionTypes.ShowBinaryLinks,
    });
  };
  const toggleHexaryNodes = () => {
    dispatch({
      type: state.hexaryNodesVisible
        ? ActionTypes.HideHexaryNodes
        : ActionTypes.ShowHexaryNodes,
    });
  };
  const toggleHexaryLinks = () => {
    dispatch({
      type: state.hexaryLinksVisible
        ? ActionTypes.HideHexaryLinks
        : ActionTypes.ShowHexaryLinks,
    });
  };
  const toggleHeatMap = () => {
    dispatch({
      type: state.heatVisible ? ActionTypes.HideHeat : ActionTypes.ShowHeat,
    });
  };
  const update = useCallback(() => {
    if (svgRef.current) {
      const svg = d3.select(".tree-svg").node() as any;
      const c = svg!.getBoundingClientRect();
      const log: Record<string, any> = {
        widthS: svg?.width.baseVal.value,
        widthC: c!.width,
        heightC: c!.height,
        widthMath: c!.right - c!.left,
        leftS: svg!.clientLeft,
        leftC: c!.left,
        rightC: c!.right,
        centerx: c.width / 2 + c!.left,
        windowCenterX: window.innerWidth / 2,
        // c
      };

      Object.keys(log).forEach((key) => console.log(key, log[key]));

      const center = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.65,
      };

      dispatch({
        type: ActionTypes.SetCenter,
        payload: center,
      });
      setWidth(window.innerWidth);
    }
  }, [dispatch]);
  useEffect(() => {
    update();
    window.onresize = () => {
      update();
    };
  }, [state, update]);

  useEffect(() => {
    update();
  }, [leftVisible, rightVisible, update]);

  // useMemo to memoize the tree data based on the depth and dimensions
  const treeData = useMemo(
    () => generateTreeData(state.depth, width, state.center),
    [state.depth, state.center, width]
  );

  const root = d3.hierarchy(treeData);
  const nodes = root.descendants();
  const links = nodes.slice(1);

  const firstNodeRef = useRef<d3.HierarchyNode<ITreeNode> | null>(null);

  // useEffect(() => {
  //   if (firstNodeRef.current) {
  //     dispatch({
  //       type: ActionTypes.SetCenter,
  //       payload: {
  //         x: firstNodeRef.current.data.x,
  //         y: firstNodeRef.current.data.y,
  //       },
  //     });
  //   }
  // }, [dispatch]);

  // Store a reference to the first node
  useEffect(() => {
    if (nodes.length > 0) {
      firstNodeRef.current = nodes[0];
    }
  }, [nodes]);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }
    const selection = d3.select(svgRef.current);
    const zoom = d3.zoom();
    selection.call(zoom as any);

    // Stop wheel event propagation
    selection
      .node()!
      .addEventListener("wheel", (event) => event.stopPropagation(), true);
    selection
      .node()!
      .addEventListener("mousemove", (event) => event.stopPropagation(), true);

    zoom.on("zoom", (e) => {
      const { transform, sourceEvent } = e;
      if (
        sourceEvent === null ||
        (sourceEvent.type !== "wheel" && sourceEvent.type !== "mousemove")
      ) {
        console.log("got zoom", sourceEvent);
        selection.transition().attr("transform", transform);
      }
    });

    window.onkeydown = (e) => {
      if (e.ctrlKey) {
        const node = selection.node()!;
        switch (e.key) {
          case "ArrowUp":
            // zoom in
            const newScaleIn = 1.25;
            zoom.scaleBy(selection as any, newScaleIn);
            const inTransform = d3.zoomTransform(node);
            zoom.translateBy(selection as any, -inTransform.x, -inTransform.y);
            break;
          case "ArrowDown":
            //zoom out
            const newScaleOut = 0.8;
            zoom.scaleBy(selection as any, newScaleOut);
            const outTransform = d3.zoomTransform(node);
            zoom.translateBy(
              selection as any,
              -outTransform.x,
              -outTransform.y
            );

            break;
        }
      } else if (e.altKey) {
        switch (e.key) {
          case "ArrowLeft":
            zoom.translateBy(selection as any, -100, 0);
            break;
          case "ArrowRight":
            zoom.translateBy(selection as any, 100, 0);
            break;
          case "ArrowUp":
            zoom.translateBy(selection as any, 0, -100);
            break;
          case "ArrowDown":
            zoom.translateBy(selection as any, 0, 100);
            break;
        }
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100vh",
        width: "100%",
      }}
    >
      {" "}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          height: "min-content",
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color={state.hexaryLinksVisible ? "primary" : "error"}
          onClick={toggleHexaryLinks}
          disabled={state.depth < 5}
        >
          {state.hexaryLinksVisible ? "Hide" : "Show"} Hexary Links
        </Button>
        <Button
          variant="contained"
          onClick={toggleBinaryLinks}
          color={state.binaryLinksVisible ? "primary" : "error"}
        >
        {state.binaryLinksVisible ? "Hide" : "Show"}  Binary Links 
        </Button>
        <Button
          variant="contained"
          onClick={toggleBinaryNodes}
          color={state.binaryNodesVisible ? "primary" : "error"}
        >
         {state.binaryNodesVisible ? "Hide" : "Show"} Binary Nodes 
        </Button>
        <CloseVisualizer />
      </div>
      {/* <div>
        <button onClick={toggleLeftVisibility}>
          {leftVisible ? "Hide" : "Show Controls"}
        </button>
        {leftVisible && <InfoContainer />}
      </div> */}
      <div className="tree-container">
        <svg ref={svgRef} className="tree-svg">
          {state.binaryLinksVisible &&
            links.map((linkData, index) => (
              <NodeLink key={index} linkData={linkData} />
            ))}
          {state.hexaryLinksVisible &&
            links.map((linkData, index) =>
              linkData.data.id.length === 6 ? (
                <HexaryLink key={index} linkData={linkData} />
              ) : linkData.data.id.length === 10 ? (
                <HexaryLink2 key={index} linkData={linkData} />
              ) : (
                <></>
              )
            )}
          {state.selected !== "" && nodes.length >= 3 && (
            <HeatMap nodes={nodes} />
          )}
          {nodes.map((nodeData) => {
            return state.binaryNodesVisible ? (
              <TreeNode key={nodeData.id} treeNode={nodeData} />
            ) : state.hexaryNodesVisible ? (
              nodeData.data.id.slice(2).length % 4 === 0 ? (
                <TreeNode key={nodeData.id} treeNode={nodeData} />
              ) : (
                <></>
              )
            ) : nodeData.data.id.slice(2).length === 0 ? (
              <TreeNode key={nodeData.id} treeNode={nodeData} />
            ) : nodeData.data.id.slice(2).length === state.depth - 1 ? (
              <TreeNode key={nodeData.id} treeNode={nodeData} />
            ) : (
              <></>
            );
          })}
        </svg>
      </div>
      {/* <div>
        <button onClick={toggleRightVisibility}>
          {rightVisible ? "Hide" : "Show Controls"}
        </button>
        {rightVisible && <TreeMsg />}
      </div> */}
    </div>
  );
};

export default BinaryTreeVisualization;
