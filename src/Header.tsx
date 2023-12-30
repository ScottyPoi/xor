import React, { ChangeEvent } from "react";

interface HeaderProps {
  depth: number;
  setDepth: React.Dispatch<React.SetStateAction<number>>;
  handleDepthChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selected: string;
}
export default function Header({
  depth,
  setDepth,
  handleDepthChange,
  selected,
}: HeaderProps) {
  return (
    <header className="controls">
      <button className="button" onClick={() => setDepth(depth + 1)}>
        Increase Depth
      </button>
      <button
        className="button"
        onClick={() => setDepth(Math.max(depth - 1, 1))}
      >
        Decrease Depth
      </button>
      <span>Depth: {depth}</span>
      <input
        type="number"
        value={depth}
        onChange={handleDepthChange}
        min={1}
        max={16}
        className="depth-input"
      />
      {/* <h3 style={{ textAlign: "left", paddingInline: 10 }}>
        selected: {selected.slice(2)}
        <br />
        node_id: {"0x" + padToEven(parseInt(selected.slice(2), 2).toString(16))}
      </h3> */}
    </header>
  );
}
