import { useContext, useMemo } from "react";
import { BinaryTreeContext } from "./BinaryTreeProvider";

export default function TreeMsg() {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const treeMsg = useMemo(
    () => `This is a Binary Tree at depth=${state.depth - 1}`,
    [state.depth]
  );
  const leafMsg = useMemo(
    () => `It has 2^${state.depth - 1} (${2 ** (state.depth - 1)}) Leaves`,
    [state.depth]
  );
  const distanceMsg = useMemo(
    () =>
      `The range of DISTANCES is 0 to 2^${state.depth - 1} - 1 (${(
        2 ** (state.depth - 1) -
        1
      ).toString()})`,
    [state.depth]
  );

  const depthMessages: Record<number, string[]> = {
    1: [`The DISTANCE from this lone node to itself is 0.`],
    2: [`The DISTANCE from each node to its sibling node is 1`],
    3: [
      `The DISTANCE from each node to the children of its opposite parent is 2 and 3, depending on its orientation as a "LEFT" or "RIGHT" node.`,
      `The "LEFT" side node has DISTANCE 2 to its cousin "LEFT" node and 3 to its cousin "RIGHT" node`,
      `The "RIGHT" side node has DISTANCE 2 to its cousin "RIGHT" node and 2 to its cousin "LEFT" node`,
      `Notice how the distances to the LEFT SIDE nodes from their OPPOSITE PARENT NODE is lower than the RIGHT SIDE nodes`,
      `Notice how each node has a UNIQUE distance to every other node.`,
    ],
    4: [
      `Notice how the entire tree can be divided into SEPARATE (sub)trees of depth 2.`,
      `Notice that for any node, the DISTANCE to the all of the nodes in its subtree is smaller than for all nodes beyond the subtree.`,
      `SELECT a "LEFT" node, and notice that the DISTANCES to all nodes on the "LEFT" half of the opposite subtree are smaller than the "RIGHT" half.`,
      `SELECT a "RIGHT" node, and notice that the DISTANCES to all nodes on the "RIGHT" half of the opposite subtree are smaller than the "LEFT" half.`,
    ],
    5: [
      `Notice how larger trees contain smaller subtrees at all depths.`,
      `Notice how the "LEFT"/"RIGHT" pattern is repeated on the branches at all depths.`,
    ],
  };

  const message = useMemo(() => {
    const msg = [treeMsg, leafMsg, distanceMsg];
    for (let i = 0; i < state.depth; i++) {
      msg.push(...(depthMessages[i + 1] ?? []));
    }
    return msg;
  }, [depthMessages, distanceMsg, leafMsg, state.depth, treeMsg]);

  return (
    <div className={"tree-msg"}>
      {message.map((m, i) => {
        return (
          <div className="msg-line">
            <span
              style={{
                fontSize: "x-large",
              }}
            >
              {i}:
            </span>
            {m}
          </div>
        );
      })}
    </div>
  );
}
