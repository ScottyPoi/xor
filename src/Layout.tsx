import { useContext, useEffect, useState } from "react";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import BinaryTreeVisualization from "./BinaryTreeVisualization";
import { ChangeDepth } from "./DepthButtons";
import InfoContainer from "./InfoContainer";
import TreeMsg from "./TreeMsg";
import { ChangeRadius } from "./RadiusButtons";
import { SwipeLeftSharp, SwipeRightSharp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { padToEven } from "./treeUtils";
import ReactMarkdown from "react-markdown";
import OpenVisualizer, { CloseVisualizer } from "./OpenVisualizer";

export default function Layout() {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const incDepth = () => {
    dispatch({
      type: ActionTypes.IncDepth,
    });
  };
  const decDepth = () => {
    dispatch({
      type: ActionTypes.DecDepth,
    });
  };
  return (
    <div style={{ width: "100%" }}>
      {state.home ? (
        <Home />
      ) : (
        <>
          <BinaryTreeVisualization />
          <div>
            <InfoContainer />
          </div>
          <div className="tree-msg">
            <Box
              display={"flex"}
              style={{ width: "100%" }}
              justifyContent={"space-between"}
            >
              <Button
                variant="contained"
                color="info"
                disabled={state.depth < 1}
                onClick={decDepth}
                endIcon={<SwipeLeftSharp />}
              >
                Prev Tree
              </Button>
              <Button
                variant="contained"
                color="info"
                disabled={state.depth > 12}
                onClick={incDepth}
                startIcon={<SwipeRightSharp />}
              >
                Next Tree
              </Button>
            </Box>
            <TreeMsg />
          </div>
          <div
            style={{
              width: "100%",
              alignItems: "center",

              display: "flex",
              flexDirection: "column",
              position: "fixed",
              bottom: 15,
            }}
          >
            <ChangeDepth />
            {state.depth > 2 && <ChangeRadius />}
          </div>
        </>
      )}
    </div>
  );
}

export function Home() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [showText, setShowText] = useState(false);
  const [showBin, setShowBin] = useState(false);

  const setValues = () => {
    const _a = Math.floor(Math.random() * 32);
    const _b = Math.floor(Math.random() * 32);

    setA(padToEven(_a.toString(2)).padStart(6, "0"));
    setB(padToEven(_b.toString(2)).padStart(6, "0"));

    const _c = _a ^ _b;

    setC(padToEven(_c.toString(2)).padStart(6, "0"));
  };

  useEffect(() => {
    setValues();

    const interval = setInterval(() => {
      setValues();
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const _a = document.getElementById("animated-a");
    const _b = document.getElementById("animated-b");
    const _c = document.getElementById("animated-c");
    if (_a && _b && _c) {
      function createSpanWithAnimation(
        parentElement: HTMLElement,
        character: string,
        index: number
      ): void {
        const span = document.createElement("span");
        span.innerText = character;
        span.style.opacity = "0"; // Assuming all spans should start with opacity 0
        span.style.animation = `fadeIn${character} 1s ${index}s forwards`;
        parentElement.appendChild(span);
      }

      const charactersA = a.split("");
      _a.innerText = "";
      const charactersB = b.split("");
      _b.innerText = "";
      const charactersC = c.split("");
      _c.innerText = "";

      charactersA.forEach((char, index) => {
        createSpanWithAnimation(_a, char, index);
      });
      charactersB.forEach((char, index) => {
        createSpanWithAnimation(_b, char, index);
      });
      charactersC.forEach((char, index) => {
        createSpanWithAnimation(_c, char, index);
      });
    }
  }, [c]);

  // useEffect(() => {
  //   setValues();
  // }, []);

  const XOR1 = `
  # XOR
  ## The XOR (Exclusive OR) operation is a straightforward bitwise logic function. In the context of Kademlia, a peer-to-peer network algorithm, XOR serves a unique role as a distance metric:`;
  const XOR = `
  ## **Basic Function**:
  ### XOR compares two bits, outputting 1 if they differ and 0 if they are the same. For example, 1 ⊕ 0 = 1, but 1 ⊕ 1 = 0.
  ## **Kademlia Distance Metric**:
  ### It measures the 'distance' between node IDs or between a node ID and a data key in the Kademlia network. This distance is calculated by XORing the two IDs and interpreting the result as an integer.
  ## **Network Structure**:
  ### In Kademlia, this XOR distance shapes the network's topology, determining how nodes store and locate data. Nodes closer in XOR distance are more likely to have relevant data paths or information.
  `;

  const BIN = `# XOR & BINARY TREES
  ## The XOR distance metric used in Kademlia conceptually aligns with the structure of a binary tree.

  1. **Binary Tree Structure**: A binary tree is a hierarchical structure where each node has two children, commonly referred to as the left and right child. The position of each node in the tree is determined by a series of binary decisions (left or right) starting from the root.
  
  2. **Binary Representation of Node IDs**: In Kademlia, each node has a unique binary ID. If we consider these IDs as paths in a binary tree, each bit in the ID determines a left or right branch at each level of the tree.
  
  3. **XOR Distance and Tree Paths**: The XOR operation effectively measures the "distance" between two nodes by comparing their binary IDs bit by bit. The XOR metric identifies how similar or different two IDs are, which translates to how close or far they are in a conceptual binary tree.
  
  4. **Common Ancestor and Distance**: In a binary tree, the distance between two nodes can be conceptualized as how far back you need to go to find a common ancestor. Nodes with more bits in common (a lower XOR distance) will have a common ancestor higher in the tree (closer to the root), indicating closeness in the tree's structure.
    
  `;

  return (
    <div className="homescreen">
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems={"center"}
        // width={showText ? "40%" : showBin ? "10%" : "25%"}
        width={"30%"}
        padding={4}
        fontSize={"x-large"}
        fontFamily={"monospace"}
        color={"white"}
        textAlign={"left"}
      >
        {!showText ? (
          <Button
            style={{
              fontSize: "xxx-large",
              fontFamily: "monospace",
            }}
            onMouseOver={() => setShowText(true)}
          >
            What Is XOR?
          </Button>
        ) : (
          <Box onMouseLeave={() => setShowText(false)}>
            <ReactMarkdown>{XOR1}</ReactMarkdown>
            <ReactMarkdown>{XOR}</ReactMarkdown>
          </Box>
        )}
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"40%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          display={"flex"}
          fontWeight={"bolder"}
          color="CaptionText"
          variant={"h1"}
          fontFamily={"monospace"}
        >
          XOR
        </Typography>
        <Typography
          display={"flex"}
          fontWeight={"bolder"}
          color="CaptionText"
          variant={"h3"}
          fontFamily={"monospace"}
        >
          Distance Metric for Kademlia
        </Typography>
        <Typography
          display={"flex"}
          fontWeight={"bolder"}
          color="CaptionText"
          variant={"h2"}
          id="animated-a"
          fontFamily={"monospace"}
        >
          {a}
        </Typography>
        <Typography
          display={"flex"}
          fontWeight={"bolder"}
          color="CaptionText"
          variant={"h2"}
          borderBottom={"solid 5px CaptionText"}
          id="animated-b"
          fontFamily={"monospace"}
        >
          {b}
        </Typography>
        <Typography
          display={"flex"}
          fontWeight={"bolder"}
          variant={"h2"}
          id="animated-c"
          fontFamily={"monospace"}
        >
          {c}
        </Typography>
        <div
          style={{
            position: "fixed",
            bottom: "15%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <OpenVisualizer />
        </div>
      </Box>
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        // width={showBin ? "40%" : showText ? "10%" : "25%"}
        width={"30%"}
        padding={4}
        fontSize={"x-large"}
        color={"white"}
        textAlign={"center"}
        height={"100%"}
        fontFamily={"monospace"}
      >
        {showBin ? (
          <Box
            top={16}
            overflow={"auto"}
            padding={4}
            maxHeight={"85%"}
            onMouseLeave={() => setShowBin(false)}
          >
            <ReactMarkdown>{BIN}</ReactMarkdown>
          </Box>
        ) : (
          <Button
            onMouseOver={() => setShowBin(true)}
            variant="outlined"
            size="large"
            style={{
              fontSize: "xxx-large",
              fontFamily: "monospace",
            }}
          >
            XOR distance &<br />
            Binary Trees
          </Button>
        )}
      </Box>
    </div>
  );
}
