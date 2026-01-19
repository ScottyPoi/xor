import * as d3 from "d3";
import { HeatMapProps } from "../types";
import { useContext } from "react";
import { BinaryTreeContext } from "../context/BinaryTreeProvider";
import { calculateDistance, getLeafAngles } from "../utils/treeUtils";
import LeafHeat from "./LeafHeat";

export default function HeatMap({ nodes }: HeatMapProps) {
  const { state } = useContext(BinaryTreeContext);

  const minDistance = 0;
  const maxDistance = 2 ** (state.depth - 1) - 1;

  const leafNodes = nodes.slice(
    2 ** (state.depth - 1) - 1,
    2 ** state.depth - 1
  );
  const leafAngles = Object.fromEntries(
    leafNodes.map((node) => {
      return getLeafAngles(node, { x: state.center.x, y: state.center.y });
    })
  );

  const leafPosition = {
    x: nodes[nodes.length - 1].data.x,
    y: nodes[nodes.length - 1].data.y,
  };
  const leafDistance = Math.sqrt(
    (state.center.x - leafPosition.x) ** 2 +
      (state.center.y - leafPosition.y) ** 2
  );
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);

  return nodes.length > 3 ? (
    <>
      {nodes.slice().map((node) => {
        const nodeData = node.data;
        if (node.depth === state.depth - 1) {
          // Only for leaf nodes
          const distance = calculateDistance(state.selected, nodeData.id);
          const startAngle = leafAngles[nodeData.id].leftParentAngle;
          const endAngle = leafAngles[nodeData.id].rightParentAngle;
          const nodeWidth = Math.max(1, 16 - node.depth * 1.5);
          const dimensions = {
            heat_innerRadius: 16,
            heat_outerRadius: leafDistance + 16,
            node_innerRadius: leafDistance - nodeWidth,
            node_outerRadius: leafDistance + nodeWidth,
          };
          return (
            <LeafHeat
              nodeData={nodeData}
              distance={distance}
              colorScale={colorScale}
              startAngle={startAngle}
              endAngle={endAngle}
              dimensions={dimensions}
              key={node.data.id}
            />
          );
        }
        return <> </>;
      })}
    </>
  ) : nodes.length === 3 ? (
    // Special case for 2 leaf nodes
    <>
      <LeafHeat
        nodeData={nodes[1].data}
        startAngle={-Math.PI / 2}
        endAngle={0}
        distance={state.selected === nodes[1].data.id ? "0x00" : "0x01"}
        colorScale={colorScale}
        dimensions={{
          heat_innerRadius: 16,
          heat_outerRadius: leafDistance + 16,
          node_innerRadius: leafDistance - 16,
          node_outerRadius: leafDistance + 16,
        }}
      />
      <LeafHeat
        nodeData={nodes[2].data}
        startAngle={0}
        endAngle={Math.PI / 2}
        distance={state.selected === nodes[2].data.id ? "0x00" : "0x01"}
        colorScale={colorScale}
        dimensions={{
          heat_innerRadius: 16,
          heat_outerRadius: leafDistance + 16,
          node_innerRadius: leafDistance - 16,
          node_outerRadius: leafDistance + 16,
        }}
      />
    </>
  ) : (
    <></>
  );
}
