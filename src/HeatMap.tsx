import * as d3 from "d3";
import { ITreeNode } from "./types";

interface HeatMapProps {
  nodes: d3.HierarchyNode<ITreeNode>[];
  depth: number;
  selected: string;
}

const calculateDistance = (first: string, second: string) => {
  // console.log("distance", { first, second });
  if (first.length < 3 || second.length < 3) {
    return;
  }
  if (first.length !== second.length) {
    return;
    // throw new Error(
    //   `Input should be binary strings of equal lengths.  Got: \n${first} (${first.length}) and \n${second} (${second.length})`
    // );
  }
  if (!first.startsWith("0b") || !second.startsWith("0b")) {
    // throw new Error(
    //   `Input should be binary strings of equal lengths.  Got: \n${first} and \n${second}`
    // );
    return;
  }
  const f = BigInt(parseInt(first.slice(2), 2));
  const s = BigInt(parseInt(second.slice(2), 2));
  const d = f ^ s;
  return "0x" + d.toString(16).padStart(first.length - 2, "0");
};

export default function HeatMap({ nodes, depth, selected }: HeatMapProps) {
  const minDistance = 0;
  const maxDistance = 2 ** (depth) - 1;
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
            : Math.PI
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

  return nodes.length > 1 ? (
    <>
      {nodes.slice().map((node, i) => {
        const nodeData = node.data;
        if (node.depth === depth - 1) {
          // Only for leaf nodes
          const distance = calculateDistance(selected, nodeData.id);
          const startAngle = leafAngles[nodeData.id].leftParentAngle;
          const endAngle = leafAngles[nodeData.id].rightParentAngle;
          const colorScale = d3
            .scaleSequential(d3.interpolateReds)
            .domain([maxDistance, minDistance]);
          const arcGenerator = d3.arc();
          return (
            <>
              <path
                d={
                  arcGenerator({
                    innerRadius: 16,
                    outerRadius: leafDistance + nodeWidth + arcWidth,
                    startAngle,
                    endAngle,
                  }) ?? undefined
                }
                fill={
                  distance
                    ? colorScale(parseInt(distance.slice(2), 16))
                    : "none"
                }
                // fill={nodeData.id.endsWith("0") ? "red" : "blue"}
                opacity={0.75}
                transform={`translate(${center.x},${center.y})`}
              />
            </>
          );
        } else if (node.depth > 0) {
          // radial angle relative to center node
          const nodeAngle =
            Math.atan2(node.data.y - center.y, node.data.x - center.x);
          // point at leaf distance at nodeAngle
          const nodeCoordinate = {
            x: center.x + (leafDistance + arcWidth + 16) * Math.cos(nodeAngle),
            y: center.y + (leafDistance + arcWidth + 16) * Math.sin(nodeAngle),
          };

          return (
            <>
              <line
                x1={center.x}
                y1={center.y}
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
  ) : (
    <></>
  );
}
