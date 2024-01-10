import { useContext, useMemo, useState } from "react";
import { BinaryTreeContext } from "./BinaryTreeProvider";
import Carousel from "react-material-ui-carousel";
import CarouselControls from "./CarouselControls";
export default function TreeMsg() {
  const { state } = useContext(BinaryTreeContext);
  const [show, setShow] = useState(true);
  const [play, setPlay] = useState(true);
  const treeMsg = useMemo(
    () => `This is a Binary Tree at depth=${state.depth - 1}`,
    [state.depth]
  );
  const leafMsg = useMemo(
    () =>
      `It has 2^${state.depth} - 1 (${2 ** state.depth - 1}) ${
        state.depth > 1 ? "NODES" : "NODE, which is both ROOT and LEAF."
      }`,
    [state.depth]
  );
  const networkMsg = useMemo(
    () =>
      `This tree models a DHT network with 2^${state.depth - 1} possible ${
        state.depth > 1 ? "NODE_IDs" : "NODE_ID."
      }`,
    [state.depth]
  );
  const distanceMsg = useMemo(
    () =>
      `The range of NODE_ID & DISTANCES is   0 to 2^${
        state.depth - 1
      }-1   (0 to ${2 ** (state.depth - 1) - 1})`,
    [state.depth]
  );

  const clickMsg = `Click to select a Leaf Node and see its DISTANCE to other Leaf Nodes.`;
  const radiusMsg = useMemo(() => {
    return [
      `Adjust the RADIUS up and down using the controls at the bottom.`,
      `Nodes within the yellow band are have DISTANCE within the RADIUS.`,
    ];
  }, []);

  const depthMessages: Record<number, string[]> = useMemo(() => {
    return {
      1: [],
      2: [
        clickMsg,
        `Each node has a UNIQUE distance to every other node.`,
        `The DISTANCE from each node to itself is 0.`,
        `The DISTANCE from each node to its sibling node is 1`,
      ],
      3: [
        ...radiusMsg,
        `The DISTANCE from each node to the children of its opposite parent is 2 and 3`,
        `The "LEFT" side node has DISTANCE 2 to its cousin "LEFT" node and 3 to its cousin "RIGHT" node`,
        `The "RIGHT" side node has DISTANCE 2 to its cousin "RIGHT" node and 2 to its cousin "LEFT" node`,
        `The distances to the LEFT SIDE nodes from their OPPOSITE PARENT NODE is lower than the RIGHT SIDE nodes`,
      ],
      4: [
        `Larger trees contain smaller subtrees at all depths.`,
        `For any node, the DISTANCE to the all of the other nodes in a subtree is less than all nodes beyond the subtree.`,
      ],
      5: [
        `The "LEFT"/"RIGHT" pattern is repeated on the branches at all depths.`,
      ],
    };
  }, [clickMsg, radiusMsg]);

  const message = useMemo(() => {
    const msg = [treeMsg, leafMsg, networkMsg];
    if (state.depth > 1) {
      msg.push(distanceMsg);
    } else {
      msg.push(`The DISTANCE from this node to itself is 0.`);
    }
    for (let i = 0; i < state.depth; i++) {
      msg.push(...(depthMessages[i + 1] ?? []));
    }
    return msg;
  }, [depthMessages, distanceMsg, leafMsg, networkMsg, state.depth, treeMsg]);

  return (
    <div>
      <CarouselControls
        isShown={show}
        toggleShown={() => {
          setShow(!show);
        }}
        isPlaying={play}
        togglePlaying={() => {
          setPlay(!play);
        }}
      />
      {show && (
        <Carousel autoPlay={play}>
          {message.map((m, i) => {
            return (
              <div key={i} className="msg-line">
                {m}
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
}
