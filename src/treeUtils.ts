// treeUtils.ts
interface ITreeNode {
  id: string;
  x: number;
  y: number;
  angle: number;
  children?: ITreeNode[];
}

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
