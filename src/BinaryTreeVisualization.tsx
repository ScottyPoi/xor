// filename: BinaryTreeVisualization.tsx
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css"; // Ensure you have this CSS file in your project

interface ITreeNode {
  id: string;
  parent?: ITreeNode;
  children?: ITreeNode[];
  x?: number;
  y?: number;
  angle?: number;
}

const BinaryTreeVisualization: React.FC = () => {
  const [depth, setDepth] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 400 + depth * 80; // Width of the visualization area
  const height = 200 + depth * 80; // Height of the visualization area
  const rootNodePosition = { x: width / 2, y: height / 2 + 100 };

  const generateTreeData = (depth: number): ITreeNode => {
    const root: ITreeNode = { id: "root", ...rootNodePosition, angle: 0 };

    const addChildren = (
      node: ITreeNode,
      level: number,
      angleRange: number
    ) => {
      if (level < depth) {
        const e = depth / (4 + depth);
        const distance = ((level ** e / (depth - 1) ** e) * width) / 2; // Proportion of height
        const baseAngle = node.angle!;
        node.children = [0, 1].map((i) => {
          const angle = baseAngle + ((i === 0 ? -1 : 1) * angleRange) / 2;
          const x =
            rootNodePosition.x + distance * Math.sin(angle * (Math.PI / 180));
          const y =
            rootNodePosition.y - distance * Math.cos(angle * (Math.PI / 180));
          const id = `${node.id}-${i === 0 ? "L" : "R"}`;
          const child: ITreeNode = { id, parent: node, x, y, angle };
          addChildren(child, level + 1, angleRange / 2);
          return child;
        });
      }
    };

    // Adjust the initial angle range so that it increases with the depth of the tree
    const initialAngleRange = 45 + 120 ** ((depth - 1) ** (1 / 8) / 2 ** 0.5);
    addChildren(root, 1, initialAngleRange);
    return root;
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear SVG before new render

      const treeData = generateTreeData(depth);
      const nodes = d3.hierarchy(treeData).descendants();

      // Set positions for links
      svg
        .selectAll(".link")
        .data(nodes.slice(1)) // Exclude root
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.parent!.data.x!)
        .attr("y1", (d) => d.parent!.data.y!)
        .attr("x2", (d) => d.data.x!)
        .attr("y2", (d) => d.data.y!)
        .style(
          "stroke",
          (d) =>
            `${
              d.data.id.slice(-1) === "R"
                ? "#aaf"
                : d.data.id.slice(-1) === "L"
                ? "#faa"
                : "#000"
            }`
        )
        .style("stroke-width", 1);

      // Set positions for nodes
      const nodeEnter = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.data.x},${d.data.y})`);

      // Create nodes as circles
      nodeEnter
        .append("circle")
        .attr("r", 100 ** 0.95 / (2 ** (depth - 1)) ** 0.95) // Adjust based on depth if needed
        .style(
          "fill",
          (d) =>
            `${
              d.data.id.slice(-1) === "R"
                ? "#00f"
                : d.data.id.slice(-1) === "L"
                ? "#f00"
                : "#000"
            }`
        )
        .style("stroke", "none");

      // Add text labels
      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .style("text-anchor", (d) =>
          d.data.id[5] === "R"
            ? "start"
            : d.data.id[5] === "L"
            ? "end"
            : "middle"
        )
        .text((d) => {
          const add = d.data.id
            .replace("root-", "0x")
            .replaceAll("L", "0")
            .replaceAll("R", "1")
            .replaceAll("-", "");
          const nibble =
            d.data.id.slice(-1) === "R"
              ? "1"
              : d.data.id.slice(-1) === "L"
              ? "0"
              : "0x";
          return add.length === depth + 1 ? add : nibble;
        });
    }
  }, [depth]);

  return (
    <div className="binary-tree-container">
      <div className="controls">
        <button className="button" onClick={() => setDepth(depth + 1)}>
          UP
        </button>
        <h2>Depth: {depth - 1}</h2>
        <h3>Leaves: {2 ** (depth - 1)}</h3>
        <button
          className="button"
          onClick={() => setDepth(depth > 1 ? depth - 1 : 1)}
        >
          DOWN
        </button>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="tree-svg"
      ></svg>
    </div>
  );
};

export default BinaryTreeVisualization;
