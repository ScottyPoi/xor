// treeUtils.ts

import { ITreeNode, TextAngleParams } from "./types";


export const generateTreeData = (
  depth: number,
  center: { x: number; y: number }
): ITreeNode => {
  const rootNodePosition = {
    x: center.x,
    y: center.y,
  };
  const root: ITreeNode = { id: "0b", ...rootNodePosition, angle: 0 };

  const addChildren = (node: ITreeNode, level: number, angleRange: number) => {
    if (level < depth) {
      const leafDistance = rootNodePosition.y * 0.8;
      const distance = leafDistance * (level / depth) ** (1 / 2);
      const baseAngle = node.angle;
      node.children = [0, 1].map((i) => {
        const angle = baseAngle + ((i === 0 ? -1 : 1) * angleRange) / 2;
        const x =
          rootNodePosition.x + distance * Math.sin((angle * Math.PI) / 180);
        const y =
          rootNodePosition.y - distance * Math.cos((angle * Math.PI) / 180);
        const childId = `${node.id}${i === 0 ? "0" : "1"}`;
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

export const padToEven = (hex: string) => {
  if (hex.length % 2 === 0) {
    return hex;
  } else {
    return "0" + hex;
  }
};

export const getLeafAngles = (
  node: d3.HierarchyNode<ITreeNode>,
  center: { x: number; y: number }
): [
  string,
  {
    leftParent: d3.HierarchyNode<any>;
    rightParent: d3.HierarchyNode<any>;
    nodeAngle: number;
    leftParentAngle: number;
    rightParentAngle: number;
  }
] => {
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
    Math.PI / 2 + Math.atan2(node.data.y - center.y, node.data.x - center.x);
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
};

export const calculateDistance = (first: string, second: string) => {
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

export const fillColorById = (id: string) => {
  return id.endsWith("0") ? "green" : "blue";
};

export const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};



export const textStartAngle = ({
  startAngle,
  endAngle,
  distance,
  depth,
  id,
  hovered,
  selected,
}: TextAngleParams) => {
  const distStr = BigInt(distance).toString();
  const distStrLen = distStr.length;

  const fifth = (endAngle - startAngle) / 5;
  const quarter = (endAngle - startAngle) / 4;
  const third = (endAngle - startAngle) / 3;

  const quarterAngle = startAngle + quarter;
  const thirdAngle = startAngle + third;
  const twoFifthsAngle = startAngle + fifth * 2;
  const halfAngle = quarterAngle + quarter;

  let textStart = startAngle;

  textStart =
    depth > 7
      ? startAngle
      : distStrLen < 2
      ? twoFifthsAngle
      : distStrLen < 3
      ? thirdAngle
      : startAngle;

  if (hovered || selected) {
    if (depth === 5) {
      textStart = halfAngle - third * distStrLen;
    } else if (depth === 6) {
      textStart = thirdAngle - quarter * 2 * distStrLen;
    } else if (depth === 7) {
      textStart = startAngle - quarter * 4 * distStrLen;
    } else if (depth === 8) {
      textStart = startAngle - quarter * 8 * distStrLen;
    } else if (depth === 9) {
      textStart = startAngle - quarter * 16 * distStrLen;
    } else if (depth === 10) {
      textStart = startAngle - quarter * 32 * distStrLen;
    } else if (depth === 11) {
      textStart = startAngle - quarter * 64 * distStrLen;
    } else if (depth === 12) {
      textStart = startAngle - quarter * 112 * distStrLen;
    } else if (depth === 13) {
      textStart = startAngle - quarter * 196 * distStrLen;
    }
  }

  textStart =
    depth === 2
      ? id.endsWith("0")
        ? startAngle + quarter * 2
        : startAngle + fifth * 2
      : textStart;

  return textStart
};
