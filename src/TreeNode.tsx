import { ITreeNode } from "./types";

export interface NodeProps {
  treeNode: d3.HierarchyNode<ITreeNode>;
  handleMouseOver: (nodeData: ITreeNode) => void;
  handleMouseOut: () => void;
  handleClick: (node: d3.HierarchyNode<ITreeNode>) => void;
  selected: boolean;
  tooltip: boolean;
}
const TreeNode = ({
  treeNode,
  handleMouseOver,
  handleMouseOut,
  handleClick,
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
        tooltip
          ? nodeData.id.endsWith("1")
            ? "#55f"
            : "#f55"
          : selected
          ? nodeData.id.endsWith("1")
            ? "#00f"
            : "#f00"
          : nodeData.id.endsWith("1")
          ? "#99f"
          : "#f99"
      } // Specify the fill color of the circle
      stroke={selected ? "#000" : "none"} // Specify the stroke color of the circle
      onMouseOver={() => handleMouseOver(nodeData)}
      onMouseOut={handleMouseOut}
      onMouseDown={() => handleClick(treeNode)}
    />
  );
};
export interface LinkProps {
  linkData: d3.HierarchyNode<ITreeNode>;
}

export const NodeLink = ({ linkData }: LinkProps) => {
  return (
    <line
      x1={linkData.parent!.data.x}
      y1={linkData.parent!.data.y}
      x2={linkData.data.x}
      y2={linkData.data.y}
      stroke={
        linkData.data.id.endsWith("1")
          ? "#" +
            Math.min(15, linkData.depth).toString(16) +
            Math.min(15, linkData.depth).toString(16) +
            "f"
          : "#f" +
            Math.min(15, linkData.depth).toString(16) +
            Math.min(15, linkData.depth).toString(16)
      }
      strokeWidth={10 - (3 * linkData.depth) / 4}
    />
  );
};

export default TreeNode;
