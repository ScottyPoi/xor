// filename: BinaryTreeVisualization.tsx
import React, {
  useState,
  useEffect,
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

const padToEven = (hex: string) => {
  if (hex.length % 2 === 0) {
    return hex;
  } else {
    return "0" + hex;
  }
};

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDepth = Math.max(1, Math.min(16, Number(event.target.value)));
      setDepth(newDepth);
    },
    []
  );

  const handleMouseOver = useCallback((node: ITreeNode) => {
    console.log("mouseover");
    setTooltip({ x: node.x, y: node.y, id: node.id });
  }, []);

  const handleMouseOut = useCallback((node: ITreeNode) => {
    console.log("mouseout");
    setTooltip(null);
  }, []);

  const handleClick = useCallback((node: any) => {
    console.log({
      id: node.data.id,
      d_depth: node.depth,
      depth,
      select: node.depth === depth - 1,
    });
    node.depth === depth - 1 && setSelected(node.data.id);
  }, []);

  // useMemo to memoize the tree data based on the depth and dimensions
  const treeData = useMemo(
    () => generateTreeData(depth, width, height),
    [depth, width, height]
  );

  useEffect(() => {
    // Ensure our ref is currently holding a value
    if (!svgRef.current) {
      return;
    }
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear canvas

    const root = d3.hierarchy(treeData);
    const nodes = root.descendants();
    const links = nodes.slice(1);

    // Links
    svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.parent!.data.x)
      .attr("y1", (d) => d.parent!.data.y)
      .attr("x2", (d) => d.data.x)
      .attr("y2", (d) => d.data.y)
      .style("stroke", (d) =>
        d.data.id.endsWith("1")
          ? "#" +
            Math.min(15, d.depth).toString(16) +
            Math.min(15, d.depth).toString(16) +
            "f"
          : "#f" +
            Math.min(15, d.depth).toString(16) +
            Math.min(15, d.depth).toString(16)
      )
      .style("stroke-width", (d) => 10 - (3 * d.depth) / 4);

    // Nodes
    const nodeEnter = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.data.x},${d.data.y})`);

    // Circles
    nodeEnter
      .append("circle")
      .attr("r", (d) =>
        d.data.id === tooltip?.id
          ? 16
          : d.data.id === selected
          ? 16
          : Math.max(1, 16 - d.depth)
      )
      .style("fill", (d) =>
        d.data.id === tooltip?.id
          ? d.data.id.endsWith("1")
            ? "#55f"
            : "#f55"
          : d.data.id === selected
          ? d.data.id.endsWith("1")
            ? "#00f"
            : "#f00"
          : d.data.id.endsWith("1")
          ? "#99f"
          : "#f99"
      )
      .style("stroke", (d) => (d.data.id === selected ? "#000" : "none"))
      // Define the enter pattern for new nodes
      .on("mouseover", (event, d) => handleMouseOver(d.data))
      .on("mouseout", handleMouseOut)
      .on("mousedown", (event, d) => handleClick(d));

    // If nodes are exiting, define the exit pattern
    nodeEnter.exit().remove(); // Text
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text((d) => (d.depth === depth ? d.data.id : ""));
  }, [
    treeData,
    handleMouseOver,
    handleMouseOut,
    handleClick,
    tooltip,
    selected,
    depth,
  ]);

  return (
    <div>
      <header className="controls">
        <button className="button" onClick={() => setDepth(depth + 1)}>
          Increase Depth
        </button>
        <button
          className="button"
          onClick={() => setDepth(Math.max(depth - 1, 1))}
        >
          Decrease Depth
        </button>
        <span>Depth: {depth}</span>
        <input
          type="number"
          value={depth}
          onChange={handleDepthChange}
          min={1}
          max={16}
          className="depth-input"
        />
        <h3 style={{ textAlign: "left", paddingInline: 10 }}>
          selected: {selected.slice(2)}
          <br />
          node_id:{" "}
          {"0x" + padToEven(parseInt(selected.slice(2), 2).toString(16))}
        </h3>
      </header>
      <div className="tree-container">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="tree-svg"
        ></svg>
        {
          tooltip && (
            <div
              className="tooltip"
              style={
                tooltip.id.startsWith("0b0")
                  ? {
                      top:
                        50 +
                        (2 ** (depth - 2) -
                          parseInt(tooltip.id.slice(2), 2) -
                          1) *
                          ((height - 200) / 2 ** (depth - 2)),
                      left: 50,
                    }
                  : {
                      top: Math.max(
                        50,
                        50 +
                          (parseInt(tooltip.id.slice(2), 2) -
                            1 -
                            2 ** (depth - 2)) *
                            ((height - 200) / 2 ** (depth - 2))
                      ),
                      right: 50,
                    }
              }
            >
              {tooltip.id}
            </div>
          )
          // Tooltip div and content logic here
        }
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
