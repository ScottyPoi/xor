import { useCallback, useContext } from "react";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import { ITreeNode } from "./types";

export interface TreeNodeProps {
  treeNode: d3.HierarchyNode<ITreeNode>;
}
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

  const handleClick = useCallback(
    (node: d3.HierarchyNode<ITreeNode>) => {
      if (node.data.id.slice(2).length === state.depth - 1) {
      } else {
        //
      }
    },
    [state.depth]
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

  return (
    <circle
      cx={nodeData.x}
      cy={nodeData.y}
      r={
        state.tooltip?.id === nodeData.id
          ? 16
          : state.selected === nodeData.id
          ? 16
          : Math.max(1, 16 - treeNode.depth*1.5)
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
      fillOpacity={selected ? 1 : 0.75}
      strokeWidth={2}
      stroke={
        selected
          ? "#000"
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
      onClick={() => handleClick(treeNode)}
    />
  );
};
interface NodeLinkProps {
  linkData: d3.HierarchyNode<ITreeNode>;
}

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
    <line
      x1={linkData.parent!.data.x}
      y1={linkData.parent!.data.y}
      x2={linkData.data.x}
      y2={linkData.data.y}
      stroke={
        linkData.data.id.endsWith("1")
          ? "#" +
            (path
              ? "0"
              : Math.min(15, Math.floor(linkData.depth * 1.75)).toString(16)) +
            (path
              ? "0"
              : Math.min(15, Math.floor(linkData.depth * 1.75)).toString(16)) +
            "f"
          : "#" +
            (path
              ? "0"
              : Math.min(15, Math.floor(linkData.depth * 1.75)).toString(16)) +
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
          ? 0.75
          : path
          ? 0.75
          : 0.5
      }
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
};

export default TreeNode;
