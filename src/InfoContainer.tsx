import { padToEven } from "./treeUtils";

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

export default function InfoContainer({
  selected,
  tooltip,
  nodeB,
  depth,
}: InfoContainerProps) {
  return (
    <div className="info-container">
      <table>
        <tbody>
          <tr>
            <th>Depth:</th>
            <td>{depth}</td>
          </tr>
          <tr>
            <th>Leaves:</th>
            <td>{2 ** depth}</td>
          </tr>
          <tr>
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
