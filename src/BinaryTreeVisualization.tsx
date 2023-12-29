// filename: BinaryTreeVisualization.tsx
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";
import { generateTreeData } from "./treeUtils";

const padToEven = (hex: string) => {
  if (hex.length % 2 === 0) {
    return hex;
  } else {
    return "0" + hex;
  }
};
interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

const BinaryTreeVisualization: React.FC = () => {
  const [depth, setDepth] = useState(1);
  const [selected, setSelected] = useState("");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: (2 * window.outerWidth) / 3,
    height: window.outerHeight - 20,
  });

  const handleDepthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDepth = Math.max(1, Math.min(16, Number(event.target.value)));
    setDepth(newDepth);
  };

  const handleMouseOver = (node: ITreeNode) => {
    console.log("mouseover");
    node.id.length === depth + 1
      ? setTooltip({ x: node.x, y: node.y, id: node.id })
      : setTooltip(null);
  };

  const handleMouseOut = () => {
    console.log("mouseout");
    setTooltip(null);
  };

  const handleClick = (node: ITreeNode) => {
    node.id.length === depth + 1 && setSelected(node.id);
  };

  const handleResize = () => {
    setDimensions({
      width: (2 * window.outerWidth) / 3,
      height: window.innerHeight - 20,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const treeData = generateTreeData(depth, width, height); // Dynamic dimensions based on viewport
    const nodes = d3.hierarchy(treeData).descendants();
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
      .on("mouseover", (e, d) => handleMouseOver(d.data))
      .on("mouseout", () => handleMouseOut())
      .on("mousedown", (e, d) => handleClick(d.data));

    // Text
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text((d) => (d.depth === depth ? d.data.id : ""));
  }, [depth, dimensions, tooltip]);

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
        <h3>
          selected:{" "}
          {"0x" + padToEven(parseInt(selected.slice(2), 2).toString(16))}
        </h3>
      </header>
      <div className="tree-container">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="tree-svg"
        />
        {tooltip && (
          <div
            className="tooltip"
            style={
              tooltip.id.startsWith("0x0")
                ? {
                    top:
                      50 +
                      (2 ** (depth - 2) -
                        parseInt(tooltip.id.slice(2), 2) -
                        1) *
                        ((dimensions.height - 200) / 2 ** (depth - 2)),
                    left: 50,
                  }
                : {
                    top: Math.max(
                      50,
                      50 +
                        (parseInt(tooltip.id.slice(2), 2) -
                          1 -
                          2 ** (depth - 2)) *
                          ((dimensions.height - 200) / 2 ** (depth - 2))
                    ),
                    right: 50,
                  }
            }
          >
            {"0x" + padToEven(parseInt(tooltip.id.slice(2), 2).toString(16))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
