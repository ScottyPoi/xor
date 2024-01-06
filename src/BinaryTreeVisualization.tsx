// filename: BinaryTreeVisualization.tsx
import React, { useRef, useMemo, useEffect } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";
import { generateTreeData } from "./treeUtils";
import { ITreeNode } from "./types";
import { useWindowSize } from "./useWindowSize";
import TreeNode, { NodeLink } from "./TreeNode";
import InfoContainer from "./InfoContainer";
import HeatMap from "./HeatMap";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import TreeMsg from "./TreeMsg";

const BinaryTreeVisualization: React.FC = () => {
  const { state, dispatch } = React.useContext(BinaryTreeContext);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { width, height } = useWindowSize(); // Use our custom hook

  useEffect(() => {
    dispatch({
      type: ActionTypes.SetCenter,
      payload: {
        x: (width - 400) / 2 + 400,
        y: height * 0.6,
      },
    });
  }, [width, height, state.depth, dispatch]);

  // useMemo to memoize the tree data based on the depth and dimensions
  const treeData = useMemo(
    () => generateTreeData(state.depth, width, state.center),
    [state.depth, state.center, width]
  );

  const root = d3.hierarchy(treeData);
  const nodes = root.descendants();
  const links = nodes.slice(1);

  const firstNodeRef = useRef<d3.HierarchyNode<ITreeNode> | null>(null);

  useEffect(() => {
    if (firstNodeRef.current) {
      dispatch({
        type: ActionTypes.SetCenter,
        payload: {
          x: firstNodeRef.current.data.x,
          y: firstNodeRef.current.data.y,
        },
      });
    }
  }, [dispatch]);

  // Store a reference to the first node
  useEffect(() => {
    if (nodes.length > 0) {
      firstNodeRef.current = nodes[0];
    }
  }, [nodes]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <InfoContainer />
      <div className="tree-container">
        <svg ref={svgRef} className="tree-svg">
          {links.map((linkData, index) => (
            <NodeLink key={index} linkData={linkData} />
          ))}
          {state.selected !== "" && nodes.length >= 3 && (
            <HeatMap nodes={nodes} />
          )}
          {nodes.map((nodeData) => (
            <TreeNode key={nodeData.id} treeNode={nodeData} />
          ))}
        </svg>
      </div>
      <div>
        <TreeMsg />
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
