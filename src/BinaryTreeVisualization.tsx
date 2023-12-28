// filename: BinaryTreeVisualization.tsx
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";
import { generateTreeData } from "./treeUtils";

interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

const BinaryTreeVisualization: React.FC = () => {
  const [depth, setDepth] = useState(1);
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
    setTooltip({ x: node.x, y: node.y, id: node.id });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const handleResize = () => {
    setDimensions({
      width: (2 * window.outerWidth) / 3,
      height: window.outerHeight - 20,
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
      .style("stroke", (d) => (d.data.id.endsWith("1") ? "#aaf" : "#faa"))
      .style("stroke-width", 1);

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
      .attr("r", 10)
      .style("fill", (d) => (d.data.id.endsWith("1") ? "#00f" : "#f00"))
      .style("stroke", "#fff")
      .style("stroke-width", 1.5)
      .on("mouseover", (e, d) => handleMouseOver(d.data))
      .on("mouseout", () => handleMouseOut());

    // Text
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text((d) => (d.depth === depth ? d.data.id : ""));
  }, [depth, dimensions]);

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
      </header>
      <div className="tree-container">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="tree-svg"
        />
        {tooltip && (
          <div className="tooltip" style={{ top: 50, left: 50 }}>
            {tooltip.id}
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeVisualization;
