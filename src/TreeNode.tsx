import { ITreeNode } from "./types";

export interface NodeProps {
  treeNode: d3.HierarchyNode<ITreeNode>;
  handleMouseOver: (nodeData: ITreeNode) => void;
  handleMouseOut: () => void;
  handleDoubleClick: (node: d3.HierarchyNode<ITreeNode>) => void;
  handleClick: (node: d3.HierarchyNode<ITreeNode>) => void;
  selected: boolean;
  tooltip: boolean;
}
const TreeNode = ({
  treeNode,
  handleMouseOver,
  handleMouseOut,
  handleClick,
  handleDoubleClick,
  selected = false,
  tooltip = false,
}: NodeProps) => {
  const nodeData = treeNode.data;
  return (
    <circle
      cx={nodeData.x}
      cy={nodeData.y}
      r={tooltip ? 16 : selected ? 16 : Math.max(1, 16 - treeNode.depth)} // Specify the radius of the circle
      fill={
        // "#aaf"
        selected
          ? nodeData.id.endsWith("1")
            ? "#00f"
            : "#0f0"
          : tooltip
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
          : tooltip
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
export interface LinkProps {
  linkData: d3.HierarchyNode<ITreeNode>;
  selected: boolean;
  tooltip: boolean;
  path?: boolean;
}

export const NodeLink = ({
  linkData,
  selected,
  tooltip,
  path = false,
}: LinkProps) => {
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
      strokeOpacity={selected ? 1 : tooltip ? 0.75 : path ? 0.75 : 0.5}
    />
  );
};

export default TreeNode;
