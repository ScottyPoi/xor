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
import { generateTreeData } from "./treeUtils";
import { ITreeNode } from "./types";
import { useWindowSize } from "./useWindowSize";
// import classNames from "classnames";
import TreeNode, { NodeLink } from "./TreeNode";
import Header from "./Header";
import InfoContainer from "./InfoContainer";
import HeatMap from "./HeatMap";

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
  const [nodeB, setNodeB] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);
  const [radius, setRadius] = useState(0);

  const changeDepth = (newDepth: number) => {
    const oldDepth = depth;
    const newSelected =
      newDepth <= oldDepth
        ? selected.slice(0, newDepth + 1)
        : selected.padEnd(1 + newDepth, selected.slice(-1)[0]);

    setRadius(Math.min(radius, newDepth));
    setDepth(newDepth);
    setSelected((_) => newSelected);
  };

  // Handle depth change with useCallback hook to memoize the function
  const handleDepthChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newDepth = Math.max(1, Math.min(16, Number(event.target.value)));
      changeDepth(newDepth);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleClick = useCallback(
    (node: d3.HierarchyNode<ITreeNode>) => {
      if (node.data.id.slice(2).length === depth - 1) {
        setNodeB((prevNodeB) => {
          console.log("click", node.data.id, prevNodeB?.id, 0);
          if (node.data.id === prevNodeB?.id) {
            return null;
          }
          return {
            ...prevNodeB,
            x: node.data.x,
            y: node.data.y,
            id: node.data.id,
          };
        });
      } else {
        setNodeB(null);
      }
    },
    [depth]
  );

  const handleMouseOut = useCallback(() => {
    console.log("mouseout");
    setTooltip((prevTooltip) => ({ ...prevTooltip, x: 0, y: 0, id: "" }));
  }, []);

  const handleDoubleClick = useCallback(
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

  const nodeById = Object.fromEntries(
    nodes.map((node) => [node.data.id, node])
  );

  const setHovered = (id: string) => {
    const node = nodeById[id];
    if (!node) return;
    setTooltip({ x: node.data.x, y: node.data.y, id: node.data.id });
  };

  return (
    <div>
      <Header
        depth={depth}
        setDepth={changeDepth}
        handleDepthChange={handleDepthChange}
        selected={selected}
      />
      <div className="tree-container">
        <InfoContainer
          depth={depth}
          selected={selected}
          tooltip={tooltip}
          nodeB={nodeB}
          radius={radius}
          setRadius={setRadius}
          setTooltip={setHovered}
        />
        <svg
          ref={svgRef}
          width={width * 1.2}
          height={height}
          className="tree-svg"
        >
          {nodes.length >= 3 && (
            <HeatMap
              nodes={nodes}
              depth={depth}
              selected={selected}
              tooltip={tooltip?.id}
              radius={radius}
              setHovered={setHovered}
            />
          )}
          {links.map((linkData, index) => (
            <NodeLink
              key={index}
              linkData={linkData}
              selected={selected.startsWith(linkData.data.id)}
              tooltip={
                tooltip ? tooltip.id.startsWith(linkData.data.id) : false
              }
              path={
                nodeB
                  ? selected.startsWith(linkData.data.id) ||
                    nodeB.id.startsWith(linkData.data.id)
                  : false
              }
            />
          ))}
          {nodes.map((nodeData) => (
            <TreeNode
              key={nodeData.id}
              treeNode={nodeData}
              handleMouseOver={handleMouseOver}
              handleMouseOut={handleMouseOut}
              handleDoubleClick={handleDoubleClick}
              handleClick={handleClick}
              selected={nodeData.data.id === selected}
              tooltip={tooltip?.id === nodeData.data.id}
            />
          ))}
        </svg>
        {/* {tooltip && (
          <div
            className={classNames("tooltip", {
              "tooltip-top": tooltip.id.startsWith("0b0"),
              "tooltip-bottom": !tooltip.id.startsWith("0b0"),
            })}
          >
            {tooltip.id}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
