// filename: BinaryTreeVisualization.tsx
import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useMemo,
} from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";
import { generateTreeData, padToEven } from "./treeUtils";
import { ITreeNode } from "./types";
import { useWindowSize } from "./useWindowSize";
import classNames from "classnames";
import TreeNode, { NodeLink } from "./TreeNode";
import Header from "./Header";

const BinaryTreeVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { width, height } = useWindowSize(); // Use our custom hook
  const [depth, setDepth] = useState(1);
  const [selected, setSelected] = useState("");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  // Handle depth change with useCallback hook to memoize the function
  const handleDepthChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newDepth = Math.max(1, Math.min(16, Number(event.target.value)));
      setDepth(newDepth);
    },
    [setDepth]
  );

  const handleMouseOver = useCallback((node: ITreeNode) => {
    console.log("mouseover");
    setTooltip((prevTooltip) => ({
      ...prevTooltip,
      x: node.x,
      y: node.y,
      id: node.id,
    }));
  }, []);

  const handleMouseOut = useCallback(() => {
    console.log("mouseout");
    setTooltip((prevTooltip) => ({ ...prevTooltip, x: 0, y: 0, id: "" }));
  }, []);

  const handleClick = useCallback(
    (node: d3.HierarchyNode<ITreeNode>) => {
      console.log({
        id: node.data.id,
        d_depth: node.depth,
        depth,
        select: node.depth === depth - 1,
      });
      if (node.depth === depth - 1) {
        setSelected((prevSelected) => node.data.id);
      }
    },
    [depth]
  );

  // useMemo to memoize the tree data based on the depth and dimensions
  const treeData = useMemo(
    () => generateTreeData(depth, width, height),
    [depth, width, height]
  );

  const root = d3.hierarchy(treeData);
  const nodes = root.descendants();
  const links = nodes.slice(1);

  return (
    <div>
      <Header
      depth={depth}
      setDepth={setDepth}
      handleDepthChange={handleDepthChange}
      selected={selected}
      />
      <div className="tree-container">
        <svg ref={svgRef} width={width} height={height} className="tree-svg">
          {links.map((linkData, index) => (
            <NodeLink
              key={index}
              linkData={linkData}
              selected={selected.startsWith(linkData.data.id)}
              tooltip={
                tooltip ? tooltip.id.startsWith(linkData.data.id) : false
              }
            />
          ))}
          {nodes.map((nodeData) => (
            <TreeNode
              key={nodeData.id}
              treeNode={nodeData}
              handleMouseOver={handleMouseOver}
              handleMouseOut={handleMouseOut}
              handleClick={handleClick}
              selected={nodeData.data.id === selected}
              tooltip={tooltip?.id === nodeData.data.id}
            />
          ))}
        </svg>
        {tooltip && (
          <div
            className={classNames("tooltip", {
              "tooltip-top": tooltip.id.startsWith("0b0"),
              "tooltip-bottom": !tooltip.id.startsWith("0b0"),
            })}
          >
            {tooltip.id}
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
