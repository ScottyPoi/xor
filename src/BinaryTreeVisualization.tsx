// filename: BinaryTreeVisualization.tsx
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BinaryTreeVisualization.css'; // Ensure you have this CSS file in your project

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
  const width = 800; // Width of the visualization area
  const height = 600; // Height of the visualization area
  const rootNodePosition = { x: width / 2, y: height / 2 };

  const generateTreeData = (depth: number): ITreeNode => {
    const root: ITreeNode = { id: 'root', ...rootNodePosition, angle: 0 };

    const addChildren = (node: ITreeNode, level: number, angleRange: number) => {
      if (level < depth) {
        const distance = ((level / (depth - 1)) * height) / 2; // Proportion of height
        const baseAngle = node.angle!;
        node.children = [0, 1].map(i => {
          const angle = baseAngle + (i === 0 ? -1 : 1) * angleRange / 2;
          const x = rootNodePosition.x + distance * Math.sin(angle * (Math.PI / 180));
          const y = rootNodePosition.y - distance * Math.cos(angle * (Math.PI / 180));
          const id = `${node.id}-${i === 0 ? 'L' : 'R'}`;
          const child: ITreeNode = { id, parent: node, x, y, angle };
          addChildren(child, level + 1, angleRange / 2);
          return child;
        });
      }
    };

    // Adjust the initial angle range so that it increases with the depth of the tree
    const initialAngleRange = 20 + (depth -1) * 5;
    addChildren(root, 1, initialAngleRange);
    return root;
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear SVG before new render

      const treeData = generateTreeData(depth);
      const nodes = d3.hierarchy(treeData).descendants();

      // Set positions for links
      svg.selectAll(".link")
        .data(nodes.slice(1)) // Exclude root
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => d.parent!.data.x!)
        .attr("y1", d => d.parent!.data.y!)
        .attr("x2", d => d.data.x!)
        .attr("y2", d => d.data.y!)
        .style("stroke", "#ccc")
        .style("stroke-width", 1.5);

      // Set positions for nodes
      const nodeEnter = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.data.x},${d.data.y})`);

      // Create nodes as circles
      nodeEnter.append("circle")
        .attr("r", 10) // Adjust based on depth if needed
        .style("fill", "#fff")
        .style("stroke", "#68a")
        .style("stroke-width", 1.5);

      // Add text labels
      nodeEnter.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(d => d.data.id);
    }
  }, [depth]);

  return (
    <div className="binary-tree-container">
      <div className="controls">
        <button className="button" onClick={() => setDepth(depth > 1 ? depth - 1 : 1)}>DOWN</button>
        <button className="button" onClick={() => setDepth(depth + 1)}>UP</button>
      </div>
      <svg ref={svgRef} width={width} height={height} className="tree-svg"></svg>
    </div>
  );
};

export default BinaryTreeVisualization;