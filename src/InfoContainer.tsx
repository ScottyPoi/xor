import { useContext } from "react";
import { padToEven } from "./treeUtils";
import * as d3 from "d3";
import Header from "./Header";
import { ActionTypes, BinaryTreeContext } from "./BinaryTreeProvider";

const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};

export default function InfoContainer() {
  const { state, dispatch } = useContext(BinaryTreeContext);
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
  const increaseRadius = () => {
    if (state.radius + 1 >= state.depth) return;
    setRadius(state.radius + 1);
  };
  const decreaseRadius = () => {
    if (state.radius - 1 < 0) return;
    setRadius(state.radius - 1);
  };

  return (
    <div className="info-container">
      <Header />
      <table>
        <tbody>
          <tr>
            <th>
              {state.tooltip && state.tooltip.id
                ? state.tooltip.id +
                  "_".repeat(state.depth + 3 - state.tooltip.id.length)
                : "_".repeat(state.depth + 2)}{" "}
            </th>
            <td>{"---"}</td>
          </tr>
          <tr>
            <th>Depth:</th>
            <td>{state.depth - 1}</td>
          </tr>
          <tr>
            <th>Leaves:</th>
            <td>{2 ** (state.depth - 1)}</td>
          </tr>
          <tr>
            <th>Radius:</th>
            <td style={{ fontSize: "x-large" }}>
              2^{state.radius} -1 ({"d < "}
              {2 ** state.radius - 1})
            </td>
          </tr>
          <tr>
            <td>
              <button
                style={{ width: "100%", height: "50px" }}
                disabled={state.radius === 0}
                onClick={decreaseRadius}
              >
                - Radius
              </button>
            </td>
            <td>
              <button
                style={{ width: "100%", height: "50px" }}
                onClick={increaseRadius}
                disabled={state.radius === state.depth - 1}
              >
                + Radius
              </button>
            </td>
          </tr>
          <tr
            style={{
              color: "white",
              background: state.selected.endsWith("1") ? "blue" : "green",
            }}
          >
            <th>Node_A:</th>
            <td>
              <tr>
                <th>binary:</th>
                <td>{state.selected}</td>
              </tr>
              <tr>
                <th>hex_id:</th>
                <td>
                  0x
                  {padToEven(parseInt(state.selected.slice(2), 2).toString(16))}
                </td>
              </tr>
            </td>
          </tr>
          {state.selected && (
            <tr>
              <th style={{ textAlign: "center" }}>
                Distances:
                <br />0 -- {2 ** (state.depth - 1) - 1}
              </th>
              <div style={{ maxHeight: 780, overflow: "auto" }}>
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
                        >
                          <th>{x}</th>
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
          {/* {nodeB && nodeB.id && (
            <tr>
              <th>Node_B:</th>
              <td>
                <tr>
                  <th>binary:</th>
                  <td>{nodeB.id}</td>
                </tr>
                <tr>
                  <th>hex_id:</th>
                  <td>
                    {nodeB.id
                      ? "0x" +
                        padToEven(parseInt(nodeB.id.slice(2), 2).toString(16))
                      : ""}
                  </td>
                </tr>
              </td>
            </tr>
          )}

          {nodeB && nodeB.id && (
            <tr>
              <th>Distance:</th>
              <td>
                {parseInt(nodeB.id.slice(2), 2) ^
                  parseInt(state.selected.slice(2), 2)}
              </td>
            </tr>
          )} */}

          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}
