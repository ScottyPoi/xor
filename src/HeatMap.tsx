import * as d3 from "d3";
import { ITreeNode } from "./types";
import { padToEven } from "./treeUtils";
import { useState } from "react";

interface HeatMapProps {
  nodes: d3.HierarchyNode<ITreeNode>[];
  depth: number;
  selected: string;
  tooltip?: string;
  radius?: number;
}

const calculateDistance = (first: string, second: string) => {
  // console.log("distance", { first, second });
  if (first.length < 3 || second.length < 3) {
    return "0x00";
  }
  if (first.length !== second.length) {
    return "0x00";
    // throw new Error(
    //   `Input should be binary strings of equal lengths.  Got: \n${first} (${first.length}) and \n${second} (${second.length})`
    // );
  }
  if (!first.startsWith("0b") || !second.startsWith("0b")) {
    // throw new Error(
    //   `Input should be binary strings of equal lengths.  Got: \n${first} and \n${second}`
    // );
    return "0x00";
  }
  const f = BigInt(parseInt(first.slice(2), 2));
  const s = BigInt(parseInt(second.slice(2), 2));
  const d = f ^ s;
  return "0x" + d.toString(16).padStart(first.length - 2, "0");
};

const fillColorById = (id: string) => {
  return id.endsWith("0") ? "green" : "blue";
};

const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};

interface ILeafHeatProps {
  selected: string;
  tooltip?: boolean;
  nodeData: ITreeNode;
  distance: string;
  center: { x: number; y: number; r?: number };
  startAngle: number;
  endAngle: number;
  colorScale: d3.ScaleSequential<string, never>;
  dimensions: ILeafHeatDimensions;
}

interface ILeafHeatDimensions {
  heat_innerRadius: number;
  node_innerRadius: number;
  heat_outerRadius: number;
  node_outerRadius: number;
}
function LeafHeat({
  selected,
  tooltip = false,
  nodeData,
  startAngle,
  endAngle,
  center,
  colorScale,
  distance,
  dimensions: {
    heat_innerRadius,
    node_innerRadius,
    heat_outerRadius,
    node_outerRadius,
  },
}: ILeafHeatProps) {
  const [hovered, setHovered] = useState(false);
  // Only for leaf nodes
  const arcGenerator = d3.arc();
  const midAngle = (startAngle + endAngle) / 2;
  const depth = nodeData.id.length - 2;
  const fontSize = hovered
    ? "8rem"
    : selected === nodeData.id
    ? "8rem"
    : depth < 4
    ? "8rem"
    : `${8 / ((depth - 3) * 2)}rem`;
  return (
    <>
      <path
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        d={
          arcGenerator({
            innerRadius: heat_innerRadius,
            outerRadius: heat_outerRadius,
            startAngle,
            endAngle,
          }) ?? undefined
        }
        fill={fillColorByDistance(colorScale, distance)}
        opacity={0.75}
        transform={`translate(${center.x},${center.y})`}
      />
      <path
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        d={
          arcGenerator({
            innerRadius: node_innerRadius,
            outerRadius: node_outerRadius,
            startAngle,
            endAngle,
          }) ?? undefined
        }
        fill={fillColorById(nodeData.id)}
        opacity={1}
        transform={`translate(${center.x},${center.y})`}
      />
      <path
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        id={`${nodeData.id}Arc`}
        d={
          arcGenerator({
            innerRadius: node_innerRadius + (hovered ? 24 : 16),
            outerRadius: node_outerRadius + (hovered ? 24 : 16),
            startAngle,
            endAngle: (hovered || selected === nodeData.id) ? endAngle + Math.PI / 2 : endAngle,
          }) ?? undefined
        }
        fill={"none"}
        opacity={1}
        transform={`translate(${center.x},${center.y})`}
      />
      <text
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        overflow={"hidden"}
      >
        <textPath
          lengthAdjust={"spacing"}
          fontSize={fontSize}
          href={`#${nodeData.id}Arc`}
        >
          {BigInt(distance).toString()}
        </textPath>
      </text>
    </>
  );
}

interface ILeafAngle {
  leftParent: d3.HierarchyNode<ITreeNode>;
  rightParent: d3.HierarchyNode<ITreeNode>;
  nodeAngle: number;
  leftParentAngle: number;
  rightParentAngle: number;
}

type LeafAngles = Record<string, ILeafAngle>;
interface IHeatMapLeavesProps {
  leafNodes: d3.HierarchyNode<ITreeNode>[]; // leaf nodes
  leafAngles: LeafAngles;
  selected: string; // binary string representing the selected node
  depth: number; // depth of the tree
  center: { x: number; y: number; r?: number };
  leafDistance: number;
  arcWidth: number;
  nodeWidth: number;
}
function HeatMapLeaves({
  leafNodes,
  leafAngles,
  selected,
  depth,
  center,
  leafDistance,
  arcWidth,
  nodeWidth,
}: IHeatMapLeavesProps) {
  const minDistance = 0;
  const maxDistance = 2 ** (depth - 1) - 1;
  // Only for leaf nodes
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);
  const dimensions = {
    heat_innerRadius: 16,
    node_innerRadius: leafDistance - nodeWidth,
    heat_outerRadius: leafDistance + 16 + arcWidth,
    node_outerRadius: leafDistance + nodeWidth,
  };

  return leafNodes.map((node) => {
    const nodeData = node.data;
    const distance = calculateDistance(selected, nodeData.id);
    const startAngle = leafAngles[nodeData.id].leftParentAngle;
    const endAngle = leafAngles[nodeData.id].rightParentAngle;
    return (
      <LeafHeat
        nodeData={nodeData}
        distance={distance}
        center={center}
        colorScale={colorScale}
        startAngle={startAngle}
        endAngle={endAngle}
        selected={selected}
        dimensions={dimensions}
        key={node.data.id}
      />
    );
  });
}

export default function HeatMap({
  nodes,
  depth,
  selected,
  tooltip = "",
  radius = 0,
}: HeatMapProps) {
  const minDistance = 0;
  const maxDistance = 2 ** (depth - 1) - 1;
  const arcWidth = 20;
  const center = {
    x: nodes[0].data.x,
    y: nodes[0].data.y,
  };
  const nodeWidth = 16;
  const leafNodes = nodes.slice(2 ** (depth - 1) - 1, 2 ** depth - 1);
  const leafAngles = Object.fromEntries(
    leafNodes.map((node) => {
      const nodePos = node.data.id[node.data.id.length - 1];
      let oppParent = node.parent ?? node;
      while (oppParent.parent && oppParent.data.id.endsWith(nodePos)) {
        oppParent = oppParent.parent;
      }
      let sameParent = node.parent ?? node;
      while (sameParent.parent && !sameParent.data.id.endsWith(nodePos)) {
        sameParent = sameParent.parent;
      }
      const leftParent =
        nodePos === "1" ? node.parent! : oppParent!.parent ?? oppParent;
      const rightParent =
        nodePos === "0" ? node.parent! : oppParent.parent ?? oppParent;

      const leftParentPosition = {
        x: leftParent.data.x,
        y: leftParent.data.y,
      };
      const rightParentPosition = {
        x: rightParent.data.x,
        y: rightParent.data.y,
      };
      const nodeAngle =
        Math.PI / 2 +
        Math.atan2(node.data.y - center.y, node.data.x - center.x);
      let leftParentAngle =
        Math.PI / 2 +
        Math.atan2(
          leftParentPosition.y - center.y,
          leftParentPosition.x - center.x
        );
      let rightParentAngle =
        Math.PI / 2 +
        Math.atan2(
          rightParentPosition.y - center.y,
          rightParentPosition.x - center.x
        );
      leftParentAngle =
        leftParentAngle === Math.PI / 2
          ? Math.round(rightParentAngle) === 2
            ? Math.PI / 2
            : Math.round(rightParentAngle) === 0
            ? 0
            : Math.round(rightParentAngle) === -2
            ? -2 * Math.PI +
              nodeAngle -
              (rightParentAngle - (-2 * Math.PI + nodeAngle))
            : nodeAngle - (rightParentAngle - nodeAngle)
          : leftParentAngle;

      rightParentAngle =
        rightParentAngle === Math.PI / 2
          ? Math.round(leftParentAngle) === 2
            ? nodeAngle + (nodeAngle - leftParentAngle)
            : Math.round(leftParentAngle) === 0
            ? 0
            : Math.round(leftParentAngle) === -2
            ? -Math.PI / 2
            : Math.PI
          : rightParentAngle;

      if (leftParentAngle > rightParentAngle) {
        leftParentAngle -= Math.PI * 2;
      }
      if (rightParentAngle === Math.PI) {
        rightParentAngle = nodeAngle + (nodeAngle - leftParentAngle);
      }

      return [
        node.data.id,
        {
          leftParent,
          rightParent,
          nodeAngle,
          leftParentAngle,
          rightParentAngle,
        },
      ];
    })
  );
  console.log(leafAngles);
  for (const [node, angles] of Object.entries(leafAngles).slice(-10)) {
    const L = angles.leftParentAngle.toFixed(3);
    const R = angles.rightParentAngle.toFixed(3);
    console.log(node, L, R);
  }
  // const firstLeafNode = nodes[2 ** (depth - 1) - 1];
  // const lastLeafNode = nodes.slice(-1)[0];
  // console.log({ firstLeafNode, lastLeafNode });
  const leafPosition = {
    x: nodes[nodes.length - 1].data.x,
    y: nodes[nodes.length - 1].data.y,
  };
  const leafDistance = Math.sqrt(
    (center.x - leafPosition.x) ** 2 + (center.y - leafPosition.y) ** 2
  );
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);

  return nodes.length > 3 ? (
    <>
      {nodes.slice().map((node) => {
        const nodeData = node.data;
        if (node.depth === depth - 1) {
          // Only for leaf nodes
          const distance = calculateDistance(selected, nodeData.id);
          const startAngle = leafAngles[nodeData.id].leftParentAngle;
          const endAngle = leafAngles[nodeData.id].rightParentAngle;
          console.log({ startAngle, endAngle });
          return (
            <LeafHeat
              nodeData={nodeData}
              distance={distance}
              center={center}
              colorScale={colorScale}
              startAngle={startAngle}
              endAngle={endAngle}
              selected={selected}
              tooltip={tooltip === node.data.id}
              dimensions={{
                heat_innerRadius: 16,
                node_innerRadius: leafDistance - nodeWidth,
                heat_outerRadius: leafDistance + 16 + arcWidth,
                node_outerRadius: leafDistance + nodeWidth,
              }}
              key={node.data.id}
            />
          );
        } else if (node.depth > 0) {
          // radial angle relative to center node
          const nodeAngle = Math.atan2(
            node.data.y - center.y,
            node.data.x - center.x
          );
          // point at leaf distance at nodeAngle
          const nodeCoordinate = {
            x: center.x + (leafDistance + arcWidth + 16) * Math.cos(nodeAngle),
            y: center.y + (leafDistance + arcWidth + 16) * Math.sin(nodeAngle),
          };

          return (
            <>
              <line
                x1={node.data.x}
                y1={node.data.y}
                x2={nodeCoordinate.x}
                y2={nodeCoordinate.y}
                stroke="grey"
              />
            </>
          );
        }
        return <> </>;
      })}
    </>
  ) : nodes.length === 3 ? (
    <>
      <LeafHeat
        nodeData={nodes[1].data}
        center={center}
        startAngle={-Math.PI / 2}
        endAngle={0}
        selected={selected}
        distance={selected === nodes[1].data.id ? "0x00" : "0x01"}
        colorScale={colorScale}
        dimensions={{
          heat_innerRadius: 16,
          node_innerRadius: leafDistance - nodeWidth,
          heat_outerRadius: leafDistance + 16 + arcWidth,
          node_outerRadius: leafDistance + nodeWidth,
        }}
      />
      <LeafHeat
        nodeData={nodes[2].data}
        center={center}
        startAngle={0}
        endAngle={Math.PI / 2}
        selected={selected}
        distance={selected === nodes[2].data.id ? "0x00" : "0x01"}
        colorScale={colorScale}
        dimensions={{
          heat_innerRadius: 16,
          node_innerRadius: leafDistance - nodeWidth,
          heat_outerRadius: leafDistance + 16 + arcWidth,
          node_outerRadius: leafDistance + nodeWidth,
        }}
      />
    </>
  ) : (
    <></>
  );
}
