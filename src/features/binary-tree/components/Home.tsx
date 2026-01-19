import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import OpenVisualizer from "./OpenVisualizer";
import { padToEven } from "../utils/treeUtils";
import { XOR1, XOR, BIN } from "../data/words";

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
    }, [a, b, c]);
  
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