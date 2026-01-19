import { useCallback, useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "../context/BinaryTreeProvider";
import { ITreeNode, NodeLinkProps, TreeNodeProps } from "../types";
import { calculateDistance } from "../utils/treeUtils";

const TreeNode = ({ treeNode }: TreeNodeProps) => {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const handleMouseOver = useCallback(
    (node: ITreeNode) => {
      dispatch({
        type: ActionTypes.SetTooltip,
        payload: { x: node.x, y: node.y, id: node.id },
      });
    },
    [dispatch]
  );


  const handleMouseOut = useCallback(() => {
    console.log("mouseout");
    dispatch({ type: ActionTypes.SetTooltip, payload: null });
  }, [dispatch]);

  const handleDoubleClick = useCallback(
    (node: d3.HierarchyNode<ITreeNode>) => {
      if (node.depth === state.depth - 1) {
        dispatch({ type: ActionTypes.SetSelected, payload: node.data.id });
      }
    },
    [dispatch, state.depth]
  );
  const nodeData = treeNode.data;
  const hovered = state.tooltip?.id === treeNode.data.id;
  const selected = state.selected === treeNode.data.id;
  const hexary = state.depth > 4 && nodeData.id.slice(2).length === 4;
  const distance = calculateDistance(state.selected, nodeData.id);
  const inRadius = BigInt(distance) < state.radiusN;

  return (
    <circle
      cx={nodeData.x}
      cy={nodeData.y}
      r={
        state.tooltip?.id === nodeData.id
          ? 16
          : state.selected === nodeData.id
          ? 16
          : Math.max(1, 16 - treeNode.depth * 1.5)
      } // Specify the radius of the circle
      fill={
        // "#aaf"
        selected
          ? nodeData.id.endsWith("1")
            ? "#00f"
            : "#0f0"
          : hovered
          ? nodeData.id.endsWith("1")
            ? "#55f"
            : "#5f5"
          : nodeData.id.endsWith("1")
          ? "#99f"
          : "#9f9"
      } // Specify the fill color of the circle
      fillOpacity={selected || hovered || hexary ? 1 : 0.75}
      strokeWidth={selected ? 4 : inRadius ? 3 : 2}
      stroke={
        selected
          ? "yellow"
          : inRadius
          ? "yellow"
          : hexary
          ? "#FFF"
          : hovered
          ? nodeData.id.endsWith("1")
            ? "#00f"
            : "#0f0"
          : selected
          ? nodeData.id.endsWith("1")
            ? "#00f"
            : "#0f0"
          : nodeData.id.endsWith("1")
          ? "#88f"
          : "#8f8"
      } // Specify the stroke color of the circle
      onMouseOver={() => handleMouseOver(nodeData)}
      onMouseOut={handleMouseOut}
      onDoubleClick={() => handleDoubleClick(treeNode)}
      onClick={() => handleDoubleClick(treeNode)}
    />
  );
};


export const NodeLink = ({ linkData }: NodeLinkProps) => {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const path = state.selected.startsWith(linkData.data.id);

  const isLeafLink = !linkData.children;
  const handleMouseOver = () => {
    if (!isLeafLink) return;
    dispatch({
      type: ActionTypes.SetTooltip,
      payload: { x: linkData.data.x, y: linkData.data.y, id: linkData.data.id },
    });
  };
  const handleMouseOut = () => {
    if (!isLeafLink) return;
    dispatch({ type: ActionTypes.SetTooltip, payload: null });
  };

  return (
    <>
      <line
        x1={linkData.parent!.data.x}
        y1={linkData.parent!.data.y}
        x2={linkData.data.x}
        y2={linkData.data.y}
        stroke={
          linkData.data.id.endsWith("1")
            ? "#" +
              (path ? "0" : "0") +
              (path
                ? "0"
                : Math.min(15, Math.floor(linkData.depth)).toString(16)) +
              "F"
            : "#" +
              (path
                ? "0"
                : Math.min(15, Math.floor(linkData.depth * 1.75)).toString(
                    16
                  )) +
              "f" +
              (path
                ? "0"
                : Math.min(15, Math.floor(linkData.depth * 1.75)).toString(16))
        }
        strokeWidth={Math.max(1, 32 - linkData.depth * 2)}
        strokeOpacity={
          state.selected
            ? 1
            : state.tooltip?.id === linkData.data.id
            ? 0.8
            : path
            ? 0.8
            : 0.7
        }
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
    </>
  );
};
export const HexaryLink = ({ linkData }: NodeLinkProps) => {
  const { state } = useContext(BinaryTreeContext);
  return (
    <line
      x1={state.center.x}
      y1={state.center.y}
      x2={linkData.data.x}
      y2={linkData.data.y}
      stroke="white"
      strokeWidth={12}
      strokeOpacity={0.5}
      // onMouseOver={handleMouseOver}
      // onMouseOut={handleMouseOut}
    />
  );
};
export const HexaryLink2 = ({ linkData }: NodeLinkProps) => {
  useContext(BinaryTreeContext);

  const leafParent = linkData.ancestors()[4];

  return (
    <line
      x1={leafParent!.data.x}
      y1={leafParent!.data.y}
      x2={linkData.data.x}
      y2={linkData.data.y}
      stroke="white"
      strokeWidth={1}
      strokeOpacity={1}
      // onMouseOver={handleMouseOver}
      // onMouseOut={handleMouseOut}
    />
  );
};

export default TreeNode;
