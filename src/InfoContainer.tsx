import { useContext } from "react";
import { fillColorByDistance, padToEven } from "./treeUtils";
import * as d3 from "d3";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";
import Button from "@mui/material/Button/Button";

export default function InfoContainer() {
  const { state, dispatch } = useContext(BinaryTreeContext);

  const minDistance = 0;
  const maxDistance = 2 ** (state.depth - 1) - 1;
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);
  const swatches = 2 ** (state.depth - 1);

  const toggleHeatMap = () => {
    state.heatVisible
      ? dispatch({ type: ActionTypes.HideHeat })
      : dispatch({
          type: ActionTypes.ShowHeat,
        });
  };
  return (
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
              <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                <td>
                  <Swatches count={swatches} colorScale={colorScale} />
                </td>
              </div>
            </tr>
          )}
          <tr></tr>
        </tbody>
      </table>
      <Button
        fullWidth
        variant="contained"
        disabled={state.depth < 3}
        color={state.heatVisible ? "primary" : "error"}
        onClick={toggleHeatMap}
        style={{
          fontSize: "x-large",
        }}
      >
        {state.heatVisible ? "Hide" : "Show"} HeatMap
      </Button>
    </div>
  );
}

interface SwatchesProps {
  count: number;
  colorScale: d3.ScaleSequential<string, never>;
}

function Swatches({ count, colorScale }: SwatchesProps) {
  const { state, dispatch } = useContext(BinaryTreeContext);
  const handleMouseOver = (id: string) => {
    dispatch({ type: ActionTypes.SetTooltip, payload: { id, x: 0, y: 0 } });
  };
  const handleMouseOut = () => {
    dispatch({ type: ActionTypes.SetTooltip, payload: null });
  };
  const inRadius = (distance: string) => {
    return BigInt(distance) <= state.radiusN;
  };
  return (
    <div style={{ maxHeight: "40vh", overflow: "auto" }}>
      <td>
        {Array.from({ length: count }, (_, i) => i).map((x) => {
          const s = parseInt(state.selected.slice(2), 2);
          const d = x ^ s;
          const hex = padToEven(d.toString(16));
          const bin = d.toString(2).padStart(state.depth - 1, "0");
          return (
            <>
              <tr
                onMouseOut={handleMouseOut}
                onMouseOver={() => handleMouseOver("0b" + bin)}
                className={inRadius("0x" + x.toString(16)) ? "inradius" : ""}
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
  );
}
