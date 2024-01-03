import { padToEven } from "./treeUtils";
import * as d3 from "d3";

interface InfoContainerProps {
  selected: string;
  tooltip: {
    x: number;
    y: number;
    id: string;
  } | null;
  nodeB: {
    x: number;
    y: number;
    id: string;
  } | null;
  depth: number;
}

const fillColorByDistance = (
  colorScale: d3.ScaleSequential<string, never>,
  distance?: string
) => {
  return distance ? colorScale(parseInt(distance.slice(2), 16)) : "none";
};

export default function InfoContainer({
  selected,
  tooltip,
  nodeB,
  depth,
}: InfoContainerProps) {
  const minDistance = 0;
  const maxDistance = 2 ** (depth - 1) - 1;
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([minDistance, maxDistance]);

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
            <td>{depth}</td>
          </tr>
          <tr>
            <th>Leaves:</th>
            <td>{2 ** depth}</td>
          </tr>
          <tr>
            <th>Radius:</th>
            <td>N/A</td>
          </tr>
          <tr
            style={{
              color: "white",
              background: selected.endsWith("1") ? "#00f" : "#0f0",
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
              <th>
                Distances:
                <br />0 -- (2^{depth - 1} - 1)
              </th>
              <div style={{ height: "300px", overflow: "auto" }}>
                <td>
                  {Array.from(
                    { length: Math.min(16, 2 ** (depth - 1)) },
                    (_, i) =>
                      i < Math.min(16, 2 ** (depth - 1)) / 2
                        ? i
                        : 2 ** (depth - 1) - Math.min(16, 2 ** (depth - 1)) + i
                  ).map((x) => {
                    const s = parseInt(selected.slice(2), 2);
                    const d = x ^ s;
                    const hex = padToEven(d.toString(16));
                    const bin = d.toString(2);
                    return (
                      <>
                        <tr>
                          <th>
                            {x < Math.min(16, 2 ** depth - 1) / 2
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
                        {x === Math.min(16, 2 ** depth - 1) / 2 - 1 && (
                          <tr>
                            <th>. . .</th>
                          </tr>
                        )}
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
