import { Dispatch, SetStateAction } from "react";
import { padToEven } from "./treeUtils";
import * as d3 from "d3";

interface InfoContainerProps {
  selected: string;
  tooltip: {
    x: number;
    y: number;
    id: string;
  } | null;
  setTooltip: (id: string) => void;
  nodeB: {
    x: number;
    y: number;
    id: string;
  } | null;
  depth: number;
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
}

const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};

const colorGradientByDistance = (
  depth: number,
  selected: string,
  colorScale: d3.ScaleSequential<string, never>
) => {
  return Array.from({ length: Math.min(32, 2 ** (depth - 1)) }, (_, i) =>
    i < Math.min(32, 2 ** (depth - 1)) / 2
      ? i
      : 2 ** (depth - 1) - Math.min(32, 2 ** (depth - 1)) + i
  ).map((x) => {
    const s = parseInt(selected.slice(2), 2);
    const d = x ^ s;
    const hex = padToEven(d.toString(16));
    const bin = d.toString(2);
    return (
      <>
        <tr>
          <th>
            {x < Math.min(32, 2 ** depth - 1) / 2
              ? x
              : "2^" + (depth - 1) + "-" + (2 ** depth - x)}
          </th>
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
              background: bin.endsWith("1") ? "#00f" : "#0f0",
            }}
          >
            0x
            {hex}
          </td>
        </tr>
        {x === Math.min(32, 2 ** depth - 1) / 2 - 1 && (
          <tr>
            <th>. . .</th>
          </tr>
        )}
      </>
    );
  });
};

export default function InfoContainer({
  selected,
  tooltip,
  nodeB,
  depth,
  radius,
  setRadius,
  setTooltip,
}: InfoContainerProps) {
  const minDistance = 0;
  const maxDistance = 2 ** (depth - 1) - 1;
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);
  // const swatches = Math.min(32, 2 ** (depth - 1));
  const swatches = 2 ** (depth - 1);
  return (
    <div className="info-container">
      <table>
        <tbody>
          <tr>
            <th>
              {tooltip && tooltip.id
                ? tooltip.id + "_".repeat(depth + 1 - tooltip.id.length)
                : "_".repeat(depth + 2)}{" "}
            </th>
            <td>{"---"}</td>
          </tr>
          <tr>
            <th>Depth:</th>
            <td>{depth - 1}</td>
          </tr>
          <tr>
            <th>Leaves:</th>
            <td>{2 ** (depth - 1)}</td>
          </tr>
          <tr>
            <th>Radius:</th>
            <td style={{ fontSize: "x-large" }}>
              2^{radius} -1 ({"d < "}
              {2 ** radius - 1})
            </td>
          </tr>
          <tr>
            <td>
              <button
                style={{ width: "100%", height: "50px" }}
                disabled={radius === 0}
                onClick={() => setRadius((prev) => prev - 1)}
              >
                - Radius
              </button>
            </td>
            <td>
              <button
                style={{ width: "100%", height: "50px" }}
                onClick={() => setRadius((prev) => prev + 1)}
                disabled={radius === depth - 1}
              >
                + Radius
              </button>
            </td>
          </tr>
          <tr
            style={{
              color: "white",
              background: selected.endsWith("1") ? "blue" : "green",
            }}
          >
            <th>Node_A:</th>
            <td>
              <tr>
                <th>binary:</th>
                <td>{selected}</td>
              </tr>
              <tr>
                <th>hex_id:</th>
                <td>
                  0x{padToEven(parseInt(selected.slice(2), 2).toString(16))}
                </td>
              </tr>
            </td>
          </tr>
          {selected && (
            <tr>
              <th style={{ textAlign: "center" }}>
                Distances:
                <br />0 -- {2 ** (depth - 1) - 1}
              </th>
              <div style={{ maxHeight: 780, overflow: "auto" }}>
                <td>
                  {Array.from({ length: swatches }, (_, i) => i).map((x) => {
                    const s = parseInt(selected.slice(2), 2);
                    const d = x ^ s;
                    const hex = padToEven(d.toString(16));
                    const bin = d.toString(2).padStart(depth - 1, '0');
                    return (
                      <>
                        <tr
                        onMouseOver={() => setTooltip('0b' + bin)}
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
          {nodeB && nodeB.id && (
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
                  parseInt(selected.slice(2), 2)}
              </td>
            </tr>
          )}

          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}
