// filename: BinaryTreeVisualization.tsx
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BinaryTreeVisualization.css";

interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

const generateTreeData = (
  depth: number,
  width: number,
  height: number
): ITreeNode => {
  const rootNodePosition = { x: width / 2, y: (5 * height) / 8 };
  const root: ITreeNode = { id: "root", ...rootNodePosition, angle: 0 };

  const addChildren = (node: ITreeNode, level: number, angleRange: number) => {
    if (level < depth) {
      const e = depth / (4 + depth);
      const distance = ((level ** e / (depth - 1) ** e) * width) / 2;
      const baseAngle = node.angle;
      node.children = [0, 1].map((i) => {
        const angle = baseAngle + ((i === 0 ? -1 : 1) * angleRange) / 2;
        const x =
          rootNodePosition.x + distance * Math.sin((angle * Math.PI) / 180);
        const y =
          rootNodePosition.y - distance * Math.cos((angle * Math.PI) / 180);
        const childId = `${node.id}-${i === 0 ? "L" : "R"}`;
        const child: ITreeNode = { id: childId, x, y, angle };
        addChildren(child, level + 1, angleRange / 2);
        return child;
      });
    }
  };

  const initialAngleRange = 45 + 120 ** ((depth - 1) ** (1 / 8) / 2 ** 0.5);
  addChildren(root, 1, initialAngleRange);
  return root;
};

const BinaryTreeVisualization: React.FC = () => {
  const [depth, setDepth] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 400 + depth * 80;
  const height = 200 + depth * 80;
  const treeData = generateTreeData(depth, width, height);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = d3.hierarchy(treeData).descendants();
    const links = nodes.slice(1);

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
      .style("stroke", (d) => (d.data.id.endsWith("R") ? "#aaf" : "#faa"))
      .style("stroke-width", 1);

    const nodeEnter = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.data.x},${d.data.y})`);

    nodeEnter
      .append("circle")
      .attr("r", 10)
      .style("fill", (d) => (d.data.id.endsWith("R") ? "#00f" : "#f00"))
      .style("stroke", "#fff")
      .style("stroke-width", 1.5);

    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text((d) => (d.depth === depth ? d.data.id : ""));
  }, [depth, treeData]);

  return (
    <div className="binary-tree-container">
      <div className="controls">
        <button className="button" onClick={() => setDepth(depth + 1)}>
          Increase Depth
        </button>
        <span>Depth: {depth}</span>
        <button
          className="button"
          onClick={() => setDepth(Math.max(depth - 1, 1))}
        >
          Decrease Depth
        </button>
      </div>
      <svg ref={svgRef} width={width} height={height} className="tree-svg" />
    </div>
  );
};

export default BinaryTreeVisualization;
