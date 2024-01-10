import { useContext, useEffect, useState } from "react";
import { padToEven } from "./treeUtils";
import * as d3 from "d3";
import Header from "./Header";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import { useWindowSize } from "./useWindowSize";
import DepthButton from "./DepthButtons";
import Button from "@mui/material/Button/Button";

const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};

export default function InfoContainer() {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const [isVisible, setIsVisible] = useState(true);
  const [size, setSize] = useState<Record<string, any>>({});
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    window.onresize = () => {
      const sw = d3.select(".tree-svg");
      const style = {
        width: sw.style("width"),
        height: sw.style("height"),
        winWid: window.innerWidth,
        winHei: window.innerHeight,
        centerx: window.innerWidth / 2,
        centery: window.innerHeight / 2,
      };
      if (style.width > style.height) {
        setIsVisible(false);
      }
      setSize(style);
    };
  }, []);

  useEffect(() => {
    const sw = d3.select(".tree-svg");
    const style = {
      width: sw.style("width"),
      height: sw.style("height"),
      winWid: window.innerWidth,
      winHei: window.innerHeight,
      centerx: window.innerWidth / 2,
      centery: window.innerHeight * 0.6,
    };
    if (style.width > style.height) {
      setIsVisible(false);
    }
    setSize(style);
  }, []);

  const minDistance = 0;
  const maxDistance = 2 ** (state.depth - 1) - 1;
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);
  // const swatches = Math.min(32, 2 ** (depth - 1));
  const swatches = 2 ** (state.depth - 1);
  const handleMouseOver = (id: string) => {
    dispatch({ type: ActionTypes.SetTooltip, payload: { id, x: 0, y: 0 } });
  };
  const handleMouseOut = () => {
    dispatch({ type: ActionTypes.SetTooltip, payload: null });
  };
  const setRadius = (radius: number) => {
    dispatch({ type: ActionTypes.SetRadius, payload: radius });
  };
  const inRadius = (distance: string) => {
    return BigInt(distance) <= state.radiusN;
  };

  const increaseRadius = () => {
    if (state.radius + 1 >= state.depth) return;
    setRadius(state.radius + 1);
  };
  const decreaseRadius = () => {
    if (state.radius - 1 < 0) return;
    setRadius(state.radius - 1);
  };
  const changeDepth = (newDepth: number) => {
    dispatch({ type: ActionTypes.ChangeDepth, payload: newDepth });
  };
  const incrementDepth = () => {
    if (state.depth > 16) return;
    changeDepth(state.depth + 1);
  };
  const decrementDepth = () => {
    if (state.depth < 1) return;
    changeDepth(state.depth - 1);
  };

  const toggleHeatMap = () => {
    state.heatVisible
      ? dispatch({ type: ActionTypes.HideHeat })
      : dispatch({
          type: ActionTypes.ShowHeat,
        });
  };
  return (
    // <div>
    //   <button onClick={toggleVisibility}>
    //     {isVisible ? "Hide" : "Show Controls"}
    //   </button>
    //   {isVisible && (
    <div className="info-container">
      <table>
        <tbody>
          <tr
            style={{
              color: "white",
              fontWeight: "bolder",
              fontSize: "large",
            }}
          >
            <th
              style={{
                color: "white",
                background: state.selected.endsWith("1") ? "blue" : "green",
              }}
            >
              Selected:
              {`NODE:  `}
              {state.selected
                .slice(2)
                .split("")
                .map((d) => {
                  return (
                    <span
                      style={{
                        background: d === "1" ? "blue" : "green",
                      }}
                    >
                      {d}
                    </span>
                  );
                })}
            </th>
          </tr>
          {state.selected && (
            <tr>
              {/* <th style={{ textAlign: "center" }}>
                Distances:
                <br />0 -- {2 ** (state.depth - 1) - 1}
              </th> */}
              <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                <td>
                  {Array.from({ length: swatches }, (_, i) => i).map((x) => {
                    const s = parseInt(state.selected.slice(2), 2);
                    const d = x ^ s;
                    const hex = padToEven(d.toString(16));
                    const bin = d.toString(2).padStart(state.depth - 1, "0");
                    return (
                      <>
                        <tr
                          onMouseOut={handleMouseOut}
                          onMouseOver={() => handleMouseOver("0b" + bin)}
                          className={
                            inRadius("0x" + x.toString(16)) ? "inradius" : ""
                          }
                          style={{
                            fontSize:
                              state.selected === "0b" + bin
                                ? "xxx-large"
                                : state.tooltip?.id === "0b" + bin
                                ? "xx-large"
                                : "medium",
                            fontWeight:
                              state.selected === "0b" + bin
                                ? "bolder"
                                : state.tooltip?.id === "0b" + bin
                                ? "bold"
                                : "normal",
                            // marginTop:
                            //   state.selected === "0b" + bin
                            //     ? "8px"
                            //     : state.tooltip?.id === "0b" + bin
                            //     ? "8px"
                            //     : "4px",
                            // outline: inRadius("0x" + x.toString(16))
                            //   ? "2px solid yellow"
                            //   : "none",
                          }}
                        >
                          <th style={{ textAlign: "center" }}>{x}</th>
                          <td
                            style={{
                              color: "white",
                              background: fillColorByDistance(
                                colorScale,
                                "0x" + x.toString(16)
                              ),
                            }}
                          >
                            ___
                          </td>
                          <td
                            style={{
                              color: "white",
                              background: bin.endsWith("1") ? "blue" : "green",
                            }}
                          >
                            0x
                            {hex}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </td>
              </div>
            </tr>
          )}
          <tr>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
            <Button
            fullWidth
              variant="contained"
              disabled={state.depth < 3}
              color={state.heatVisible ? "primary" : "error"}
              onClick={toggleHeatMap}
              style={{
                fontSize:'x-large'
              }}
            >
              {state.heatVisible ? "Hide" : "Show"} HeatMap 
            </Button>
    </div>
    //   )}
    // </div>
  );
}
