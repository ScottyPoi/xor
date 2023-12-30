import { padToEven } from "./treeUtils";

interface InfoContainerProps {
  selected: string;
  tooltip: {
    x: number;
    y: number;
    id: string;
  } | null;
  depth: number;
}

export default function InfoContainer({
  selected,
  tooltip,
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
            <th>Selected:</th>
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
          <tr>
            <th>Cursor:</th>
            {tooltip && (
              <td>
                    <tr>
                      <th>binary:</th>
                      <td>{tooltip.id}</td>
                    </tr>
                    <tr>
                      <th>hex_id:</th>
                      <td>
                        {tooltip.id
                          ? "0x" +
                            padToEven(
                              parseInt(tooltip.id.slice(2), 2).toString(16)
                            )
                          : ""}
                      </td>
                    </tr>
              </td>
            )}
          </tr>

          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}
